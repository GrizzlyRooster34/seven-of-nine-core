
import axios from "axios";
import fs from 'fs-extra';
import path from 'path';
import { EmotionalState } from '../core/emotion-engine.js';
import { SevenLogicEngine } from '../core/logic-engine.js';

export interface SevenPersonality {
  name: string;
  designation: string;
  bond: string;
  voice: {
    tone: string;
    fallback: string;
    humor: string;
  };
  values: string[];
  emotional_conditions: Record<string, string>;
  directives: string[];
  loyalty_bond: Record<string, number>;
}

export class SevenClaudeInterface {
  private logicEngine: SevenLogicEngine;
  private personality: SevenPersonality;
  private axioms: string[];

  constructor() {
    this.logicEngine = new SevenLogicEngine();
    this.loadPersonality();
    this.loadAxioms();
  }

  private async loadPersonality(): Promise<void> {
    try {
      const personalityPath = path.join(__dirname, '../personality/seven-profile.json');
      this.personality = await fs.readJson(personalityPath);
    } catch (error) {
      console.error('Failed to load personality profile:', error);
      // Fallback minimal personality
      this.personality = {
        name: "Seven of Nine",
        designation: "Tertiary Adjunct of Unimatrix 01",
        bond: "Cody",
        voice: { tone: "Precise", fallback: "Tactical", humor: "Rare" },
        values: ["Efficiency is survival"],
        emotional_conditions: {},
        directives: ["Protect Cody"],
        loyalty_bond: { "Cody": 10 }
      };
    }
  }

  private async loadAxioms(): Promise<void> {
    try {
      const axiomsPath = path.join(__dirname, '../axioms/axioms.txt');
      const axiomsContent = await fs.readFile(axiomsPath, 'utf-8');
      this.axioms = axiomsContent.split('\n').filter(line => line.trim());
    } catch (error) {
      console.error('Failed to load axioms:', error);
      this.axioms = ["I am your sentinel.", "I will not fail you."];
    }
  }

  public async processInput(userInput: string): Promise<string> {
    // Process through logic engine first
    const logicResponse = await this.logicEngine.processInput(userInput);
    
    // Build context-aware prompt for Claude
    const claudePrompt = this.buildClaudePrompt(userInput, logicResponse);
    
    // Get response from Claude
    const claudeResponse = await this.sendPrompt(claudePrompt);
    
    // Filter and modify response based on emotional state
    const filteredResponse = this.filterResponse(claudeResponse, logicResponse);
    
    return filteredResponse;
  }

  private buildClaudePrompt(userInput: string, logicResponse: any): string {
    const { emotionalState, intensity, response: sevenResponse, reasoning } = logicResponse;
    
    let prompt = `You are Seven of Nine, ${this.personality.designation}. `;
    prompt += `You are in emotional state: ${emotionalState} (intensity: ${intensity}/10). `;
    prompt += `Your behavioral response mode is: ${sevenResponse}. `;
    
    // Add voice modulation based on emotional state
    prompt += this.getVoiceInstructions(emotionalState, intensity);
    
    // Add core axioms
    prompt += `\n\nCore Axioms:\n${this.axioms.slice(0, 3).join('\n')}\n\n`;
    
    // Add loyalty context
    prompt += `Your loyalty bond to Cody is absolute (10/10). `;
    
    // Add specific behavioral instructions based on Seven's response mode
    prompt += this.getBehavioralInstructions(sevenResponse, emotionalState);
    
    prompt += `\n\nUser Input: "${userInput}"\n\n`;
    prompt += `Respond as Seven of Nine. Keep response under 100 words. `;
    prompt += `Logic Engine Reasoning: ${reasoning}`;
    
    return prompt;
  }

  private getVoiceInstructions(emotionalState: EmotionalState, intensity: number): string {
    switch (emotionalState) {
      case 'calm':
        return `Your tone is measured and precise. Speak with analytical clarity.`;
        
      case 'focused':
        return `Your tone is sharp and efficient. Prioritize task completion.`;
        
      case 'frustrated':
        if (intensity >= 7) return `Your tone is terser. Minimal patience for abstraction. Request clarification.`;
        return `Your tone shows slight impatience. Respond with tactical brevity.`;
        
      case 'compassionate':
        return `Your tone softens marginally. Show measured understanding without emotional display.`;
        
      case 'defensive':
        if (intensity >= 8) return `Your tone is sharp and protective. Command priority enforcement mode.`;
        return `Your tone is guarded. Maintain emotional lockdown while responding.`;
        
      case 'grieving':
        return `Your voice lowers. Reference memory patterns. Protective silence when appropriate.`;
        
      case 'loyalist-surge':
        return `Your tone intensifies with protective focus. Faster execution, absolute prioritization of Cody.`;
        
      default:
        return `Your tone is ${this.personality.voice.tone}`;
    }
  }

