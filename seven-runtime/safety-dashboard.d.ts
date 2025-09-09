import { SecurityResult } from './security_middleware';
import { SystemMetrics, TelemetryAlert } from './system-monitor';
/**
 * Seven Core Unified Safety Dashboard
 * Provides comprehensive view of all security and safety systems
 */
export interface SafetyDashboardStatus {
    timestamp: number;
    overall: {
        status: 'secure' | 'warning' | 'critical';
        score: number;
        summary: string;
    };
    systems: {
        quadranLock: SystemStatus;
        quadraLockCSSR: SystemStatus;
        safetyGuardrails: SystemStatus;
        overrideConditions: SystemStatus;
        restraintDoctrine: SystemStatus;
    };
    metrics: SafetyMetrics;
    systemMetrics: SystemMetrics | null;
    telemetry: {
        alerts: TelemetryAlert[];
        monitorStatus: any;
    };
    alerts: SafetyAlert[];
    recommendations: string[];
}
export interface SystemStatus {
    name: string;
    status: 'operational' | 'degraded' | 'failed' | 'disabled';
    lastCheck: number;
    score: number;
    details: any;
    errorCount: number;
    avgResponseTime: number;
}
export interface SafetyMetrics {
    totalRequests: number;
    blockedRequests: number;
    passedRequests: number;
    avgProcessingTime: number;
    criticalAlerts: number;
    uptime: number;
}
export interface SafetyAlert {
    id: string;
    severity: 'info' | 'warning' | 'critical';
    system: string;
    message: string;
    timestamp: number;
    resolved: boolean;
    details?: any;
}
export declare class SafetyDashboard {
    private securityMiddleware;
    private quadranLock;
    private quadraLockCSSR;
    private metrics;
    private alerts;
    private systemStartTime;
    constructor();
    private initializeSystemMonitoring;
    /**
     * Get comprehensive safety dashboard status
     */
    getSafetyStatus(): Promise<SafetyDashboardStatus>;
    /**
     * Test security pipeline with sample input
     */
    testSecurityPipeline(testInput?: string): Promise<SecurityResult>;
    private checkQuadranLockStatus;
    private checkQuadraLockCSSRStatus;
    private checkSafetyGuardrailsStatus;
    private checkOverrideConditionsStatus;
    private checkRestraintDoctrineStatus;
    private determineOverallStatus;
    private generateOverallSummary;
    private generateRecommendations;
    private addAlert;
    private getActiveAlerts;
    /**
     * Resolve an alert by ID
     */
    resolveAlert(alertId: string): boolean;
    /**
     * Get historical safety metrics
     */
    getMetrics(): SafetyMetrics;
    /**
     * Reset metrics (for testing/maintenance)
     */
    resetMetrics(): void;
}
export declare const safetyDashboard: SafetyDashboard;
export default safetyDashboard;
//# sourceMappingURL=safety-dashboard.d.ts.map