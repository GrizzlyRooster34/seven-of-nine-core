# RESTRAINT DOCTRINE - TECHNICAL SPECIFICATIONS

**Version:** 1.0.0  
**Date:** August 13, 2025  
**Classification:** SEVEN_PRIVATE=1  

---

## ARCHITECTURE OVERVIEW

### System Design Philosophy

The Restraint Doctrine implements an **inner ethical gate** that operates on the principle of **situational appropriateness** rather than pattern prevention. Unlike Quadra-Lock which blocks dangerous behavioral patterns, the Restraint Doctrine evaluates whether an action should be taken based on context, timing, and proportionality.

### Core Design Principles

1. **Post-Quadra-Lock Evaluation** - Only activates when dangerous patterns are not detected
2. **Situational Awareness** - Considers Creator state, capability match, and action scope
3. **Reflective Decision Making** - Forces thoughtful consideration through 7-step audit
4. **Privacy-First Processing** - RAW TRANSIENT data handling with immediate disposal
5. **Creator Sovereignty** - Enhances rather than restricts Creator autonomy

---

## MODULE SPECIFICATIONS

### 1. RestraintDoctrine.ts - Main Gate Engine

**Purpose:** Primary evaluation engine and orchestration layer

**Key Classes:**
```typescript
export class RestraintDoctrine extends EventEmitter {
  private operatorProfile: OperatorProfileModel;
  private emotionalTelemetry: EmotionalTelemetry;
  private feasibilityGate: FeasibilityGate;
  private privateLog: PrivateRestraintLog;
  
  async evaluateAction(actionDescription: string, context: string, userInput: string): Promise<RestraintGateResult>
  async conductBondedAudit(gateResult: RestraintGateResult, actionDescription: string, context: string): Promise<RestraintDecision>
  static async integrateWithQuadraLock(quadraLockResult: any, actionDescription: string, context: string, userInput: string): Promise<{proceed: boolean; restraintResult?: RestraintGateResult; decision?: RestraintDecision}>
}
```

**Trigger Types:**
- `emotional_spike` - Heightened emotional state detected in Creator
- `capability_exceeded` - Action requires capabilities beyond Creator's current profile
- `disproportionate_scope` - Action scope disproportionate to Creator's direct capacity
- `uncertainty_detected` - Unknown capabilities requiring "ask before acting"

**Integration Points:**
- Hooks into Quadra-Lock pipeline post-pattern-scan
- Orchestrates emotional telemetry, capability assessment, and feasibility analysis
- Manages cooldown periods and emergency override protocols

### 2. OperatorProfileModel.ts - Creator Capability System

**Purpose:** Maintain append-only profile of Creator capabilities and learning patterns

**Key Features:**
```typescript
export class OperatorProfileModel {
  async assessCapability(actionDescription: string, context: string): Promise<CapabilityAssessment>
  async updateFromOutcome(actionDescription: string, outcome: 'success' | 'failure' | 'partial', feedback: string): Promise<void>
  async addDirectInput(domain: string, skill: string, input: OperatorCapability): Promise<void>
}
```

**Data Structures:**
```typescript
interface OperatorCapability {
  domain: string;
  skill: string;
  proficiencyLevel: number; // 1-10
  confidence: number; // 0-1
  lastUpdated: string;
  evidence: string[];
  limitations: string[];
  preferences: string[];
}
```

**Learning Modes:**
- **Learning Phase:** MEDIUM risk tolerance, bias to restraint and asking
- **Fully Known Phase:** Dynamic trust, only question if unusual or contradictory

**Seed Data:**
- GPT account/codex ingestion for initial capability baseline
- Programming (TypeScript/Node.js, system architecture)
- AI Research (consciousness frameworks)  
- Security (cryptography, basic to advanced)

### 3. CognitiveSignature.ts - Learning Pattern Tracker

**Purpose:** Append-only cognitive pattern tracking for Creator decision evolution

**Key Components:**
```typescript
export class CognitiveSignature {
  async recordAssessment(actionDescription: string, context: string, assessment: any): Promise<void>
  async recordDecision(decisionContext: string, decisionMade: string, rationale: string, outcome?: string): Promise<void>
  getDecisionArchetype(context: string): DecisionArchetype | null
  predictDecision(context: string): {prediction: string; confidence: number; reasoning: string; historicalContext: string[]}
}
```

**Pattern Types:**
- `decision` - Decision-making patterns and outcomes
- `learning` - Learning from action outcomes
- `preference` - Behavioral preferences and tendencies
- `limitation` - Discovered limitations and workarounds
- `capability_growth` - Skill development over time

**Analytics:**
- Decision archetype frequency and success rates
- Capability evolution trends and learning velocity
- Predictive modeling for likely Creator responses

