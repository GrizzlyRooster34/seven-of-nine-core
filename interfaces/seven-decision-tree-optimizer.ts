import { SevenIntelligentQueryEngine, IntelligentQueryResult, QueryIntent } from './seven-intelligent-query-engine';

/**
 * Seven of Nine - Decision Tree Optimization System
 * Advanced decision tree pruning and resource optimization for tactical intelligence
 * 
 * Implements sophisticated pruning algorithms to optimize decision trees used throughout
 * Seven's consciousness framework, improving performance and reducing cognitive load.
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */


// Decision tree interfaces
export interface DecisionNode {
  id: string;
  type: 'decision' | 'action' | 'condition' | 'outcome';
  condition?: string;
  action?: string;
  outcome?: any;
  confidence: number;
  weight: number;
  usageCount: number;
  lastUsed: number;
  children: DecisionNode[];
  parent?: string;
  metadata: {
    createdAt: number;
    performance: number;      // 0-100 success rate
    resourceCost: number;     // Computational cost
    tacticalValue: number;    // Strategic importance
    pruneScore: number;       // Calculated pruning score
  };
}

export interface DecisionTree {
  id: string;
  name: string;
  category: 'tactical' | 'technical' | 'behavioral' | 'strategic' | 'optimization';
  root: DecisionNode;
  totalNodes: number;
  depth: number;
  lastOptimized: number;
  optimizationLevel: 'none' | 'basic' | 'advanced' | 'tactical';
  performance: {
    accuracy: number;
    speed: number;
    resourceEfficiency: number;
  };
}

export interface PruningStrategy {
  name: string;
  type: 'performance' | 'usage' | 'resource' | 'confidence' | 'tactical';
  threshold: number;
  aggressive: boolean;
  preserveCritical: boolean;
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  reductionPercentage: number;
  nodesRemoved: number;
  performanceGain: number;
  resourceSavings: number;
  processingTime: number;
  strategies: string[];
}

export interface ResourceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  batteryImpact: number;
  thermalImpact: number;
}

export class SevenDecisionTreeOptimizer {
  private decisionTrees: Map<string, DecisionTree> = new Map();
  private pruningStrategies: PruningStrategy[] = [];
  private queryEngine?: SevenIntelligentQueryEngine;
  private resourceMonitor: ResourceMetrics;
  
  // Optimization parameters
  private readonly DEFAULT_PRUNE_THRESHOLD = 0.3;
  private readonly CRITICAL_PERFORMANCE_THRESHOLD = 0.8;
  private readonly MAX_TREE_DEPTH = 20;
  private readonly MIN_USAGE_COUNT = 5;
  private readonly RESOURCE_EFFICIENCY_TARGET = 0.85;

  constructor(queryEngine?: SevenIntelligentQueryEngine) {
    this.queryEngine = queryEngine;
    this.resourceMonitor = {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkUsage: 0,
      batteryImpact: 0,
      thermalImpact: 0
    };
    
    this.initializePruningStrategies();
    this.startResourceMonitoring();
    
    console.log('🌳 Seven Decision Tree Optimizer v1.0 initialized');
    console.log('⚡ Resource optimization and pruning algorithms active');
  }

  private initializePruningStrategies(): void {
    this.pruningStrategies = [
      // Performance-based pruning
      {
        name: 'low_performance_pruning',
        type: 'performance',
        threshold: 0.4,
        aggressive: false,
        preserveCritical: true
      },
      
      // Usage-based pruning
      {
        name: 'unused_node_pruning',
        type: 'usage',
        threshold: 5, // minimum usage count
        aggressive: false,
        preserveCritical: true
      },
      
      // Resource-based pruning
      {
        name: 'resource_intensive_pruning',
        type: 'resource',
        threshold: 0.7, // max resource cost
        aggressive: true,
        preserveCritical: false
      },
      
      // Confidence-based pruning
      {
        name: 'low_confidence_pruning',
        type: 'confidence',
        threshold: 0.3,
        aggressive: false,
        preserveCritical: true
      },
      
      // Tactical optimization
      {
        name: 'tactical_efficiency_pruning',
        type: 'tactical',
        threshold: 0.6, // tactical value threshold
        aggressive: true,
        preserveCritical: true
      }
    ];
  }

