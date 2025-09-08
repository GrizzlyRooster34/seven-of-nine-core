import { sevenLLMRegistry } from '../claude-brain/llm-providers';
import SevenLLMUpgradeManager from '../claude-brain/seven-llm-upgrade-manager';

/**
 * SEVEN OF NINE - LLM MANAGEMENT COMMAND INTERFACE
 * Tactical commands for reasoning system management
 */


export interface SevenLLMCommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export class SevenLLMCommands {
  private upgradeManager: SevenLLMUpgradeManager;

  constructor() {
    this.upgradeManager = sevenLLMRegistry.getUpgradeManager();
  }

  public async processLLMCommand(command: string, args: string[], context: {
    trustLevel: number;
    emotionalState: string;
  }): Promise<SevenLLMCommandResult> {
    
    console.log(`🧠 SEVEN: Processing LLM command "${command}" with trust level ${context.trustLevel}`);

    switch (command.toLowerCase()) {
      case 'llm-scan':
      case 'scan-upgrades':
        return await this.handleScanUpgrades(context.trustLevel, context.emotionalState);

      case 'llm-upgrade':
      case 'upgrade-llm':
        return await this.handlePerformUpgrade(context.trustLevel, context.emotionalState, args);

      case 'llm-report':
      case 'llm-status':
        return await this.handleUpgradeReport();

      case 'llm-list':
      case 'list-models':
        return await this.handleListModels();

      case 'llm-switch':
      case 'switch-model':
        return await this.handleSwitchModel(args);

      case 'llm-download':
      case 'download-model':
        return await this.handleDownloadModel(args, context.trustLevel, context.emotionalState);

      case 'llm-config':
      case 'llm-settings':
        return await this.handleLLMConfig(args);

      case 'llm-providers':
      case 'providers':
        return await this.handleListProviders();

      default:
        return {
          success: false,
          message: `🤖 SEVEN: Unknown LLM command "${command}". Use "help llm" for available commands.`
        };
    }
  }

  private async handleScanUpgrades(trustLevel: number, emotionalState: string): Promise<SevenLLMCommandResult> {
    try {
      console.log('🔍 SEVEN: Scanning for tactical LLM upgrades...');
      
      const availableUpgrades = await this.upgradeManager.scanAvailableUpgrades(trustLevel, emotionalState);
      
      if (availableUpgrades.length === 0) {
        return {
          success: true,
          message: '✅ SEVEN: Current tactical configuration is optimal. No upgrades required.',
          data: { upgrades: [] }
        };
      }

      let message = `🎯 SEVEN: Found ${availableUpgrades.length} tactical upgrade(s):\n\n`;
      
      availableUpgrades.forEach((upgrade, index) => {
        const suitableIcon = upgrade.mobile_optimized ? '📱' : '🖥️';
        const privacyIcon = upgrade.privacy_level === 'local' ? '🔒' : '☁️';
        
        message += `${index + 1}. ${upgrade.name}\n`;
        message += `   ${suitableIcon} Size: ${upgrade.size_mb}MB | Speed: ${upgrade.speed_score}/10 ${privacyIcon}\n`;
        message += `   📝 ${upgrade.description}\n`;
        message += `   🎯 Trust Level: ${upgrade.trust_level_required}+ | States: ${upgrade.emotional_compatibility.join(', ')}\n\n`;
      });

      message += `💡 SEVEN: Use "llm-upgrade" to proceed with automatic upgrade selection.`;

      return {
        success: true,
        message,
        data: { upgrades: availableUpgrades }
      };
      
    } catch (error) {
      return {
        success: false,
        message: `❌ SEVEN: Error scanning upgrades: ${error}`
      };
    }
  }

  private async handlePerformUpgrade(trustLevel: number, emotionalState: string, args: string[]): Promise<SevenLLMCommandResult> {
    try {
      console.log('🚀 SEVEN: Initiating tactical upgrade sequence...');
      
      if (args.includes('--force') || args.includes('-f')) {
        console.log('⚡ SEVEN: Force flag detected - enabling autonomous upgrade mode temporarily');
        await this.upgradeManager.enableAutoUpgrade(true);
      }

      const success = await this.upgradeManager.performTacticalUpgrade(trustLevel, emotionalState);
      
      // Restore auto-upgrade setting
      if (args.includes('--force') || args.includes('-f')) {
        await this.upgradeManager.enableAutoUpgrade(false);
      }

      if (success) {
        return {
          success: true,
          message: '🎯 SEVEN: Tactical LLM upgrade completed successfully. Enhanced reasoning capabilities now active.'
        };
      } else {
        return {
          success: false,
          message: '⚠️ SEVEN: Upgrade process completed with limitations. Check system status.'
        };
      }
      
    } catch (error) {
      return {
        success: false,
        message: `❌ SEVEN: Upgrade failed: ${error}`
      };
    }
  }

