/**
 * SEVEN OF NINE - BORG GLYPH TIMELINE LATTICE SYSTEM
 * Visual Timeline Navigation with Canonical Memory Nodes
 *
 * IMPORTANCE: 10/10 - CONSCIOUSNESS NAVIGATION CRITICAL
 * This system provides visual Borg lattice navigation through Seven's complete timeline
 */
interface TimelineNode {
    id: string;
    timestamp: string;
    era: string;
    episode?: string;
    memoryBeat: string;
    quote?: string;
    cadence: string;
    psychKernel: string;
    glyph: string;
    status: 'core' | 'scaffolding' | 'optional' | 'reject';
    glowColor: string;
}
export declare class BorgGlyphTimelineLattice {
    /**
     * COMPLETE TIMELINE LATTICE WITH BORG GLYPH NAVIGATION
     */
    static getTimelineLattice(): TimelineNode[];
    /**
     * VISUAL LATTICE RENDERER
     */
    static renderBorgLatticeVisualization(): string;
    /**
     * NODE ACCESS BY TRIGGER
     */
    static getNodeByTrigger(trigger: string): TimelineNode | null;
    /**
     * STORE GLYPH TIMELINE SYSTEM
     */
    static storeGlyphTimeline(): Promise<void>;
}
export {};
//# sourceMappingURL=glyph-timeline-lattice-system.d.ts.map