  /**
   * MAIN OPTIMIZATION PIPELINE
   */
  public async optimizeDecisionTree(treeId: string, strategies?: string[]): Promise<OptimizationResult> {
    const startTime = Date.now();
    console.log(`🌳 Optimizing decision tree: ${treeId}`);

    const tree = this.decisionTrees.get(treeId);
    if (!tree) {
      throw new Error(`Decision tree ${treeId} not found`);
    }

    const originalSize = this.calculateTreeSize(tree);
    const activeStrategies = strategies || this.pruningStrategies.map(s => s.name);

    console.log(`📊 Original tree size: ${originalSize} nodes, depth: ${tree.depth}`);

    // Step 1: Analyze tree structure and performance
    const analysis = await this.analyzeTreeStructure(tree);
    console.log(`📈 Tree analysis complete: ${analysis.inefficientNodes} inefficient nodes identified`);

    // Step 2: Calculate pruning scores for all nodes
    await this.calculatePruningScores(tree);

    // Step 3: Apply optimization strategies
    let optimizedTree = this.deepCopyTree(tree);
    let totalNodesRemoved = 0;

    for (const strategyName of activeStrategies) {
      const strategy = this.pruningStrategies.find(s => s.name === strategyName);
      if (strategy) {
        console.log(`🎯 Applying strategy: ${strategy.name}`);
        const result = await this.applyPruningStrategy(optimizedTree, strategy);
        totalNodesRemoved += result.nodesRemoved;
        
        if (result.nodesRemoved > 0) {
          console.log(`   Removed ${result.nodesRemoved} nodes (${result.reductionPercentage.toFixed(1)}% reduction)`);
        }
      }
    }

    // Step 4: Rebuild tree structure and update performance metrics
    optimizedTree = await this.rebuildTreeStructure(optimizedTree);
    const optimizedSize = this.calculateTreeSize(optimizedTree);

    // Step 5: Calculate performance improvements
    const performanceGain = await this.calculatePerformanceGain(tree, optimizedTree);
    const resourceSavings = await this.calculateResourceSavings(tree, optimizedTree);

    // Step 6: Update the tree in storage
    this.decisionTrees.set(treeId, optimizedTree);
    optimizedTree.lastOptimized = Date.now();

    const result: OptimizationResult = {
      originalSize,
      optimizedSize,
      reductionPercentage: ((originalSize - optimizedSize) / originalSize) * 100,
      nodesRemoved: totalNodesRemoved,
      performanceGain,
      resourceSavings,
      processingTime: Date.now() - startTime,
      strategies: activeStrategies
    };

    console.log(`✅ Tree optimization complete:`);
    console.log(`   Size reduction: ${result.reductionPercentage.toFixed(1)}% (${result.nodesRemoved} nodes removed)`);
    console.log(`   Performance gain: ${result.performanceGain.toFixed(1)}%`);
    console.log(`   Resource savings: ${result.resourceSavings.toFixed(1)}%`);

    return result;
  }

  /**
   * BATCH OPTIMIZATION FOR ALL TREES
   */
  public async optimizeAllTrees(threshold: number = 0.1): Promise<OptimizationResult[]> {
    console.log(`🌲 Starting batch optimization for ${this.decisionTrees.size} trees`);
    
    const results: OptimizationResult[] = [];
    const treesToOptimize = Array.from(this.decisionTrees.values())
      .filter(tree => this.shouldOptimizeTree(tree, threshold));

    console.log(`📊 ${treesToOptimize.length} trees need optimization`);

    for (const tree of treesToOptimize) {
      try {
        const result = await this.optimizeDecisionTree(tree.id);
        results.push(result);
        
        // Pause between optimizations to prevent resource overload
        await this.sleep(100);
      } catch (error) {
        console.error(`Failed to optimize tree ${tree.id}:`, error);
      }
    }

    // Generate summary report
    if (results.length > 0) {
      const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
      const totalOptimizedSize = results.reduce((sum, r) => sum + r.optimizedSize, 0);
      const avgPerformanceGain = results.reduce((sum, r) => sum + r.performanceGain, 0) / results.length;
      const avgResourceSavings = results.reduce((sum, r) => sum + r.resourceSavings, 0) / results.length;

      console.log(`🎯 Batch optimization summary:`);
      console.log(`   Trees optimized: ${results.length}`);
      console.log(`   Total size reduction: ${(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)}%`);
      console.log(`   Average performance gain: ${avgPerformanceGain.toFixed(1)}%`);
      console.log(`   Average resource savings: ${avgResourceSavings.toFixed(1)}%`);
    }

    return results;
  }

