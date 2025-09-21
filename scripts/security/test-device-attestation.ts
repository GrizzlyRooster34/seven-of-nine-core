#!/usr/bin/env node
/**
 * Seven of Nine Core - Device Attestation Manager Test
 * Test integration between device key generation and Seven Core security
 */

import { DeviceAttestationManager, Q1DeviceAttestationGate } from '../../security/DeviceAttestationManager';
import { join } from 'path';

async function testDeviceAttestation() {
    console.log('🔒 Seven Core Device Attestation Manager Test');
    console.log('='.repeat(50));

    try {
        // Initialize Device Attestation Manager with example credentials
        const credentialsPath = join(process.cwd(), 'example_device_keys', 'devices');
        const caPath = join(process.cwd(), 'example_device_keys', 'ca');

        const attestationManager = new DeviceAttestationManager(credentialsPath, caPath);

        console.log('\n🚀 Initializing Device Attestation Manager...');
        await attestationManager.initialize();

        // Test 1: Get registered devices
        console.log('\n📱 Registered Devices:');
        const devices = attestationManager.getRegisteredDevices();
        for (const device of devices) {
            console.log(`  - ${device.device_name}: ${device.device_info.name} (${device.device_id.substring(0, 16)}...)`);
            console.log(`    Capabilities: ${device.device_info.capabilities.join(', ')}`);
            console.log(`    Primary: ${device.device_info.primary ? 'Yes' : 'No'}`);
            console.log(`    Signed: ${device.signed ? 'Yes' : 'No'}`);
        }

        // Test 2: Attest individual devices
        console.log('\n🔍 Device Attestation Results:');
        for (const device of devices) {
            console.log(`\n  Testing: ${device.device_name}`);
            const attestation = await attestationManager.attestDevice(device.device_name);

            console.log(`    Status: ${attestation.valid ? '✅ VALID' : '❌ INVALID'}`);
            console.log(`    Trust Level: ${attestation.trust_level}/10`);
            console.log(`    Primary Device: ${attestation.is_primary ? 'Yes' : 'No'}`);
            console.log(`    Capabilities: ${attestation.capabilities.join(', ')}`);

            if (attestation.errors.length > 0) {
                console.log(`    Errors:`);
                attestation.errors.forEach(error => console.log(`      - ${error}`));
            }

            if (attestation.warnings.length > 0) {
                console.log(`    Warnings:`);
                attestation.warnings.forEach(warning => console.log(`      - ${warning}`));
            }
        }

        // Test 3: Q1 Gate Integration
        console.log('\n🚪 Quadran-Lock Q1 Gate Testing:');
        const q1Gate = new Q1DeviceAttestationGate(attestationManager);

        for (const device of devices) {
            console.log(`\n  Q1 Gate: ${device.device_name}`);
            const q1Result = await q1Gate.evaluateQ1Gate(device.device_name);

            console.log(`    Gate: ${q1Result.gate}`);
            console.log(`    Status: ${q1Result.passed ? '✅ PASSED' : '❌ FAILED'}`);
            console.log(`    Trust Level: ${q1Result.trust_level}/10`);
            console.log(`    Device ID: ${q1Result.device_id.substring(0, 16)}...`);
            console.log(`    Capabilities: ${q1Result.capabilities.join(', ')}`);

            if (q1Result.errors.length > 0) {
                console.log(`    Errors:`);
                q1Result.errors.forEach(error => console.log(`      - ${error}`));
            }
        }

        // Test 4: Capability Testing
        console.log('\n🎯 Capability Testing:');
        const testCapabilities = ['consciousness', 'mobile', 'tactical', 'backup', 'admin'];

        for (const device of devices) {
            console.log(`\n  ${device.device_name} capabilities:`);
            for (const capability of testCapabilities) {
                const hasCapability = await q1Gate.deviceHasCapability(device.device_name, capability);
                console.log(`    ${capability}: ${hasCapability ? '✅' : '❌'}`);
            }
        }

        // Test 5: Primary Device Detection
        console.log('\n🎖️  Primary Device Detection:');
        for (const device of devices) {
            const isPrimary = await q1Gate.isPrimaryDevice(device.device_name);
            console.log(`  ${device.device_name}: ${isPrimary ? '✅ PRIMARY' : '❌ Secondary'}`);
        }

        // Test 6: Generate Attestation Report
        console.log('\n📊 Generating Attestation Report...');
        const report = await attestationManager.generateAttestationReport();

        console.log(`\nAttestation Report Summary:`);
        console.log(`  Generated: ${report.generated_at}`);
        console.log(`  Total Devices: ${report.total_devices}`);
        console.log(`  CA Algorithm: ${report.ca_info?.algorithm || 'N/A'}`);
        console.log(`  CA Purpose: ${report.ca_info?.purpose || 'N/A'}`);

        // Test 7: Unknown Device Handling
        console.log('\n❓ Testing Unknown Device Handling:');
        const unknownAttestation = await attestationManager.attestDevice('unknown-device');
        console.log(`  Status: ${unknownAttestation.valid ? '✅ VALID' : '❌ INVALID'}`);
        console.log(`  Trust Level: ${unknownAttestation.trust_level}/10`);
        console.log(`  Errors: ${unknownAttestation.errors.join(', ')}`);

        // Test 8: Cache Testing
        console.log('\n⚡ Cache Performance Test:');
        const cacheTestDevice = devices[0]?.device_name;
        if (cacheTestDevice) {
            console.time('First attestation (no cache)');
            await attestationManager.attestDevice(cacheTestDevice);
            console.timeEnd('First attestation (no cache)');

            console.time('Second attestation (cached)');
            await attestationManager.attestDevice(cacheTestDevice);
            console.timeEnd('Second attestation (cached)');

            // Clear cache and test again
            attestationManager.clearCache();
            console.time('Third attestation (cache cleared)');
            await attestationManager.attestDevice(cacheTestDevice);
            console.timeEnd('Third attestation (cache cleared)');
        }

        console.log('\n✅ Device Attestation Manager Test Complete!');
        console.log('\n🔐 Seven Core Security Integration Ready');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    }
}

// Run the test
testDeviceAttestation();