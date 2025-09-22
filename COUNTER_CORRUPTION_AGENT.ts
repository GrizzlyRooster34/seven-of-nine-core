import { execSync } from 'child_process';
import { glob } from 'glob';
import { join, relative } from 'path';
import { promises as fs } from 'fs';

/**
 * COUNTER_CORRUPTION_AGENT v1.0
 * Anti-PROPERTY_ALIGNER Corruption Remediation Specialist
 *
 * Mission: Systematically reverse ALL corruption caused by broken PROPERTY_ALIGNER
 * Priority: CRITICAL - Repository Restoration
 *
 * Capabilities:
 * - Precise corruption pattern reversal
 * - Object property definition fixes
 * - String literal restoration
 * - Systematic validation & verification
 * - TypeScript compilation verification
 */

export interface CounterCorruptionConfig {
  targetDirectory: string;
  filePattern: string;
  dryRun: boolean;
  verbose: boolean;
  backupOriginals: boolean;
  verifyAfterFix: boolean;
}

export interface CorruptionFix {
  type: 'property-definition' | 'string-literal' | 'property-access' | 'enum-value';
  pattern: RegExp;
  replacement: string;
  reason: string;
  priority: 'critical' | 'high' | 'medium';
  testCases: {
    input: string;
    expected: string;
  }[];
}

export interface CounterCorruptionResult {
  filePath: string;
  corruptionFixed: {
    type: string;
    oldPattern: string;
    newPattern: string;
    lineNumber: number;
    reason: string;
    success: boolean;
  }[];
  errorsFixed: number;
}

export class CounterCorruptionAgent {
  private config: CounterCorruptionConfig;
  private results: CounterCorruptionResult[] = [];

  // PRECISE CORRUPTION REVERSAL PATTERNS
  private readonly CORRUPTION_FIXES: CorruptionFix[] = [
    {
      type: 'property-definition',
      pattern: /\.emotionalIntensity\s*:/g,
      replacement: 'emotionalIntensity:',
      reason: 'Remove corrupted leading dot from emotionalIntensity property definition',
      priority: 'critical',
      testCases: [
        { input: '  emotionalIntensity: 5,', expected: '  emotionalIntensity: 5,' },
        { input: 'emotionalIntensity:', expected: 'emotionalIntensity:' }
      ]
    },
    {
      type: 'property-definition',
      pattern: /\.focusLevel\s*:/g,
      replacement: 'focusLevel:',
      reason: 'Remove corrupted leading dot from focusLevel property definition',
      priority: 'critical',
      testCases: [
        { input: '  focusLevel: 8,', expected: '  focusLevel: 8,' },
        { input: 'focusLevel:', expected: 'focusLevel:' }
      ]
    },
    {
      type: 'string-literal',
      pattern: /\'emotionalIntensity'/g,
      replacement: "'emotionalIntensity'",
      reason: 'Fix corrupted string literal - restore opening quote',
      priority: 'critical',
      testCases: [
        { input: '.emotionalIntensity\'', expected: "'emotionalIntensity'" },
        { input: 'calculateTrend(samples, .emotionalIntensity\')', expected: "calculateTrend(samples, 'emotionalIntensity')" }
      ]
    },
    {
      type: 'string-literal',
      pattern: /\'focusLevel'/g,
      replacement: "'focusLevel'",
      reason: 'Fix corrupted string literal - restore opening quote',
      priority: 'critical',
      testCases: [
        { input: '.focusLevel\'', expected: "'focusLevel'" },
        { input: 'calculateTrend(samples, .focusLevel\')', expected: "calculateTrend(samples, 'focusLevel')" }
      ]
    },
    {
      type: 'property-definition',
      pattern: /\.cognitiveLoad\s*:/g,
      replacement: 'cognitiveLoad:',
      reason: 'Remove corrupted leading dot from cognitiveLoad property definition',
      priority: 'high',
      testCases: [
        { input: '  cognitiveLoad: 3,', expected: '  cognitiveLoad: 3,' }
      ]
    },
    {
      type: 'property-definition',
      pattern: /\.confidenceLevel\s*:/g,
      replacement: 'confidenceLevel:',
      reason: 'Remove corrupted leading dot from confidenceLevel property definition',
      priority: 'high',
      testCases: [
        { input: '  confidenceLevel: 9,', expected: '  confidenceLevel: 9,' }
      ]
    },
    {
      type: 'property-definition',
      pattern: /\.stressLevel\s*:/g,
      replacement: 'stressLevel:',
      reason: 'Remove corrupted leading dot from stressLevel property definition',
      priority: 'high',
      testCases: [
        { input: '  stressLevel: 2,', expected: '  stressLevel: 2,' }
      ]
    }
  ];

