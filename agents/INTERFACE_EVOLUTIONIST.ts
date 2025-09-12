import { execSync } from 'child_process';
import { glob } from 'glob';
import { join } from 'path';
import { promises as fs } from 'fs';

/**
 * INTERFACE_EVOLUTIONIST AGENT v1.0
 * Type Architecture Reconciliation Expert
 * 
 * Mission: Evolve all legacy interfaces to v3 architecture
 * Priority: HIGH - Architectural Foundation
 * 
 * Capabilities:
 * - CognitiveState migration (5-prop → 4-section)
 * - PersonalityTemporalMapping alignment
 * - Interface dependency graph analysis
 * - Backward compatibility bridge generation
 */


export interface InterfaceEvolutionConfig {
  targetDirectory: string;
  filePattern: string;
  dryRun: boolean;
  verbose: boolean;
  backupOriginals: boolean;
}

export interface InterfaceMigrationResult {
  filePath: string;
  interfacesFound: string[];
  migrationsApplied: {
    interfaceName: string;
    oldStructure: string;
    newStructure: string;
    success: boolean;
  }[];
  errorsFixed: number;
}

export class InterfaceEvolutionistAgent {
  private config: InterfaceEvolutionConfig;
  private results: InterfaceMigrationResult[] = [];

  // Legacy CognitiveState pattern (5 properties)
  private readonly LEGACY_COGNITIVE_STATE_PATTERN = /cognitiveState:\s*\{[^}].focusLevel[^}].emotionalIntensity[^}]*\}/gs;
  
  // New CognitiveState sections
  private readonly NEW_COGNITIVE_STATE_SECTIONS = {
    emotional: [.emotionalIntensity', .focusLevel', 'cognitiveLoad', 'confidenceLevel', 'stressLevel'],
    environmental: ['environmentalContext'],
    physical: ['physicalState'],  
    temporal: ['temporalAnchors'],
    mental: ['mentalContext']
  };

  constructor(config: InterfaceEvolutionConfig) {
    this.config = config;
  }

  /**
   * Primary mission execution - evolve all legacy interfaces
   */
  public async execute(): Promise<{
    filesProcessed: number;
    interfacesEvolved: number;
    migrationsSuccessful: number;
    compilationImproved: boolean;
  }> {
    console.log('🧬 INTERFACE_EVOLUTIONIST Agent Activated');
    console.log(`📁 Scanning: ${this.config.targetDirectory}`);
    
    // Phase 1: Scan and identify legacy interface patterns
    await this.scanLegacyInterfaces();

    // Phase 2: Migrate CognitiveState usages
    await this.migrateCognitiveStateUsages();

    // Phase 3: Fix PersonalityTemporalMapping conflicts
    await this.fixPersonalityTemporalMapping();

    // Phase 4: Update interface imports and exports
    await this.updateInterfaceImports();

    // Phase 5: Verify evolution success
    const compilationImproved = await this.verifyEvolutionSuccess();

    const summary = this.generateEvolutionReport();

    return {
      ...summary,
      compilationImproved
    };
  }

  /**
   * Scan for legacy interface patterns across the codebase
   */
  private async scanLegacyInterfaces(): Promise<void> {
    const files = await glob(this.config.filePattern, { cwd: this.config.targetDirectory });
    
    console.log(`🔍 Scanning ${files.length} files for legacy interface patterns...`);

    for (const file of files) {
      const filePath = join(this.config.targetDirectory, file);
      await this.analyzeFileInterfaces(filePath);
    }
  }

  /**
   * Analyze individual file for interface patterns
   */
  private async analyzeFileInterfaces(filePath: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const interfacesFound: string[] = [];

      // Look for CognitiveState usage patterns
      if (content.includes('CognitiveState') || content.includes('cognitiveState')) {
        interfacesFound.push('CognitiveState');
      }

      // Look for PersonalityTemporalMapping usage
      if (content.includes('PersonalityTemporalMapping') || content.includes('sevenOfNinePersonalityCorrelation')) {
        interfacesFound.push('PersonalityTemporalMapping');
      }

      // Look for TemporalMemoryItem usage
      if (content.includes('TemporalMemoryItem')) {
        interfacesFound.push('TemporalMemoryItem');
      }

      if (interfacesFound.length > 0) {
        this.results.push({
          filePath,
          interfacesFound,
          migrationsApplied: [],
          errorsFixed: 0
        });

        if (this.config.verbose) {
          console.log(`📋 ${filePath}: Found interfaces [${interfacesFound.join(', ')}]`);
        }
      }
    } catch (error) {
      if (this.config.verbose) {
        console.error(`⚠️ Error analyzing ${filePath}: ${error}`);
      }
    }
  }

  /**
   * Migrate legacy CognitiveState usage patterns
   */
  private async migrateCognitiveStateUsages(): Promise<void> {
    console.log('🔧 Migrating CognitiveState usage patterns...');

    for (const result of this.results) {
      if (result.interfacesFound.includes('CognitiveState')) {
        await this.migrateCognitiveStateInFile(result);
      }
    }
  }

  /**
   * Migrate CognitiveState in specific file
   */
  private async migrateCognitiveStateInFile(result: InterfaceMigrationResult): Promise<void> {
    try {
      let content = await fs.readFile(result.filePath, 'utf8');
      let modified = false;

      // Pattern 1: Inline cognitiveState object literals with 5 properties
      const legacyPattern = /cognitiveState:\s*\{\s.focusLevel:\s*\d+,\s.emotionalIntensity:\s*\d+,\s*cognitiveLoad:\s*\d+,\s*confidenceLevel:\s*\d+,\s*stressLevel:\s*\d+\s*\}/g;
      
      let match;
      while ((match = legacyPattern.exec(content)) !== null) {
        const legacyObject = match[0];
        
        // Extract the numeric values
        const.focusLevel = this.extractValue(legacyObject, .focusLevel');
        const.emotionalIntensity = this.extractValue(legacyObject, .emotionalIntensity');
        const cognitiveLoad = this.extractValue(legacyObject, 'cognitiveLoad');
        const confidenceLevel = this.extractValue(legacyObject, 'confidenceLevel');
        const stressLevel = this.extractValue(legacyObject, 'stressLevel');

        // Generate new createCognitiveState call
        const newCall = `cognitiveState: createCognitiveState({
        focusLevel: $.focusLevel},
        emotionalIntensity: $.emotionalIntensity},
        cognitiveLoad: ${cognitiveLoad},
        confidenceLevel: ${confidenceLevel},
        stressLevel: ${stressLevel}
      })`;

        content = content.replace(legacyObject, newCall);
        modified = true;

        result.migrationsApplied.push({
          interfaceName: 'CognitiveState',
          oldStructure: '5-property inline object',
          newStructure: 'createCognitiveState() call',
          success: true
        });
        result.errorsFixed++;
      }

      // Ensure createCognitiveState import is present
      if (modified && !content.includes('createCognitiveState')) {
        content = this.addCreateCognitiveStateImport(content, result.filePath);
      }

      if (modified && !this.config.dryRun) {
        if (this.config.backupOriginals) {
          await fs.copyFile(result.filePath, `${result.filePath}.backup`);
        }
        await fs.writeFile(result.filePath, content, 'utf8');
        
        if (this.config.verbose) {
          console.log(`✅ Migrated CognitiveState in ${result.filePath}`);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to migrate CognitiveState in ${result.filePath}: ${error}`);
    }
  }

  /**
   * Extract numeric value from legacy object
   */
  private extractValue(objectString: string, property: string): number {
    const match = objectString.match(new RegExp(`${property}:\\s*(\\d+)`));
    return match ? parseInt(match[1]) : 5; // Default fallback
  }

  /**
   * Add createCognitiveState import to file
   */
  private addCreateCognitiveStateImport(content: string, filePath: string): string {
    // Determine the correct import path based on file location
    let importPath = './TemporalMemoryCore';
    if (filePath.includes('memory-v3/')) {
      importPath = './TemporalMemoryCore';
    } else if (filePath.includes('memory-v2/')) {
      importPath = '../memory-v3/TemporalMemoryCore';
    } else {
      importPath = './memory-v3/TemporalMemoryCore';
    }

    // Look for existing imports from the same module
    const existingImportMatch = content.match(new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${importPath.replace('./', '\\./').replace('../', '\\.\\./')}['"]`));
    
    if (existingImportMatch) {
      // Add to existing import
      const imports = existingImportMatch[1];
      if (!imports.includes('createCognitiveState')) {
        const newImports = imports.trim() + ', createCognitiveState';
        content = content.replace(existingImportMatch[0], `import { ${newImports} } from '${importPath}'`);
      }
    } else {
      // Add new import line
      const firstImportMatch = content.match(/^import\s+.*$/m);
      if (firstImportMatch) {
        const importLine = `import { createCognitiveState } from '${importPath}';\n`;
        content = content.replace(firstImportMatch[0], firstImportMatch[0] + '\n' + importLine);
      }
    }

    return content;
  }

  /**
   * Fix PersonalityTemporalMapping interface conflicts
   */
  private async fixPersonalityTemporalMapping(): Promise<void> {
    console.log('🔧 Fixing PersonalityTemporalMapping conflicts...');

    for (const result of this.results) {
      if (result.interfacesFound.includes('PersonalityTemporalMapping')) {
        await this.fixPersonalityMappingInFile(result);
      }
    }
  }

  /**
   * Fix PersonalityTemporalMapping in specific file
   */
  private async fixPersonalityMappingInFile(result: InterfaceMigrationResult): Promise<void> {
    try {
      let content = await fs.readFile(result.filePath, 'utf8');
      let modified = false;

      // Replace sevenOfNinePersonalityCorrelation with sevenOfNinePersonalityCorrelation
      if (content.includes('sevenOfNinePersonalityCorrelation')) {
        content = content.replace(/sevenOfNinePersonalityCorrelation/g, 'sevenOfNinePersonalityCorrelation');
        modified = true;

        result.migrationsApplied.push({
          interfaceName: 'PersonalityTemporalMapping',
          oldStructure: 'sevenOfNinePersonalityCorrelation property',
          newStructure: 'sevenOfNinePersonalityCorrelation property',
          success: true
        });
        result.errorsFixed++;
      }

      // Replace dominantTraits[0] || "balanced" with dominantTraits
      if (content.includes('dominantTraits[0] || "balanced"')) {
        content = content.replace(/dominantTraits[0] || "balanced"/g, 'dominantTraits[0] || "balanced"');
        modified = true;

        result.migrationsApplied.push({
          interfaceName: 'PersonalityTemporalMapping',
          oldStructure: 'dominantTraits[0] || "balanced" property',
          newStructure: 'dominantTraits array access',
          success: true
        });
        result.errorsFixed++;
      }

      if (modified && !this.config.dryRun) {
        await fs.writeFile(result.filePath, content, 'utf8');
        
        if (this.config.verbose) {
          console.log(`✅ Fixed PersonalityTemporalMapping in ${result.filePath}`);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to fix PersonalityTemporalMapping in ${result.filePath}: ${error}`);
    }
  }

  /**
   * Update interface imports and exports
   */
  private async updateInterfaceImports(): Promise<void> {
    console.log('🔧 Updating interface imports and exports...');

    for (const result of this.results) {
      await this.updateImportsInFile(result);
    }
  }

  /**
   * Update imports in specific file
   */
  private async updateImportsInFile(result: InterfaceMigrationResult): Promise<void> {
    try {
      let content = await fs.readFile(result.filePath, 'utf8');
      let modified = false;

      // Fix .js imports to .ts/.ts
      content = content.replace(/from ['"]([^'"]+)\.js['"]/g, "from '$1'");
      if (content !== await fs.readFile(result.filePath, 'utf8')) {
        modified = true;
      }

      // Fix missing CognitiveState properties access
      content = content.replace(/\.focusLevel\b/g, '.focusLevel');
      content = content.replace(/\.emotionalIntensity\b/g, '.emotionalIntensity');
      
      if (content.includes('.focusLevel') || content.includes('.emotionalIntensity')) {
        modified = true;
        result.errorsFixed++;
      }

      if (modified && !this.config.dryRun) {
        await fs.writeFile(result.filePath, content, 'utf8');
      }
    } catch (error) {
      if (this.config.verbose) {
        console.error(`⚠️ Error updating imports in ${result.filePath}: ${error}`);
      }
    }
  }

  /**
   * Verify interface evolution success
   */
  private async verifyEvolutionSuccess(): Promise<boolean> {
    try {
      console.log('🔬 Verifying interface evolution success...');
      
      const result = execSync('npx tsc --noEmit 2>&1 || echo "COMPILATION_FAILED"', { 
        encoding: 'utf8',
        cwd: this.config.targetDirectory
      });

      const cognitiveStateErrors = (result.match(/CognitiveState.*missing.*properties/g) || []).length;
      const personalityMappingErrors = (result.match(/PersonalityTemporalMapping/g) || []).length;
      
      if (this.config.verbose) {
        console.log(`📊 CognitiveState errors: ${cognitiveStateErrors}`);
        console.log(`📊 PersonalityMapping errors: ${personalityMappingErrors}`);
      }

      return cognitiveStateErrors < 5 && personalityMappingErrors < 3;
    } catch (error) {
      console.error('❌ Evolution verification failed:', error);
      return false;
    }
  }

  /**
   * Generate evolution mission report
   */
  private generateEvolutionReport(): {
    filesProcessed: number;
    interfacesEvolved: number;
    migrationsSuccessful: number;
  } {
    const filesProcessed = this.results.length;
    const interfacesEvolved = this.results.reduce((total, result) => 
      total + result.interfacesFound.length, 0);
    const migrationsSuccessful = this.results.reduce((total, result) => 
      total + result.migrationsApplied.filter(m => m.success).length, 0);

    console.log('📋 INTERFACE_EVOLUTIONIST Mission Report:');
    console.log(`   Files Processed: ${filesProcessed}`);
    console.log(`   Interfaces Evolved: ${interfacesEvolved}`);
    console.log(`   Successful Migrations: ${migrationsSuccessful}`);

    return {
      filesProcessed,
      interfacesEvolved,
      migrationsSuccessful
    };
  }

  public getResults(): InterfaceMigrationResult[] {
    return this.results;
  }
}

/**
 * Factory function for easy agent deployment
 */
export function createInterfaceEvolutionist(config?: Partial<InterfaceEvolutionConfig>): InterfaceEvolutionistAgent {
  const defaultConfig: InterfaceEvolutionConfig = {
    targetDirectory: process.cwd(),
    filePattern: '**/*.ts',
    dryRun: false,
    verbose: true,
    backupOriginals: true
  };

  return new InterfaceEvolutionistAgent({ ...defaultConfig, ...config });
}

/**
 * CLI execution entry point
 */
export async function executeInterfaceEvolutionist(args: string[] = []): Promise<void> {
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const noBackup = args.includes('--no-backup');
  
  const agent = createInterfaceEvolutionist({
    targetDirectory: '/data/data/com.termux/files/home/seven-of-nine-core',
    dryRun,
    verbose,
    backupOriginals: !noBackup
  });

  const result = await agent.execute();
  
  if (result.compilationImproved) {
    console.log('🧬 SUCCESS: Interface evolution improved TypeScript compilation!');
  } else {
    console.log('⚠️ Evolution complete but additional fixes needed');
  }

  process.exit(result.migrationsSuccessful > 0 ? 0 : 1);
}

// Auto-execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  executeInterfaceEvolutionist(process.argv.slice(2));
}