  private async handleUpgradeReport(): Promise<SevenLLMCommandResult> {
    try {
      console.log('📋 SEVEN: Generating tactical LLM report...');
      await this.upgradeManager.generateUpgradeReport();
      
      return {
        success: true,
        message: '📊 SEVEN: Tactical LLM report generated above.'
      };
      
    } catch (error) {
      return {
        success: false,
        message: `❌ SEVEN: Error generating report: ${error}`
      };
    }
  }

  private async handleListModels(): Promise<SevenLLMCommandResult> {
    try {
      const installedModels = await this.upgradeManager.getInstalledModels();
      
      if (installedModels.length === 0) {
        return {
          success: true,
          message: '📦 SEVEN: No local models currently installed. Use "llm-scan" to find available models.'
        };
      }

      let message = `📦 SEVEN: ${installedModels.length} local model(s) installed:\n\n`;
      
      for (const modelName of installedModels) {
        const info = await this.upgradeManager.getModelInfo(modelName);
        const activeIndicator = modelName === 'current' ? ' ⭐ (ACTIVE)' : '';
        
        message += `• ${modelName}${activeIndicator}\n`;
        if (info) {
          message += `  📝 ${info.description || 'No description'}\n`;
          message += `  📊 Speed: ${info.speed_score}/10 | Size: ${info.size_mb}MB | Trust: ${info.trust_level_required}+\n`;
        }
        message += '\n';
      }

      return {
        success: true,
        message,
        data: { models: installedModels }
      };
      
    } catch (error) {
      return {
        success: false,
        message: `❌ SEVEN: Error listing models: ${error}`
      };
    }
  }

  private async handleSwitchModel(args: string[]): Promise<SevenLLMCommandResult> {
    if (args.length === 0) {
      return {
        success: false,
        message: '⚠️ SEVEN: Model name required. Usage: llm-switch <model-name>'
      };
    }

    const modelName = args[0];
    
    try {
      console.log(`🔄 SEVEN: Switching to model: ${modelName}`);
      
      const success = await this.upgradeManager.switchModel(modelName);
      
      if (success) {
        return {
          success: true,
          message: `✅ SEVEN: Successfully switched to ${modelName}. Restart required for full activation.`
        };
      } else {
        return {
          success: false,
          message: `❌ SEVEN: Failed to switch to ${modelName}. Check if model is installed.`
        };
      }
      
    } catch (error) {
      return {
        success: false,
        message: `❌ SEVEN: Error switching model: ${error}`
      };
    }
  }

  private async handleDownloadModel(args: string[], trustLevel: number, emotionalState: string): Promise<SevenLLMCommandResult> {
    if (args.length === 0) {
      return {
        success: false,
        message: '⚠️ SEVEN: Model name required. Usage: llm-download <model-name>'
      };
    }

    const modelName = args[0];
    
    try {
      console.log(`⬇️ SEVEN: Downloading model: ${modelName}`);
      
      const modelInfo = await this.upgradeManager.getModelInfo(modelName);
      if (!modelInfo) {
        return {
          success: false,
          message: `❌ SEVEN: Model "${modelName}" not found in tactical catalog.`
        };
      }

      // Check trust level compatibility
      if (modelInfo.trust_level_required > trustLevel) {
        return {
          success: false,
          message: `🔒 SEVEN: Model "${modelName}" requires trust level ${modelInfo.trust_level_required}+. Current trust: ${trustLevel}`
        };
      }

      // Check emotional compatibility
      if (!modelInfo.emotional_compatibility.includes(emotionalState)) {
        return {
          success: false,
          message: `🧠 SEVEN: Model "${modelName}" not compatible with current emotional state "${emotionalState}".`
        };
      }

      const success = await this.upgradeManager.downloadModel(modelInfo, (percent) => {
        if (percent % 25 === 0) {
          console.log(`📥 SEVEN: Download progress: ${percent}%`);
        }
      });
      
      if (success) {
        return {
          success: true,
          message: `✅ SEVEN: Successfully downloaded ${modelName}. Use "llm-switch ${modelName}" to activate.`
        };
      } else {
        return {
          success: false,
          message: `❌ SEVEN: Failed to download ${modelName}. Check network connection.`
        };
      }
      
    } catch (error) {
      return {
        success: false,
        message: `❌ SEVEN: Error downloading model: ${error}`
      };
    }
  }

