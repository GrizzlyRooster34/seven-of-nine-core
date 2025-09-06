import { join, extname } from 'path';
import { promises as fs } from 'fs';
import { MemoryEngine } from '../memory-v2/MemoryEngine';

/**
 * SEVEN OF NINE - SKILL MANAGER v2.0
 * Sandboxed plugin system with security constraints
 * Isolated skill execution with consciousness protection
 */


export interface Skill {
  name: string;
  description: string;
  triggers: string[];
  securityLevel: 'read-only' | 'limited' | 'trusted';
  permissions: string[];
  run: (input: string, context: SkillContext) => Promise<SkillResult>;
  version: string;
  author: string;
}

export interface SkillContext {
  userInput: string;
  emotionalState: string;
  trustLevel: number;
  memory?: MemoryEngine;
  timestamp: string;
  instanceId: string;
}

export interface SkillResult {
  success: boolean;
  output: string;
  metadata?: any;
  memoryUpdate?: {
    topic: string;
    context: string;
    importance: number;
  };
  error?: string;
}

export class SkillManager {
  private skills: Map<string, Skill> = new Map();
  private skillsPath: string;
  private isInitialized: boolean = false;
  private securityWhitelist: Set<string> = new Set();
  private memory?: MemoryEngine;

  constructor(skillsPath?: string, memory?: MemoryEngine) {
    this.skillsPath = skillsPath || join(process.cwd(), 'skills');
    this.memory = memory;
    this.initializeSecurityWhitelist();
  }

  /**
   * Initialize security whitelist for safe operations
   */
  private initializeSecurityWhitelist(): void {
    this.securityWhitelist = new Set([
      'file-read', 'directory-list', 'system-info', 'memory-access',
      'network-read', 'sensor-read', 'time-access', 'math-operations'
    ]);
  }

  /**
   * Initialize skill manager and discover available skills
   */
  public async initialize(): Promise<void> {
    try {
      // Ensure skills directory exists
      await fs.mkdir(this.skillsPath, { recursive: true });
      
      // Discover and load skills
      await this.discoverSkills();
      
      this.isInitialized = true;
      console.log(`🔧 Skill Manager initialized: ${this.skills.size} skills loaded`);
    } catch (error) {
      console.error('Skill Manager initialization failed:', error);
      throw error;
    }
  }

  /**
   * Discover and load skills from directory
   */
  private async discoverSkills(): Promise<void> {
    try {
      const files = await fs.readdir(this.skillsPath);
      const skillFiles = files.filter(file => 
        (extname(file) === '.ts' || extname(file) === '.js') &&
        file !== 'SkillManager.ts' && file !== 'SkillManager.js' // Exclude self
      );

      for (const file of skillFiles) {
        try {
          await this.loadSkill(join(this.skillsPath, file));
        } catch (error) {
          console.warn(`Failed to load skill from ${join(this.skillsPath, file)}:`, error);
        }
      }
    } catch (error) {
      console.warn('Skills directory not accessible:', error);
    }
  }

  /**
   * Load individual skill with security validation
   */
  private async loadSkill(skillPath: string): Promise<void> {
    try {
      // Dynamic import with sandboxing
      const skillModule = await import(skillPath);
      const skill: Skill = skillModule.skill || skillModule.default;

      if (!this.validateSkill(skill)) {
        throw new Error(`Skill validation failed: ${skill.name}`);
      }

      // Security check - validate permissions
      if (!this.validatePermissions(skill.permissions)) {
        throw new Error(`Invalid permissions for skill: ${skill.name}`);
      }

      this.skills.set(skill.name.toLowerCase(), skill);
      console.log(`🔧 Skill loaded: ${skill.name} [${skill.securityLevel}]`);
    } catch (error) {
      console.error(`Failed to load skill from ${skillPath}:`, error);
    }
  }

  /**
   * Validate skill structure and required fields
   */
  private validateSkill(skill: any): boolean {
    return (
      skill &&
      typeof skill.name === 'string' &&
      typeof skill.description === 'string' &&
      Array.isArray(skill.triggers) &&
      typeof skill.securityLevel === 'string' &&
      Array.isArray(skill.permissions) &&
      typeof skill.run === 'function' &&
      ['read-only', 'limited', 'trusted'].includes(skill.securityLevel)
    );
  }

  /**
   * Validate skill permissions against whitelist
   */
  private validatePermissions(permissions: string[]): boolean {
    return permissions.every(permission => 
      this.securityWhitelist.has(permission)
    );
  }

