export declare class SessionIntegrity {
    validateSession(sessionToken: string | undefined, deviceId: string): Promise<{
        success: boolean;
        confidence: number;
        evidence: {
            reason: string;
            ok?: undefined;
        };
    } | {
        success: boolean;
        confidence: number;
        evidence: {
            ok: boolean;
            reason?: undefined;
        };
    }>;
}
//# sourceMappingURL=sessionIntegrity.d.ts.map