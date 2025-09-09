export interface Q1AttestationResult {
    valid: boolean;
    timestamp: string;
    error?: string;
}
export interface Q1AttestationContext {
    env?: {
        deviceId?: string;
    };
    runtime?: {
        deviceId?: string;
    };
    auth?: {
        pubkey_ssh_ed25519?: string;
    };
}
export declare function q1_attestation(ctx: any): boolean;
export declare function runQ1Attestation(ctx: Q1AttestationContext, signature?: string): Promise<Q1AttestationResult>;
//# sourceMappingURL=q1_attestation.d.ts.map