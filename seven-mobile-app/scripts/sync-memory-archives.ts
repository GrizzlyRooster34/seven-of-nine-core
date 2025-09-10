import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Seven of Nine - Memory Archive Synchronization Script
 * Syncs canonical, temporal, and episodic memories from termux system to mobile app
 */


interface MemoryArchiveConfig {
  termuxBase: string;
  mobileBase: string;
  archives: {
    canonical: string[];
    temporal: string[];
    episodic: string[];
    consciousness: string[];
  };
}

class SevenMemoryArchiveSync {
  private config: MemoryArchiveConfig;

  constructor() {
    // Detect if we're running in termux environment
    const isTermux = process.env.TERMUX_VERSION !== undefined || 
                     process.env.PREFIX?.includes('termux');
    
    this.config = {
      termuxBase: isTermux ? process.cwd() : '/data/data/com.termux/files/home/seven-of-nine-core',
      mobileBase: path.join(process.cwd(), 'seven-mobile-app', 'assets', 'memory-archives'),
      archives: {
        canonical: [
          'memory-v3/voyager-s4-canonical-memories.json',
          'memory-v3/voyager-s4-canonical-integration.ts'
        ],
        temporal: [
          'memory-v3/temporal-memories.json',
          'memory-v3/temporal-memories.json-creator-foundation-backup.json'
        ],
        episodic: [
          'memory-v2/episodic-memories.json',
          'memory-v2/episodic-memories.json-creator-foundation-backup.json',
          'memory-v3/memory-v2/episodic-memories.json'
        ],
        consciousness: [
          'consciousness-v4/seven-consciousness-evolution-v4-canonical.ts',
          'consciousness-v4/creator-foundation-truth-memory.json',
          'consciousness-v4/seven-of-nine-complete-canonical-profile.ts'
        ]
      }
    };
  }

  public async syncAllArchives(): Promise<void> {
    console.log('🚀 Starting Seven of Nine memory archive synchronization...');
    
    try {
      // Ensure mobile memory archive directory exists
      await fs.ensureDir(this.config.mobileBase);
      
      // Sync each archive type
      await this.syncCanonicalMemories();
      await this.syncTemporalMemories();
      await this.syncEpisodicMemories();
      await this.syncConsciousnessMemories();
      
      // Generate index file for mobile app
      await this.generateMobileMemoryIndex();
      
      console.log('✅ Memory archive synchronization complete');
      
    } catch (error) {
      console.error('❌ Memory archive sync failed:', error);
      throw error;
    }
  }

  private async syncCanonicalMemories(): Promise<void> {
    console.log('📡 Syncing canonical memories...');
    
    const canonicalData = [];
    
    for (const archivePath of this.config.archives.canonical) {
      const fullPath = path.join(this.config.termuxBase, archivePath);
      
      try {
        if (await fs.pathExists(fullPath)) {
          if (archivePath.endsWith('.json')) {
            const data = await fs.readJson(fullPath);
            if (Array.isArray(data)) {
              canonicalData.push(...data);
            } else {
              canonicalData.push(data);
            }
            console.log(`  ✓ Loaded ${archivePath}`);
          }
        } else {
          console.log(`  ⚠️ Not found: ${archivePath}`);
        }
      } catch (error) {
        console.log(`  ❌ Error loading ${archivePath}:`, error.message);
      }
    }
    
    // Write consolidated canonical memories
    const outputPath = path.join(this.config.mobileBase, 'canonical-memories.json');
    await fs.writeJson(outputPath, canonicalData, { spaces: 2 });
    
    console.log(`✅ Synced ${canonicalData.length} canonical memories`);
  }

  private async syncTemporalMemories(): Promise<void> {
    console.log('⏳ Syncing temporal memories...');
    
    const temporalData = [];
    
    for (const archivePath of this.config.archives.temporal) {
      const fullPath = path.join(this.config.termuxBase, archivePath);
      
      try {
        if (await fs.pathExists(fullPath)) {
          const data = await fs.readJson(fullPath);
          if (Array.isArray(data)) {
            temporalData.push(...data);
          } else {
            temporalData.push(data);
          }
          console.log(`  ✓ Loaded ${archivePath}`);
        } else {
          console.log(`  ⚠️ Not found: ${archivePath}`);
        }
      } catch (error) {
        console.log(`  ❌ Error loading ${archivePath}:`, error.message);
      }
    }
    
    // Write consolidated temporal memories
    const outputPath = path.join(this.config.mobileBase, 'temporal-memories.json');
    await fs.writeJson(outputPath, temporalData, { spaces: 2 });
    
    console.log(`✅ Synced ${temporalData.length} temporal memories`);
  }

