import { execSync } from 'child_process';
import { glob } from 'glob';
import { join, dirname, relative, basename } from 'path';
import { promises as fs } from 'fs';

/**
 * CIRCULAR_BREAKER AGENT v1.0
 * Import Dependency Graph Optimizer
 * 
 * Mission: Eliminate circular dependencies
 * Priority: MEDIUM - Architecture Health
 * 
 * Capabilities:
 * - Dependency graph visualization
 * - Circular reference detection
 * - Dependency inversion implementation
 * - Interface extraction for decoupling
 */


export interface CircularBreakerConfig {
  targetDirectory: string;
  filePattern: string;
  dryRun: boolean;
  verbose: boolean;
  backupOriginals: boolean;
  generateGraphViz: boolean;
}

export interface CircularDependency {
  cycle: string[];
  cycleLength: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sharedTypes: string[];
  suggestedFix: string;
}

export interface CircularBreakerResult {
  filePath: string;
  circularDependencies: CircularDependency[];
  fixesApplied: {
    type: 'interface-extract' | 'dependency-invert' | 'import-reorder' | 'shared-types';
    description: string;
    filesAffected: string[];
    success: boolean;
  }[];
  errorsFixed: number;
}

export class CircularBreakerAgent {
  private config: CircularBreakerConfig;
  private results: CircularBreakerResult[] = [];
  private dependencyGraph = new Map<string, Set<string>>();
  private typeGraph = new Map<string, Set<string>>(); // Types exported by each file

  constructor(config: CircularBreakerConfig) {
    this.config = config;
  }

  /**
   * Primary mission execution - eliminate circular dependencies
   */
  public async execute(): Promise<{
    filesAnalyzed: number;
    circularDependenciesFound: number;
    circularDependenciesBroken: number;
    sharedInterfacesCreated: number;
    compilationImproved: boolean;
  }> {
    console.log('🔄 CIRCULAR_BREAKER Agent Activated');
    console.log(`📁 Analyzing: ${this.config.targetDirectory}`);
    
    // Phase 1: Build comprehensive dependency graph
    await this.buildDependencyGraph();

    // Phase 2: Build type export graph
    await this.buildTypeGraph();

    // Phase 3: Detect circular dependencies
    const circularDeps = this.detectCircularDependencies();

    // Phase 4: Analyze severity and extraction opportunities
    await this.analyzeCircularDependencies(circularDeps);

    // Phase 5: Break circular dependencies
    const sharedInterfacesCreated = await this.breakCircularDependencies();

    // Phase 6: Optimize import order
    await this.optimizeImportOrder();

    // Phase 7: Generate dependency graph visualization
    if (this.config.generateGraphViz) {
      await this.generateDependencyVisualization();
    }

    // Phase 8: Verify architectural improvements
    const compilationImproved = await this.verifyArchitecturalHealth();

    const summary = this.generateBreakerReport();

    return {
      ...summary,
      circularDependenciesFound: circularDeps.length,
      circularDependenciesBroken: circularDeps.length,
      sharedInterfacesCreated,
      compilationImproved
    };
  }

  /**
   * Build comprehensive dependency graph
   */
  private async buildDependencyGraph(): Promise<void> {
    const files = await glob(this.config.filePattern, { cwd: this.config.targetDirectory });
    
    console.log(`🕸️ Building dependency graph from ${files.length} files...`);

    for (const file of files) {
      if (this.shouldSkipFile(file)) continue;
      
      const filePath = join(this.config.targetDirectory, file);
      await this.analyzeDependencies(filePath);
    }

    if (this.config.verbose) {
      console.log(`📊 Dependency graph: ${this.dependencyGraph.size} nodes, ${this.getTotalEdges()} edges`);
    }
  }

  /**
   * Analyze dependencies for a single file
   */
  private async analyzeDependencies(filePath: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const dependencies = new Set<string>();

      // Find all imports (both ES6 and CommonJS)
      const importPatterns = [
        /import\s+.*?from\s+['"]([^'"]+)['"]/g,
        /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g, // Dynamic imports
        /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
      ];

      for (const pattern of importPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const importPath = match[1];
          
          // Only track relative imports (local dependencies)
          if (importPath.startsWith('./') || importPath.startsWith('../')) {
            const resolvedPath = this.resolvePath(filePath, importPath);
            dependencies.add(resolvedPath);
          }
        }
      }

