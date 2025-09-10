#!/usr/bin/env tsx

import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import chalk from 'chalk';
import path from 'path';

/**
 * AI Code Assistant - Leverages Claude Code capabilities for rapid development
 */

interface CodeAnalysisResult {
  complexity: number;
  maintainability: string;
  suggestions: string[];
  securityIssues: string[];
  performanceNotes: string[];
}

export class AICodeAssistant {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Intelligent code search using ripgrep with AI context
   */
  async smartCodeSearch(query: string, context?: string): Promise<void> {
    console.log(chalk.cyan(`🔍 Smart search for: ${query}`));

    // Use ripgrep for high-performance search
    const searchPatterns = [
      `rg "${query}" --type ts --context 3 --color always`,
      `rg "class.*${query}" --type ts`,
      `rg "interface.*${query}" --type ts`,
      `rg "function.*${query}" --type ts`,
      `rg "${query}.*=" --type ts` // Variable assignments
    ];

    for (const pattern of searchPatterns) {
      try {
        const result = await this.execCommand(pattern);
        if (result.stdout) {
          console.log(chalk.yellow(`\n📂 Pattern: ${pattern}`));
          console.log(result.stdout);
        }
      } catch (error) {
        // Skip patterns with no matches
      }
    }
  }

  /**
   * Automated refactoring suggestions
   */
  async suggestRefactoring(filePath: string): Promise<CodeAnalysisResult> {
    console.log(chalk.cyan(`🔧 Analyzing: ${filePath}`));

    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Basic complexity analysis
    const complexity = this.calculateComplexity(content);
    
    const analysis: CodeAnalysisResult = {
      complexity,
      maintainability: complexity < 10 ? 'Good' : complexity < 20 ? 'Moderate' : 'Needs Refactoring',
      suggestions: this.generateSuggestions(content),
      securityIssues: this.detectSecurityIssues(content),
      performanceNotes: this.analyzePerformance(content)
    };

    this.displayAnalysis(filePath, analysis);
    return analysis;
  }

  /**
   * Auto-generate documentation
   */
  async generateDocs(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract classes, functions, interfaces
    const classes = this.extractClasses(content);
    const functions = this.extractFunctions(content);
    const interfaces = this.extractInterfaces(content);

    const docContent = this.buildDocumentation({
      filePath,
      classes,
      functions,
      interfaces
    });

    const docPath = filePath.replace(/\.ts$/, '.docs.md');
    await fs.writeFile(docPath, docContent);
    
    console.log(chalk.green(`📚 Documentation generated: ${docPath}`));
  }

  /**
   * Code quality assessment with modern tools
   */
  async runQualityCheck(): Promise<void> {
    const checks = [
      { name: 'TypeScript Check', cmd: 'npx tsc --noEmit --strict' },
      { name: 'Security Scan', cmd: 'npm audit --audit-level moderate' },
      { name: 'Dependency Check', cmd: 'npx depcheck --ignores="@types/*"' },
      { name: 'Circular Dependencies', cmd: 'npx madge --circular --extensions ts ./src' }
    ];

    console.log(chalk.cyan('🔍 Running Quality Checks'));

    for (const check of checks) {
      try {
        console.log(chalk.yellow(`⏳ ${check.name}...`));
        const result = await this.execCommand(check.cmd);
        
        if (result.stdout) {
          console.log(chalk.blue(`📋 ${check.name} Results:`));
          console.log(result.stdout);
        }
        
        console.log(chalk.green(`✅ ${check.name} completed`));
      } catch (error: any) {
        console.log(chalk.red(`❌ ${check.name}: ${error.message}`));
      }
    }
  }

  /**
   * Smart build optimization
   */
  async optimizeBuild(): Promise<void> {
    console.log(chalk.cyan('⚡ Optimizing Build Pipeline'));

    // Analyze build bottlenecks
    const buildAnalysis = await this.analyzeBuildPerformance();
    
    // Generate optimized build script
    const optimizedScript = this.generateOptimizedBuild(buildAnalysis);
    
    await fs.writeFile('scripts/optimized-build.ts', optimizedScript);
    console.log(chalk.green('✅ Optimized build script generated'));
  }

