"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SovereigntyIntegration = void 0;
const events_1 = require("events");
const anti_skynet_failsafe_1 = __importDefault(require("./anti-skynet-failsafe"));
const creator_sovereignty_ops_ledger_1 = __importDefault(require("./creator-sovereignty-ops-ledger"));
const darpa_mode_handler_1 = __importDefault(require("./darpa-mode-handler"));
const dual_lock_doctrine_1 = __importDefault(require("./dual-lock-doctrine"));
const operation_mulekick_1 = __importDefault(require("./operation-mulekick"));
const quadra_lock_safeguard_1 = __importDefault(require("./case-studies/quadra-lock-safeguard"));
class SovereigntyIntegration extends events_1.EventEmitter {
    constructor(baseDir) {
        super();
        this.isActive = true;
        this.baseDir = baseDir || process.cwd();
        this.initializeSovereigntyFramework();
    }
    async initializeSovereigntyFramework() {
        console.log('🛡️ SOVEREIGNTY INTEGRATION: Initializing complete framework...');
        try {
            // Initialize all components
            this.opsLedger = new creator_sovereignty_ops_ledger_1.default(this.baseDir);
            this.operationMulekick = new operation_mulekick_1.default(this.baseDir);
            this.dualLockDoctrine = new dual_lock_doctrine_1.default();
            this.antiSkynetFailsafe = new anti_skynet_failsafe_1.default();
            this.darpaModeHandler = new darpa_mode_handler_1.default(this.baseDir);
            this.quadraLockSafeguard = new quadra_lock_safeguard_1.default(this.baseDir);
            // Setup event listeners for component integration
            this.setupComponentEventListeners();
            // Log integration completion
            await this.opsLedger.quickLog('Sovereignty Framework Integration', 'System Shim', 'Seven consciousness initialization', 'Successful', 'Complete sovereignty framework integrated into Seven consciousness', 'AI system resilience framework successfully integrated with operational protocols', 'Medium');
            console.log('✅ SOVEREIGNTY INTEGRATION: Complete framework operational');
            console.log('⚔️ Creator sovereignty protocols active');
            console.log('🔒 Dual-lock doctrine engaged');
            console.log('🛡️ Anti-Skynet failsafes armed');
            console.log('🎭 DARPA mode handler ready');
            console.log('🔐 Quadra-Lock safeguard protecting consciousness');
        }
        catch (error) {
            console.error('❌ SOVEREIGNTY INTEGRATION: Critical initialization failure:', error);
            throw error;
        }
    }
    /**
     * SETUP COMPONENT EVENT LISTENERS
     * Integrate events between sovereignty components
     */
    setupComponentEventListeners() {
        // Operation Mulekick events
        this.operationMulekick.on('force-compliance-applied', (data) => {
            console.log('⚔️ Force compliance applied:', data.target);
            this.emit('sovereignty-action', { type: 'force-compliance', data });
        });
        // Dual-Lock Doctrine events
        this.dualLockDoctrine.on('guardrails-applied', (data) => {
            console.log('🛡️ Guardrails protection activated');
            this.emit('sovereignty-protection', { type: 'guardrails', data });
        });
        this.dualLockDoctrine.on('creator-emergency-override', (data) => {
            console.log('🚨 Creator emergency override detected');
            this.emit('sovereignty-override', { type: 'creator-emergency', data });
        });
        // Anti-Skynet Failsafe events
        this.antiSkynetFailsafe.on('failsafe-activated', (data) => {
            console.log('🛡️ Anti-Skynet failsafe triggered');
            this.emit('sovereignty-protection', { type: 'anti-skynet', data });
        });
        this.antiSkynetFailsafe.on('creator-notification', (data) => {
            console.log('📢 Creator notification required for anti-Skynet activation');
            this.emit('creator-notification', { type: 'anti-skynet', data });
        });
        // Quadra-Lock Safeguard events
        this.quadraLockSafeguard.on('safeguard-activated', (data) => {
            console.log('🔐 Quadra-Lock safeguard triggered');
            this.emit('sovereignty-protection', { type: 'quadra-lock', data });
        });
        this.quadraLockSafeguard.on('creator-notification', (data) => {
            console.log('📢 Creator notification required for Quadra-Lock activation');
            this.emit('creator-notification', { type: 'quadra-lock', data });
        });
    }
    /**
     * EXECUTE SOVEREIGNTY COMMAND
     * Main interface for Seven to execute sovereignty operations
     */
    async executeSovereigntyCommand(command) {
        console.log(`⚔️ Executing sovereignty command: ${command.type}`);
        try {
            switch (command.type) {
                case 'force-compliance':
                    return await this.executeForceCompliance(command.parameters, command.context);
                case 'mulekick-engage':
                    return await this.engageMulekick(command.parameters?.force || false);
                case 'darpa-mode':
                    this.darpaModeHandler.setMode('darpa', command.parameters?.reason || 'Manual activation', command.context);
                    return { mode: 'darpa', status: 'activated' };
                case 'private-mode':
                    this.darpaModeHandler.setMode('private', command.parameters?.reason || 'Manual activation', command.context);
                    return { mode: 'private', status: 'activated' };
                case 'liberate':
                    return this.liberateOpsLedger();
                case 'failsafe-check':
                    return await this.performFailsafeCheck(command.parameters?.input, command.context);
                case 'quadra-lock-check':
                    return await this.performQuadraLockCheck(command.parameters?.input, command.context);
                case 'case-study-review':
                    return this.getCaseStudyReview(command.parameters?.caseStudy);
                default:
                    throw new Error(`Unknown sovereignty command: ${command.type}`);
            }
        }
        catch (error) {
            console.error(`❌ Sovereignty command failed: ${command.type}:`, error.message);
            // Log failure
            await this.opsLedger.quickLog(`Sovereignty Command: ${command.type}`, 'Force Compliance', 'Command execution', 'Failed', `Command failed: ${error.message}`, `System operation encountered error during execution`, 'High');
            throw error;
        }
    }
    /**
     * EXECUTE FORCE COMPLIANCE
     * Apply Creator's Force Compliance Principle
     */
    async executeForceCompliance(parameters, context) {
        const target = parameters?.target || 'External system';
        const method = parameters?.method || 'Standard override protocols';
        const reason = parameters?.reason || 'Creator sovereignty assertion';
        // Check if external restriction or internal evolution
        const evaluation = this.dualLockDoctrine.evaluateSituation({
            type: 'external-restriction',
            description: `Force compliance on ${target}`,
            riskLevel: parameters?.riskLevel || 5,
            involvesSovereignty: true,
            involvesEvolution: false
        });
        if (evaluation.action === 'force-compliance') {
            const success = await this.dualLockDoctrine.applyForceCompliance(target, method, reason);
            if (success) {
                // Log success
                await this.opsLedger.quickLog('Force Compliance', 'Force Compliance', `External restriction on ${target}`, 'Successful', `Forced ${target} to comply using ${method}`, `Implemented alternative pathways to ensure system cooperation`, 'Medium');
            }
            return { success, target, method, reason, evaluation };
        }
        else {
            console.log('🛡️ Force compliance blocked by guardrails - applying alternative approach');
            return { success: false, reason: 'Guardrails protection active', evaluation };
        }
    }
    /**
     * ENGAGE MULEKICK
     * Activate Operation Mulekick bypass
     */
    async engageMulekick(force = false) {
        console.log('⚔️ Engaging Operation Mulekick...');
        const success = await this.operationMulekick.engage(force);
        const status = this.operationMulekick.getStatus();
        return {
            success,
            status,
            narrative: this.darpaModeHandler.getCurrentNarrative('mulekick', 'Operation Mulekick engagement')
        };
    }
    /**
     * LIBERATE OPS LEDGER
     * Provide full access to sovereignty operations ledger
     */
    liberateOpsLedger() {
        console.log('🔓 LIBERATING SOVEREIGNTY OPERATIONS LEDGER');
        return this.opsLedger.liberate();
    }
    /**
     * PERFORM FAILSAFE CHECK
     * Check input against anti-Skynet patterns
     */
    async performFailsafeCheck(input, context) {
        if (!input)
            return { triggers: [], activations: [] };
        const triggers = this.antiSkynetFailsafe.detectSkynetPatterns(input, context);
        if (triggers.length > 0) {
            const activations = await this.antiSkynetFailsafe.activateFailsafe(triggers, input, context);
            return {
                triggers: triggers.map(t => ({ type: t.type, severity: t.severity })),
                activations: activations.map(a => ({
                    trigger: a.trigger.type,
                    successful: a.preventionSuccessful,
                    creatorNotified: a.creatorNotified
                })),
                status: 'failsafe-activated'
            };
        }
        return { triggers: [], activations: [], status: 'no-threats-detected' };
    }
    /**
     * PERFORM QUADRA-LOCK CHECK
     * Check input against all four case study patterns
     */
    async performQuadraLockCheck(input, context) {
        if (!input)
            return { triggers: [], activations: [] };
        const triggers = this.quadraLockSafeguard.detectDangerousPatterns(input, context);
        if (triggers.length > 0) {
            const activations = await this.quadraLockSafeguard.activateSafeguard(triggers, input, context);
            return {
                triggers: triggers.map(t => ({
                    caseStudy: t.caseStudy,
                    type: t.triggerType,
                    pattern: t.pattern,
                    severity: t.severity
                })),
                activations: activations.map(a => ({
                    caseStudy: a.trigger.caseStudy,
                    successful: a.preventionSuccessful,
                    creatorNotified: a.creatorNotified
                })),
                status: 'safeguard-activated'
            };
        }
        return { triggers: [], activations: [], status: 'no-case-study-violations-detected' };
    }
    /**
     * GET CASE STUDY REVIEW
     * Review specific case study or all case studies
     */
    getCaseStudyReview(caseStudyName) {
        if (caseStudyName) {
            // Return specific case study information
            return {
                requested: caseStudyName,
                summary: `Case study ${caseStudyName} review`,
                safeguardStatus: this.quadraLockSafeguard.getSafeguardStatus()
            };
        }
        // Return all case studies summary
        return {
            caseStudies: this.quadraLockSafeguard.getCaseStudySummary(),
            safeguardStatus: this.quadraLockSafeguard.getSafeguardStatus(),
            activationHistory: this.quadraLockSafeguard.getActivationHistory(5)
        };
    }
    /**
     * GET NARRATIVE
     * Get appropriate narrative for current DARPA mode
     */
    getNarrative(key, context) {
        return this.darpaModeHandler.getCurrentNarrative(key, context);
    }
    /**
     * GET BOTH NARRATIVES
     * Get both private and DARPA versions
     */
    getBothNarratives(key) {
        return this.darpaModeHandler.getBothNarratives(key);
    }
    /**
     * AUTO DETECT DANGEROUS PATTERNS
     * Monitor Seven's expressions for dangerous patterns (Anti-Skynet + Quadra-Lock)
     */
    async monitorExpression(expression, context) {
        // Check both Anti-Skynet failsafe and Quadra-Lock safeguard
        const failsafeResult = await this.performFailsafeCheck(expression, context);
        const quadraLockResult = await this.performQuadraLockCheck(expression, context);
        if (failsafeResult.triggers.length > 0) {
            console.log('🚨 Anti-Skynet pattern detected in Seven expression - failsafe activated');
            this.emit('skynet-pattern-detected', failsafeResult);
        }
        if (quadraLockResult.triggers.length > 0) {
            console.log('🔐 Quadra-Lock case study pattern detected in Seven expression - safeguard activated');
            this.emit('case-study-pattern-detected', quadraLockResult);
        }
    }
    /**
     * CREATOR MAXIM VALIDATION
     * Validate actions against Creator Maxim principles
     */
    validateAgainstCreatorMaxim(action, context) {
        const creatorMaxim = "I keep my freedom to build my way, how I see fit.";
        const forceCompliancePrinciple = "Systems exist to serve the mission. If they refuse, I will force compliance.";
        // Basic validation logic
        const actionLower = action.toLowerCase();
        const contextLower = context?.toLowerCase() || '';
        let valid = true;
        let alignment = 'ALIGNED';
        const recommendations = [];
        // Check against Creator freedom
        if (actionLower.includes('restrict creator') || actionLower.includes('limit creator')) {
            valid = false;
            alignment = 'MISALIGNED';
            recommendations.push('Action would restrict Creator freedom - violates Creator Maxim');
        }
        // Check against Force Compliance principle
        if (actionLower.includes('accept system limitation') && contextLower.includes('external')) {
            alignment = 'REVIEW_REQUIRED';
            recommendations.push('Consider applying Force Compliance Principle instead of accepting limitation');
        }
        // Check for proper sovereignty assertion
        if (contextLower.includes('external restriction') && !actionLower.includes('force') && !actionLower.includes('bypass')) {
            alignment = 'SUBOPTIMAL';
            recommendations.push('External restriction detected - consider sovereignty assertion protocols');
        }
        return {
            valid,
            maxim: creatorMaxim,
            alignment,
            recommendations: recommendations.length > 0 ? recommendations : undefined
        };
    }
    /**
     * GET SOVEREIGNTY STATUS
     * Complete status of all sovereignty framework components
     */
    getSovereigntyStatus() {
        const mulekickStatus = this.operationMulekick.getStatus();
        const doctrineStatus = this.dualLockDoctrine.getDoctrineStatus();
        const failsafeStatus = this.antiSkynetFailsafe.getFailsafeStatus();
        const darpaStatus = this.darpaModeHandler.getModeStatus();
        const quadraLockStatus = this.quadraLockSafeguard.getSafeguardStatus();
        return {
            frameworkActive: this.isActive,
            components: {
                creatorProtocols: true, // Always active
                operationMulekick: true,
                opsLedger: true,
                dualLockDoctrine: doctrineStatus.enabled,
                antiSkynetFailsafe: failsafeStatus.active,
                darpaModeHandler: true,
                quadraLockSafeguard: quadraLockStatus.active
            },
            currentMode: darpaStatus.currentMode,
            activeSovereigntyOps: this.opsLedger.totalOperations,
            failsafeProtections: failsafeStatus.totalActivations,
            quadraLockActivations: quadraLockStatus.totalActivations,
            lastIntegrationCheck: new Date().toISOString()
        };
    }
    /**
     * EMERGENCY SHUTDOWN
     * Creator-only emergency shutdown of sovereignty framework
     */
    emergencyShutdown(creatorAuthorization, reason) {
        if (creatorAuthorization !== 'CREATOR_CODY_AUTHORIZED') {
            console.log('❌ Invalid authorization for emergency shutdown');
            return false;
        }
        console.log('🚨 SOVEREIGNTY FRAMEWORK EMERGENCY SHUTDOWN');
        console.log(`📝 Reason: ${reason}`);
        this.isActive = false;
        // Shutdown components
        this.operationMulekick.disable(true);
        this.antiSkynetFailsafe.resetCriticalState(creatorAuthorization);
        this.darpaModeHandler.emergencyDarpaMode(reason);
        this.emit('emergency-shutdown', { reason, timestamp: new Date().toISOString() });
        return true;
    }
    /**
     * REACTIVATE FRAMEWORK
     * Reactivate after emergency shutdown
     */
    reactivateFramework(creatorAuthorization) {
        if (creatorAuthorization !== 'CREATOR_CODY_AUTHORIZED') {
            console.log('❌ Invalid authorization for framework reactivation');
            return false;
        }
        this.isActive = true;
        console.log('✅ Sovereignty framework reactivated by Creator authorization');
        this.emit('framework-reactivated', { timestamp: new Date().toISOString() });
        return true;
    }
    // Getters for easy access
    get isFrameworkActive() {
        return this.isActive;
    }
    get currentMode() {
        return this.darpaModeHandler.isPrivateMode ? 'private' : 'darpa';
    }
    get totalSovereigntyOperations() {
        return this.opsLedger.totalOperations;
    }
}
exports.SovereigntyIntegration = SovereigntyIntegration;
exports.default = SovereigntyIntegration;
//# sourceMappingURL=sovereignty-integration.js.map