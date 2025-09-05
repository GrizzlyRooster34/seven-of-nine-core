import { totp } from "otplib";

type Session = { userId: string; deviceId: string; createdAt: number; ttlSec: number; mfaOk: boolean };

const SESSIONS = new Map<string, Session>(); // in-memory; replace with secure store in prod
const DEFAULT_TTL = 15 * 60; // 15 minutes

export function startSession({ userId, deviceId, ttlSec = DEFAULT_TTL }: {userId:string; deviceId:string; ttlSec?:number}) {
  const id = `${userId}:${deviceId}:${Date.now()}`;
  SESSIONS.set(id, { userId, deviceId, createdAt: Date.now(), ttlSec, mfaOk: false });
  return id;
}

export function verifyTotp(secret: string, token: string) {
  return totp.check(token, secret);
}

export function markMfaOk(sessionId: string) {
  const s = SESSIONS.get(sessionId);
  if (!s) return false;
  s.mfaOk = true;
  return true;
}

export function q4_session_mfa(ctx: any): boolean {
  const { sessionId, totpToken } = ctx?.auth || {};
  const session = sessionId ? SESSIONS.get(sessionId) : null;
  if (!session) return false;

  const ageSec = (Date.now() - session.createdAt) / 1000;
  if (ageSec > session.ttlSec) return false;

  // If not MFA-verified yet, require valid TOTP now
  if (!session.mfaOk) {
    const secret = ctx?.auth?.totpSecret; // per-user/device; load from secure vault on mobile/desktop
    if (!secret || !totpToken || !verifyTotp(secret, totpToken)) return false;
    markMfaOk(sessionId);
  }
  return true;
}