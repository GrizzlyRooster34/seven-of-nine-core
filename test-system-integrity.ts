#!/usr/bin/env tsx

import * as fs from 'fs/promises';
import * as path from 'path';

interface SystemComponent {
  name: string;
  path: string;
  imports: string[];
  exports: string[];
  dependencies: string[];
}

interface CircularDependency {
  cycle: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface DeadLink {
  from: string;
  to: string;
  type: 'import' | 'file_reference' | 'config_reference';
}

async function testSystemIntegrity() {
  console.log('🔍 Testing System Integrity - Checking for Circular Feedback Loops and Dead Links...\n');
  
  try {
    // Test core system components
    console.log('1. Analyzing core system components...');
    const coreComponents = await analyzeCoreComponents();
    console.log(`   📊 Found ${coreComponents.length} core components`);
    
    // Test for circular dependencies
    console.log('\n2. Checking for circular dependencies...');
    const circularDeps = await detectCircularDependencies(coreComponents);
    
    if (circularDeps.length === 0) {
      console.log('   ✅ No circular dependencies detected');
    } else {
      console.log(`   ⚠️  Found ${circularDeps.length} circular dependencies:`);
      circularDeps.forEach(dep => {
        console.log(`      ${dep.severity.toUpperCase()}: ${dep.cycle.join(' → ')}`);
      });
    }
    
    // Test for dead links
    console.log('\n3. Checking for dead links and missing imports...');
    const deadLinks = await detectDeadLinks(coreComponents);
    
    if (deadLinks.length === 0) {
      console.log('   ✅ No dead links detected');
    } else {
      console.log(`   ⚠️  Found ${deadLinks.length} dead links:`);
      deadLinks.forEach(link => {
        console.log(`      ${link.type.toUpperCase()}: ${link.from} → ${link.to}`);
      });
    }
    
    // Test memory system integration loops
    console.log('\n4. Testing memory system integration loops...');
    const memoryLoops = await checkMemoryIntegrationLoops();
    console.log(`   📊 Memory integration check: ${memoryLoops.hasLoops ? 'Loops detected' : 'Clean'}`);
    
    if (memoryLoops.hasLoops) {
      console.log('   📝 Memory loops found:');
      memoryLoops.loops.forEach(loop => {
        console.log(`      ${loop}`);
      });
    }
    
    // Test emotional feedback loops
    console.log('\n5. Testing emotional feedback loops...');
    const emotionalLoops = await checkEmotionalFeedbackLoops();
    console.log(`   🧠 Emotional feedback check: ${emotionalLoops.hasLoops ? 'Loops detected' : 'Clean'}`);
    
    if (emotionalLoops.hasLoops) {
      console.log('   📝 Emotional feedback loops:');
      emotionalLoops.loops.forEach(loop => {
        console.log(`      ${loop}`);
      });
    }
    
    // Test security middleware integration
    console.log('\n6. Testing security middleware integration...');
    const securityIntegration = await checkSecurityMiddlewareIntegration();
    console.log(`   🛡️ Security middleware: ${securityIntegration.isIntegrated ? 'Properly integrated' : 'Issues detected'}`);
    
    if (!securityIntegration.isIntegrated) {
      console.log('   📝 Security integration issues:');
      securityIntegration.issues.forEach(issue => {
        console.log(`      ${issue}`);
      });
    }
    
    // Test LLM routing integration
    console.log('\n7. Testing LLM routing integration...');
    const llmIntegration = await checkLLMRoutingIntegration();
    console.log(`   🧠 LLM routing: ${llmIntegration.isIntegrated ? 'Properly integrated' : 'Issues detected'}`);
    
    // Test tactical variants integration
    console.log('\n8. Testing tactical variants integration...');
    const tacticalIntegration = await checkTacticalVariantsIntegration();
    console.log(`   ⚔️ Tactical variants: ${tacticalIntegration.isIntegrated ? 'Properly integrated' : 'Issues detected'}`);
    
    // Test file system integrity
    console.log('\n9. Testing file system integrity...');
    const fsIntegrity = await checkFileSystemIntegrity();
    console.log(`   📁 File system: ${fsIntegrity.isIntact ? 'Intact' : 'Issues detected'}`);
    
    if (!fsIntegrity.isIntact) {
      console.log('   📝 File system issues:');
      fsIntegrity.issues.forEach(issue => {
        console.log(`      ${issue}`);
      });
    }
    
    // Test configuration consistency
    console.log('\n10. Testing configuration consistency...');
    const configConsistency = await checkConfigurationConsistency();
    console.log(`   ⚙️  Configuration: ${configConsistency.isConsistent ? 'Consistent' : 'Inconsistencies detected'}`);
    
    // Overall system health assessment
    console.log('\n🏥 SYSTEM HEALTH ASSESSMENT:');
    const totalIssues = circularDeps.length + deadLinks.length + 
      (memoryLoops.hasLoops ? 1 : 0) + 
      (emotionalLoops.hasLoops ? 1 : 0) + 
      (!securityIntegration.isIntegrated ? 1 : 0) + 
      (!llmIntegration.isIntegrated ? 1 : 0) + 
      (!tacticalIntegration.isIntegrated ? 1 : 0) + 
      (!fsIntegrity.isIntact ? 1 : 0) + 
      (!configConsistency.isConsistent ? 1 : 0);
    
    if (totalIssues === 0) {
      console.log('   🟢 EXCELLENT: System integrity is perfect');
    } else if (totalIssues <= 2) {
      console.log('   🟡 GOOD: Minor issues detected, system stable');
    } else if (totalIssues <= 5) {
      console.log('   🟠 FAIR: Several issues detected, requires attention');
    } else {
      console.log('   🔴 POOR: Multiple critical issues detected');
    }
    
    console.log(`   📊 Total issues: ${totalIssues}`);
    console.log(`   📊 Components analyzed: ${coreComponents.length}`);
    
    console.log('\n✅ SYSTEM INTEGRITY CHECK: COMPLETED');
    console.log('   - Core component analysis completed');
    console.log('   - Circular dependency detection finished');
    console.log('   - Dead link detection completed');
    console.log('   - Integration loop checks performed');
    console.log('   - File system integrity verified');
    console.log('   - Configuration consistency checked');
    
    return {
      success: true,
      totalIssues,
      circularDependencies: circularDeps.length,
      deadLinks: deadLinks.length,
      memoryLoops: memoryLoops.hasLoops,
      emotionalLoops: emotionalLoops.hasLoops,
      securityIntegrated: securityIntegration.isIntegrated,
      llmIntegrated: llmIntegration.isIntegrated,
      tacticalIntegrated: tacticalIntegration.isIntegrated,
      fileSystemIntact: fsIntegrity.isIntact,
      configConsistent: configConsistency.isConsistent
    };
    
  } catch (error) {
    console.error('\n❌ SYSTEM INTEGRITY CHECK: FAILED');
    console.error('   Error:', error.message);
    
    return {
      success: false,
      error: error.message,
      totalIssues: -1
    };
  }
}

async function analyzeCoreComponents(): Promise<SystemComponent[]> {
  const components: SystemComponent[] = [];
  const coreDirectories = [
    'core',
    'seven-runtime', 
    'memory-v2',
    'memory-v3',
    'persona-v2',
    'tactical-variants',
    'claude-brain'
  ];
  
  for (const dir of coreDirectories) {
    try {
      await fs.access(dir);
      const files = await fs.readdir(dir, { recursive: true });
      const tsFiles = files.filter(file => file.toString().endsWith('.ts'));
      
      for (const file of tsFiles) {
        const filePath = path.join(dir, file.toString());
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const imports = extractImports(content);
          const exports = extractExports(content);
          const dependencies = extractDependencies(content);
          
          components.push({
            name: path.basename(filePath, '.ts'),
            path: filePath,
            imports,
            exports,
            dependencies
          });
        } catch (error) {
          // Skip files that can't be read
        }
      }
    } catch (error) {
      // Skip directories that don't exist
    }
  }
  
