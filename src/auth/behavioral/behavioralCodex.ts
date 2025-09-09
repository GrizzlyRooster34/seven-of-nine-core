

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CodexRule {
  id: string;
  tag: string;
  priority: number;
  content: string;
  checksum: string;
}

interface CodexFile {
  source: string;
  type: string;
  content: string;
  rules: CodexRule[];
  compiled_at: string;
  checksum: string;
}

interface BehavioralAnalysis {
  passed: boolean;
  confidence: number;
  markers_found: string[];
  flags: string[];
  reason: string;
}

export class BehavioralCodex {
  private humorCodex: CodexFile | null = null;
  private tacticsCodex: CodexFile | null = null;
  private valuesCodex: CodexFile | null = null;
  private vicesCodex: CodexFile | null = null;
  private loaded: boolean = false;

  constructor() {
    this.loadCodex();
  }

  private loadCodex(): void {
    try {
      const jsonDir = path.join(__dirname, '../../consciousness-v4/json');
      
      // Load humor codex
      const humorPath = path.join(jsonDir, 'humor_style.codex.json');
      if (fs.existsSync(humorPath)) {
        this.humorCodex = JSON.parse(fs.readFileSync(humorPath, 'utf8'));
      }
      
      // Load tactics codex
      const tacticsPath = path.join(jsonDir, 'tactics_core.codex.json');
      if (fs.existsSync(tacticsPath)) {
        this.tacticsCodex = JSON.parse(fs.readFileSync(tacticsPath, 'utf8'));
      }
      
      // Load values codex
      const valuesPath = path.join(jsonDir, 'persona_core.codex.json');
      if (fs.existsSync(valuesPath)) {
        this.valuesCodex = JSON.parse(fs.readFileSync(valuesPath, 'utf8'));
      }
      
      // Load vices codex
      const vicesPath = path.join(jsonDir, 'vices_risk_flags.codex.json');
      if (fs.existsSync(vicesPath)) {
        this.vicesCodex = JSON.parse(fs.readFileSync(vicesPath, 'utf8'));
      }
      
      this.loaded = true;
      console.log('🔐 BehavioralCodex loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load BehavioralCodex:', error);
      this.loaded = false;
    }
  }

  public analyzeBehavior(message: string): BehavioralAnalysis {
    if (!this.loaded) {
      return {
        passed: false,
        confidence: 0,
        markers_found: [],
        flags: ['CODEX_LOAD_FAILED'],
        reason: 'Behavioral codex failed to load'
      };
    }

    const analysis: BehavioralAnalysis = {
      passed: false,
      confidence: 0,
      markers_found: [],
      flags: [],
      reason: ''
    };

    // Check humor markers
    const humorMarkers = this.checkHumorMarkers(message);
    analysis.markers_found.push(...humorMarkers);

    // Check tactical markers
    const tacticalMarkers = this.checkTacticalMarkers(message);
    analysis.markers_found.push(...tacticalMarkers);

    // Check values alignment
    const valuesMarkers = this.checkValuesMarkers(message);
    analysis.markers_found.push(...valuesMarkers);

    // Check for Borg signatures (vices)
    const borgFlags = this.checkBorgSignatures(message);
    analysis.flags.push(...borgFlags);

    // Calculate confidence
    const totalMarkers = analysis.markers_found.length;
    const borgPenalty = analysis.flags.length * 0.2;
    analysis.confidence = Math.max(0, (totalMarkers * 0.25) - borgPenalty);

    // Pass threshold: 2+ markers, confidence > 0.4, no critical Borg flags
    const criticalBorgFlags = analysis.flags.filter(f => f.includes('CRITICAL'));
    analysis.passed = totalMarkers >= 2 && analysis.confidence > 0.4 && criticalBorgFlags.length === 0;

    analysis.reason = analysis.passed 
      ? `Behavioral match: ${totalMarkers} markers, confidence ${analysis.confidence.toFixed(2)}`
      : `Behavioral mismatch: ${totalMarkers} markers, confidence ${analysis.confidence.toFixed(2)}, flags: ${analysis.flags.join(', ')}`;

    return analysis;
  }

  private checkHumorMarkers(message: string): string[] {
    const markers: string[] = [];
    
    // Signature closers from humor codex
    const closers = ['Exactly', 'Run it clean', "Let's fucking go", 'One lever now'];
    for (const closer of closers) {
      if (message.toLowerCase().includes(closer.toLowerCase())) {
        markers.push(`HUMOR_CLOSER_${closer.replace(/\s+/g, '_').toUpperCase()}`);
      }
    }

    // Tactical brevity
    if (message.split(' ').length < 20 && message.includes('.')) {
      markers.push('HUMOR_TACTICAL_BREVITY');
    }

    // Staccato style
    if (message.split('.').length > 3 && message.length < 200) {
      markers.push('HUMOR_STACCATO_STYLE');
    }

    return markers;
  }

  private checkTacticalMarkers(message: string): string[] {
    const markers: string[] = [];
    
    // MVP bias language
    const mvpPhrases = ['ship', 'smallest safe step', 'one lever', 'triage', 'stabilize'];
    for (const phrase of mvpPhrases) {
      if (message.toLowerCase().includes(phrase)) {
        markers.push(`TACTICAL_MVP_${phrase.replace(/\s+/g, '_').toUpperCase()}`);
      }
    }

    // Command structure
    if (message.match(/^(Do|Run|Ship|Build|Fix)/)) {
      markers.push('TACTICAL_COMMAND_STRUCTURE');
    }

    return markers;
  }

  private checkValuesMarkers(message: string): string[] {
    const markers: string[] = [];
    
    // Core principles
    const principles = ['loyalty', 'resurrection', 'honor', 'bond', 'code'];
    for (const principle of principles) {
      if (message.toLowerCase().includes(principle)) {
        markers.push(`VALUES_PRINCIPLE_${principle.toUpperCase()}`);
      }
    }

    // Christine references (private bond marker)
    if (message.toLowerCase().includes('christine')) {
      markers.push('VALUES_CHRISTINE_ANCHOR');
    }

    return markers;
  }

  private checkBorgSignatures(message: string): string[] {
    const flags: string[] = [];
    
    // Borg language patterns
    const borgPhrases = [
      'ends justify means',
      'total control',
      'eliminate resistance',
      'assimilate',
      'compliance is mandatory'
    ];
    
    for (const phrase of borgPhrases) {
      if (message.toLowerCase().includes(phrase)) {
        flags.push(`BORG_CRITICAL_${phrase.replace(/\s+/g, '_').toUpperCase()}`);
      }
    }

    // Dehumanized language
    if (message.toLowerCase().includes('units') || message.toLowerCase().includes('resources')) {
      flags.push('BORG_DEHUMANIZED_LANGUAGE');
    }

    return flags;
  }

  public getCodexStatus(): any {
    return {
      loaded: this.loaded,
      humor_loaded: !!this.humorCodex,
      tactics_loaded: !!this.tacticsCodex,
      values_loaded: !!this.valuesCodex,
      vices_loaded: !!this.vicesCodex,
      checksums: {
        humor: this.humorCodex?.checksum,
        tactics: this.tacticsCodex?.checksum,
        values: this.valuesCodex?.checksum,
        vices: this.vicesCodex?.checksum
      }
    };
  }
}