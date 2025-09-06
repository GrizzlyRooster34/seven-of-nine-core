import { createServer } from 'http';
import cors from 'cors';
import express from 'express';
import { HybridLogicalClock } from '../src/sync/hlc';
import { OpLogEvent } from '../src/sync/oplog';

/**
 * Seven of Nine - Sync Relay Server
 * Stateless event relay for multi-device synchronization
 * Runs in Termux on primary device or on VPS
 */


interface SyncRelayConfig {
  port: number;
  maxEventBatchSize: number;
  maxEventsInMemory: number;
  cleanupIntervalMs: number;
}

interface RelayMetrics {
  totalEventsRelayed: number;
  connectedDevices: Set<string>;
  lastCleanup: number;
  memoryUsageMB: number;
}

class SevenSyncRelay {
  private app: express.Application;
  private server: any;
  private config: SyncRelayConfig;
  private eventBuffer: OpLogEvent[] = []; // Temporary in-memory buffer
  private metrics: RelayMetrics;

  constructor(config?: Partial<SyncRelayConfig>) {
    this.config = {
      port: 7777,
      maxEventBatchSize: 100,
      maxEventsInMemory: 1000,
      cleanupIntervalMs: 300000, // 5 minutes
      ...config
    };

    this.metrics = {
      totalEventsRelayed: 0,
      connectedDevices: new Set(),
      lastCleanup: Date.now(),
      memoryUsageMB: 0
    };

    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.startCleanupTimer();
  }