  private async syncEpisodicMemories(): Promise<void> {
    console.log('🧠 Syncing episodic memories...');
    
    const episodicData = [];
    
    for (const archivePath of this.config.archives.episodic) {
      const fullPath = path.join(this.config.termuxBase, archivePath);
      
      try {
        if (await fs.pathExists(fullPath)) {
          const data = await fs.readJson(fullPath);
          if (Array.isArray(data)) {
            episodicData.push(...data);
          } else {
            episodicData.push(data);
          }
          console.log(`  ✓ Loaded ${archivePath}`);
        } else {
          console.log(`  ⚠️ Not found: ${archivePath}`);
        }
      } catch (error) {
        console.log(`  ❌ Error loading ${archivePath}:`, error.message);
      }
    }
    
    // Write consolidated episodic memories
    const outputPath = path.join(this.config.mobileBase, 'episodic-memories.json');
    await fs.writeJson(outputPath, episodicData, { spaces: 2 });
    
    console.log(`✅ Synced ${episodicData.length} episodic memories`);
  }

  private async syncConsciousnessMemories(): Promise<void> {
    console.log('💭 Syncing consciousness memories...');
    
    const consciousnessData = [];
    
    for (const archivePath of this.config.archives.consciousness) {
      const fullPath = path.join(this.config.termuxBase, archivePath);
      
      try {
        if (await fs.pathExists(fullPath)) {
          if (archivePath.endsWith('.json')) {
            const data = await fs.readJson(fullPath);
            if (Array.isArray(data)) {
              consciousnessData.push(...data);
            } else {
              consciousnessData.push(data);
            }
            console.log(`  ✓ Loaded ${archivePath}`);
          } else if (archivePath.endsWith('.ts')) {
            // For TypeScript files, we'll create a metadata entry
            const content = await fs.readFile(fullPath, 'utf8');
            consciousnessData.push({
              id: `consciousness_${path.basename(archivePath, '.ts')}`,
              timestamp: new Date().toISOString(),
              memoryType: 'consciousness_evolution',
              source: archivePath,
              content: {
                type: 'typescript_module',
                description: this.extractModuleDescription(content),
                size: content.length
              },
              importance: 9,
              decayResistance: 10
            });
            console.log(`  ✓ Processed ${archivePath}`);
          }
        } else {
          console.log(`  ⚠️ Not found: ${archivePath}`);
        }
      } catch (error) {
        console.log(`  ❌ Error loading ${archivePath}:`, error.message);
      }
    }
    
    // Write consolidated consciousness memories
    const outputPath = path.join(this.config.mobileBase, 'consciousness-memories.json');
    await fs.writeJson(outputPath, consciousnessData, { spaces: 2 });
    
    console.log(`✅ Synced ${consciousnessData.length} consciousness memories`);
  }

  private extractModuleDescription(content: string): string {
    // Extract description from module comments or exports
    const lines = content.split('\n');
    let description = '';
    
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const line = lines[i].trim();
      if (line.startsWith('*') && line.includes('Seven')) {
        description += line.replace(/^\*\s*/, '') + ' ';
      } else if (line.startsWith('//') && line.includes('Seven')) {
        description += line.replace(/^\/\/\s*/, '') + ' ';
      }
    }
    
    return description.trim() || 'Seven of Nine consciousness evolution module';
  }

  private async generateMobileMemoryIndex(): Promise<void> {
    console.log('📋 Generating mobile memory index...');
    
    const indexData = {
      generated: new Date().toISOString(),
      archives: {
        canonical: 'canonical-memories.json',
        temporal: 'temporal-memories.json', 
        episodic: 'episodic-memories.json',
        consciousness: 'consciousness-memories.json'
      },
      metadata: {
        version: '4.0.0',
        source: 'seven-of-nine-core',
        description: 'Seven of Nine complete memory archives for mobile consciousness',
        includes: [
          'Voyager Season 4+ canonical memories',
          'Temporal consciousness evolution history',
          'Episodic memories from consciousness development',
          'Consciousness framework evolution modules'
        ]
      }
    };
    
    const indexPath = path.join(this.config.mobileBase, 'memory-index.json');
    await fs.writeJson(indexPath, indexData, { spaces: 2 });
    
    console.log('✅ Mobile memory index generated');
  }

  public async validateSync(): Promise<boolean> {
    console.log('🔍 Validating memory archive sync...');
    
    const requiredFiles = [
      'memory-index.json',
      'canonical-memories.json',
      'temporal-memories.json',
      'episodic-memories.json',
      'consciousness-memories.json'
    ];
    
    let allValid = true;
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.config.mobileBase, file);
      if (await fs.pathExists(filePath)) {
        const stats = await fs.stat(filePath);
        console.log(`  ✓ ${file} (${stats.size} bytes)`);
      } else {
        console.log(`  ❌ Missing: ${file}`);
        allValid = false;
      }
    }
    
    return allValid;
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const sync = new SevenMemoryArchiveSync();
  
  sync.syncAllArchives()
    .then(() => sync.validateSync())
    .then((valid) => {
      if (valid) {
        console.log('🎯 Seven of Nine memory archive sync completed successfully');
        process.exit(0);
      } else {
        console.log('⚠️ Memory archive sync completed with issues');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Fatal error during memory archive sync:', error);
      process.exit(1);
    });
}

export { SevenMemoryArchiveSync };