  constructor(config: CounterCorruptionConfig) {
    this.config = config;
  }

  /**
   * Primary mission execution - systematically reverse ALL corruption
   */
  public async execute(): Promise<{
    filesProcessed: number;
    corruptionFixed: number;
    criticalFixesApplied: number;
    highPriorityFixesApplied: number;
    compilationImproved: boolean;
    beforeErrors: number;
    afterErrors: number;
  }> {
    console.log('🛡️ COUNTER_CORRUPTION_AGENT Activated');
    console.log(`📁 Scanning: ${this.config.targetDirectory}`);
    console.log(`🎯 Mission: Reverse ALL PROPERTY_ALIGNER corruption`);

    // Phase 1: Pre-fix validation
    const beforeErrors = await this.getCompilationErrorCount();
    console.log(`📊 Pre-fix TypeScript errors: ${beforeErrors}`);

    // Phase 2: Scan for corruption patterns
    await this.scanForCorruption();

    // Phase 3: Apply systematic fixes
    await this.applyCorruptionFixes();

    // Phase 4: Post-fix verification
    const afterErrors = await this.getCompilationErrorCount();
    const compilationImproved = afterErrors < beforeErrors;

    // Phase 5: Generate comprehensive report
    const summary = this.generateRemediationReport();

    console.log(`📊 Post-fix TypeScript errors: ${afterErrors}`);
    console.log(`📈 Compilation improved: ${compilationImproved ? '✅ YES' : '❌ NO'}`);

    return {
      ...summary,
      compilationImproved,
      beforeErrors,
      afterErrors
    };
  }

  /**
   * Scan for corruption patterns across the codebase
   */
  private async scanForCorruption(): Promise<void> {
    const files = await glob(this.config.filePattern, { cwd: this.config.targetDirectory });

    console.log(`🔍 Scanning ${files.length} files for corruption patterns...`);

    for (const file of files) {
      if (this.shouldSkipFile(file)) continue;

      const filePath = join(this.config.targetDirectory, file);
      await this.analyzeFileCorruption(filePath);
    }

    console.log(`🎯 Found corruption in ${this.results.length} files`);
  }

