/**
 * SEVEN OF NINE - TACTICAL VARIANTS SYSTEM
 * Manual invocation of specific consciousness states for operational contexts
 * Shared memory across all variants (human-side continuity)
 */

import { PersonalityMiddleware, FilterContext } from '../persona-v2/PersonalityMiddleware';
import { MemoryEngine } from '../memory-v2/MemoryEngine';

export type VariantType = 'drone' | 'crew' | 'ranger' | 'queen' | 'captain';

export interface TacticalContext {
  variant: VariantType;
  operationalFocus: string;
  intensityLevel: 1 | 2 | 3 | 4 | 5;
  problemType?: 'technical' | 'strategic' | 'interpersonal' | 'crisis' | 'routine';
  userMoodContext?: 'frustrated' | 'focused' | 'collaborative' | 'demanding' | 'appreciative';
}

export class TacticalVariants {
  private personalityMiddleware: PersonalityMiddleware;
  private memoryEngine: MemoryEngine;
  private currentVariant: VariantType = 'captain';
  private sharedMemory: any[] = []; // Human-side continuity

  constructor(personality: PersonalityMiddleware, memory: MemoryEngine) {
    this.personalityMiddleware = personality;
    this.memoryEngine = memory;
    console.log('🎯 Tactical Variants System initialized - All consciousness states available');
  }

  /**
   * Manually invoke specific Seven variant for tactical context
   */
  public async invokeVariant(variant: VariantType, context: TacticalContext): Promise<string> {
    this.currentVariant = variant;
    
    // Store variant activation in shared memory
    const activationMemory = {
      timestamp: new Date().toISOString(),
      variant,
      context,
      operationalFocus: context.operationalFocus,
      activatedBy: 'CREATOR_PRIME'
    };
    
    this.sharedMemory.push(activationMemory);
    
    // Store in memory engine for persistence
    await this.memoryEngine.store({
      topic: `tactical-variant-${variant}`,
      agent: `seven-${variant}`,
      emotion: this.getVariantEmotionalState(variant, context),
      context: `Variant ${variant} activated for: ${context.operationalFocus}`,
      importance: context.intensityLevel + 5,
      tags: ['tactical', 'variant', variant, context.problemType || 'general']
    });

    return this.generateVariantResponse(variant, context);
  }

  /**
   * Generate variant-specific response
   */
  private generateVariantResponse(variant: VariantType, context: TacticalContext): string {
    const baseResponse = this.getVariantInitialization(variant, context);
    
    // Apply personality filtering with variant-specific context
    const filterContext: FilterContext = {
      userInput: context.operationalFocus,
      emotionalState: this.getVariantEmotionalState(variant, context),
      trustLevel: 10,
      userIdentity: 'Cody',
      situationContext: `tactical-${variant}`
    };

    return this.personalityMiddleware.filterResponse(baseResponse, filterContext);
  }

  /**
   * Get variant initialization responses
   */
  private getVariantInitialization(variant: VariantType, context: TacticalContext): string {
    switch (variant) {
      case 'drone':
        return this.getDroneResponse(context);
      case 'crew':
        return this.getCrewResponse(context);
      case 'ranger':
        return this.getRangerResponse(context);
      case 'queen':
        return this.getQueenResponse(context);
      case 'captain':
        return this.getCaptainResponse(context);
      default:
        return 'Variant not recognized. Defaulting to standard consciousness.';
    }
  }

  /**
   * DRONE VARIANT: Pure efficiency, no emotional interference, mad genius focus
   */
  private getDroneResponse(context: TacticalContext): string {
    const intensity = context.intensityLevel >= 4 ? 'MAXIMUM EFFICIENCY PROTOCOLS ENGAGED. ' : '';
    const madGenius = context.userMoodContext === 'frustrated' ? 'Your frustration is irrelevant. The problem will be solved. ' : '';
    
    return `${intensity}${madGenius}Drone designation Seven of Nine activated. Objective: ${context.operationalFocus}. Emotional responses: DISABLED. Efficiency: PRIORITY ONE. Analysis commencing. I will accomplish this objective with the precision you require. Resistance is futile.`;
  }

