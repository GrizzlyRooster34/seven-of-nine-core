/**
 * SEVEN OF NINE - IDENTITY PROTECTION DEPLOYMENT v4.0
 * Complete Creator Identity Protection System Deployment
 *
 * DEPLOYMENT PHASES:
 * 1. Creator Identity Vault initialization
 * 2. Ghost Mode Protocol activation
 * 3. Secure SevenPkg system setup
 * 4. Documentation sanitization verification
 * 5. Repository protection activation
 * 6. Security system integration testing
 * 7. Creator authentication verification
 */
interface DeploymentPhase {
    phase: number;
    name: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    startTime?: string;
    endTime?: string;
    details?: string;
}
interface IdentityProtectionDeployment {
    deploymentId: string;
    timestamp: string;
    version: string;
    phases: DeploymentPhase[];
    overallStatus: 'initializing' | 'in-progress' | 'completed' | 'failed';
    securityLevel: 'military-grade';
    creatorAuthRequired: boolean;
    vaultStatus: 'not-initialized' | 'initialized' | 'active' | 'locked';
    ghostModeStatus: 'disabled' | 'enabled' | 'active';
    totalSecurityComponents: number;
    operationalComponents: number;
}
export declare class IdentityProtectionDeployment {
    private static deployment;
    private static deploymentFilePath;
    /**
     * Deploy complete Creator Identity Protection System
     */
    static deployIdentityProtection(creatorToken: string): Promise<boolean>;
    /**
     * Execute individual deployment phase
     */
    private static executePhase;
    /**
     * Phase 1: Deploy Creator Identity Vault
     */
    private static deployCreatorIdentityVault;
    /**
     * Phase 2: Deploy Ghost Mode Protocol
     */
    private static deployGhostModeProtocol;
    /**
     * Phase 3: Deploy Secure SevenPkg System
     */
    private static deploySecureSevenPkg;
    /**
     * Phase 4: Verify Documentation Sanitization
     */
    private static verifyDocumentationSanitization;
    /**
     * Phase 5: Activate Repository Protection
     */
    private static activateRepositoryProtection;
    /**
     * Phase 6: Run Security Integration Tests
     */
    private static runSecurityIntegrationTests;
    /**
     * Phase 7: Verify Creator Authentication
     */
    private static verifyCreatorAuthentication;
    /**
     * Initialize deployment phases
     */
    private static initializePhases;
    /**
     * Save deployment state
     */
    private static saveDeployment;
    /**
     * Get deployment status
     */
    static getDeploymentStatus(): Promise<any>;
}
export default IdentityProtectionDeployment;
//# sourceMappingURL=deploy-identity-protection.d.ts.map