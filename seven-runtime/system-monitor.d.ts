/**
 * Seven Core System Monitor
 * Advanced CPU, Memory, and Performance Telemetry
 */
export interface SystemMetrics {
    timestamp: number;
    cpu: CPUMetrics;
    memory: MemoryMetrics;
    performance: PerformanceMetrics;
    system: SystemInfo;
}
export interface CPUMetrics {
    usage: number;
    cores: number;
    loadAverage: {
        oneMinute: number;
        fiveMinute: number;
        fifteenMinute: number;
    };
    model: string;
    speed: number;
    temperatures?: number[];
}
export interface MemoryMetrics {
    total: number;
    free: number;
    used: number;
    usagePercent: number;
    available: number;
    heap: {
        used: number;
        total: number;
        limit: number;
    };
    gc?: {
        collections: number;
        duration: number;
        lastRun: number;
    };
}
export interface PerformanceMetrics {
    uptime: number;
    processUptime: number;
    eventLoopDelay: number;
    handleCount: number;
    requestCount: number;
    avgResponseTime: number;
    peakMemoryUsage: number;
}
export interface SystemInfo {
    platform: string;
    arch: string;
    nodeVersion: string;
    pid: number;
    hostname: string;
    timezone: string;
}
export interface TelemetryAlert {
    id: string;
    severity: 'info' | 'warning' | 'critical';
    metric: string;
    threshold: number;
    currentValue: number;
    message: string;
    timestamp: number;
    acknowledged: boolean;
}
export declare class SystemMonitor {
    private metrics;
    private alerts;
    private isRunning;
    private intervalId;
    private lastCpuUsage;
    private startTime;
    private requestCount;
    private totalResponseTime;
    private peakMemoryUsage;
    private gcStats;
    private thresholds;
    constructor();
    /**
     * Start continuous system monitoring
     */
    start(intervalMs?: number): void;
    /**
     * Stop system monitoring
     */
    stop(): void;
    /**
     * Collect current system metrics
     */
    collectMetrics(): Promise<SystemMetrics>;
    private getCPUMetrics;
    private getMemoryMetrics;
    private getPerformanceMetrics;
    private getSystemInfo;
    private measureEventLoopDelay;
    private getCPUTemperatures;
    private setupGCMonitoring;
    private checkAlerts;
    private addAlert;
    private cleanupOldMetrics;
    /**
     * Get latest system metrics
     */
    getLatestMetrics(): SystemMetrics | null;
    /**
     * Get metrics history
     */
    getMetricsHistory(minutes?: number): SystemMetrics[];
    /**
     * Get active alerts
     */
    getActiveAlerts(): TelemetryAlert[];
    /**
     * Get all alerts
     */
    getAllAlerts(): TelemetryAlert[];
    /**
     * Acknowledge an alert
     */
    acknowledgeAlert(alertId: string): boolean;
    /**
     * Track request metrics (call this from request handlers)
     */
    recordRequest(responseTimeMs: number): void;
    /**
     * Update alert thresholds
     */
    updateThresholds(newThresholds: Partial<typeof this.thresholds>): void;
    /**
     * Get current thresholds
     */
    getThresholds(): {
        cpu: {
            warning: number;
            critical: number;
        };
        memory: {
            warning: number;
            critical: number;
        };
        eventLoop: {
            warning: number;
            critical: number;
        };
        responseTime: {
            warning: number;
            critical: number;
        };
    };
    /**
     * Get monitor status
     */
    getStatus(): {
        running: boolean;
        uptime: number;
        metricsCollected: number;
        activeAlerts: number;
        totalAlerts: number;
    };
    /**
     * Generate summary report
     */
    generateSummaryReport(minutes?: number): string;
}
export declare const systemMonitor: SystemMonitor;
export default systemMonitor;
//# sourceMappingURL=system-monitor.d.ts.map