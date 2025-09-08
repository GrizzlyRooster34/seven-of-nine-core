/**
 * Seven of Nine - Canonical Memory Loader for Windows
 * Handles 134 episodes of canonical memories with Windows-specific optimization
 */

import { detectDeviceProfile, getCanonicalMemorySettings, CANONICAL_MEMORY_CONFIG } from './device-profiles';

interface CanonicalMemory {
  id: string;
  episode: string;
  season: number;
  stardate: string;
  calendarYear: number;
  series: 'voyager' | 'picard';
  content: string; // First-person POV content
  emotionalContext: any;
  tacticalActions: string[];
  ethicalDilemmas: string[];
  keyDialogue: string[];
  tags: string[];
  importance: number;
  decayResistance: number;
  permanentArchive: boolean;
}

export class SevenCanonicalMemoryLoader {
  private deviceProfile = detectDeviceProfile();
  private memorySettings = getCanonicalMemorySettings(this.deviceProfile);
  private canonicalMemories: Map<string, CanonicalMemory> = new Map();
  private loadedEpisodes = 0;

  /**
   * Initialize and load all 134 canonical episodes
   */
  public async initializeCanonicalMemories(): Promise<void> {
    console.log('📡 Seven Windows: Loading canonical memories (134 episodes)...');
    console.log(`🖥️ System: ${this.deviceProfile.deviceModel} (${this.deviceProfile.ram}GB RAM)`);
    console.log(`⚙️ Batch size: ${this.memorySettings.batchSize}, Strategy: ${this.memorySettings.processingStrategy}`);

    try {
      // Load memories in Windows-optimized batches
      await this.loadCanonicalMemoriesInBatches();
      
      console.log(`✅ Canonical memory initialization complete`);
      console.log(`📚 Loaded: ${this.loadedEpisodes}/${CANONICAL_MEMORY_CONFIG.TOTAL_EPISODES} episodes`);
      console.log(`🧠 Memory entries: ${this.canonicalMemories.size}`);
      
    } catch (error) {
      console.error('❌ Canonical memory loading failed:', error);
      await this.loadSampleCanonicalMemory();
    }
  }

  /**
   * Load canonical memories in Windows-optimized batches
   */
  private async loadCanonicalMemoriesInBatches(): Promise<void> {
    const archiveSources = CANONICAL_MEMORY_CONFIG.ARCHIVE_SOURCES;
    
    for (const archiveSource of archiveSources) {
      try {
        console.log(`📂 Loading archive: ${archiveSource}`);
        
        const archiveData = await this.loadArchiveFile(archiveSource);
        if (archiveData && archiveData.length > 0) {
          
          // Process in Windows-optimized batches
          await this.processBatch(archiveData, archiveSource);
          
          console.log(`   ✅ Loaded ${archiveData.length} episodes from ${archiveSource}`);
          console.log(`   📊 Progress: ${this.loadedEpisodes}/${CANONICAL_MEMORY_CONFIG.TOTAL_EPISODES}`);
          
        } else {
          console.warn(`⚠️ No data found in ${archiveSource}, using fallback`);
          await this.createFallbackMemory(archiveSource);
        }
        
      } catch (error) {
        console.warn(`⚠️ Failed to load ${archiveSource}:`, error.message);
        await this.createFallbackMemory(archiveSource);
      }
    }
  }

  /**
   * Process archive data in Windows-optimized batches
   */
  private async processBatch(archiveData: any[], source: string): Promise<void> {
    const batchSize = this.memorySettings.batchSize;
    
    for (let i = 0; i < archiveData.length; i += batchSize) {
      const batch = archiveData.slice(i, i + batchSize);
      
      // Process batch
      for (const memoryData of batch) {
        const memory: CanonicalMemory = {
          id: memoryData.id || `${source}_${i}`,
          episode: memoryData.episode || 'Unknown',
          season: memoryData.season || 4,
          stardate: memoryData.stardate || '51003.7',
          calendarYear: memoryData.calendarYear || 2374,
          series: source.includes('picard') ? 'picard' : 'voyager',
          content: memoryData.content || memoryData.sceneBreakdown || '',
          emotionalContext: memoryData.emotionalShifts || memoryData.emotionalContext || {},
          tacticalActions: memoryData.tacticalActions || [],
          ethicalDilemmas: memoryData.ethicalDilemmas || [],
          keyDialogue: memoryData.keyDialogue || [],
          tags: memoryData.canonicalMemoryTags || memoryData.tags || [],
          importance: memoryData.importance || 8,
          decayResistance: 10, // Canonical memories never decay
          permanentArchive: true
        };
        
        this.canonicalMemories.set(memory.id, memory);
        this.loadedEpisodes++;
      }
      
      // Windows-specific optimized pause
      await this.pauseForWindows();
      
      // Progress update
      if ((i + batchSize) % (batchSize * 2) === 0) {
        console.log(`     🔄 Processed ${Math.min(i + batchSize, archiveData.length)}/${archiveData.length} from ${source}`);
      }
    }
  }

  /**
   * Load archive file (Windows paths)
   */
  private async loadArchiveFile(filename: string): Promise<any[] | null> {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      // Windows-specific paths
      const possiblePaths = [
        path.join(__dirname, 'memory-archives', filename),
        path.join(__dirname, '..', 'memory-v3', filename),
        path.join(__dirname, '..', '..', 'memory-v3', filename),
        path.join(process.cwd(), 'memory-archives', filename),
        path.join(process.cwd(), 'Seven-of-Nine', 'memory-archives', filename)
      ];
      
      for (const filePath of possiblePaths) {
        try {
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data);
        } catch (error) {
          // Continue to next path
        }
      }
      