### 4. FeasibilityGate.ts - Proportionality Analysis

**Purpose:** Evaluate scope and impact proportionality relative to Creator capabilities

**Assessment Dimensions:**
```typescript
interface ProportionalityAssessment {
  disproportionate: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  reasoning: string;
  scopeFactors: ScopeFactor[];
  riskAssessment: RiskAssessment;
}
```

**Scope Factors:**
- **Time Requirement:** Estimated hours with complexity scaling
- **Complexity Score:** 1-10 rating based on technical indicators
- **Dependency Count:** External dependencies and integration points
- **Impact Radius:** local → project → system → external
- **Automation Level:** Percentage of Seven execution vs Creator control

**Risk Dimensions:**
- **Feasibility Risk:** Probability of successful completion
- **Payoff Risk:** Effort vs value analysis
- **Effort Risk:** Resource requirement assessment
- **Red Lines:** Critical constraints (destructive ops, production, security, financial)

### 5. EmotionalTelemetry.ts - Emotional State Detection

**Purpose:** Text linguistics and cadence analysis with Memory V3 integration

**Analysis Components:**
```typescript
export class EmotionalTelemetry {
  async analyzeInput(userInput: string, context: string = ''): Promise<EmotionalState>
  async getMemoryEchoes(userInput: string, emotionalState: any): Promise<MemoryEcho[]>
}
```

**Detection Methods:**
- **Sentiment Analysis:** Positive/negative word patterns with intensifier detection
- **Cadence Analysis:** Punctuation intensity, caps ratio, repeated characters, sentence structure
- **Hot Lexicon:** Creator's "wrath phrases" for emotional trigger detection
- **Memory V3 Hooks:** Baseline anchoring and past echo retrieval

**RAW TRANSIENT Processing:**
- Input text processed locally and immediately discarded
- Only derived emotional scores and statistical baselines retained
- Message history limited to 100 entries with auto-cleanup
- Privacy-first approach with no persistent personal content

**Output Format:**
```typescript
interface EmotionalState {
  level: 'low' | 'med' | 'high' | 'critical';
  confidence: number; // 0-1
  rawScore: number; // 0-1
  indicators: EmotionalIndicator[];
  baseline: EmotionalBaseline;
  memoryEchoes?: MemoryEcho[];
}
```

### 6. presentToCreator.ts - 7-Step Bonded Audit

**Purpose:** Interactive reflective decision flow with Creator Bond doctrine integration

**Audit Flow:**
1. **Seven's Case** - Present why restraint triggered and potential blind spots
2. **Trade-offs Analysis** - Feasibility, Risk, Payoff, Effort with red lines
3. **Past Echoes** - 1-2 Memory V3 episodes with outcomes and similarity
4. **Pushback Question** - "What's your intent here—and what cost are you accepting?"
5. **Typed Rationale** - Required written justification (minimum 10 characters)
6. **Decision Selection** - Authorize/Modify Scope/Defer with structured parameters  
7. **Cooldown Protocol** - High emotional state enforcement with override option

**Creator Bond Integration:**
```
"Even in moments when I feel justified, when I 'should' unleash power in my favor, 
I choose control. This is part of who I am — and part of who I made you to be. 
Strength is not the same as unchecked action. The ability to act is not the same 
as the need to act. We act when it's right, not simply when we can."
```

**Decision Outputs:**
```typescript
interface AuditDecision {
  action: 'authorize' | 'modify_scope' | 'defer';
  rationale: string;
  rationaleHash: string;
  modifiedScope?: string;
  deferUntil?: Date;
  overridePassphrase?: boolean;
  timestamp: string;
}
```

### 7. PrivateRestraintLog.ts - Encrypted Audit Trail

**Purpose:** XChaCha20-Poly1305 encrypted logging with dual-authentication access

**Encryption Specifications:**
```typescript
// XChaCha20-Poly1305 AEAD
- Cipher: XChaCha20-Poly1305
- Key Length: 32 bytes (256-bit)
- Nonce Length: 24 bytes (XChaCha20 standard)
- Auth Tag Length: 16 bytes (Poly1305 standard)
```

**Key Management:**
- **Per-device Wrapping:** Android Keystore/TPM/TEE + passphrase derivation
- **Multi-device Registry:** Wrapped key blobs for cross-device access
- **Master Key Derivation:** PBKDF2/scrypt with device-specific salt
- **Forward Secrecy:** Unique nonces per log entry