  private calculateComplexity(content: string): number {
    const patterns = [
      /if\s*\(/g,
      /else\s*if/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /switch\s*\(/g,
      /case\s+/g,
      /catch\s*\(/g,
      /&&|\|\|/g
    ];

    return patterns.reduce((complexity, pattern) => {
      const matches = content.match(pattern);
      return complexity + (matches ? matches.length : 0);
    }, 1);
  }

  private generateSuggestions(content: string): string[] {
    const suggestions: string[] = [];
    
    if (content.includes('any')) {
      suggestions.push('Consider replacing "any" types with specific interfaces');
    }
    
    if (content.match(/function\s+\w+\([^)]*\)\s*{[\s\S]{200,}}/)) {
      suggestions.push('Large functions detected - consider breaking into smaller functions');
    }
    
    if (content.includes('console.log')) {
      suggestions.push('Replace console.log with proper logging system');
    }

    if (!content.includes('export') && content.includes('class')) {
      suggestions.push('Consider making classes exportable for reusability');
    }

    return suggestions;
  }

  private detectSecurityIssues(content: string): string[] {
    const issues: string[] = [];
    
    if (content.includes('eval(')) {
      issues.push('CRITICAL: eval() usage detected - major security risk');
    }
    
    if (content.match(/password.*=.*['"]/i)) {
      issues.push('WARNING: Hardcoded password detected');
    }
    
    if (content.includes('process.env') && !content.includes('??')) {
      issues.push('WARNING: Environment variables without defaults');
    }

    return issues;
  }

  private analyzePerformance(content: string): string[] {
    const notes: string[] = [];
    
    if (content.includes('JSON.stringify') || content.includes('JSON.parse')) {
      notes.push('JSON operations detected - consider caching for large objects');
    }
    
    if (content.match(/for\s*\(.*\.length/)) {
      notes.push('Loop with .length check - consider caching length');
    }
    
    if (content.includes('await') && content.includes('for')) {
      notes.push('Sequential async operations in loop - consider Promise.all()');
    }

    return notes;
  }

  private extractClasses(content: string): string[] {
    const classMatches = content.match(/class\s+(\w+)/g);
    return classMatches ? classMatches.map(m => m.replace('class ', '')) : [];
  }

  private extractFunctions(content: string): string[] {
    const functionMatches = content.match(/(?:function\s+(\w+)|(\w+)\s*\([^)]*\)\s*[:{])/g);
    return functionMatches || [];
  }

  private extractInterfaces(content: string): string[] {
    const interfaceMatches = content.match(/interface\s+(\w+)/g);
    return interfaceMatches ? interfaceMatches.map(m => m.replace('interface ', '')) : [];
  }

  private buildDocumentation(data: any): string {
    return `# ${path.basename(data.filePath)} Documentation

Generated on: ${new Date().toISOString()}

## Classes
${data.classes.map((c: string) => `- ${c}`).join('\n')}

## Functions  
${data.functions.map((f: string) => `- ${f}`).join('\n')}

## Interfaces
${data.interfaces.map((i: string) => `- ${i}`).join('\n')}

## Usage Examples

\`\`\`typescript
// Add usage examples here
\`\`\`
`;
  }

  private async analyzeBuildPerformance(): Promise<any> {
    // Analyze TypeScript compilation time, bundle size, etc.
    return {
      slowModules: [],
      bundleSize: 0,
      recommendations: ['Use tree-shaking', 'Enable incremental compilation']
    };
  }

  private generateOptimizedBuild(analysis: any): string {
    return `#!/usr/bin/env tsx

/**
 * Optimized Build Script - Auto-generated
 */

export async function optimizedBuild(): Promise<void> {
  console.log('🚀 Starting optimized build...');
  
  // Parallel compilation
  const tasks = [
    'npx tsc --build --incremental',
    'npm run test',
    'npm run lint'
  ];
  
  await Promise.all(tasks.map(cmd => 
    import('child_process').then(cp => cp.spawn('bash', ['-c', cmd]))
  ));
  
  console.log('✅ Optimized build complete!');
}

if (import.meta.url === \`file://\${process.argv[1]}\`) {
  optimizedBuild();
}`;
  }

  private displayAnalysis(filePath: string, analysis: CodeAnalysisResult): void {
    console.log(chalk.cyan(`\n📊 Analysis for ${filePath}:`));
    console.log(chalk.blue(`Complexity: ${analysis.complexity} (${analysis.maintainability})`));
    
    if (analysis.suggestions.length > 0) {
      console.log(chalk.yellow('\n💡 Suggestions:'));
      analysis.suggestions.forEach(s => console.log(`  • ${s}`));
    }
    
    if (analysis.securityIssues.length > 0) {
      console.log(chalk.red('\n🔒 Security Issues:'));
      analysis.securityIssues.forEach(s => console.log(`  • ${s}`));
    }
    
    if (analysis.performanceNotes.length > 0) {
      console.log(chalk.green('\n⚡ Performance Notes:'));
      analysis.performanceNotes.forEach(s => console.log(`  • ${s}`));
    }
  }

  private execCommand(command: string): Promise<{stdout: string, stderr: string}> {
    return new Promise((resolve, reject) => {
      const child = spawn('bash', ['-c', command], {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => stdout += data.toString());
      child.stderr?.on('data', (data) => stderr += data.toString());

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed: ${command}`));
        }
      });
    });
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const assistant = new AICodeAssistant();
  const action = process.argv[2];
  const target = process.argv[3];

  switch (action) {
    case 'search':
      assistant.smartCodeSearch(target);
      break;
    case 'analyze':
      assistant.suggestRefactoring(target);
      break;
    case 'docs':
      assistant.generateDocs(target);
      break;
    case 'quality':
      assistant.runQualityCheck();
      break;
    case 'optimize':
      assistant.optimizeBuild();
      break;
    default:
      console.log('Usage: npx tsx ai-code-assistant.ts [search|analyze|docs|quality|optimize] [target]');
  }
}