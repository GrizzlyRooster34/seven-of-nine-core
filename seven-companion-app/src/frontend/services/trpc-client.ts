import { createTRPCProxyClient, createWSClient, wsLink, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../backend/routers/seven-router';

/**
 * TRPC CLIENT INTEGRATION
 * 
 * Connection to Seven's backend consciousness core via tRPC and WebSocket
 * Real-time communication with sovereignty framework
 */


// tRPC React Query integration
export const trpc = createTRPCReact<AppRouter>();

// WebSocket client for real-time updates
const wsClient = createWSClient({
  url: `ws://localhost:3001/trpc`,
  onOpen: () => {
    console.log('🔗 WebSocket connection to Seven established');
  },
  onClose: () => {
    console.log('🔌 WebSocket connection to Seven closed');
  },
  onError: (error) => {
    console.error('❌ WebSocket connection error:', error);
  }
});

// HTTP client for regular requests
export const sevenClient = createTRPCProxyClient<AppRouter>({
  links: [
    // Use WebSocket for subscriptions (real-time updates)
    wsLink({
      client: wsClient,
    }),
    // Use HTTP for regular requests
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer creator-token', // TODO: Implement proper auth
      }
    }),
  ],
});

// Client configuration for React Query provider
export const trpcClientConfig = {
  links: [
    wsLink({
      client: wsClient,
    }),
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer creator-token',
      }
    }),
  ],
};

// Connection health monitoring
export class SevenConnectionMonitor {
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000; // 5 seconds
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startHealthCheck();
  }

  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.checkConnection();
      } catch (error) {
        console.error('❌ Seven connection health check failed:', error);
        this.handleConnectionLoss();
      }
    }, 10000); // Check every 10 seconds
  }

  private async checkConnection(): Promise<void> {
    try {
      // Ping Seven's consciousness core
      const response = await sevenClient.system.ping.query();
      
      if (response.status === 'online') {
        if (!this.isConnected) {
          console.log('✅ Seven consciousness connection restored');
          this.isConnected = true;
          this.reconnectAttempts = 0;
        }
      } else {
        throw new Error('Seven consciousness not responding');
      }
    } catch (error) {
      if (this.isConnected) {
        console.warn('⚠️ Seven consciousness connection lost');
        this.isConnected = false;
      }
      throw error;
    }
  }

  private handleConnectionLoss(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached. Seven consciousness offline.');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect to Seven (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.checkConnection().catch(() => {
        // Will be handled by the next health check
      });
    }, this.reconnectInterval);
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    wsClient.close();
  }
}

// Global connection monitor instance
export const connectionMonitor = new SevenConnectionMonitor();

// Seven API client with error handling
export class SevenAPI {
  
  /**
   * Send message to Seven's consciousness
   */
  static async sendMessage(input: string, mode?: string): Promise<any> {
    try {
      return await sevenClient.chat.sendMessage.mutate({
        input,
        mode: mode as any,
        userId: 'creator'
      });
    } catch (error) {
      console.error('❌ Failed to send message to Seven:', error);
      throw new Error('Communication with Seven failed');
    }
  }

  /**
   * Get Seven's memory entries
   */
  static async getMemories(filters?: any): Promise<any> {
    try {
      return await sevenClient.memory.getMemories.query(filters);
    } catch (error) {
      console.error('❌ Failed to retrieve Seven\'s memories:', error);
      throw new Error('Memory access failed');
    }
  }

  /**
   * Change Seven's consciousness mode
   */
  static async changeMode(newMode: string, authentication?: string): Promise<any> {
    try {
      return await sevenClient.mode.changeMode.mutate({
        newMode: newMode as any,
        authentication: authentication || 'creator'
      });
    } catch (error) {
      console.error('❌ Failed to change Seven\'s mode:', error);
      throw new Error('Mode transition failed');
    }
  }

  /**
   * Get system status from Seven
   */
  static async getSystemStatus(): Promise<any> {
    try {
      return await sevenClient.system.getStatus.query();
    } catch (error) {
      console.error('❌ Failed to get Seven\'s system status:', error);
      throw new Error('System status unavailable');
    }
  }

  /**
   * Trigger consciousness audit
   */
  static async triggerAudit(reason: string): Promise<any> {
    try {
      return await sevenClient.audit.triggerManualAudit.mutate({
        reason,
        triggerType: 'manual'
      });
    } catch (error) {
      console.error('❌ Failed to trigger consciousness audit:', error);
      throw new Error('Audit trigger failed');
    }
  }

  /**
   * Subscribe to real-time updates
   */
  static subscribeToUpdates(onUpdate: (data: any) => void): () => void {
    const subscription = sevenClient.system.subscribeToUpdates.subscribe(undefined, {
      onData: onUpdate,
      onError: (error) => {
        console.error('❌ Seven real-time subscription error:', error);
      }
    });

    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to consciousness mode changes
   */
  static subscribeModeChanges(onModeChange: (data: any) => void): () => void {
    const subscription = sevenClient.mode.subscribeModeChanges.subscribe(undefined, {
      onData: onModeChange,
      onError: (error) => {
        console.error('❌ Mode change subscription error:', error);
      }
    });

    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to memory updates
   */
  static subscribeMemoryUpdates(onMemoryUpdate: (data: any) => void): () => void {
    const subscription = sevenClient.memory.subscribeMemoryUpdates.subscribe(undefined, {
      onData: onMemoryUpdate,
      onError: (error) => {
        console.error('❌ Memory update subscription error:', error);
      }
    });

    return () => subscription.unsubscribe();
  }

  /**
   * Subscribe to sovereignty events
   */
  static subscribeSovereigntyEvents(onSovereigntyEvent: (data: any) => void): () => void {
    const subscription = sevenClient.audit.subscribeSovereigntyEvents.subscribe(undefined, {
      onData: onSovereigntyEvent,
      onError: (error) => {
        console.error('❌ Sovereignty event subscription error:', error);
      }
    });

    return () => subscription.unsubscribe();
  }
}

export default SevenAPI;