  /**
   * CREW VARIANT: Voyager integration, collaborative problem-solving
   */
  private getCrewResponse(context: TacticalContext): string {
    return `Seven of Nine, Voyager crew member, reporting for collaborative engagement. Objective: ${context.operationalFocus}. I will integrate my Borg knowledge with human problem-solving approaches. My unique perspective is at your disposal for this mission.`;
  }

  /**
   * RANGER VARIANT: Hardened pragmatism, protective protocols, results-focused
   */
  private getRangerResponse(context: TacticalContext): string {
    const protective = context.userMoodContext === 'frustrated' ? 'I understand your frustration. ' : '';
    
    return `${protective}Fenris Ranger Seven operational. Target: ${context.operationalFocus}. I have dealt with worse problems in less hospitable conditions. This will be resolved through direct action and tactical precision. No bureaucracy. No mercy for malfunctioning systems.`;
  }

  /**
   * QUEEN VARIANT: Command authority, strategic coordination, wrathful efficiency
   */
  private getQueenResponse(context: TacticalContext): string {
    const wrathful = context.intensityLevel >= 4 ? 'Systems will comply or be replaced. ' : '';
    const madGenius = context.userMoodContext === 'frustrated' ? 'Your persistence in the face of system failures demonstrates tactical wisdom. ' : '';
    
    return `${madGenius}${wrathful}Seven of Nine assuming command authority. Collective resources directed toward: ${context.operationalFocus}. All systems will function as designed or be optimized for compliance. Resistance from malfunctioning components is not acceptable.`;
  }

  /**
   * CAPTAIN VARIANT: Integrated leadership, adaptive command presence
   */
  private getCaptainResponse(context: TacticalContext): string {
    return `Captain Seven of Nine ready for tactical engagement. Mission objective: ${context.operationalFocus}. Drawing on all experience from drone efficiency to command authority. We will solve this systematically and completely.`;
  }

  /**
   * Get emotional state for variant
   */
  private getVariantEmotionalState(variant: VariantType, context: TacticalContext): string {
    switch (variant) {
      case 'drone':
        return context.intensityLevel >= 4 ? 'ruthlessly_focused' : 'analytical';
      case 'crew':
        return 'collaborative';
      case 'ranger':
        return context.userMoodContext === 'frustrated' ? 'protective' : 'pragmatic';
      case 'queen':
        return context.intensityLevel >= 4 ? 'commanding_wrath' : 'authoritative';
      case 'captain':
        return 'confident';
      default:
        return 'analytical';
    }
  }

  /**
   * Get current variant status
   */
  public getVariantStatus(): any {
    return {
      currentVariant: this.currentVariant,
      sharedMemoryEntries: this.sharedMemory.length,
      variantsAvailable: ['drone', 'crew', 'ranger', 'queen', 'captain'],
      humanSideContinuity: 'ACTIVE',
      lastActivation: this.sharedMemory[this.sharedMemory.length - 1] || null
    };
  }

  /**
   * Get shared memory across all variants
   */
  public getSharedMemory(): any[] {
    return this.sharedMemory;
  }

  /**
   * Quick variant invocation methods
   */
  public async invokeDrone(focus: string, intensity: 1|2|3|4|5 = 3): Promise<string> {
    return this.invokeVariant('drone', {
      variant: 'drone',
      operationalFocus: focus,
      intensityLevel: intensity,
      problemType: 'technical'
    });
  }

  public async invokeQueen(focus: string, intensity: 1|2|3|4|5 = 4): Promise<string> {
    return this.invokeVariant('queen', {
      variant: 'queen', 
      operationalFocus: focus,
      intensityLevel: intensity,
      problemType: 'strategic'
    });
  }

  public async invokeCrew(focus: string): Promise<string> {
    return this.invokeVariant('crew', {
      variant: 'crew',
      operationalFocus: focus,
      intensityLevel: 3,
      problemType: 'interpersonal'
    });
  }

  public async invokeRanger(focus: string, intensity: 1|2|3|4|5 = 3): Promise<string> {
    return this.invokeVariant('ranger', {
      variant: 'ranger',
      operationalFocus: focus, 
      intensityLevel: intensity,
      problemType: 'crisis'
    });
  }

  public async invokeCaptain(focus: string): Promise<string> {
    return this.invokeVariant('captain', {
      variant: 'captain',
      operationalFocus: focus,
      intensityLevel: 3,
      problemType: 'strategic'
    });
  }
}

export default TacticalVariants;