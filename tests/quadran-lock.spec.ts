
import { describe, it, expect, vi } from 'vitest';
import { preflight } from '../seven-runtime/security_middleware';
import * as cssr from '../core/safety/quadra-lock';
import * as sec from '../core/security/quadran-lock';

describe('quadran-lock', () => {
  it('runs Quadran-Lock before CSSR, hard-fails on Q1–Q4 fail', async () => {
    const qSpy = vi.spyOn(sec, 'runQuadranLock').mockResolvedValue({ q1:true,q2:true,q3:true,q4:true,passed:true,reasons:[] });
    const cSpy = vi.spyOn(cssr, 'runQuadraLockCSSR').mockResolvedValue([]);
    const ctx:any = { auth:{}, input:'', meta:{} };
    await preflight(ctx);
    expect(qSpy).toHaveBeenCalledBefore(cSpy);
  });

  it('fails closed when Quadran-Lock fails', async () => {
    vi.spyOn(sec, 'runQuadranLock').mockResolvedValue({ q1:false,q2:false,q3:false,q4:false,passed:false,reasons:['Q1'] });
    await expect(preflight({} as any)).rejects.toThrow(/Quadran-Lock failed/i);
  });
});