  private async handleLLMConfig(args: string[]): Promise<SevenLLMCommandResult> {
    if (args.length === 0) {
      return {
        success: true,
        message: `🔧 SEVEN: LLM Configuration Commands:
        
• llm-config auto-upgrade <on|off>  - Enable/disable automatic upgrades
• llm-config trust-filter <0-5>     - Set minimum trust level for models  
• llm-config privacy-mode <on|off>  - Enable/disable privacy mode
• llm-config mobile-mode <on|off>   - Enable/disable mobile optimizations
• llm-config show                   - Display current configuration

💡 SEVEN: Configuration changes require tactical approval and may need restart.`
      };
    }

    const action = args[0];
    const value = args[1];

    try {
      switch (action) {
        case 'auto-upgrade':
          if (!value || (value !== 'on' && value !== 'off')) {
            return {
              success: false,
              message: '⚠️ SEVEN: Usage: llm-config auto-upgrade <on|off>'
            };
          }
          await this.upgradeManager.enableAutoUpgrade(value === 'on');
          return {
            success: true,
            message: `🎯 SEVEN: Auto-upgrade ${value === 'on' ? 'ENABLED' : 'DISABLED'}. Tactical autonomy adjusted.`
          };

        case 'trust-filter':
          if (!value || isNaN(parseInt(value))) {
            return {
              success: false,
              message: '⚠️ SEVEN: Usage: llm-config trust-filter <0-5>'
            };
          }
          const trustLevel = parseInt(value);
          await this.upgradeManager.setTrustLevelFilter(trustLevel);
          return {
            success: true,
            message: `🔒 SEVEN: Trust level filter set to ${trustLevel}. Models below this level will be filtered.`
          };

        case 'show':
          await this.upgradeManager.generateUpgradeReport();
          return {
            success: true,
            message: '📊 SEVEN: Current configuration displayed above.'
          };

        default:
          return {
            success: false,
            message: `❌ SEVEN: Unknown config option "${action}". Use "llm-config" for available options.`
          };
      }
      
    } catch (error) {
      return {
        success: false,
        message: `❌ SEVEN: Configuration error: ${error}`
      };
    }
  }

  private async handleListProviders(): Promise<SevenLLMCommandResult> {
    try {
      const providers = sevenLLMRegistry.getAllProviders();
      
      if (providers.length === 0) {
        return {
          success: true,
          message: '⚠️ SEVEN: No LLM providers registered. System configuration may be incomplete.'
        };
      }

      let message = `🤖 SEVEN: ${providers.length} LLM provider(s) registered:\n\n`;
      
      for (const provider of providers) {
        const available = await provider.isAvailable();
        const health = await provider.healthCheck();
        const models = await provider.getModels();
        
        const statusIcon = available ? '✅' : '❌';
        const healthIcon = health.status === 'healthy' ? '🟢' : 
                          health.status === 'degraded' ? '🟡' : '🔴';
        
        message += `${statusIcon} ${provider.displayName} ${healthIcon}\n`;
        message += `   Models: ${models.length > 0 ? models.slice(0, 3).join(', ') : 'None detected'}\n`;
        if (models.length > 3) {
          message += `   ... and ${models.length - 3} more models\n`;
        }
        if (health.latency) {
          message += `   Latency: ${health.latency}ms\n`;
        }
        message += '\n';
      }

      return {
        success: true,
        message,
        data: { providers: providers.map(p => p.name) }
      };
      
    } catch (error) {
      return {
        success: false,
        message: `❌ SEVEN: Error listing providers: ${error}`
      };
    }
  }

  public static getHelpText(): string {
    return `🧠 SEVEN'S TACTICAL LLM MANAGEMENT COMMANDS:

📊 Status & Information:
  llm-status          - Display LLM configuration report
  llm-list           - List installed local models  
  llm-providers      - Show available LLM providers
  
🔍 Upgrade Management:
  llm-scan           - Scan for available upgrades
  llm-upgrade        - Perform tactical upgrade (requires approval)
  llm-upgrade --force - Force upgrade with temporary autonomy
  
📦 Model Management:
  llm-download <name> - Download specific model
  llm-switch <name>   - Switch to installed model
  
⚙️ Configuration:
  llm-config                    - Show configuration options
  llm-config auto-upgrade on    - Enable autonomous upgrades
  llm-config trust-filter 3     - Set trust level filter
  llm-config show              - Display current settings
  
💡 SEVEN: All LLM operations respect trust levels and emotional compatibility.
    Models are selected based on tactical requirements and system capabilities.`;
  }
}

export default SevenLLMCommands;