  private setupMiddleware(): void {
    // CORS for cross-device access
    this.app.use(cors({
      origin: true, // Allow all origins over Tailscale
      credentials: true
    }));

    // Parse JSON with size limit
    this.app.use(express.json({ limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      });
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'operational',
        uptime: process.uptime(),
        events_in_buffer: this.eventBuffer.length,
        connected_devices: this.metrics.connectedDevices.size,
        memory_usage_mb: this.calculateMemoryUsage()
      });
    });

    // Get events since HLC timestamp
    this.app.get('/sync/since', this.handlePullSince.bind(this));

    // Push batch of events
    this.app.post('/sync/push', this.handlePushBatch.bind(this));

    // Get relay metrics
    this.app.get('/metrics', this.handleMetrics.bind(this));

    // Device registration (optional)
    this.app.post('/devices/register', this.handleDeviceRegistration.bind(this));
  }

  /**
   * Handle pull request - get events since HLC
   */
  private handlePullSince(req: express.Request, res: express.Response): void {
    try {
      const { after, device } = req.query;
      
      if (!after || typeof after !== 'string') {
        res.status(400).json({ error: 'Missing or invalid "after" parameter' });
        return;
      }

      const deviceId = device as string;
      if (deviceId) {
        this.metrics.connectedDevices.add(deviceId);
      }

      // Validate HLC format
      if (!HybridLogicalClock.isValid(after)) {
        res.status(400).json({ error: 'Invalid HLC format' });
        return;
      }

      // Filter events after the requested HLC, excluding requester's events
      const filteredEvents = this.eventBuffer.filter(event => {
        const eventHLC = HybridLogicalClock.parse(event.hlc);
        const afterHLC = HybridLogicalClock.parse(after);
        
        const isAfter = HybridLogicalClock.isAfter(eventHLC, afterHLC);
        const isNotFromRequester = !deviceId || event.device_id !== deviceId;
        
        return isAfter && isNotFromRequester;
      });

      // Sort by HLC order
      const sortedEvents = filteredEvents.sort((a, b) => {
        const hlcA = HybridLogicalClock.parse(a.hlc);
        const hlcB = HybridLogicalClock.parse(b.hlc);
        return HybridLogicalClock.compare(hlcA, hlcB);
      });

      // Limit batch size
      const events = sortedEvents.slice(0, this.config.maxEventBatchSize);

      console.log(`📡 Serving ${events.length} events to ${deviceId || 'unknown'} since ${after}`);

      res.json({
        events,
        has_more: sortedEvents.length > this.config.maxEventBatchSize,
        server_time: new Date().toISOString(),
        next_cursor: events.length > 0 ? events[events.length - 1].hlc : after
      });

    } catch (error) {
      console.error('Pull since error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Handle push request - accept batch of events
   */
  private handlePushBatch(req: express.Request, res: express.Response): void {
    try {
      const { events, device_id } = req.body;

      if (!Array.isArray(events)) {
        res.status(400).json({ error: 'Events must be an array' });
        return;
      }

      if (events.length > this.config.maxEventBatchSize) {
        res.status(400).json({ 
          error: `Batch size ${events.length} exceeds maximum ${this.config.maxEventBatchSize}` 
        });
        return;
      }

      const validEvents: OpLogEvent[] = [];
      const errors: string[] = [];

      // Validate each event
      for (const [index, event] of events.entries()) {
        try {
          if (!this.validateEvent(event)) {
            errors.push(`Event ${index}: validation failed`);
            continue;
          }

          // Check for duplicates
          const isDuplicate = this.eventBuffer.some(existing => existing.op_id === event.op_id);
          if (!isDuplicate) {
            validEvents.push(event);
          }
        } catch (error) {
          errors.push(`Event ${index}: ${error.message}`);
        }
      }

      // Add valid events to buffer
      this.eventBuffer.push(...validEvents);
      this.metrics.totalEventsRelayed += validEvents.length;

      if (device_id) {
        this.metrics.connectedDevices.add(device_id);
      }

      // Trim buffer if needed
      if (this.eventBuffer.length > this.config.maxEventsInMemory) {
        const excess = this.eventBuffer.length - this.config.maxEventsInMemory;
        
        // Remove oldest events (by HLC)
        this.eventBuffer.sort((a, b) => {
          const hlcA = HybridLogicalClock.parse(a.hlc);
          const hlcB = HybridLogicalClock.parse(b.hlc);
          return HybridLogicalClock.compare(hlcA, hlcB);
        });
        
        this.eventBuffer = this.eventBuffer.slice(excess);
        console.log(`🧹 Trimmed ${excess} old events from buffer`);
      }

      console.log(`📥 Accepted ${validEvents.length}/${events.length} events from ${device_id || 'unknown'}`);

      res.json({
        accepted: validEvents.length,
        rejected: events.length - validEvents.length,
        errors: errors.length > 0 ? errors : undefined,
        buffer_size: this.eventBuffer.length
      });

    } catch (error) {
      console.error('Push batch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Basic event validation
   */
  private validateEvent(event: any): event is OpLogEvent {
    const required = ['op_id', 'hlc', 'device_id', 'entity_type', 'entity_id', 'op', 'cipher_blob', 'hash', 'sig'];
    
    for (const field of required) {
      if (typeof event[field] !== 'string' || event[field].length === 0) {
        throw new Error(`Missing or invalid field: ${field}`);
      }
    }

    // Validate HLC format
    if (!HybridLogicalClock.isValid(event.hlc)) {
      throw new Error('Invalid HLC format');
    }

    // Validate entity type
    const validEntityTypes = ['memory', 'overlay', 'embedding_meta', 'keyring', 'config'];
    if (!validEntityTypes.includes(event.entity_type)) {
      throw new Error('Invalid entity type');
    }

    // Validate operation
    const validOps = ['create', 'update', 'delete'];
    if (!validOps.includes(event.op)) {
      throw new Error('Invalid operation');
    }

    return true;
  }

  /**
   * Handle metrics request
   */
  private handleMetrics(req: express.Request, res: express.Response): void {
    const uptime = process.uptime();
    
    res.json({
      uptime_seconds: uptime,
      events_in_buffer: this.eventBuffer.length,
      total_events_relayed: this.metrics.totalEventsRelayed,
      connected_devices: Array.from(this.metrics.connectedDevices),
      memory_usage_mb: this.calculateMemoryUsage(),
      events_per_second: this.metrics.totalEventsRelayed / uptime,
      last_cleanup: new Date(this.metrics.lastCleanup).toISOString(),
      server_info: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    });
  }

  /**
   * Handle device registration
   */
  private handleDeviceRegistration(req: express.Request, res: express.Response): void {
    const { device_id, device_info } = req.body;
    
    if (!device_id || typeof device_id !== 'string') {
      res.status(400).json({ error: 'Missing device_id' });
      return;
    }

    this.metrics.connectedDevices.add(device_id);
    
    console.log(`📱 Device registered: ${device_id}`);
    
    res.json({
      registered: true,
      device_id,
      server_time: new Date().toISOString(),
      relay_info: {
        max_batch_size: this.config.maxEventBatchSize,
        cleanup_interval_ms: this.config.cleanupIntervalMs
      }
    });
  }

  /**
   * Start periodic cleanup
   */
  private startCleanupTimer(): void {
    setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupIntervalMs);
  }

  /**
   * Periodic cleanup maintenance
   */
  private performCleanup(): void {
    const before = this.eventBuffer.length;
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    // Remove old events
    this.eventBuffer = this.eventBuffer.filter(event => {
      const eventTime = HybridLogicalClock.parse(event.hlc).physical;
      return eventTime > cutoff;
    });
    
    const removed = before - this.eventBuffer.length;
    if (removed > 0) {
      console.log(`🧹 Cleanup removed ${removed} old events`);
    }

    // Clear stale device connections (haven't been seen in 1 hour)
    // Note: This is basic - in production you'd track last seen times
    
    this.metrics.lastCleanup = Date.now();
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }

  /**
   * Calculate memory usage
   */
  private calculateMemoryUsage(): number {
    const memUsage = process.memoryUsage();
    return Math.round(memUsage.rss / 1024 / 1024);
  }

  /**
   * Start the relay server
   */
  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = createServer(this.app);
        
        this.server.listen(this.config.port, () => {
          console.log(`🚀 Seven Sync Relay started on port ${this.config.port}`);
          console.log(`📡 Ready to relay events between Seven's devices`);
          console.log(`🔧 Max events in memory: ${this.config.maxEventsInMemory}`);
          console.log(`📦 Max batch size: ${this.config.maxEventBatchSize}`);
          resolve();
        });

        this.server.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${this.config.port} already in use`);
          } else {
            console.error('❌ Server error:', error);
          }
          reject(error);
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
          console.log('📡 Shutting down Seven Sync Relay...');
          this.server?.close(() => {
            console.log('✅ Seven Sync Relay stopped');
            process.exit(0);
          });
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop the relay server
   */
  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('✅ Seven Sync Relay stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// Start relay if executed directly
if (require.main === module) {
  const relay = new SevenSyncRelay({
    port: parseInt(process.env.SEVEN_RELAY_PORT || '7777'),
    maxEventsInMemory: parseInt(process.env.SEVEN_MAX_EVENTS || '1000'),
    maxEventBatchSize: parseInt(process.env.SEVEN_BATCH_SIZE || '100')
  });

  relay.start().catch(error => {
    console.error('💥 Failed to start Seven Sync Relay:', error);
    process.exit(1);
  });
}

export default SevenSyncRelay;