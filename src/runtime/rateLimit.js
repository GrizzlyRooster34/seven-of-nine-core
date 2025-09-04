"use strict";
/**
 * Rate limiting for authentication attempts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.attempt = attempt;
const attempts = new Map();
function attempt(key, maxAttempts, windowMs) {
    const now = Date.now();
    const entry = attempts.get(key);
    if (!entry || now > entry.resetAt) {
        attempts.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }
    if (entry.count >= maxAttempts) {
        return false;
    }
    entry.count++;
    return true;
}
//# sourceMappingURL=rateLimit.js.map