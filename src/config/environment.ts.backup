/**
 * QUADRAN-LOCK ENVIRONMENT VALIDATION
 * Ensures all required security environment variables are present
 * 
 * COMMIT: Security environment validation system
 * PATCH: Prevents deployment without proper security configuration
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface QuadranLockConfig {
  sessionSigningKey: string;
  deviceRegistrationSecret: string;
  environment: 'development' | 'testing' | 'production';
  requireAuthentication: boolean;
  auditLogging: boolean;
  trustVerification: 'permissive' | 'standard' | 'strict';
}

/**
 * Environment validation for Quadran-Lock security system
 */
export function validateQuadranLockEnvironment(): QuadranLockConfig {
  console.log('🔒 Validating Quadran-Lock security environment...');
  
  const required = [
    'SESSION_SIGNING_KEY',
    'DEVICE_REGISTRATION_SECRET', 
    'QUADRANLOCK_ENVIRONMENT'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required Quadran-Lock environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n📝 Create a .env file based on .env.example with proper values');
    throw new Error(`Missing required Quadran-Lock environment variables: ${missing.join(', ')}`);
  }

  // Validate session signing key strength
  const sessionKey = process.env.SESSION_SIGNING_KEY;
  if (sessionKey.length < 32) {
    throw new Error('SESSION_SIGNING_KEY must be at least 32 characters long');
  }

  // Validate environment setting
  const environment = process.env.QUADRANLOCK_ENVIRONMENT;
  if (!['development', 'testing', 'production'].includes(environment)) {
    throw new Error(`Invalid QUADRANLOCK_ENVIRONMENT: ${environment}. Must be development, testing, or production`);
  }

  console.log('✅ Quadran-Lock environment validated');
  console.log(`   Environment: ${environment}`);
  console.log(`   Session Key: ${'*'.repeat(sessionKey.length)} (${sessionKey.length} chars)`);
  console.log(`   Authentication Required: ${process.env.SEVEN_REQUIRE_AUTHENTICATION !== 'false'}`);

  return {
    sessionSigningKey: sessionKey,
    deviceRegistrationSecret: process.env.DEVICE_REGISTRATION_SECRET,
    environment: environment as 'development' | 'testing' | 'production',
    requireAuthentication: process.env.SEVEN_REQUIRE_AUTHENTICATION !== 'false',
    auditLogging: process.env.SEVEN_AUDIT_LOGGING !== 'false',
    trustVerification: (process.env.SEVEN_TRUST_VERIFICATION || 'standard') as 'permissive' | 'standard' | 'strict'
  };
}

/**
 * Generate secure default keys for development
 */
export function generateSecureDefaults(): { sessionKey: string; deviceSecret: string } {
  const crypto = require('crypto');
  
  return {
    sessionKey: crypto.randomBytes(32).toString('hex'),
    deviceSecret: crypto.randomBytes(24).toString('hex')
  };
}

/**
 * Set up development environment if no .env exists
 */
export function ensureDevelopmentEnvironment(): void {
  const envPath = join(process.cwd(), '.env');
  const envExamplePath = join(process.cwd(), '.env.example');
  
  // If .env doesn't exist but .env.example does, create default .env
  if (!existsSync(envPath) && existsSync(envExamplePath)) {
    console.log('🔧 No .env file found, creating development defaults...');
    
    const defaults = generateSecureDefaults();
    let envTemplate = readFileSync(envExamplePath, 'utf8');
    
    // Replace example values with secure defaults
    envTemplate = envTemplate
      .replace('your-secure-session-key-here-32-chars', defaults.sessionKey)
      .replace('your-device-registration-secret-here', defaults.deviceSecret)
      .replace('QUADRANLOCK_ENVIRONMENT=development', 'QUADRANLOCK_ENVIRONMENT=development');
    
    writeFileSync(envPath, envTemplate);
    console.log('✅ Development .env file created with secure defaults');
    console.log('📝 Edit .env file to customize security settings');
  }
}

export default {
  validateQuadranLockEnvironment,
  generateSecureDefaults,
  ensureDevelopmentEnvironment
};