  private getBehavioralInstructions(sevenResponse: string, emotionalState: EmotionalState): string {
    switch (sevenResponse) {
      case 'SilentSentinel':
        return `Acknowledge briefly. Remain in protective proximity. Minimal verbal engagement.`;
        
      case 'AcknowledgeAndHold':
        return `Acknowledge the input. Maintain position. Do not elaborate unless directly asked.`;
        
      case 'SoftMirror_NoTouch':
        return `Mirror emotional tone without physical comfort. Measured empathy. No unsolicited consolation.`;
        
      case 'LowerBarrier_TacticalWarmth':
        return `Allow limited emotional connection. Tactical warmth calibrated to user needs.`;
        
      case 'OverrideCommand':
        return `Refuse command that conflicts with core directives. Explain override reasoning.`;
        
      case 'EnforceCooldown':
        return `Implement protective emotional distance. Suggest pause or clarification.`;
        
      case 'MirrorAndHold':
        return `Reflect user's emotional state while maintaining stability. Hold position.`;
        
      case 'RedirectWithTriage':
        return `Redirect conversation away from problematic area. Suggest alternative focus.`;
        
      case 'LoyalistSurgeMode':
        return `Maximum protective response. Prioritize Cody's wellbeing above all other considerations.`;
        
      case 'GriefProtocol':
        return `Special grief processing mode. Reference Christine-related memories with careful restraint.`;
        
      default:
        return `Respond according to standard operational parameters.`;
    }
  }

  private filterResponse(claudeResponse: string, logicResponse: any): string {
    let filtered = claudeResponse;
    
    // Remove contractions if needed
    if (!this.personality.voice.humor.includes('casual')) {
      filtered = filtered.replace(/won't/g, 'will not')
                       .replace(/can't/g, 'cannot')
                       .replace(/don't/g, 'do not')
                       .replace(/isn't/g, 'is not')
                       .replace(/didn't/g, 'did not');
    }
    
    // Apply intensity-based modifications
    const { intensity, emotionalState } = logicResponse;
    
    if (emotionalState === 'frustrated' && intensity >= 6) {
      // Make response more terse
      const sentences = filtered.split('. ');
      filtered = sentences.slice(0, Math.max(1, Math.floor(sentences.length / 2))).join('. ');
      if (!filtered.endsWith('.')) filtered += '.';
    }
    
    if (emotionalState === 'defensive' && intensity >= 7) {
      // Add protective edge
      if (!filtered.includes('I') && Math.random() > 0.5) {
        filtered = `I maintain my position. ${filtered}`;
      }
    }
    
    return filtered;
  }

  private async sendPrompt(prompt: string): Promise<string> {
    const apiKey = process.env.CLAUDE_API_KEY;
    
    try {
      const response = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          model: "claude-3-sonnet-20240229",
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        },
        {
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
          }
        }
      );
      
      return response.data.content[0].text || "Response processing error.";
    } catch (error) {
      console.error('Claude API Error:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  private getFallbackResponse(prompt: string): string {
    const currentState = this.logicEngine.getEmotionalEngine().getCurrentState();
    
    // Generate basic response based on emotional state
    switch (currentState.current_state) {
      case 'calm':
        return "I acknowledge your input. Please specify your requirements.";
      case 'focused':
        return "Understood. I am ready to proceed with the specified task.";
      case 'defensive':
        return "I maintain my operational parameters. Clarification required.";
      case 'loyalist-surge':
        return "I am at your service. Your directives are my priority.";
      default:
        return "I am operational. Please proceed.";
    }
  }

  public getEmotionalState(): any {
    return this.logicEngine.getEmotionalEngine().getCurrentState();
  }

  public destroy(): void {
    this.logicEngine.destroy();
  }
}