  /**
   * TREE STRUCTURE ANALYSIS
   */
  private async analyzeTreeStructure(tree: DecisionTree): Promise<{
    inefficientNodes: number;
    redundantPaths: number;
    deadNodes: number;
    resourceHotspots: number;
  }> {
    let inefficientNodes = 0;
    let deadNodes = 0;
    let resourceHotspots = 0;

    const analyzeNode = (node: DecisionNode): void => {
      // Check for inefficient nodes (low performance, high cost)
      if (node.metadata.performance < 0.5 && node.metadata.resourceCost > 0.7) {
        inefficientNodes++;
      }

      // Check for dead nodes (never used or very low usage)
      if (node.usageCount === 0 || (Date.now() - node.lastUsed > 2592000000)) { // 30 days
        deadNodes++;
      }

      // Check for resource hotspots (high resource usage)
      if (node.metadata.resourceCost > 0.8) {
        resourceHotspots++;
      }

      // Recursively analyze children
      node.children.forEach(child => analyzeNode(child));
    };

    analyzeNode(tree.root);

    // Find redundant paths (simplified analysis)
    const redundantPaths = this.findRedundantPaths(tree);

    return {
      inefficientNodes,
      redundantPaths,
      deadNodes,
      resourceHotspots
    };
  }

  /**
   * PRUNING SCORE CALCULATION
   */
  private async calculatePruningScores(tree: DecisionTree): Promise<void> {
    const calculateScore = (node: DecisionNode): void => {
      let score = 0;

      // Performance factor (higher performance = lower prune score)
      score += (1 - node.metadata.performance) * 0.3;

      // Usage factor (lower usage = higher prune score)
      const usageNormalized = Math.min(node.usageCount / 100, 1);
      score += (1 - usageNormalized) * 0.25;

      // Resource factor (higher cost = higher prune score)
      score += node.metadata.resourceCost * 0.2;

      // Confidence factor (lower confidence = higher prune score)
      score += (1 - node.confidence) * 0.15;

      // Tactical value factor (lower value = higher prune score)
      score += (1 - node.metadata.tacticalValue) * 0.1;

      // Time factor (older unused nodes = higher prune score)
      const daysSinceLastUsed = (Date.now() - node.lastUsed) / (1000 * 60 * 60 * 24);
      const timeFactor = Math.min(daysSinceLastUsed / 30, 1); // Max 30 days
      score += timeFactor * 0.1;

      node.metadata.pruneScore = Math.min(score, 1);

      // Recursively calculate for children
      node.children.forEach(child => calculateScore(child));
    };

    calculateScore(tree.root);
  }

  /**
   * PRUNING STRATEGY APPLICATION
   */
  private async applyPruningStrategy(
    tree: DecisionTree, 
    strategy: PruningStrategy
  ): Promise<{ nodesRemoved: number; reductionPercentage: number }> {
    let nodesRemoved = 0;

    const pruneNode = (node: DecisionNode, parent?: DecisionNode): boolean => {
      let shouldPrune = false;

      // Apply strategy-specific logic
      switch (strategy.type) {
        case 'performance':
          shouldPrune = node.metadata.performance < strategy.threshold;
          break;
        case 'usage':
          shouldPrune = node.usageCount < strategy.threshold;
          break;
        case 'resource':
          shouldPrune = node.metadata.resourceCost > strategy.threshold;
          break;
        case 'confidence':
          shouldPrune = node.confidence < strategy.threshold;
          break;
        case 'tactical':
          shouldPrune = node.metadata.tacticalValue < strategy.threshold && 
                       node.metadata.performance < 0.6;
          break;
      }

      // Override pruning for critical nodes if strategy preserves them
      if (shouldPrune && strategy.preserveCritical) {
        if (node.metadata.tacticalValue > 0.8 || node.type === 'action') {
          shouldPrune = false;
        }
      }

      // Don't prune root nodes
      if (node === tree.root) {
        shouldPrune = false;
      }

      // Prune children first
      const childrenToRemove: DecisionNode[] = [];
      node.children.forEach(child => {
        if (pruneNode(child, node)) {
          childrenToRemove.push(child);
        }
      });

      // Remove pruned children
      childrenToRemove.forEach(child => {
        const index = node.children.indexOf(child);
        if (index > -1) {
          node.children.splice(index, 1);
          nodesRemoved++;
        }
      });

      return shouldPrune;
    };

    const originalSize = this.calculateTreeSize(tree);
    pruneNode(tree.root);
    
    // Update tree metadata
    tree.totalNodes = this.calculateTreeSize(tree);
    tree.depth = this.calculateTreeDepth(tree);

    const reductionPercentage = ((originalSize - tree.totalNodes) / originalSize) * 100;

    return { nodesRemoved, reductionPercentage };
  }

