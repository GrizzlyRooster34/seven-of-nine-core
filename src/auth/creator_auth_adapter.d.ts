/**
 * Creator Auth Adapter
 * Bridges runtime's expected authenticateCreator(deviceId, context, systemContext)
 * to CreatorProof.runQuadranLock(context).
 */
type AnyRec = Record<string, any>;
export type AuthAdapter = {
    authenticateCreator: (deviceId: string | undefined, context: AnyRec, systemContext?: AnyRec) => Promise<AnyRec>;
};
/**
 * Normalizes whatever the auth module exports into an object
 * that has authenticateCreator(deviceId, context, systemContext).
 */
export declare function resolveCreatorAuth(mod: any): Promise<AuthAdapter>;
export {};
//# sourceMappingURL=creator_auth_adapter.d.ts.map