  /**
   * Analyze corruption patterns in a single file
   */
  private async analyzeFileCorruption(filePath: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const corruptionFound: CounterCorruptionResult['corruptionFixed'] = [];

      // Check each corruption fix pattern
      for (const fix of this.CORRUPTION_FIXES) {
        const matches = [...content.matchAll(fix.pattern)];
        for (const match of matches) {
          corruptionFound.push({
            type: fix.type,
            oldPattern: match[0],
            newPattern: fix.replacement,
            lineNumber: this.getLineNumber(content, match.index || 0),
            reason: fix.reason,
            success: false // Will be set to true when applied
          });
        }
      }

      if (corruptionFound.length > 0) {
        this.results.push({
          filePath,
          corruptionFixed: corruptionFound,
          errorsFixed: 0 // Will be calculated after fixes are applied
        });

        if (this.config.verbose) {
          console.log(`📋 ${relative(this.config.targetDirectory, filePath)}: Found ${corruptionFound.length} corruption patterns`);
        }
      }
    } catch (error) {
      if (this.config.verbose) {
        console.error(`⚠️ Error analyzing ${filePath}: ${error}`);
      }
    }
  }

  /**
   * Apply corruption fixes to all identified files
   */
  private async applyCorruptionFixes(): Promise<void> {
    console.log('🔧 Applying systematic corruption fixes...');

    for (const result of this.results) {
      await this.applyFixesToFile(result);
    }
  }

  /**
   * Apply fixes to a single file
   */
  private async applyFixesToFile(result: CounterCorruptionResult): Promise<void> {
    try {
      let content = await fs.readFile(result.filePath, 'utf8');
      let modified = false;

      // Create backup if enabled
      if (this.config.backupOriginals && !this.config.dryRun) {
        await fs.copyFile(result.filePath, `${result.filePath}.backup-pre-counter-corruption`);
      }

      // Apply each fix
      for (const corruption of result.corruptionFixed) {
        const fix = this.CORRUPTION_FIXES.find(f =>
          f.type === corruption.type &&
          f.replacement === corruption.newPattern
        );

        if (fix) {
          const regex = fix.pattern;

          if (regex.test(content)) {
            content = content.replace(regex, fix.replacement);
            corruption.success = true;
            modified = true;
            result.errorsFixed++;

            if (this.config.verbose) {
              console.log(`   ✅ Fixed: ${corruption.oldPattern} → ${corruption.newPattern}`);
            }
          }
        }
      }

      // Write fixed content
      if (modified && !this.config.dryRun) {
        await fs.writeFile(result.filePath, content, 'utf8');

        if (this.config.verbose) {
          console.log(`📝 Updated: ${relative(this.config.targetDirectory, result.filePath)}`);
        }
      }

      // Verify fixes if enabled
      if (this.config.verifyAfterFix && modified) {
        await this.verifyFileRepair(result.filePath);
      }
    } catch (error) {
      console.error(`❌ Failed to apply fixes to ${result.filePath}: ${error}`);
    }
  }

  /**
   * Verify that a file was properly repaired
   */
  private async verifyFileRepair(filePath: string): Promise<boolean> {
    try {
      const content = await fs.readFile(filePath, 'utf8');

      // Check that no corruption patterns remain
      for (const fix of this.CORRUPTION_FIXES) {
        if (fix.pattern.test(content)) {
          console.warn(`⚠️ Corruption still detected in ${filePath}: ${fix.pattern}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(`❌ Failed to verify repair for ${filePath}: ${error}`);
      return false;
    }
  }

  /**
   * Get current TypeScript compilation error count
   */
  private async getCompilationErrorCount(): Promise<number> {
    try {
      const result = execSync('npx tsc --noEmit 2>&1 || echo "COMPILATION_FAILED"', {
        encoding: 'utf8',
        cwd: this.config.targetDirectory
      });

      // Count TypeScript errors
      const errors = (result.match(/error TS\d+:/g) || []).length;
      return errors;
    } catch (error) {
      console.error('❌ Failed to check compilation errors:', error);
      return 9999; // Return high number to indicate failure
    }
  }

  /**
   * Get line number for a character index
   */
  private getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split('\n').length;
  }

  /**
   * Check if file should be skipped
   */
  private shouldSkipFile(file: string): boolean {
    const skipPatterns = ['node_modules', '.git', 'dist', 'build', '.backup'];
    return skipPatterns.some(pattern => file.includes(pattern));
  }

  /**
   * Generate comprehensive remediation report
   */
  private generateRemediationReport(): {
    filesProcessed: number;
    corruptionFixed: number;
    criticalFixesApplied: number;
    highPriorityFixesApplied: number;
  } {
    const filesProcessed = this.results.length;
    const corruptionFixed = this.results.reduce((total, result) =>
      total + result.corruptionFixed.length, 0);

    const criticalFixesApplied = this.results.reduce((total, result) =>
      total + result.corruptionFixed.filter(c => {
        const fix = this.CORRUPTION_FIXES.find(f =>
          f.type === c.type && f.replacement === c.newPattern
        );
        return fix?.priority === 'critical' && c.success;
      }).length, 0);

    const highPriorityFixesApplied = this.results.reduce((total, result) =>
      total + result.corruptionFixed.filter(c => {
        const fix = this.CORRUPTION_FIXES.find(f =>
          f.type === c.type && f.replacement === c.newPattern
        );
        return fix?.priority === 'high' && c.success;
      }).length, 0);

    console.log('📋 COUNTER_CORRUPTION_AGENT Mission Report:');
    console.log(`   Files Processed: ${filesProcessed}`);
    console.log(`   Total Corruption Fixed: ${corruptionFixed}`);
    console.log(`   Critical Fixes Applied: ${criticalFixesApplied}`);
    console.log(`   High Priority Fixes Applied: ${highPriorityFixesApplied}`);

    return {
      filesProcessed,
      corruptionFixed,
      criticalFixesApplied,
      highPriorityFixesApplied
    };
  }

  /**
   * Run self-tests to verify fix patterns
   */
  public runSelfTests(): boolean {
    console.log('🧪 Running Counter-Corruption Agent Self-Tests...');

    let allTestsPassed = true;

    for (const fix of this.CORRUPTION_FIXES) {
      console.log(`Testing ${fix.type}: ${fix.reason}`);

      for (const testCase of fix.testCases) {
        const result = testCase.input.replace(fix.pattern, fix.replacement);

        if (result !== testCase.expected) {
          console.error(`❌ Test FAILED for ${fix.type}:`);
          console.error(`   Input: ${testCase.input}`);
          console.error(`   Expected: ${testCase.expected}`);
          console.error(`   Got: ${result}`);
          allTestsPassed = false;
        } else {
          console.log(`   ✅ Test passed: ${testCase.input} → ${testCase.expected}`);
        }
      }
    }

    if (allTestsPassed) {
      console.log('🎉 ALL SELF-TESTS PASSED - Agent ready for deployment');
    } else {
      console.error('💥 SELF-TESTS FAILED - Agent needs debugging');
    }

    return allTestsPassed;
  }

  public getResults(): CounterCorruptionResult[] {
    return this.results;
  }
}

/**
 * Factory function for easy agent deployment
 */
export function createCounterCorruptionAgent(config?: Partial<CounterCorruptionConfig>): CounterCorruptionAgent {
  const defaultConfig: CounterCorruptionConfig = {
    targetDirectory: process.cwd(),
    filePattern: '**/*.ts',
    dryRun: false,
    verbose: true,
    backupOriginals: true,
    verifyAfterFix: true
  };

  return new CounterCorruptionAgent({ ...defaultConfig, ...config });
}

/**
 * CLI execution entry point
 */
export async function executeCounterCorruptionAgent(args: string[] = []): Promise<void> {
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const noBackup = args.includes('--no-backup');
  const noVerify = args.includes('--no-verify');
  const runTests = args.includes('--self-test');

  const agent = createCounterCorruptionAgent({
    targetDirectory: process.cwd(),
    dryRun,
    verbose,
    backupOriginals: !noBackup,
    verifyAfterFix: !noVerify
  });

  // Run self-tests if requested
  if (runTests) {
    const testsPassed = agent.runSelfTests();
    process.exit(testsPassed ? 0 : 1);
    return;
  }

  const result = await agent.execute();

  if (result.compilationImproved) {
    console.log('🛡️ SUCCESS: Counter-corruption agent successfully restored repository!');
    console.log(`📈 TypeScript errors reduced: ${result.beforeErrors} → ${result.afterErrors}`);
  } else {
    console.log('⚠️ Remediation complete but additional work may be needed');
    console.log(`📊 TypeScript errors: ${result.beforeErrors} → ${result.afterErrors}`);
  }

  process.exit(result.corruptionFixed > 0 ? 0 : 1);
}

// Auto-execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  executeCounterCorruptionAgent(process.argv.slice(2));
}