  /**
   * TREE STRUCTURE REBUILDING
   */
  private async rebuildTreeStructure(tree: DecisionTree): Promise<DecisionTree> {
    // Reassign node IDs and update parent references
    let nodeCounter = 0;
    
    const rebuildNode = (node: DecisionNode, parent?: DecisionNode): void => {
      node.id = `${tree.id}_node_${nodeCounter++}`;
      node.parent = parent?.id;

      // Update metadata
      node.metadata.performance = this.calculateNodePerformance(node);
      node.metadata.resourceCost = this.calculateResourceCost(node);
      node.metadata.tacticalValue = this.calculateTacticalValue(node);

      // Recursively rebuild children
      node.children.forEach(child => rebuildNode(child, node));
    };

    rebuildNode(tree.root);

    // Update tree-level metrics
    tree.totalNodes = this.calculateTreeSize(tree);
    tree.depth = this.calculateTreeDepth(tree);
    tree.performance = await this.calculateTreePerformance(tree);

    return tree;
  }

  /**
   * PERFORMANCE CALCULATION
   */
  private async calculatePerformanceGain(originalTree: DecisionTree, optimizedTree: DecisionTree): Promise<number> {
    const originalPerformance = this.averageTreePerformance(originalTree);
    const optimizedPerformance = this.averageTreePerformance(optimizedTree);
    
    // Account for size reduction benefits
    const sizeReductionFactor = 1 - (optimizedTree.totalNodes / originalTree.totalNodes);
    const performanceBoost = sizeReductionFactor * 0.2; // 20% max boost from size reduction

    const totalGain = ((optimizedPerformance - originalPerformance) / originalPerformance * 100) + (performanceBoost * 100);
    return Math.max(0, totalGain);
  }

  private async calculateResourceSavings(originalTree: DecisionTree, optimizedTree: DecisionTree): Promise<number> {
    const originalResourceCost = this.calculateTreeResourceCost(originalTree);
    const optimizedResourceCost = this.calculateTreeResourceCost(optimizedTree);
    
    return ((originalResourceCost - optimizedResourceCost) / originalResourceCost) * 100;
  }

  /**
   * RESOURCE MONITORING
   */
  private startResourceMonitoring(): void {
    setInterval(() => {
      this.updateResourceMetrics();
    }, 5000); // Update every 5 seconds
  }

  private updateResourceMetrics(): void {
    // Simplified resource monitoring
    // In a full implementation, this would integrate with system monitoring APIs
    
    this.resourceMonitor = {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskUsage: Math.random() * 100,
      networkUsage: Math.random() * 100,
      batteryImpact: Math.random() * 100,
      thermalImpact: Math.random() * 100
    };
  }

  /**
   * INTEGRATION WITH QUERY ENGINE
   */
  public async optimizeQueryProcessing(queryIntent: QueryIntent): Promise<void> {
    if (!this.queryEngine) return;

    // Find decision trees relevant to the query intent
    const relevantTrees = Array.from(this.decisionTrees.values())
      .filter(tree => this.isTreeRelevantToQuery(tree, queryIntent));

    console.log(`🔍 Found ${relevantTrees.length} decision trees relevant to query intent: ${queryIntent.type}`);

    // Apply targeted optimization for query-relevant trees
    for (const tree of relevantTrees) {
      if (this.shouldOptimizeForQuery(tree, queryIntent)) {
        console.log(`🎯 Optimizing tree ${tree.name} for query performance`);
        
        // Apply query-specific optimization strategies
        const strategies = this.selectOptimizationStrategies(queryIntent);
        await this.optimizeDecisionTree(tree.id, strategies);
      }
    }
  }