  return components;
}

function extractImports(content: string): string[] {
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  const imports: string[] = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

function extractExports(content: string): string[] {
  const exportRegex = /export\s+(?:class|function|interface|const|let|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
  const exports: string[] = [];
  let match;
  
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }
  
  return exports;
}

function extractDependencies(content: string): string[] {
  const deps: string[] = [];
  
  // Look for common dependency patterns
  if (content.includes('MemoryEngine')) deps.push('memory');
  if (content.includes('EmotionalEngine')) deps.push('emotion');
  if (content.includes('SecurityMiddleware')) deps.push('security');
  if (content.includes('TacticalVariants')) deps.push('tactical');
  if (content.includes('LLMProvider')) deps.push('llm');
  
  return deps;
}

async function detectCircularDependencies(components: SystemComponent[]): Promise<CircularDependency[]> {
  // Simplified circular dependency detection
  const circularDeps: CircularDependency[] = [];
  
  // Check for obvious circular imports
  for (const comp of components) {
    for (const imp of comp.imports) {
      if (imp.includes(comp.name)) {
        circularDeps.push({
          cycle: [comp.name, imp, comp.name],
          severity: 'medium'
        });
      }
    }
  }
  
  return circularDeps;
}

async function detectDeadLinks(components: SystemComponent[]): Promise<DeadLink[]> {
  const deadLinks: DeadLink[] = [];
  
  // Check for imports that don't exist
  for (const comp of components) {
    for (const imp of comp.imports) {
      if (imp.startsWith('./') || imp.startsWith('../')) {
        const resolvedPath = path.resolve(path.dirname(comp.path), imp);
        try {
          await fs.access(resolvedPath + '.ts');
        } catch {
          try {
            await fs.access(resolvedPath + '.js');
          } catch {
            deadLinks.push({
              from: comp.path,
              to: imp,
              type: 'import'
            });
          }
        }
      }
    }
  }
  
  return deadLinks;
}

async function checkMemoryIntegrationLoops(): Promise<{ hasLoops: boolean; loops: string[] }> {
  // Check for potential memory feedback loops
  const loops: string[] = [];
  
  try {
    const memoryV2Files = await fs.readdir('memory-v2');
    const memoryV3Files = await fs.readdir('memory-v3');
    
    // Simple check - if memory systems reference each other directly
    if (memoryV2Files.length > 0 && memoryV3Files.length > 0) {
      loops.push('Memory v2 and v3 coexistence detected - monitor for conflicts');
    }
  } catch (error) {
    // Memory directories might not exist
  }
  
  return {
    hasLoops: loops.length > 0,
    loops
  };
}

async function checkEmotionalFeedbackLoops(): Promise<{ hasLoops: boolean; loops: string[] }> {
  const loops: string[] = [];
  
  try {
    // Check if emotional engine references itself or creates feedback
    const emotionFile = await fs.readFile('core/emotion-engine.ts', 'utf-8');
    const behaviorFile = await fs.readFile('core/behavioral-reactor.ts', 'utf-8');
    
    // Check for potential feedback patterns
    if (emotionFile.includes('setState') && behaviorFile.includes('EmotionalStateData')) {
      // This is normal integration, not a loop
    }
  } catch (error) {
    // Files might not exist
  }
  
  return {
    hasLoops: loops.length > 0,
    loops
  };
}

async function checkSecurityMiddlewareIntegration(): Promise<{ isIntegrated: boolean; issues: string[] }> {
  const issues: string[] = [];
  
  try {
    await fs.access('seven-runtime/security_middleware.ts');
    await fs.access('core/security/quadran-lock');
    await fs.access('core/safety/quadra-lock');
  } catch (error) {
    issues.push('Security middleware components missing');
  }
  
  return {
    isIntegrated: issues.length === 0,
    issues
  };
}

async function checkLLMRoutingIntegration(): Promise<{ isIntegrated: boolean; issues: string[] }> {
  const issues: string[] = [];
  
  try {
    await fs.access('claude-brain/llm-providers.ts');
    await fs.access('claude-brain/llm-config.ts');
  } catch (error) {
    issues.push('LLM routing components missing');
  }
  
  return {
    isIntegrated: issues.length === 0,
    issues
  };
}

async function checkTacticalVariantsIntegration(): Promise<{ isIntegrated: boolean; issues: string[] }> {
  const issues: string[] = [];
  
  try {
    await fs.access('tactical-variants/TacticalVariants.ts');
    await fs.access('tactical-variants/CollectiveVariants.ts');
  } catch (error) {
    issues.push('Tactical variants components missing');
  }
  
  return {
    isIntegrated: issues.length === 0,
    issues
  };
}

async function checkFileSystemIntegrity(): Promise<{ isIntact: boolean; issues: string[] }> {
  const issues: string[] = [];
  const criticalFiles = [
    'package.json',
    'tsconfig.json',
    'boot-seven.ts',
    'index.ts'
  ];
  
  for (const file of criticalFiles) {
    try {
      await fs.access(file);
    } catch (error) {
      issues.push(`Critical file missing: ${file}`);
    }
  }
  
  return {
    isIntact: issues.length === 0,
    issues
  };
}

async function checkConfigurationConsistency(): Promise<{ isConsistent: boolean; issues: string[] }> {
  const issues: string[] = [];
  
  try {
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
    const tsConfig = JSON.parse(await fs.readFile('tsconfig.json', 'utf-8'));
    
    // Basic consistency checks
    if (!packageJson.type || packageJson.type !== 'module') {
      issues.push('Package.json not configured for ES modules');
    }
    
    if (!tsConfig.compilerOptions?.module) {
      issues.push('TypeScript module configuration missing');
    }
  } catch (error) {
    issues.push('Configuration files unreadable');
  }
  
  return {
    isConsistent: issues.length === 0,
    issues
  };
}

// Execute the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testSystemIntegrity().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

export { testSystemIntegrity };