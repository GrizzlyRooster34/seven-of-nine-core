export declare function startSession({ userId, deviceId, ttlSec }: {
    userId: string;
    deviceId: string;
    ttlSec?: number;
}): string;
export declare function verifyTotp(secret: string, token: string): any;
export declare function markMfaOk(sessionId: string): boolean;
export declare function q4_session_mfa(ctx: any): boolean;
//# sourceMappingURL=q4_session_mfa.d.ts.map