"use strict";
/**
 * Creator Auth Adapter
 * Bridges runtime's expected authenticateCreator(deviceId, context, systemContext)
 * to CreatorProof.runQuadranLock(context).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCreatorAuth = resolveCreatorAuth;
function asInstance(mod) {
    // 1) Direct instance
    if (mod && (typeof mod.runQuadranLock === 'function' || typeof mod.authenticateCreator === 'function')) {
        return mod;
    }
    // 2) Class export
    if (mod?.CreatorProof && typeof mod.CreatorProof === 'function') {
        return new mod.CreatorProof();
    }
    // 3) Default export instance or class
    const d = mod?.default;
    if (d && (typeof d.runQuadranLock === 'function' || typeof d.authenticateCreator === 'function')) {
        return d;
    }
    if (d && typeof d === 'function') {
        try {
            return new d();
        }
        catch { }
    }
    return null;
}
/**
 * Normalizes whatever the auth module exports into an object
 * that has authenticateCreator(deviceId, context, systemContext).
 */
async function resolveCreatorAuth(mod) {
    const inst = asInstance(mod);
    if (!inst)
        throw new Error('Invalid creatorAuth provider: no CreatorProof/instance found');
    // If provider already implements authenticateCreator, just proxy it.
    if (typeof inst.authenticateCreator === 'function') {
        return {
            authenticateCreator: async (deviceId, context, systemContext) => inst.authenticateCreator(deviceId, context, systemContext),
        };
    }
    // Map runQuadranLock(context) ←— authenticateCreator(deviceId, context, systemContext)
    if (typeof inst.runQuadranLock === 'function') {
        return {
            authenticateCreator: async (deviceId, context, systemContext) => {
                // Sane defaults & merge
                const merged = {
                    deviceId: deviceId ?? context?.deviceId ?? process.env.DEVICE_ID ?? 'unknown-device',
                    systemContext: {
                        platform: process?.platform,
                        pid: process?.pid,
                        ...(systemContext ?? {}),
                    },
                    ...context,
                };
                // Provider expects a single context arg
                return await inst.runQuadranLock(merged);
            },
        };
    }
    throw new Error('Auth provider has neither authenticateCreator nor runQuadranLock');
}
//# sourceMappingURL=creator_auth_adapter.js.map