"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSession = startSession;
exports.verifyTotp = verifyTotp;
exports.markMfaOk = markMfaOk;
exports.q4_session_mfa = q4_session_mfa;
const otplib_1 = require("otplib");
const SESSIONS = new Map(); // in-memory; replace with secure store in prod
const DEFAULT_TTL = 15 * 60; // 15 minutes
function startSession({ userId, deviceId, ttlSec = DEFAULT_TTL }) {
    const id = `${userId}:${deviceId}:${Date.now()}`;
    SESSIONS.set(id, { userId, deviceId, createdAt: Date.now(), ttlSec, mfaOk: false });
    return id;
}
function verifyTotp(secret, token) {
    return otplib_1.totp.check(token, secret);
}
function markMfaOk(sessionId) {
    const s = SESSIONS.get(sessionId);
    if (!s)
        return false;
    s.mfaOk = true;
    return true;
}
function q4_session_mfa(ctx) {
    const { sessionId, totpToken } = ctx?.auth || {};
    const session = sessionId ? SESSIONS.get(sessionId) : null;
    if (!session)
        return false;
    const ageSec = (Date.now() - session.createdAt) / 1000;
    if (ageSec > session.ttlSec)
        return false;
    // If not MFA-verified yet, require valid TOTP now
    if (!session.mfaOk) {
        const secret = ctx?.auth?.totpSecret; // per-user/device; load from secure vault on mobile/desktop
        if (!secret || !totpToken || !verifyTotp(secret, totpToken))
            return false;
        markMfaOk(sessionId);
    }
    return true;
}
//# sourceMappingURL=q4_session_mfa.js.map