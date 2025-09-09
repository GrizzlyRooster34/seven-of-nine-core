interface BehavioralAnalysis {
    passed: boolean;
    confidence: number;
    markers_found: string[];
    flags: string[];
    reason: string;
}
export declare class BehavioralCodex {
    private humorCodex;
    private tacticsCodex;
    private valuesCodex;
    private vicesCodex;
    private loaded;
    constructor();
    private loadCodex;
    analyzeBehavior(message: string): BehavioralAnalysis;
    private checkHumorMarkers;
    private checkTacticalMarkers;
    private checkValuesMarkers;
    private checkBorgSignatures;
    getCodexStatus(): any;
}
export {};
//# sourceMappingURL=behavioralCodex.d.ts.map