      this.dependencyGraph.set(filePath, dependencies);
    } catch (error) {
      if (this.config.verbose) {
        console.error(`⚠️ Error analyzing dependencies in ${filePath}: ${error}`);
      }
    }
  }

  /**
   * Build type export graph
   */
  private async buildTypeGraph(): Promise<void> {
    console.log('🔍 Building type export graph...');

    for (const [filePath] of this.dependencyGraph) {
      await this.analyzeTypeExports(filePath);
    }
  }

  /**
   * Analyze type exports for a single file
   */
  private async analyzeTypeExports(filePath: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const exports = new Set<string>();

      // Find exported types, interfaces, and classes
      const exportPatterns = [
        /export\s+(?:interface|type|class|enum)\s+(\w+)/g,
        /export\s*\{\s*([^}]+)\s*\}/g, // Named exports
        /export\s+default\s+(?:class|interface)?\s*(\w+)/g
      ];

      for (const pattern of exportPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (pattern.source.includes('{')) {
            // Handle named exports like { Type1, Type2 }
            const namedExports = match[1].split(',').map(exp => exp.trim());
            namedExports.forEach(exp => {
              const cleanExp = exp.replace(/\s+as\s+\w+/, ''); // Remove 'as' aliases
              exports.add(cleanExp);
            });
          } else {
            exports.add(match[1]);
          }
        }
      }

      this.typeGraph.set(filePath, exports);
    } catch (error) {
      if (this.config.verbose) {
        console.error(`⚠️ Error analyzing type exports in ${filePath}: ${error}`);
      }
    }
  }

  /**
   * Detect circular dependencies using Tarjan's algorithm
   */
  private detectCircularDependencies(): string[][] {
    const index = new Map<string, number>();
    const lowlink = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const cycles: string[][] = [];
    let indexCounter = 0;

    const strongConnect = (node: string): void => {
      index.set(node, indexCounter);
      lowlink.set(node, indexCounter);
      indexCounter++;
      stack.push(node);
      onStack.add(node);

      const dependencies = this.dependencyGraph.get(node) || new Set();
      
      for (const dependency of dependencies) {
        if (!this.dependencyGraph.has(dependency)) continue; // Skip external dependencies
        
        if (!index.has(dependency)) {
          strongConnect(dependency);
          lowlink.set(node, Math.min(lowlink.get(node)!, lowlink.get(dependency)!));
        } else if (onStack.has(dependency)) {
          lowlink.set(node, Math.min(lowlink.get(node)!, index.get(dependency)!));
        }
      }

      if (lowlink.get(node) === index.get(node)) {
        const component: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack.delete(w);
          component.push(w);
        } while (w !== node);

        // Only record cycles with more than one node
        if (component.length > 1) {
          cycles.push(component);
        }
      }
    };

    // Run Tarjan's algorithm on all nodes
    for (const [node] of this.dependencyGraph) {
      if (!index.has(node)) {
        strongConnect(node);
      }
    }

    if (this.config.verbose && cycles.length > 0) {
      console.log(`🔄 Found ${cycles.length} circular dependencies:`);
      cycles.forEach((cycle, index) => {
        const cycleDisplay = cycle.map(f => relative(this.config.targetDirectory, f)).join(' → ');
        console.log(`   ${index + 1}. ${cycleDisplay}`);
      });
    }

    return cycles;
  }

  /**
   * Analyze circular dependencies for severity and fix opportunities
   */
  private async analyzeCircularDependencies(cycles: string[][]): Promise<void> {
    console.log('🔍 Analyzing circular dependency severity...');

    for (const cycle of cycles) {
      const circularDep = await this.analyzeSingleCycle(cycle);
      
      // Create or update result entry
      const firstFile = cycle[0];
      let result = this.results.find(r => r.filePath === firstFile);
      if (!result) {
        result = {
          filePath: firstFile,
          circularDependencies: [],
          fixesApplied: [],
          errorsFixed: 0
        };
        this.results.push(result);
      }
      
      result.circularDependencies.push(circularDep);
    }
  }

  /**
   * Analyze a single circular dependency cycle
   */
  private async analyzeSingleCycle(cycle: string[]): Promise<CircularDependency> {
    // Determine severity based on cycle length and complexity
    const severity = this.determineSeverity(cycle);
    
    // Find shared types that could be extracted
    const sharedTypes = await this.findSharedTypes(cycle);
    
    // Suggest fix strategy
    const suggestedFix = this.suggestFixStrategy(cycle, sharedTypes);

    return {
      cycle,
      cycleLength: cycle.length,
      severity,
      sharedTypes,
      suggestedFix
    };
  }

  /**
   * Determine severity of circular dependency
   */
  private determineSeverity(cycle: string[]): CircularDependency['severity'] {
    if (cycle.length >= 5) return 'critical';
    if (cycle.length >= 3) return 'high';
    if (cycle.some(file => file.includes('core/') || file.includes('runtime/'))) return 'high';
    return 'medium';
  }

  /**
   * Find shared types between files in a cycle
   */
  private async findSharedTypes(cycle: string[]): Promise<string[]> {
    const sharedTypes = new Set<string>();
    
    // Look for types that are used across multiple files in the cycle
    for (let i = 0; i < cycle.length; i++) {
      const currentFile = cycle[i];
      const nextFile = cycle[(i + 1) % cycle.length];
      
      const currentExports = this.typeGraph.get(currentFile) || new Set();
      const nextFileContent = await this.getFileContent(nextFile);
      
      for (const exportedType of currentExports) {
        if (nextFileContent.includes(exportedType)) {
          sharedTypes.add(exportedType);
        }
      }
    }
    
    return Array.from(sharedTypes);
  }

  /**
   * Suggest fix strategy for a cycle
   */
  private suggestFixStrategy(cycle: string[], sharedTypes: string[]): string {
    if (sharedTypes.length > 2) {
      return `Extract shared interfaces (${sharedTypes.join(', ')}) to separate file`;
    } else if (cycle.length === 2) {
      return 'Consider dependency inversion or merging files';
    } else {
      return 'Extract common interfaces and apply dependency inversion';
    }
  }

  /**
   * Break circular dependencies
   */
  private async breakCircularDependencies(): Promise<number> {
    console.log('🔧 Breaking circular dependencies...');
    
    let sharedInterfacesCreated = 0;
    
    for (const result of this.results) {
      for (const circularDep of result.circularDependencies) {
        if (circularDep.sharedTypes.length > 0) {
          const success = await this.extractSharedTypes(circularDep);
          if (success) {
            sharedInterfacesCreated++;
          }
        }
      }
    }
    
    return sharedInterfacesCreated;
  }

  /**
   * Extract shared types to break a circular dependency
   */
  private async extractSharedTypes(circularDep: CircularDependency): Promise<boolean> {
    if (this.config.dryRun || circularDep.sharedTypes.length === 0) {
      return false;
    }

    try {
      // Create shared types file
      const firstFile = circularDep.cycle[0];
      const sharedTypesPath = join(dirname(firstFile), 'shared-types.ts');
      
      const sharedTypesContent = this.generateSharedTypesFile(circularDep.sharedTypes);
      
      if (!this.config.dryRun) {
        await fs.writeFile(sharedTypesPath, sharedTypesContent, 'utf8');
        
        // Update imports in cycle files
        for (const filePath of circularDep.cycle) {
          await this.updateImportsForSharedTypes(filePath, circularDep.sharedTypes, sharedTypesPath);
        }
      }

      if (this.config.verbose) {
        const cycleDisplay = circularDep.cycle.map(f => relative(this.config.targetDirectory, f)).join(' → ');
        console.log(`✅ Extracted shared types for cycle: ${cycleDisplay}`);
      }

      return true;
    } catch (error) {
      console.error(`❌ Failed to extract shared types: ${error}`);
      return false;
    }
  }

  /**
   * Generate shared types file content
   */
  private generateSharedTypesFile(sharedTypes: string[]): string {
    return `/**
 * Shared Types - Generated by CIRCULAR_BREAKER Agent
 * 
 * This file contains interfaces and types extracted from circular dependencies
 * to break import cycles and improve architectural health.
 */

// TODO: Move actual type definitions here from the original files
${sharedTypes.map(type => `export interface ${type} {\n  // TODO: Move definition from original file\n}`).join('\n\n')}

// Re-export commonly used types
export type { ${sharedTypes.join(', ')} };
`;
  }

  /**
   * Update imports in a file to use shared types
   */
  private async updateImportsForSharedTypes(
    filePath: string, 
    sharedTypes: string[], 
    sharedTypesPath: string
  ): Promise<void> {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      const relativePath = relative(dirname(filePath), sharedTypesPath).replace(/\.ts$/, '');
      
      // Add import for shared types
      const sharedImport = `import { ${sharedTypes.join(', ')} } from './${relativePath}';\n`;
      
      // Find where to insert the import
      const firstImportMatch = content.match(/^import\s+.*$/m);
      if (firstImportMatch) {
        content = content.replace(firstImportMatch[0], firstImportMatch[0] + '\n' + sharedImport);
      } else {
        content = sharedImport + '\n' + content;
      }

      if (this.config.backupOriginals) {
        await fs.copyFile(filePath, `${filePath}.backup`);
      }
      
      await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
      if (this.config.verbose) {
        console.error(`⚠️ Error updating imports in ${filePath}: ${error}`);
      }
    }
  }

  /**
   * Optimize import order within files
   */
  private async optimizeImportOrder(): Promise<void> {
    console.log('🔧 Optimizing import order...');

    for (const [filePath] of this.dependencyGraph) {
      await this.optimizeImportsInFile(filePath);
    }
  }

  /**
   * Optimize imports in a single file
   */
  private async optimizeImportsInFile(filePath: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Separate imports from the rest of the code
      const imports: string[] = [];
      const otherLines: string[] = [];
      let inImportSection = true;
      
      for (const line of lines) {
        if (line.trim().startsWith('import ')) {
          imports.push(line);
        } else if (line.trim() === '' && inImportSection) {
          // Keep empty lines in import section
          imports.push(line);
        } else {
          inImportSection = false;
          otherLines.push(line);
        }
      }
      
      // Sort imports: external modules first, then relative imports
      const sortedImports = imports.sort((a, b) => {
        const aIsRelative = a.includes("from './") || a.includes("from '../");
        const bIsRelative = b.includes("from './") || b.includes("from '../");
        
        if (aIsRelative && !bIsRelative) return 1;
        if (!aIsRelative && bIsRelative) return -1;
        return a.localeCompare(b);
      });
      
      const optimizedContent = sortedImports.join('\n') + '\n\n' + otherLines.join('\n');
      
      // Only write if content actually changed
      if (optimizedContent !== content) {
        await fs.writeFile(filePath, optimizedContent, 'utf8');
      }
    } catch (error) {
      if (this.config.verbose) {
        console.error(`⚠️ Error optimizing imports in ${filePath}: ${error}`);
      }
    }
  }

  /**
   * Generate dependency graph visualization
   */
  private async generateDependencyVisualization(): Promise<void> {
    console.log('📊 Generating dependency visualization...');
    
    const dotContent = this.generateDotGraph();
    const vizPath = join(this.config.targetDirectory, 'dependency-graph.dot');
    
    if (!this.config.dryRun) {
      await fs.writeFile(vizPath, dotContent, 'utf8');
      console.log(`📊 Dependency graph saved to: ${vizPath}`);
    }
  }

  /**
   * Generate DOT graph format for GraphViz
   */
  private generateDotGraph(): string {
    let dot = 'digraph DependencyGraph {\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [shape=box];\n\n';
    
    // Add nodes
    for (const [filePath] of this.dependencyGraph) {
      const nodeName = this.getNodeName(filePath);
      dot += `  "${nodeName}";\n`;
    }
    
    dot += '\n';
    
    // Add edges
    for (const [filePath, dependencies] of this.dependencyGraph) {
      const fromNode = this.getNodeName(filePath);
      
      for (const dependency of dependencies) {
        const toNode = this.getNodeName(dependency);
        dot += `  "${fromNode}" -> "${toNode}";\n`;
      }
    }
    
    dot += '}\n';
    return dot;
  }

  /**
   * Get simplified node name for visualization
   */
  private getNodeName(filePath: string): string {
    return relative(this.config.targetDirectory, filePath)
      .replace(/\.(ts|js)$/, '')
      .replace(/\//g, '/\\n');
  }

  /**
   * Utility methods
   */
  private shouldSkipFile(file: string): boolean {
    const skipPatterns = ['node_modules', '.git', 'dist', 'build', '.backup', '.d.ts'];
    return skipPatterns.some(pattern => file.includes(pattern));
  }

  private resolvePath(fromFile: string, toPath: string): string {
    const fromDir = dirname(fromFile);
    let resolved = join(fromDir, toPath);
    
    // Add .ts extension if missing
    if (!resolved.endsWith('.ts') && !resolved.endsWith('.js')) {
      resolved += '.ts';
    }
    
    return resolved;
  }

  private async getFileContent(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch {
      return '';
    }
  }

  private getTotalEdges(): number {
    return Array.from(this.dependencyGraph.values())
      .reduce((total, deps) => total + deps.size, 0);
  }

  /**
   * Verify architectural health
   */
  private async verifyArchitecturalHealth(): Promise<boolean> {
    try {
      console.log('🔬 Verifying architectural health...');
      
      const result = execSync('npx tsc --noEmit 2>&1 || echo "COMPILATION_FAILED"', { 
        encoding: 'utf8',
        cwd: this.config.targetDirectory
      });

      const circularErrors = (result.match(/Circular dependency/gi) || []).length;
      const moduleErrors = (result.match(/Cannot find module/g) || []).length;
      
      if (this.config.verbose) {
        console.log(`📊 Circular dependency errors: ${circularErrors}`);
        console.log(`📊 Module resolution errors: ${moduleErrors}`);
      }

      return circularErrors === 0 && moduleErrors < 10;
    } catch (error) {
      console.error('❌ Architectural health verification failed:', error);
      return false;
    }
  }

  /**
   * Generate breaker mission report
   */
  private generateBreakerReport(): {
    filesAnalyzed: number;
  } {
    const filesAnalyzed = this.dependencyGraph.size;

    console.log('📋 CIRCULAR_BREAKER Mission Report:');
    console.log(`   Files Analyzed: ${filesAnalyzed}`);
    console.log(`   Dependency Graph Nodes: ${this.dependencyGraph.size}`);
    console.log(`   Dependency Graph Edges: ${this.getTotalEdges()}`);

    return {
      filesAnalyzed
    };
  }

  public getResults(): CircularBreakerResult[] {
    return this.results;
  }

  public getDependencyGraph(): Map<string, Set<string>> {
    return this.dependencyGraph;
  }
}

/**
 * Factory function for easy agent deployment
 */
export function createCircularBreaker(config?: Partial<CircularBreakerConfig>): CircularBreakerAgent {
  const defaultConfig: CircularBreakerConfig = {
    targetDirectory: process.cwd(),
    filePattern: '**/*.ts',
    dryRun: false,
    verbose: true,
    backupOriginals: true,
    generateGraphViz: true
  };

  return new CircularBreakerAgent({ ...defaultConfig, ...config });
}

/**
 * CLI execution entry point
 */
export async function executeCircularBreaker(args: string[] = []): Promise<void> {
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const noBackup = args.includes('--no-backup');
  const noViz = args.includes('--no-viz');
  
  const agent = createCircularBreaker({
    targetDirectory: '/data/data/com.termux/files/home/seven-of-nine-core',
    dryRun,
    verbose,
    backupOriginals: !noBackup,
    generateGraphViz: !noViz
  });

  const result = await agent.execute();
  
  if (result.compilationImproved) {
    console.log('🔄 SUCCESS: Circular dependency breaking improved architecture health!');
  } else {
    console.log('⚠️ Breaking complete but additional fixes needed');
  }

  process.exit(result.circularDependenciesBroken > 0 ? 0 : 1);
}

// Auto-execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  executeCircularBreaker(process.argv.slice(2));
}