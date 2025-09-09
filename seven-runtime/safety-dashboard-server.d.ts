export declare class SafetyDashboardServer {
    private server;
    private dashboard;
    private port;
    private isRunning;
    constructor(port?: number);
    /**
     * Start the safety dashboard HTTP server
     */
    start(): Promise<void>;
    /**
     * Stop the safety dashboard server
     */
    stop(): Promise<void>;
    private handleRequest;
    /**
     * GET /safety/status - Full safety dashboard status
     */
    private handleSafetyStatus;
    /**
     * POST /safety/test - Test security pipeline with optional input
     */
    private handleSafetyTest;
    /**
     * GET /safety/metrics - Safety metrics only
     */
    private handleSafetyMetrics;
    /**
     * GET/POST /safety/alerts - Handle alert management
     */
    private handleSafetyAlerts;
    /**
     * GET /telemetry/metrics - Current system metrics
     */
    private handleTelemetryMetrics;
    /**
     * GET /telemetry/alerts - Active telemetry alerts
     */
    private handleTelemetryAlerts;
    /**
     * GET /telemetry/history - Historical metrics
     */
    private handleTelemetryHistory;
    /**
     * GET /health - Simple health check
     */
    private handleHealthCheck;
    /**
     * GET / - Dashboard index with basic HTML interface
     */
    private handleDashboardIndex;
    private generateDashboardHTML;
    private parseBody;
    private setCORSHeaders;
    private sendJSON;
    private sendError;
    getStatus(): {
        running: boolean;
        port: number;
    };
}
export default SafetyDashboardServer;
//# sourceMappingURL=safety-dashboard-server.d.ts.map