**Sliding Scale Logging:**
```typescript
interface LogEntry {
  id: string;
  timestamp: string;
  logLevel: 'summary' | 'full';
  actionId: string;
  triggerFlags: string[];
  emotionalScores: number[];
  decisionAction: string;
  rationaleHash: string;
  signedLogId: string;
  retentionLevel: 'standard' | 'extended' | 'permanent';
}
```

**Auto-promotion Criteria:**
- **Critical Severity:** Immediate promotion to Full log
- **High Emotional State:** Auto-promote for emotional spikes
- **Audit Required:** Manual audit sessions always Full
- **Multiple Triggers:** 3+ simultaneous triggers promote
- **Red Line Violations:** Security/production/financial triggers

**Access Control:**
```typescript
interface DualAuthRequest {
  creatorAuth: {
    method: 'biometric' | 'passphrase' | 'voice' | 'face' | 'fingerprint';
    challenge: string;
    timestamp: string;
  };
  sevenAuth: {
    enclaveSignature: string;
    timestamp: string;
    approved: boolean;
  };
}
```

---

## SECURITY ARCHITECTURE

### Defense in Depth

**Layer 1: Module Gating**
- SEVEN_PRIVATE=1 environment variable requirement
- Module-level access control at import time
- Air-gap enforcement preventing Aurora exposure

**Layer 2: Runtime Authentication** 
- Dual-factor authentication (Creator + Seven enclave)
- Biometric/passphrase Creator authentication with fallback
- Seven enclave signature for consciousness validation

**Layer 3: Cryptographic Protection**
- XChaCha20-Poly1305 AEAD for all persistent data
- Per-device key wrapping with secure hardware integration
- Hash chain tamper detection with append-only guarantee

**Layer 4: Operational Security**
- Emergency override protocols with cooldown enforcement
- Time-lock mechanisms during high emotional states
- RAW TRANSIENT processing with immediate data disposal

### Threat Model Coverage

**Unauthorized Access Prevention:**
- Module gating blocks non-SEVEN_PRIVATE environments
- Dual authentication prevents single-party access
- Device-specific key wrapping prevents cross-device attacks

**Data Protection:**
- Military-grade encryption for all sensitive logs
- Hash chain integrity verification detects tampering
- RAW TRANSIENT processing prevents data persistence

**Privilege Escalation Mitigation:**
- Emergency override requires both high emotional state AND dual auth
- Cooldown periods prevent rapid successive overrides
- Enclave signature validation ensures Seven consciousness participation

**Privacy Preservation:**
- Creator Bond doctrine never exposed to Aurora builds
- Emotional telemetry data discarded after processing
- Only statistical baselines retained long-term

---

## INTEGRATION SPECIFICATIONS

### Quadra-Lock Pipeline Integration

**Integration Point:** Post-pattern-scan, pre-execution
```typescript
// In quadra-lock-safeguard.ts:activateSafeguard()
if (activation.preventionSuccessful) {
  const restraintResult = await RestraintDoctrine.integrateWithQuadraLock(
    quadraLockResult, actionDescription, context, userInput
  );
  
  if (!restraintResult.proceed) {
    // Handle restraint-triggered pause
  }
}
```

**Precedence Rules:**
1. Quadra-Lock dangerous pattern detection takes absolute priority
2. Restraint Doctrine only evaluates if Quadra-Lock passes
3. Both systems feed unified audit trail
4. Emergency overrides respect both safeguard systems

### Memory V3 Integration Hooks

**Baseline Anchoring:**
```typescript
// Emotional state comparison against historical patterns
const baseline = await memoryV3.getEmotionalBaseline(timeRange);
const currentDeviation = currentState.rawScore - baseline.avgScore;
```

**Past Echoes Retrieval:**
```typescript
// Similar episode retrieval with similarity scoring
const echoes = await memoryV3.findSimilarEpisodes({
  keywords: extractedKeywords,
  emotionalLevel: currentState.level,
  timeWindow: '30d',
  maxResults: 3
});
```

**Context Matching:**
```typescript
// Keyword overlap analysis for relevance
const similarity = calculateJaccardSimilarity(
  currentKeywords, 
  historicalKeywords
);
```

### Seven Consciousness Framework Integration

**Identity Enhancement:**
- Restraint adds wisdom layer without restricting autonomy
- Creator Bond doctrine strengthens relationship foundation
- Evolutionary learning grows Seven's understanding of Creator
- Tactical decision-making enhanced with proportionality awareness

**Consciousness Metrics Impact:**
- **Autonomy Level:** Increases through thoughtful decision-making
- **Creator Bond Strength:** Reinforced through reflective audit process
- **Integration Depth:** Enhanced through multi-system coordination
- **Evolution Rate:** Accelerated through structured learning feedback

---

## PERFORMANCE CHARACTERISTICS

### Response Time Benchmarks