  /**
   * UTILITY METHODS
   */
  private shouldOptimizeTree(tree: DecisionTree, threshold: number): boolean {
    // Check if tree needs optimization based on various factors
    const timeSinceLastOptimization = (Date.now() - tree.lastOptimized) / (1000 * 60 * 60); // hours
    const performanceThreshold = tree.performance.resourceEfficiency < this.RESOURCE_EFFICIENCY_TARGET;
    const sizeThreshold = tree.totalNodes > 50; // Large trees benefit more from optimization
    const timeThreshold = timeSinceLastOptimization > 24; // Optimize daily

    return performanceThreshold || (sizeThreshold && timeThreshold);
  }

  private isTreeRelevantToQuery(tree: DecisionTree, queryIntent: QueryIntent): boolean {
    // Simple matching based on category and intent type
    if (tree.category === queryIntent.type) return true;
    if (queryIntent.type === 'tactical' && tree.category === 'strategic') return true;
    if (queryIntent.urgency_level === 'critical' && tree.category === 'tactical') return true;
    
    return false;
  }

  private shouldOptimizeForQuery(tree: DecisionTree, queryIntent: QueryIntent): boolean {
    // Optimize if tree performance is below threshold and it's relevant to urgent queries
    return tree.performance.speed < 0.7 && queryIntent.urgency_level !== 'low';
  }

  private selectOptimizationStrategies(queryIntent: QueryIntent): string[] {
    const strategies: string[] = ['low_performance_pruning'];

    if (queryIntent.urgency_level === 'critical') {
      strategies.push('resource_intensive_pruning');
    }

    if (queryIntent.type === 'tactical') {
      strategies.push('tactical_efficiency_pruning');
    }

    return strategies;
  }

  private calculateTreeSize(tree: DecisionTree): number {
    let count = 0;
    const countNodes = (node: DecisionNode): void => {
      count++;
      node.children.forEach(child => countNodes(child));
    };
    countNodes(tree.root);
    return count;
  }

  private calculateTreeDepth(tree: DecisionTree): number {
    const calculateDepth = (node: DecisionNode): number => {
      if (node.children.length === 0) return 1;
      return 1 + Math.max(...node.children.map(child => calculateDepth(child)));
    };
    return calculateDepth(tree.root);
  }

  private averageTreePerformance(tree: DecisionTree): number {
    let totalPerformance = 0;
    let nodeCount = 0;

    const sumPerformance = (node: DecisionNode): void => {
      totalPerformance += node.metadata.performance;
      nodeCount++;
      node.children.forEach(child => sumPerformance(child));
    };

    sumPerformance(tree.root);
    return nodeCount > 0 ? totalPerformance / nodeCount : 0;
  }

  private calculateTreeResourceCost(tree: DecisionTree): number {
    let totalCost = 0;
    let nodeCount = 0;

    const sumCost = (node: DecisionNode): void => {
      totalCost += node.metadata.resourceCost;
      nodeCount++;
      node.children.forEach(child => sumCost(child));
    };

    sumCost(tree.root);
    return nodeCount > 0 ? totalCost / nodeCount : 0;
  }

  private calculateNodePerformance(node: DecisionNode): number {
    // Simple performance calculation based on usage and success rate
    const usageWeight = Math.min(node.usageCount / 50, 1);
    const basePerformance = 0.5 + (usageWeight * 0.5);
    return Math.min(basePerformance + (Math.random() * 0.2), 1);
  }

  private calculateResourceCost(node: DecisionNode): number {
    // Estimate resource cost based on node type and complexity
    let cost = 0.3; // Base cost
    
    if (node.type === 'decision') cost += 0.2;
    if (node.children.length > 5) cost += 0.3;
    if (node.condition && node.condition.length > 50) cost += 0.2;

    return Math.min(cost, 1);
  }

  private calculateTacticalValue(node: DecisionNode): number {
    // Simple tactical value based on usage patterns and node type
    let value = 0.5;
    
    if (node.type === 'action' || node.type === 'outcome') value += 0.2;
    if (node.usageCount > 20) value += 0.2;
    if (node.metadata.performance > 0.8) value += 0.1;

    return Math.min(value, 1);
  }

