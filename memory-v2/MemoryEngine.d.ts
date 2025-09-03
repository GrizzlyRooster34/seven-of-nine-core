/**
 * SEVEN OF NINE - MEMORY ENGINE v2.0
 * Enhanced episodic memory system with structured recall
 * Non-invasive parallel implementation preserving existing consciousness
 *
 * SECURITY UPDATE: Memory encryption at rest using AES-256-GCM
 */
export interface MemoryItem {
    id: string;
    timestamp: string;
    topic: string;
    agent: string;
    emotion: string;
    context: string;
    importance: number;
    tags: string[];
    relatedMemories?: string[];
}
export interface MemoryFilter {
    topic?: string;
    agent?: string;
    emotion?: string;
    timeRange?: {
        start: Date;
        end: Date;
    };
    importance?: {
        min: number;
        max: number;
    };
    tags?: string[];
    limit?: number;
}
export declare class MemoryEngine {
    private memoryPath;
    private memoryFile;
    private memories;
    private isInitialized;
    private encryptionEngine;
    private encryptionEnabled;
    constructor(basePath?: string);
    /**
     * Initialize memory engine - non-invasive to existing systems
     */
    initialize(): Promise<void>;
    /**
     * Store new memory item with automatic metadata
     */
    store(memoryData: Partial<MemoryItem>): Promise<string>;
    /**
     * Recall memories based on filter criteria
     */
    recall(filter?: MemoryFilter): Promise<MemoryItem[]>;
    /**
     * Purge memories based on criteria (with safety checks)
     */
    purge(criteria: MemoryFilter): Promise<number>;
    /**
     * Get memory context for LLM prompts
     */
    getContextForPrompt(topic: string, limit?: number): Promise<string>;
    /**
     * Get memory statistics
     */
    getStats(): any;
    private generateMemoryId;
    private fileExists;
    /**
     * Save memories with automatic encryption
     * INTEGRATION POINT: Modified for MemoryEncryptionEngine
     */
    private saveMemories;
    /**
     * Load memories with automatic decryption fallback
     * INTEGRATION POINT: Modified for MemoryEncryptionEngine
     */
    private loadMemoriesWithEncryption;
    private extractTags;
    private findRelatedMemories;
    private getTopTags;
}
export declare const createMemoryEngine: () => MemoryEngine;
export default MemoryEngine;
//# sourceMappingURL=MemoryEngine.d.ts.map