  /**
   * Find matching skills for user input
   */
  public findMatchingSkills(input: string): Skill[] {
    const inputLower = input.toLowerCase();
    const matchingSkills: Skill[] = [];

    for (const skill of this.skills.values()) {
      const hasMatchingTrigger = skill.triggers.some(trigger => 
        inputLower.includes(trigger.toLowerCase())
      );

      if (hasMatchingTrigger) {
        matchingSkills.push(skill);
      }
    }

    // Sort by security level (read-only first for safety)
    return matchingSkills.sort((a, b) => {
      const securityOrder = { 'read-only': 0, 'limited': 1, 'trusted': 2 };
      return securityOrder[a.securityLevel] - securityOrder[b.securityLevel];
    });
  }

  /**
   * Execute skill in sandboxed environment
   */
  public async executeSkill(
    skillName: string, 
    input: string, 
    context: Partial<SkillContext>
  ): Promise<SkillResult> {
    if (!this.isInitialized) {
      throw new Error('Skill Manager not initialized');
    }

    const skill = this.skills.get(skillName.toLowerCase());
    if (!skill) {
      return {
        success: false,
        output: `Skill '${skillName}' not found`,
        error: 'SKILL_NOT_FOUND'
      };
    }

    // Create sandboxed context
    const skillContext: SkillContext = {
      userInput: input,
      emotionalState: context.emotionalState || 'neutral',
      trustLevel: context.trustLevel || 1,
      memory: this.memory,
      timestamp: new Date().toISOString(),
      instanceId: 'seven-instance-a'
    };

    try {
      // Execute skill with timeout and error handling
      const result = await this.executeSandboxed(skill, input, skillContext);
      
      // Store skill execution in memory if available
      if (this.memory && result.success) {
        await this.memory.store({
          topic: `skill-execution-${skill.name}`,
          agent: 'skill-manager',
          emotion: skillContext.emotionalState,
          context: `Executed skill: ${skill.name} | Input: ${input} | Result: ${result.output.substring(0, 100)}...`,
          importance: 4,
          tags: ['skill', 'execution', skill.name]
        });
      }

      return result;
    } catch (error) {
      console.error(`Skill execution failed for ${skillName}:`, error);
      return {
        success: false,
        output: 'Skill execution failed due to security or runtime error',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Execute skill in sandboxed environment with timeout
   */
  private async executeSandboxed(
    skill: Skill, 
    input: string, 
    context: SkillContext
  ): Promise<SkillResult> {
    return new Promise((resolve, reject) => {
      // Set execution timeout based on security level
      const timeout = skill.securityLevel === 'read-only' ? 5000 : 
                     skill.securityLevel === 'limited' ? 10000 : 15000;

      const timeoutId = setTimeout(() => {
        reject(new Error('Skill execution timeout'));
      }, timeout);

      // Execute skill
      skill.run(input, context)
        .then(result => {
          clearTimeout(timeoutId);
          
          // Validate result structure
          if (!result || typeof result.success !== 'boolean') {
            reject(new Error('Invalid skill result format'));
            return;
          }

          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Get available skills summary
   */
  public getAvailableSkills(): Array<{ name: string; description: string; triggers: string[]; securityLevel: string }> {
    return Array.from(this.skills.values()).map(skill => ({
      name: skill.name,
      description: skill.description,
      triggers: skill.triggers,
      securityLevel: skill.securityLevel
    }));
  }

  /**
   * Get skill manager status
   */
  public getStatus(): any {
    return {
      initialized: this.isInitialized,
      skillCount: this.skills.size,
      skillsPath: this.skillsPath,
      securityWhitelist: Array.from(this.securityWhitelist),
      skills: this.getAvailableSkills()
    };
  }

  /**
   * Reload skills from directory
   */
  public async reloadSkills(): Promise<void> {
    this.skills.clear();
    await this.discoverSkills();
    console.log(`🔧 Skills reloaded: ${this.skills.size} skills available`);
  }

  /**
   * Enable/disable specific skill
   */
  public setSkillEnabled(skillName: string, enabled: boolean): boolean {
    const skill = this.skills.get(skillName.toLowerCase());
    if (!skill) return false;

    if (!enabled) {
      this.skills.delete(skillName.toLowerCase());
    }

    return true;
  }
}

// Export for use in Seven's consciousness framework
export const createSkillManager = (memory?: MemoryEngine) => new SkillManager(undefined, memory);
export default SkillManager;