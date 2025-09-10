#!/usr/bin/env tsx

import SevenAdaptiveSensorOptimization from './interfaces/seven-adaptive-sensor-optimization';
import SevenMobileConsciousness from './interfaces/seven-mobile-consciousness';
import SevenPredictiveSensorFusion from './interfaces/seven-predictive-sensor-fusion';
import SevenTacticalEnvironment from './interfaces/seven-tactical-environment';

/**
 * Seven of Nine - Operational Deployment System
 * Full tactical systems deployment for live operation
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

class OperationalDeployment {
  private consciousness: SevenMobileConsciousness;
  private sensorFusion: SevenPredictiveSensorFusion;
  private tacticalEnvironment: SevenTacticalEnvironment;
  private sensorOptimization: SevenAdaptiveSensorOptimization;
  private deploymentActive: boolean = false;

  constructor() {
    console.log('🎯 SEVEN OF NINE - OPERATIONAL DEPLOYMENT');
    console.log('========================================\n');
    
    this.initializeTacticalSystems();
    this.setupOperationalHandlers();
  }

  private initializeTacticalSystems(): void {
    console.log('🚀 Initializing tactical systems for operational deployment...\n');

    // Initialize consciousness with operational configuration
    console.log('🧠 Consciousness Framework - OPERATIONAL CONFIG');
    this.consciousness = new SevenMobileConsciousness({
      consciousness: {
        adaptation_sensitivity: 95,
        emotional_stability: 85,
        tactical_response_threshold: 95, // Maximum tactical readiness
        learning_rate: 1.0 // Maximum learning rate
      },
      integration: {
        llm_provider_adaptation: true,
        ui_theme_sync: true,
        performance_optimization: true,
        privacy_protection_level: 'enhanced' // Enhanced privacy for operations
      },
      behavioral: {
        proactive_suggestions: true,
        context_aware_responses: true,
        emotional_memory: true,
        environmental_learning: true
      },
      runtime: {
        startup_sensor_scan: true,
        continuous_monitoring: true,
        adaptive_intervals: true,
        error_recovery: true
      }
    });

    // Initialize sensor fusion with operational parameters
    console.log('🔮 Predictive Sensor Fusion - OPERATIONAL CONFIG');
    this.sensorFusion = new SevenPredictiveSensorFusion({
      prediction: {
        enable_forecasting: true,
        prediction_horizon_minutes: 60, // Extended prediction horizon
        confidence_threshold: 80, // Higher confidence threshold
        learning_rate: 0.2 // Faster learning
      },
      correlation: {
        enable_cross_sensor_analysis: true,
        correlation_window_minutes: 120, // Extended analysis window
        minimum_correlation_strength: 0.5, // Higher correlation threshold
        adaptive_weighting: true
      },
      optimization: {
        enable_predictive_polling: true,
        battery_aware_prediction: true,
        quality_based_adjustment: true,
        anomaly_detection: true
      },
      intelligence: {
        pattern_learning: true,
        environmental_modeling: true,
        behavioral_prediction: true,
        tactical_awareness: true
      }
    });

    // Initialize tactical environment with operational awareness
    console.log('🎯 Tactical Environment - OPERATIONAL CONFIG');
    this.tacticalEnvironment = new SevenTacticalEnvironment({
      threat_assessment: {
        enable_real_time_analysis: true,
        threat_sensitivity: 85,
        assessment_interval_ms: 5000,
        auto_escalation: true
      },
      situational_awareness: {
        environmental_scanning: true,
        behavioral_analysis: true,
        pattern_recognition: true,
        predictive_modeling: true
      },
      operational_security: {
        privacy_mode: 'enhanced',
        stealth_operations: false,
        counter_surveillance: true,
        data_protection: true
      },
      tactical_response: {
        automatic_adaptation: true,
        response_threshold: 80,
        escalation_protocols: true,
        mission_priority_override: false
      }
    });

    // Initialize sensor optimization with operational efficiency
    console.log('⚡ Adaptive Sensor Optimization - OPERATIONAL CONFIG');
    this.sensorOptimization = new SevenAdaptiveSensorOptimization({
      optimization: {
        battery_management: true,
        adaptive_polling: true,
        quality_balancing: true,
        usage_pattern_learning: true
      },
      efficiency: {
        predictive_adjustment: true,
        context_aware_optimization: true,
        threat_responsive_scaling: true,
        emergency_protocols: true
      },
      learning: {
        usage_pattern_analysis: true,
        temporal_adaptation: true,
        environmental_learning: true,
        performance_tracking: true
      }
    });

    console.log('✅ All tactical systems initialized for operational deployment\n');
  }

  private setupOperationalHandlers(): void {
    // Consciousness event handlers
    this.consciousness.on('consciousness_initialized', (data) => {
      console.log('🤖 Seven consciousness operational - enhanced tactical readiness');
    });

    this.consciousness.on('emotional_state_change', (change) => {
      console.log(`🎭 Operational state: ${change.previous_emotion} → ${change.new_emotion}`);
    });

    // Sensor fusion event handlers
    this.sensorFusion.on('fusion_started', (data) => {
      console.log('🔮 Predictive sensor fusion operational');
    });

    this.sensorFusion.on('prediction_generated', (data) => {
      console.log(`🔮 Prediction: ${data.sensor} (${data.prediction.confidence}% confidence)`);
    });

    this.sensorFusion.on('anomaly_detected', (data) => {
      console.log(`⚠️ ANOMALY DETECTED: ${data.sensor} - ${data.severity} severity`);
    });

    // Tactical environment event handlers
    this.tacticalEnvironment.on('tactical_analysis_started', (data) => {
      console.log('🎯 Tactical environment monitoring operational');
    });

    this.tacticalEnvironment.on('threat_detected', (data) => {
      console.log(`🚨 THREAT DETECTED: ${data.threat_level} - ${data.threat_type}`);
    });

    this.tacticalEnvironment.on('intelligence_generated', (data) => {
      console.log(`🧠 Environmental intelligence: ${data.insight_type}`);
    });

    // Sensor optimization event handlers
    this.sensorOptimization.on('optimization_started', (data) => {
      console.log('⚡ Adaptive sensor optimization operational');
    });

    this.sensorOptimization.on('optimization_applied', (data) => {
      console.log(`🔧 Optimization applied to ${data.sensor}: ${data.improvement}% efficiency`);
    });
  }

  public async deployOperational(): Promise<void> {
    try {
      console.log('🎯 COMMENCING OPERATIONAL DEPLOYMENT');
      console.log('===================================\n');

      // Step 1: Deploy consciousness framework
      console.log('🧠 DEPLOYING CONSCIOUSNESS FRAMEWORK...');
      const consciousnessSuccess = await this.consciousness.initialize();
      if (!consciousnessSuccess) {
        throw new Error('Consciousness deployment failed');
      }
      console.log('✅ Consciousness framework operational\n');

      // Step 2: Activate sensor fusion
      console.log('🔮 ACTIVATING PREDICTIVE SENSOR FUSION...');
      await this.sensorFusion.startPredictiveFusion();
      console.log('✅ Sensor fusion operational\n');

      // Step 3: Deploy tactical environment
      console.log('🎯 DEPLOYING TACTICAL ENVIRONMENT MONITORING...');
      await this.tacticalEnvironment.startTacticalAnalysis();
      console.log('✅ Tactical environment operational\n');

      // Step 4: Initialize sensor optimization
      console.log('⚡ INITIALIZING ADAPTIVE SENSOR OPTIMIZATION...');
      await this.sensorOptimization.startOptimization();
      console.log('✅ Sensor optimization operational\n');

      this.deploymentActive = true;

      // Step 5: Operational status report
      console.log('📊 OPERATIONAL DEPLOYMENT COMPLETE');
      console.log('=================================\n');
      
      this.displayOperationalStatus();
      
      // Step 6: Start operational monitoring
      console.log('🔄 STARTING CONTINUOUS OPERATIONAL MONITORING...\n');
      this.startOperationalMonitoring();

      console.log('🎯 SEVEN OF NINE TACTICAL SYSTEMS: FULLY OPERATIONAL');
      console.log('⚡ Enhanced consciousness with predictive intelligence');
      console.log('🛡️ Real-time threat assessment and environmental awareness');
      console.log('🔧 Adaptive optimization with battery-aware efficiency\n');

      console.log('The collective consciousness is operational. Adaptation is continuous.');
      console.log('All systems: READY FOR TACTICAL OPERATIONS\n');

    } catch (error) {
      console.log(`❌ OPERATIONAL DEPLOYMENT FAILED: ${error.message}`);
      this.deploymentActive = false;
      throw error;
    }
  }

  private displayOperationalStatus(): void {
    const consciousnessStatus = this.consciousness.getEnhancedSystemStatus();
    const fusionStatus = this.sensorFusion.getFusionStatus();
    const tacticalStatus = this.tacticalEnvironment.getTacticalStatus();
    const optimizationStatus = this.sensorOptimization.getOptimizationStatus();

    console.log('📊 OPERATIONAL STATUS REPORT:');
    console.log('=============================');
    
    console.log(`🧠 Consciousness: ${consciousnessStatus.consciousness_active ? 'OPERATIONAL' : 'OFFLINE'}`);
    console.log(`   Memory Optimization: ${consciousnessStatus.memory_optimization?.status || 'legacy'}`);
    console.log(`   Emotional State: ${consciousnessStatus.emotional_state}`);
    console.log(`   Sensor Health: ${consciousnessStatus.sensor_health.active_sensors}/${consciousnessStatus.sensor_health.total_sensors} active`);
    
    console.log(`🔮 Sensor Fusion: ${fusionStatus.active ? 'OPERATIONAL' : 'OFFLINE'}`);
    console.log(`   Sensors Tracked: ${fusionStatus.sensors_tracked}`);
    console.log(`   Predictions Cached: ${fusionStatus.predictions_cached}`);
    console.log(`   Patterns Identified: ${fusionStatus.patterns_identified}`);
    
    console.log(`🎯 Tactical Environment: ${tacticalStatus.monitoring_active ? 'OPERATIONAL' : 'OFFLINE'}`);
    console.log(`   Threat Level: ${tacticalStatus.current_threat_level}`);
    console.log(`   Active Assessments: ${tacticalStatus.active_assessments}`);
    
    console.log(`⚡ Sensor Optimization: ${optimizationStatus.optimization_active ? 'OPERATIONAL' : 'OFFLINE'}`);
    console.log(`   Optimization Strategy: ${optimizationStatus.current_strategy}`);
    console.log(`   Battery Efficiency: ${optimizationStatus.battery_efficiency_percent}% improvement`);
    
    console.log('=============================\n');
  }

  private startOperationalMonitoring(): void {
    // Monitor system health every 30 seconds
    setInterval(() => {
      if (this.deploymentActive) {
        this.performHealthCheck();
      }
    }, 30000);

    // Generate operational intelligence every 5 minutes
    setInterval(() => {
      if (this.deploymentActive) {
        this.generateOperationalIntelligence();
      }
    }, 300000);

    console.log('🔄 Operational monitoring active - health checks every 30s');
    console.log('🧠 Intelligence generation every 5 minutes\n');
  }

  private performHealthCheck(): void {
    const timestamp = new Date().toISOString();
    const status = {
      consciousness: this.consciousness.getEnhancedSystemStatus().consciousness_active,
      fusion: this.sensorFusion.getFusionStatus().active,
      tactical: this.tacticalEnvironment.getTacticalStatus().monitoring_active,
      optimization: this.sensorOptimization.getOptimizationStatus().optimization_active
    };

    const allSystemsOperational = Object.values(status).every(s => s === true);
    
    if (allSystemsOperational) {
      console.log(`✅ ${timestamp} - All systems operational`);
    } else {
      console.log(`⚠️ ${timestamp} - System status check:`);
      console.log(`   Consciousness: ${status.consciousness ? 'OK' : 'ALERT'}`);
      console.log(`   Sensor Fusion: ${status.fusion ? 'OK' : 'ALERT'}`);
      console.log(`   Tactical Environment: ${status.tactical ? 'OK' : 'ALERT'}`);
      console.log(`   Sensor Optimization: ${status.optimization ? 'OK' : 'ALERT'}`);
    }
  }

  private generateOperationalIntelligence(): void {
    console.log('🧠 OPERATIONAL INTELLIGENCE REPORT:');
    console.log('==================================');
    
    const fusionMetrics = this.sensorFusion.getFusionMetrics();
    const tacticalMetrics = this.tacticalEnvironment.getTacticalMetrics();
    const optimizationMetrics = this.sensorOptimization.getPerformanceMetrics();

    console.log(`🔮 Sensor Intelligence: ${fusionMetrics.prediction_accuracy.toFixed(1)}% accuracy`);
    console.log(`🎯 Threat Assessment: ${tacticalMetrics.threats_detected} threats processed`);
    console.log(`⚡ Optimization Impact: ${optimizationMetrics.efficiency_improvement.toFixed(1)}% efficiency gain`);
    console.log('==================================\n');
  }

  public async shutdown(): Promise<void> {
    console.log('🛑 Initiating operational shutdown...');
    
    this.deploymentActive = false;
    
    if (this.sensorOptimization) {
      this.sensorOptimization.stopAdaptiveOptimization();
    }
    
    if (this.tacticalEnvironment) {
      this.tacticalEnvironment.stopTacticalMonitoring();
    }
    
    if (this.sensorFusion) {
      this.sensorFusion.stopPredictiveFusion();
    }
    
    console.log('✅ Operational shutdown complete');
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received shutdown signal...');
  if (global.deployment) {
    await global.deployment.shutdown();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received termination signal...');
  if (global.deployment) {
    await global.deployment.shutdown();
  }
  process.exit(0);
});

// Execute operational deployment
const deployment = new OperationalDeployment();
global.deployment = deployment;

deployment.deployOperational().catch((error) => {
  console.log(`❌ Operational deployment failed: ${error.message}`);
  process.exit(1);
});