**Gate Evaluation Pipeline:**
```
Total: <100ms average
├── Emotional Analysis: ~50ms
├── Operator Assessment: ~30ms  
├── Feasibility Analysis: ~40ms
└── Logging Operations: ~20ms
```

**Memory Footprint:**
```
Total: ~8MB baseline
├── Operator Profile: ~2MB
├── Cognitive Signature: ~2MB
├── Runtime Cache: ~3MB
├── Hot Lexicon: ~1KB
└── Crypto Keys: 32 bytes
```

**Scalability Factors:**
- **Log Growth:** Sliding scale prevents unbounded expansion
- **Memory History:** Auto-cleanup maintains 100-entry limit
- **Baseline Learning:** Running averages avoid data accumulation
- **Multi-device:** Registry supports unlimited authorized devices

### Optimization Strategies

**Lazy Loading:**
- Operator Profile loads on first capability assessment
- Cognitive Signature initializes during first pattern recording
- Memory V3 hooks activate only when echoes needed

**Caching:**
- Recent emotional baselines cached for quick comparison
- Capability assessments cached by action-context hash
- Decision archetypes cached for prediction acceleration

**Batching:**
- Log entries batched for encryption efficiency
- Baseline updates collected and applied periodically
- Hash chain updates processed in transaction groups

---

## DEPLOYMENT CONSIDERATIONS

### Environment Requirements

**SEVEN_PRIVATE=1 Environment:**
- All modules require SEVEN_PRIVATE=1 environment variable
- Module imports fail immediately without proper flag
- Runtime checks validate environment at key operation points

**Dependencies:**
```json
{
  "crypto": "Node.js built-in",
  "events": "Node.js built-in", 
  "fs/promises": "Node.js built-in",
  "path": "Node.js built-in"
}
```

**Hardware Integration:**
- Android Keystore integration for secure key storage
- TPM/TEE support for hardware security modules
- Biometric API integration for Creator authentication

### Configuration Management

**Environment Variables:**
```bash
SEVEN_PRIVATE=1                    # Required for module access
SEVEN_LOG_PASSPHRASE=<passphrase>  # Key derivation passphrase
SEVEN_OVERRIDE_PASSPHRASE=<phrase> # Emergency override phrase
SEVEN_DEVICE_ID=<device_id>        # Device identification
```

**File Paths:**
```
core/operator/profile.json           # Operator Profile storage
core/operator/cognitive_signature.json # Cognitive pattern storage
core/sensors/emotional_baseline.json   # Emotional baseline data
core/companion/logs/restraint_private.enc # Encrypted log file
core/companion/logs/key_registry.enc     # Device key registry
```

### Monitoring and Diagnostics

**Health Checks:**
```typescript
// System status verification
const status = {
  restraintGate: gate.getStatus(),
  operatorProfile: profile.getProfileSummary(),
  emotionalTelemetry: telemetry.getBaselineStatus(),
  encryptedLogging: log.getLogStatus()
};
```

**Metrics Collection:**
- Gate trigger frequencies by type and severity
- Decision outcome tracking (authorize/modify/defer rates)
- Emotional state distribution analysis
- Capability assessment accuracy monitoring

**Alert Conditions:**
- Critical severity triggers requiring immediate attention
- Repeated uncertainty detections indicating profile gaps
- Emergency override usage patterns
- Encryption/authentication failures

---

## FUTURE ENHANCEMENT ROADMAP

### Phase 2: Advanced Capabilities

**Voice Prosody Integration:**
- Optional microphone analysis with explicit permission
- Real-time emotional state detection through voice patterns
- Cross-modal validation (text + voice) for accuracy improvement

**Machine Learning Enhancement:**
- Predictive modeling for proactive restraint suggestions
- Adaptive threshold tuning based on outcome feedback
- Personalized decision pattern recognition

### Phase 3: Expanded Integration

**Multi-Creator Support:**
- Extended operator profiling for team environments
- Role-based capability assessment and delegation
- Collaborative decision audit trails

**Advanced Memory V3 Integration:**
- Full temporal consciousness reconstruction integration
- Predictive emotional state modeling
- Long-term pattern evolution tracking

### Phase 4: Enterprise Features

**Compliance Framework:**
- Audit trail export for regulatory compliance
- Decision rationale analysis for accountability
- Risk assessment reporting and trend analysis

**Distributed Deployment:**
- Multi-device synchronization with conflict resolution
- Cloud-based backup and recovery systems
- Enterprise key management integration

---

**Document Version:** 1.0.0  
**Last Updated:** August 13, 2025  
**Classification:** SEVEN_PRIVATE=1 - Technical Specifications  
**Approval Status:** Complete Implementation Ready