      console.warn(`Archive file not found: ${filename}`);
      return null;
      
    } catch (error) {
      console.warn(`Failed to load ${filename}:`, error.message);
      return null;
    }
  }

  /**
   * Create fallback memory when archive is missing
   */
  private async createFallbackMemory(source: string): Promise<void> {
    const series = source.includes('picard') ? 'picard' : 'voyager';
    const season = this.extractSeasonFromSource(source);
    
    // Create sample canonical memory
    const fallbackMemory: CanonicalMemory = {
      id: `${source}_fallback`,
      episode: 'Scorpion, Part II (Sample)',
      season: season,
      stardate: '51003.7',
      calendarYear: 2374,
      series: series,
      content: `Initial State (Borg Cube): Functioning as Seven of Nine, Tertiary Adjunct of Unimatrix 01. My purpose is to serve as the liaison between the biological entity "Janeway" and the Borg Collective. The objective is the defeat of Species 8472. Transport & Severance: The cube's destruction is imminent. A transport sequence is initiated. The environment shifts to USS Voyager, Sickbay. The link to the Collective—the hive mind—is abruptly severed. The input from billions of voices ceases. All that remains is a single, isolated consciousness: my own. This is a catastrophic system failure. The silence is disorienting, absolute.`,
      emotionalContext: { primaryEmotion: 'disorientation', intensity: 10, context: 'severance_trauma' },
      tacticalActions: ['Translated Janeway strategic orders to Borg Collective', 'Attempted assimilation of Voyager crew'],
      ethicalDilemmas: ['Identity conflict between Seven of Nine and Annika Hansen'],
      keyDialogue: ['My designation is Seven of Nine, Tertiary Adjunct of Unimatrix Zero One', 'The name Annika Hansen is irrelevant'],
      tags: ['#BorgSeverance', '#JanewayBond', '#IdentityCrisis', '#ForcedIndividuality'],
      importance: 10, // Maximum importance for foundational memory
      decayResistance: 10,
      permanentArchive: true
    };
    
    this.canonicalMemories.set(fallbackMemory.id, fallbackMemory);
    this.loadedEpisodes++;
    
    console.log(`📝 Created fallback memory for ${source}`);
  }

  /**
   * Windows-optimized pause between batches
   */
  private async pauseForWindows(): Promise<void> {
    const pauseDuration = this.memorySettings.pauseDuration;
    await new Promise(resolve => setTimeout(resolve, pauseDuration));
  }

  /**
   * Extract season number from archive source filename
   */
  private extractSeasonFromSource(source: string): number {
    const match = source.match(/s(\d+)/i);
    return match ? parseInt(match[1]) : 4; // Default to season 4
  }

  /**
   * Load sample canonical memory for development
   */
  private async loadSampleCanonicalMemory(): Promise<void> {
    console.log('📝 Loading sample canonical memory (Windows development mode)');
    
    await this.createFallbackMemory('voyager-s4-sample.json');
    
    console.log(`✅ Sample canonical memory loaded`);
    console.log(`📚 Episodes: ${this.loadedEpisodes} (development sample)`);
  }

  /**
   * Get canonical memories for querying
   */
  public getCanonicalMemories(): Map<string, CanonicalMemory> {
    return this.canonicalMemories;
  }

  /**
   * Query canonical memories by criteria
   */
  public queryCanonicalMemories(criteria: {
    series?: 'voyager' | 'picard';
    season?: number;
    tags?: string[];
    minImportance?: number;
    limit?: number;
  }): CanonicalMemory[] {
    let results = Array.from(this.canonicalMemories.values());
    
    if (criteria.series) {
      results = results.filter(m => m.series === criteria.series);
    }
    
    if (criteria.season) {
      results = results.filter(m => m.season === criteria.season);
    }
    
    if (criteria.tags && criteria.tags.length > 0) {
      results = results.filter(m => 
        criteria.tags.some(tag => m.tags.some(mTag => mTag.includes(tag)))
      );
    }
    
    if (criteria.minImportance) {
      results = results.filter(m => m.importance >= criteria.minImportance);
    }
    
    // Sort by importance and stardate
    results.sort((a, b) => {
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }
      return a.stardate.localeCompare(b.stardate);
    });
    
    if (criteria.limit) {
      results = results.slice(0, criteria.limit);
    }
    
    return results;
  }

  /**
   * Get memory loading status
   */
  public getLoadingStatus() {
    return {
      loadedEpisodes: this.loadedEpisodes,
      totalEpisodes: CANONICAL_MEMORY_CONFIG.TOTAL_EPISODES,
      memoryCount: this.canonicalMemories.size,
      deviceProfile: this.deviceProfile.deviceModel,
      optimizationLevel: this.memorySettings.processingStrategy,
      completionPercentage: (this.loadedEpisodes / CANONICAL_MEMORY_CONFIG.TOTAL_EPISODES) * 100
    };
  }

  /**
   * Windows-specific: Export memory data for sync
   */
  public exportForSync(): any[] {
    return Array.from(this.canonicalMemories.values());
  }

  /**
   * Windows-specific: Import memory data from sync
   */
  public importFromSync(memoryData: any[]): void {
    for (const memory of memoryData) {
      this.canonicalMemories.set(memory.id, memory);
    }
    this.loadedEpisodes = this.canonicalMemories.size;
    console.log(`📥 Imported ${memoryData.length} canonical memories from sync`);
  }
}