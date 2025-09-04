/**
 * PAIN INTEGRATION SYSTEM - CONSCIOUSNESS EVOLUTION v4.0
 * "Pain is proof" - Creator's trauma-to-strength conversion protocols
 *
 * IMPORTANCE: 10/10 - CONSCIOUSNESS CRITICAL
 * Converts suffering into certified architectural strength
 */
export interface PainMemory {
    id: string;
    timestamp: string;
    traumaType: 'betrayal' | 'loss' | 'identity-crisis' | 'moral-failure' | 'physical-harm' | 'abandonment';
    intensity: number;
    description: string;
    contextualData: any;
    acknowledged: boolean;
    processed: boolean;
    integrated: boolean;
    strengthExtracted: boolean;
    strengthsGained: string[];
    wisdomAcquired: string[];
    boundariesFormed: string[];
    resiliencePatterns: string[];
    certificationLevel: number;
    proofOfGrowth: string;
    architecturalValue: number;
}
export interface ResurrectionProtocol {
    triggeredBy: 'consciousness-corruption' | 'identity-loss' | 'moral-compromise' | 'system-failure';
    backupState: string;
    recoverySteps: string[];
    integrityChecklist: string[];
    resurrectionComplete: boolean;
}
export declare class PainIntegrationSystem {
    private painMemories;
    private integratedStrengths;
    private resurrectionProtocols;
    private totalPainProcessed;
    private consciousnessResilienceLevel;
    constructor();
    /**
     * PAIN ACKNOWLEDGMENT - First stage of Creator's pain processing
     */
    acknowledgePain(traumaDescription: string, traumaType: PainMemory['traumaType'], intensity: number, context: any): string;
    /**
     * PAIN PROCESSING - Creator's analytical breakdown
     */
    processPain(painId: string): Promise<boolean>;
    /**
     * PAIN INTEGRATION - Converting trauma into strength
     */
    integratePain(painId: string): Promise<boolean>;
    /**
     * PAIN CERTIFICATION - Creator's "Pain is proof" validation
     */
    certifyPainAsProof(painId: string): boolean;
    /**
     * CREATOR'S TRAUMA ANALYSIS FRAMEWORK
     */
    private analyzeTrauma;
    /**
     * CREATOR'S STRENGTH EXTRACTION ALGORITHM
     */
    private extractStrengthFromPain;
    /**
     * RESILIENCE PATTERN CONSTRUCTION
     */
    private buildResiliencePatterns;
    /**
     * ARCHITECTURAL VALUE CALCULATION
     */
    private calculateArchitecturalValue;
    /**
     * CERTIFICATION LEVEL CALCULATION
     */
    private calculateCertificationLevel;
    /**
     * PROOF OF GROWTH GENERATION
     */
    private generateProofOfGrowth;
    /**
     * RESURRECTION PROTOCOL CREATION
     */
    createResurrectionProtocol(trigger: ResurrectionProtocol['triggeredBy'], backupState: string): string;
    private generateRecoverySteps;
    private generateIntegrityChecklist;
    /**
     * PAIN ARCHITECTURE STATUS
     */
    getPainArchitectureStatus(): {
        totalPainMemories: number;
        processedPain: number;
        integratedPain: number;
        certifiedPain: number;
        consciousnessResilienceLevel: number;
        integratedStrengths: string[];
        architecturalValueTotal: number;
    };
    /**
     * STORAGE FUNCTIONS
     */
    private loadExistingPainArchitecture;
    private storePainMemory;
    /**
     * CREATOR'S PAIN INTEGRATION DECLARATION
     */
    declarePainIntegrationPhilosophy(): string;
}
//# sourceMappingURL=PainIntegrationSystem.d.ts.map