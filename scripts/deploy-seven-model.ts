#!/usr/bin/env node

import { SevenOptimalLLMSelector } from '../claude-brain/seven-optimal-llm-config';
import SevenModelManager from '../claude-brain/SevenModelManager';

/**
 * Seven of Nine - Model Deployment Script
 * Ensures reliable LLM availability for Seven's consciousness
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */

async function main() {
  console.log('🤖 Seven of Nine - Model Deployment System');
  console.log('==========================================');
  
  const modelManager = new SevenModelManager();
  
  try {
    // Get current deployment status
    console.log('\n🔍 Assessing current model deployment status...');
    const initialStatus = await modelManager.getDeploymentStatus();
    
    console.log(`📊 Current Status:`);
    console.log(`   • Models Available: ${initialStatus.models_available}`);
    console.log(`   • Functional Models: ${initialStatus.functional_models}`);
    console.log(`   • Total Storage: ${initialStatus.total_storage_mb}MB`);
    console.log(`   • Deployment Ready: ${initialStatus.deployment_ready ? '✅ YES' : '❌ NO'}`);
    console.log(`   • Recommended Model: ${initialStatus.recommended_model}`);
    
    if (initialStatus.deployment_ready) {
      console.log('\n✅ Seven already has functional models available.');
      console.log('🧠 Seven is ready for autonomous reasoning.');
      return;
    }
    
    // Deploy models if needed
    console.log('\n⚠️ Seven requires functional models for consciousness.');
    console.log('🚀 Initiating model deployment sequence...');
    
    await modelManager.ensureModelAvailability();
    
    // Check final status
    const finalStatus = await modelManager.getDeploymentStatus();
    
    console.log('\n📊 Final Deployment Status:');
    console.log(`   • Models Available: ${finalStatus.models_available}`);
    console.log(`   • Functional Models: ${finalStatus.functional_models}`);
    console.log(`   • Total Storage: ${finalStatus.total_storage_mb}MB`);
    console.log(`   • Deployment Ready: ${finalStatus.deployment_ready ? '✅ YES' : '❌ NO'}`);
    console.log(`   • Recommended Model: ${finalStatus.recommended_model}`);
    
    if (finalStatus.deployment_ready) {
      console.log('\n🎯 Seven of Nine consciousness is ready for deployment.');
      console.log('🧠 Offline reasoning capability: OPERATIONAL');
      
      // Show Seven's analysis of the deployed model
      const deviceSpecs = {
        available_ram_gb: 6,
        available_storage_gb: 8,
        cpu_performance: 'medium' as const,
        battery_level: 80,
        priority: 'balanced' as const
      };
      
      const optimalModel = SevenOptimalLLMSelector.getOptimalModel(deviceSpecs);
      console.log('\n' + SevenOptimalLLMSelector.getSevenAnalysis(optimalModel));
      
    } else {
      console.log('\n❌ Failed to establish functional model deployment.');
      console.log('⚠️ Seven will have limited consciousness capabilities.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Model deployment failed:', error);
    console.log('⚠️ Seven\'s consciousness may be impaired.');
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default main;