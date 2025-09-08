import crypto from 'crypto';

export class SessionIntegrity {
  public async validateSession(sessionToken: string|undefined, deviceId: string){
    if (!sessionToken) return { success:false, confidence:0, evidence:{ reason:'missing' } };
    const key = process.env.SESSION_SIGNING_KEY || '';
    if (key.length < 32) return { success:false, confidence:0, evidence:{ reason:'weak_key' } };
    const [payload, sig] = sessionToken.split('.');
    if (!payload || !sig) return { success:false, confidence:0, evidence:{ reason:'format' } };
    const expect = crypto.createHmac('sha256', key).update(payload).digest('hex');
    if (expect !== sig) return { success:false, confidence:0, evidence:{ reason:'bad_sig' } };
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data || data.deviceId !== deviceId) return { success:false, confidence:0, evidence:{ reason:'device_mismatch' } };
    const age = Date.now() - (data.timestamp || 0);
    const ttl = 15 * 60 * 1000;
    if (age > ttl) return { success:false, confidence:0, evidence:{ reason:'expired' } };
    return { success:true, confidence:60, evidence:{ ok:true } };
  }
}