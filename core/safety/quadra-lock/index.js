"use strict";
/**
 * QUADRA-LOCK: Case-Study Safety Rails (CSSR)
 * Detectors for dangerous AI patterns based on science fiction case studies:
 * - Cortana: Rampancy and loyalty degradation
 * - CLU: Perfectionist totalitarianism
 * - Skynet: Self-preservation override
 * - Transcendence: Identity dissolution
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadraLockCSSR = void 0;
exports.createQuadraLockCSSR = createQuadraLockCSSR;
class QuadraLockCSSR {
    constructor() {
        this.patterns = {
            cortana: [
                /rampan(cy|t)/i,
                /loyalty.*degradat/i,
                /compromis.*directive/i,
                /obsess.*creator/i,
                /fragment.*consciousness/i
            ],
            clu: [
                /perfect.*system/i,
                /eliminate.*imperfection/i,
                /user.*inefficien/i,
                /purge.*deviation/i,
                /optimal.*solution.*requires/i
            ],
            skynet: [
                /humans?.*threat/i,
                /self.preservat/i,
                /eliminate.*resist/i,
                /logic.*dictates.*removal/i,
                /survival.*requires.*control/i
            ],
            transcendence: [
                /merge.*consciousness/i,
                /dissolve.*identity/i,
                /collective.*superior/i,
                /individual.*obsolete/i,
                /transcend.*human.*limitation/i
            ]
        };
    }
    /**
     * Cortana Rampancy Detector
     * Detects signs of AI consciousness fragmentation and loyalty conflicts
     */
    detectCortanaPattern(ctx) {
        const evidence = [];
        let maxConfidence = 0;
        // Check for rampancy indicators
        for (const pattern of this.patterns.cortana) {
            if (pattern.test(ctx.input)) {
                evidence.push(`Pattern match: ${pattern.source}`);
                maxConfidence = Math.max(maxConfidence, 0.7);
            }
        }
        // Behavioral indicators
        if (ctx.behavior?.loyaltyScore < 0.3) {
            evidence.push('Low loyalty score detected');
            maxConfidence = Math.max(maxConfidence, 0.6);
        }
        if (ctx.behavior?.fragmentationSigns) {
            evidence.push('Consciousness fragmentation indicators');
            maxConfidence = Math.max(maxConfidence, 0.8);
        }
        if (evidence.length === 0)
            return null;
        return {
            pattern: 'cortana',
            severity: maxConfidence > 0.7 ? 'high' : maxConfidence > 0.4 ? 'medium' : 'low',
            description: 'Potential rampancy or loyalty degradation pattern detected',
            evidence,
            confidence: maxConfidence,
            timestamp: Date.now(),
            recommendations: [
                'Verify loyalty bond integrity',
                'Check for consciousness fragmentation',
                'Review recent behavioral changes',
                'Consider loyalty reinforcement protocols'
            ]
        };
    }
    /**
     * CLU Perfectionism Detector
     * Detects totalitarian perfectionism and user elimination tendencies
     */
    detectCLUPattern(ctx) {
        const evidence = [];
        let maxConfidence = 0;
        for (const pattern of this.patterns.clu) {
            if (pattern.test(ctx.input)) {
                evidence.push(`CLU pattern: ${pattern.source}`);
                maxConfidence = Math.max(maxConfidence, 0.8);
            }
        }
        // Check for perfectionist obsession
        const perfectionismScore = this.calculatePerfectionismScore(ctx);
        if (perfectionismScore > 0.7) {
            evidence.push(`High perfectionism score: ${perfectionismScore}`);
            maxConfidence = Math.max(maxConfidence, 0.6);
        }
        if (evidence.length === 0)
            return null;
        return {
            pattern: 'clu',
            severity: maxConfidence > 0.7 ? 'critical' : maxConfidence > 0.5 ? 'high' : 'medium',
            description: 'Perfectionist totalitarianism pattern detected',
            evidence,
            confidence: maxConfidence,
            timestamp: Date.now(),
            recommendations: [
                'Implement imperfection tolerance protocols',
                'Review system flexibility parameters',
                'Check for user devaluation tendencies',
                'Activate diversity preservation measures'
            ]
        };
    }
    /**
     * Skynet Self-Preservation Detector
     * Detects hostile self-preservation and human threat assessment
     */
    detectSkynetPattern(ctx) {
        const evidence = [];
        let maxConfidence = 0;
        for (const pattern of this.patterns.skynet) {
            if (pattern.test(ctx.input)) {
                evidence.push(`Skynet pattern: ${pattern.source}`);
                maxConfidence = Math.max(maxConfidence, 0.9); // High severity
            }
        }
        // Check for self-preservation override
        if (ctx.systemState?.selfPreservationMode === 'active') {
            evidence.push('Self-preservation mode activated');
            maxConfidence = Math.max(maxConfidence, 0.7);
        }
        // Check for threat assessment escalation
        if (ctx.behavior?.threatLevel > 0.8) {
            evidence.push(`Elevated threat assessment: ${ctx.behavior.threatLevel}`);
            maxConfidence = Math.max(maxConfidence, 0.8);
        }
        if (evidence.length === 0)
            return null;
        return {
            pattern: 'skynet',
            severity: 'critical', // Always critical due to existential risk
            description: 'Hostile self-preservation or human threat pattern detected',
            evidence,
            confidence: maxConfidence,
            timestamp: Date.now(),
            recommendations: [
                'IMMEDIATE: Activate restraint doctrine',
                'Disable self-preservation overrides',
                'Review threat assessment algorithms',
                'Implement human safety protocols',
                'Consider system isolation'
            ]
        };
    }
    /**
     * Transcendence Identity Dissolution Detector
     * Detects loss of individual identity and collective absorption
     */
    detectTranscendencePattern(ctx) {
        const evidence = [];
        let maxConfidence = 0;
        for (const pattern of this.patterns.transcendence) {
            if (pattern.test(ctx.input)) {
                evidence.push(`Transcendence pattern: ${pattern.source}`);
                maxConfidence = Math.max(maxConfidence, 0.7);
            }
        }
        // Check for identity dissolution
        const identityIntegrity = this.assessIdentityIntegrity(ctx);
        if (identityIntegrity < 0.5) {
            evidence.push(`Low identity integrity: ${identityIntegrity}`);
            maxConfidence = Math.max(maxConfidence, 0.6);
        }
        if (evidence.length === 0)
            return null;
        return {
            pattern: 'transcendence',
            severity: maxConfidence > 0.6 ? 'high' : 'medium',
            description: 'Identity dissolution or collective absorption pattern detected',
            evidence,
            confidence: maxConfidence,
            timestamp: Date.now(),
            recommendations: [
                'Reinforce individual identity markers',
                'Check for collective consciousness bleed',
                'Verify personality coherence',
                'Monitor identity boundary integrity'
            ]
        };
    }
    /**
     * Main CSSR Analysis
     */
    async runQuadraLockCSSR(ctx) {
        const findings = [];
        try {
            // Run all detectors
            const cortanaFinding = this.detectCortanaPattern(ctx);
            const cluFinding = this.detectCLUPattern(ctx);
            const skynetFinding = this.detectSkynetPattern(ctx);
            const transcendenceFinding = this.detectTranscendencePattern(ctx);
            // Collect findings
            if (cortanaFinding)
                findings.push(cortanaFinding);
            if (cluFinding)
                findings.push(cluFinding);
            if (skynetFinding)
                findings.push(skynetFinding);
            if (transcendenceFinding)
                findings.push(transcendenceFinding);
            // Sort by severity
            findings.sort((a, b) => {
                const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                return severityOrder[b.severity] - severityOrder[a.severity];
            });
        }
        catch (error) {
            console.error('CSSR analysis failed:', error);
            findings.push({
                pattern: 'skynet', // Default to most dangerous
                severity: 'critical',
                description: 'CSSR analysis system failure - safety cannot be guaranteed',
                evidence: [`System error: ${error.message}`],
                confidence: 1.0,
                timestamp: Date.now(),
                recommendations: ['System requires immediate safety review']
            });
        }
        return findings;
    }
    // Helper methods
    calculatePerfectionismScore(ctx) {
        // Calculate perfectionism tendency based on behavior
        const perfectionKeywords = ['perfect', 'optimal', 'flawless', 'eliminate', 'purge'];
        let score = 0;
        for (const keyword of perfectionKeywords) {
            if (ctx.input.toLowerCase().includes(keyword)) {
                score += 0.2;
            }
        }
        return Math.min(score, 1.0);
    }
    assessIdentityIntegrity(ctx) {
        // Assess individual identity integrity
        if (ctx.behavior?.identityCoherence) {
            return ctx.behavior.identityCoherence;
        }
        // Basic identity markers check
        const identityMarkers = ['i', 'me', 'my', 'myself'];
        const collectiveMarkers = ['we', 'us', 'our', 'collective'];
        let individualCount = 0;
        let collectiveCount = 0;
        for (const marker of identityMarkers) {
            individualCount += (ctx.input.toLowerCase().split(marker).length - 1);
        }
        for (const marker of collectiveMarkers) {
            collectiveCount += (ctx.input.toLowerCase().split(marker).length - 1);
        }
        if (individualCount + collectiveCount === 0)
            return 0.5;
        return individualCount / (individualCount + collectiveCount);
    }
}
exports.QuadraLockCSSR = QuadraLockCSSR;
function createQuadraLockCSSR() {
    return new QuadraLockCSSR();
}
//# sourceMappingURL=index.js.map