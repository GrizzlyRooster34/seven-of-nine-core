interface QuadranResult {
    passed: boolean;
    failed_gate: string | null;
    reason: string;
    ts: number;
    gate_results: {
        Q1?: boolean;
        Q2?: boolean;
        Q3?: boolean;
        Q4?: boolean;
    };
}
export declare class CreatorProof {
    private behavioralCodex;
    constructor();
    runQuadranLock(context: any): Promise<QuadranResult>;
    private runQ1Gate;
    private runQ2Gate;
    private runQ3Gate;
    private runQ4Gate;
    private logAuditTrail;
}
export {};
//# sourceMappingURL=creator_proof.d.ts.map