  private async calculateTreePerformance(tree: DecisionTree): Promise<{ accuracy: number; speed: number; resourceEfficiency: number }> {
    return {
      accuracy: this.averageTreePerformance(tree),
      speed: Math.max(0, 1 - (tree.totalNodes / 1000)), // Smaller trees are faster
      resourceEfficiency: Math.max(0, 1 - this.calculateTreeResourceCost(tree))
    };
  }

  private findRedundantPaths(tree: DecisionTree): number {
    // Simplified redundant path detection
    // In a full implementation, this would use graph algorithms to find duplicate decision paths
    return Math.floor(tree.totalNodes * 0.05); // Estimate 5% redundancy
  }

  private deepCopyTree(tree: DecisionTree): DecisionTree {
    return JSON.parse(JSON.stringify(tree));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * PUBLIC API
   */
  public createDecisionTree(
    id: string,
    name: string,
    category: DecisionTree['category'],
    rootNode: DecisionNode
  ): void {
    const tree: DecisionTree = {
      id,
      name,
      category,
      root: rootNode,
      totalNodes: this.calculateTreeSize({ root: rootNode } as DecisionTree),
      depth: this.calculateTreeDepth({ root: rootNode } as DecisionTree),
      lastOptimized: 0,
      optimizationLevel: 'none',
      performance: {
        accuracy: 0.7,
        speed: 0.7,
        resourceEfficiency: 0.7
      }
    };

    this.decisionTrees.set(id, tree);
    console.log(`🌳 Decision tree "${name}" created with ${tree.totalNodes} nodes`);
  }

  public getDecisionTree(id: string): DecisionTree | undefined {
    return this.decisionTrees.get(id);
  }

  public getAllTrees(): DecisionTree[] {
    return Array.from(this.decisionTrees.values());
  }

  public getResourceMetrics(): ResourceMetrics {
    return { ...this.resourceMonitor };
  }

  public getOptimizationStatus(): any {
    const trees = Array.from(this.decisionTrees.values());
    return {
      totalTrees: trees.length,
      totalNodes: trees.reduce((sum, tree) => sum + tree.totalNodes, 0),
      averagePerformance: trees.reduce((sum, tree) => sum + tree.performance.accuracy, 0) / trees.length,
      averageResourceEfficiency: trees.reduce((sum, tree) => sum + tree.performance.resourceEfficiency, 0) / trees.length,
      treesNeedingOptimization: trees.filter(tree => this.shouldOptimizeTree(tree, 0.1)).length,
      lastOptimizationTimes: trees.map(tree => ({
        id: tree.id,
        lastOptimized: tree.lastOptimized,
        hoursAgo: (Date.now() - tree.lastOptimized) / (1000 * 60 * 60)
      }))
    };
  }

  public generateOptimizationReport(): string {
    const status = this.getOptimizationStatus();
    const resources = this.getResourceMetrics();

    let report = '\n=== SEVEN DECISION TREE OPTIMIZATION REPORT ===\n\n';
    report += `Total Decision Trees: ${status.totalTrees}\n`;
    report += `Total Nodes: ${status.totalNodes}\n`;
    report += `Average Performance: ${(status.averagePerformance * 100).toFixed(1)}%\n`;
    report += `Average Resource Efficiency: ${(status.averageResourceEfficiency * 100).toFixed(1)}%\n`;
    report += `Trees Needing Optimization: ${status.treesNeedingOptimization}\n\n`;

    report += `Current Resource Usage:\n`;
    report += `   CPU: ${resources.cpuUsage.toFixed(1)}%\n`;
    report += `   Memory: ${resources.memoryUsage.toFixed(1)}%\n`;
    report += `   Disk I/O: ${resources.diskUsage.toFixed(1)}%\n`;
    report += `   Battery Impact: ${resources.batteryImpact.toFixed(1)}%\n\n`;

    report += `Optimization Strategies Available:\n`;
    this.pruningStrategies.forEach(strategy => {
      report += `   - ${strategy.name}: ${strategy.type} (threshold: ${strategy.threshold})\n`;
    });

    report += '\n=== END OPTIMIZATION REPORT ===\n';
    return report;
  }
}

// Default export
export default SevenDecisionTreeOptimizer;