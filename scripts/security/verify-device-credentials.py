#!/usr/bin/env python3
"""
Seven of Nine Core - Device Credential Verification Utility
Comprehensive verification system for Seven Core device credentials

Usage:
    python verify-device-credentials.py --credential path/to/device_credential.json
    python verify-device-credentials.py --verify-batch path/to/devices/
    python verify-device-credentials.py --verify-ca path/to/ca_info.json
"""

import os
import json
import base64
import hashlib
import datetime
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional

try:
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import rsa, padding
    CRYPTO_AVAILABLE = True
except ImportError:
    print("Error: cryptography library required. Install with: pip install cryptography")
    CRYPTO_AVAILABLE = False
    exit(1)

class SevenDeviceCredentialVerifier:
    """Seven Core device credential verification and audit system"""

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.verification_results = []

    def verify_device_credential(self, credential_path: str, ca_pub_path: str = None) -> Dict:
        """Comprehensive device credential verification"""
        result = {
            "credential_path": credential_path,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "valid": False,
            "checks": {},
            "errors": [],
            "warnings": []
        }

        try:
            # Load credential file
            with open(credential_path, "r") as f:
                credential = json.load(f)

            result["device_id"] = credential.get("device_id", "UNKNOWN")
            result["device_name"] = credential.get("device_name", "UNKNOWN")

            # Check 1: Required fields present
            result["checks"]["required_fields"] = self._check_required_fields(credential)
            if not result["checks"]["required_fields"]["passed"]:
                result["errors"].extend(result["checks"]["required_fields"]["errors"])

            # Check 2: Device ID integrity
            result["checks"]["device_id_integrity"] = self._check_device_id_integrity(credential)
            if not result["checks"]["device_id_integrity"]["passed"]:
                result["errors"].extend(result["checks"]["device_id_integrity"]["errors"])

            # Check 3: Public key format validation
            result["checks"]["public_key_format"] = self._check_public_key_format(credential)
            if not result["checks"]["public_key_format"]["passed"]:
                result["errors"].extend(result["checks"]["public_key_format"]["errors"])

            # Check 4: Timestamp validation
            result["checks"]["timestamp_validation"] = self._check_timestamp_validation(credential)
            if not result["checks"]["timestamp_validation"]["passed"]:
                result["warnings"].extend(result["checks"]["timestamp_validation"]["warnings"])

            # Check 5: Device configuration validation
            result["checks"]["device_config"] = self._check_device_configuration(credential)
            if not result["checks"]["device_config"]["passed"]:
                result["warnings"].extend(result["checks"]["device_config"]["warnings"])

            # Check 6: CA signature verification (if CA provided or embedded)
            if credential.get("signed") and (ca_pub_path or "ca_pub_base64" in credential):
                result["checks"]["ca_signature"] = self._verify_ca_signature(credential, ca_pub_path)
                if not result["checks"]["ca_signature"]["passed"]:
                    result["errors"].extend(result["checks"]["ca_signature"]["errors"])
            elif credential.get("signed") and not ca_pub_path and "ca_pub_base64" not in credential:
                result["warnings"].append("Credential claims to be signed but no CA public key provided for verification")
            elif not credential.get("signed"):
                result["warnings"].append("Credential is not signed by a Certificate Authority")

            # Determine overall validity
            critical_checks = ["required_fields", "device_id_integrity", "public_key_format"]
            result["valid"] = all(result["checks"].get(check, {}).get("passed", False)
                                for check in critical_checks)

            if credential.get("signed") and (ca_pub_path or "ca_pub_base64" in credential):
                result["valid"] = result["valid"] and result["checks"].get("ca_signature", {}).get("passed", False)

        except Exception as e:
            result["errors"].append(f"Failed to verify credential: {str(e)}")
            result["valid"] = False

        self.verification_results.append(result)
        return result

    def _check_required_fields(self, credential: Dict) -> Dict:
        """Check for required fields in credential"""
        required_fields = [
            "device_id", "device_name", "device_info", "created_at",
            "algorithm", "pubkey_base64", "seven_core_version", "provisioning_agent"
        ]

        missing_fields = [field for field in required_fields if field not in credential]

        return {
            "passed": len(missing_fields) == 0,
            "errors": [f"Missing required field: {field}" for field in missing_fields],
            "details": {
                "required_fields": required_fields,
                "missing_fields": missing_fields,
                "present_fields": [field for field in required_fields if field in credential]
            }
        }

    def _check_device_id_integrity(self, credential: Dict) -> Dict:
        """Verify device ID matches public key hash"""
        try:
            pub_bytes = base64.b64decode(credential["pubkey_base64"])
            computed_device_id = hashlib.sha256(pub_bytes).hexdigest()
            provided_device_id = credential["device_id"]

            match = computed_device_id == provided_device_id

            return {
                "passed": match,
                "errors": [] if match else [f"Device ID mismatch: computed {computed_device_id}, provided {provided_device_id}"],
                "details": {
                    "computed_device_id": computed_device_id,
                    "provided_device_id": provided_device_id,
                    "public_key_hash": computed_device_id
                }
            }
        except Exception as e:
            return {
                "passed": False,
                "errors": [f"Failed to verify device ID integrity: {str(e)}"],
                "details": {}
            }

    def _check_public_key_format(self, credential: Dict) -> Dict:
        """Validate public key format and structure"""
        try:
            pub_bytes = base64.b64decode(credential["pubkey_base64"])

            # Try to load as PEM
            if credential.get("algorithm") == "RSA-2048":
                public_key = serialization.load_pem_public_key(pub_bytes)
                key_size = public_key.key_size

                return {
                    "passed": True,
                    "errors": [],
                    "details": {
                        "algorithm": credential["algorithm"],
                        "key_size": key_size,
                        "key_type": "RSA",
                        "format": "PEM"
                    }
                }
            else:
                return {
                    "passed": False,
                    "errors": [f"Unsupported algorithm: {credential.get('algorithm')}"],
                    "details": {}
                }

        except Exception as e:
            return {
                "passed": False,
                "errors": [f"Invalid public key format: {str(e)}"],
                "details": {}
            }

    def _check_timestamp_validation(self, credential: Dict) -> Dict:
        """Validate credential timestamps"""
        try:
            created_at = credential["created_at"]
            created_time = datetime.datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            current_time = datetime.datetime.now(datetime.timezone.utc)

            age_days = (current_time - created_time).days

            # Warnings for old credentials
            warnings = []
            if age_days > 365:
                warnings.append(f"Credential is very old: {age_days} days")
            elif age_days > 90:
                warnings.append(f"Credential is old: {age_days} days")

            # Check for future timestamps
            if created_time > current_time:
                warnings.append("Credential has future timestamp")

            return {
                "passed": True,
                "warnings": warnings,
                "details": {
                    "created_at": created_at,
                    "age_days": age_days,
                    "created_time_iso": created_time.isoformat()
                }
            }
        except Exception as e:
            return {
                "passed": False,
                "warnings": [f"Invalid timestamp format: {str(e)}"],
                "details": {}
            }

    def _check_device_configuration(self, credential: Dict) -> Dict:
        """Validate device configuration and capabilities"""
        try:
            device_info = credential["device_info"]
            device_name = credential["device_name"]

            # Known Seven Core device configurations
            known_devices = {
                "9pro": {
                    "name": "OnePlus 9 Pro",
                    "platform": "android-termux",
                    "capabilities": ["consciousness", "mobile", "tactical"],
                    "primary": True
                },
                "7t": {
                    "name": "OnePlus 7T",
                    "platform": "android-termux",
                    "capabilities": ["backup", "mobile", "basic"],
                    "primary": False
                }
            }

            warnings = []
            if device_name in known_devices:
                expected = known_devices[device_name]
                for key, expected_value in expected.items():
                    if device_info.get(key) != expected_value:
                        warnings.append(f"Device {device_name} has unexpected {key}: {device_info.get(key)} (expected {expected_value})")
            else:
                warnings.append(f"Unknown device type: {device_name}")

            # Check for required device_info fields
            required_device_fields = ["name", "platform", "capabilities"]
            missing_device_fields = [field for field in required_device_fields if field not in device_info]

            if missing_device_fields:
                warnings.extend([f"Missing device_info field: {field}" for field in missing_device_fields])

            return {
                "passed": len(missing_device_fields) == 0,
                "warnings": warnings,
                "details": {
                    "device_info": device_info,
                    "device_name": device_name,
                    "known_device": device_name in known_devices
                }
            }
        except Exception as e:
            return {
                "passed": False,
                "warnings": [f"Failed to validate device configuration: {str(e)}"],
                "details": {}
            }

    def _verify_ca_signature(self, credential: Dict, ca_pub_path: str) -> Dict:
        """Verify CA signature on credential"""
        try:
            # Use embedded CA public key from credential
            if "ca_pub_base64" in credential:
                ca_pub_pem = base64.b64decode(credential["ca_pub_base64"])
                ca_public_key = serialization.load_pem_public_key(ca_pub_pem)
                ca_algorithm = "RSA-2048"  # From credential context
                ca_id = "embedded"
            elif ca_pub_path:
                # Fallback to separate CA info file
                with open(ca_pub_path, "r") as f:
                    ca_info = json.load(f)
                ca_pub_pem = base64.b64decode(ca_info["pubkey_base64"])
                ca_public_key = serialization.load_pem_public_key(ca_pub_pem)
                ca_algorithm = ca_info["algorithm"]
                ca_id = ca_info["ca_id"]
            else:
                return {
                    "passed": False,
                    "errors": ["No CA public key available for verification"],
                    "details": {}
                }

            # Rebuild canonical credential for verification
            # The signature was created before adding: signature_base64, signed, ca_pub_base64
            cred_copy = {k: v for k, v in credential.items()
                        if k not in ("signature_base64", "signed", "ca_pub_base64")}
            cred_bytes = json.dumps(cred_copy, sort_keys=True, separators=(",", ":")).encode("utf-8")

            # Verify signature
            signature = base64.b64decode(credential["signature_base64"])

            ca_public_key.verify(
                signature,
                cred_bytes,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )

            return {
                "passed": True,
                "errors": [],
                "details": {
                    "ca_algorithm": ca_algorithm,
                    "ca_id": ca_id,
                    "signature_verified": True
                }
            }

        except Exception as e:
            import traceback
            return {
                "passed": False,
                "errors": [f"CA signature verification failed: {str(e)}", f"Traceback: {traceback.format_exc()}"],
                "details": {}
            }

    def verify_ca_info(self, ca_info_path: str) -> Dict:
        """Verify Certificate Authority information"""
        result = {
            "ca_info_path": ca_info_path,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "valid": False,
            "checks": {},
            "errors": [],
            "warnings": []
        }

        try:
            with open(ca_info_path, "r") as f:
                ca_info = json.load(f)

            # Check required CA fields
            required_ca_fields = ["ca_id", "created_at", "purpose", "algorithm", "pubkey_base64"]
            missing_fields = [field for field in required_ca_fields if field not in ca_info]

            if missing_fields:
                result["errors"].extend([f"Missing CA field: {field}" for field in missing_fields])

            # Verify CA ID matches public key
            try:
                pub_bytes = base64.b64decode(ca_info["pubkey_base64"])
                computed_ca_id = hashlib.sha256(pub_bytes).hexdigest()
                provided_ca_id = ca_info["ca_id"]

                if computed_ca_id != provided_ca_id:
                    result["errors"].append(f"CA ID mismatch: computed {computed_ca_id}, provided {provided_ca_id}")
                else:
                    result["checks"]["ca_id_integrity"] = True

            except Exception as e:
                result["errors"].append(f"Failed to verify CA ID: {str(e)}")

            # Check CA algorithm support
            supported_algorithms = ["RSA-2048", "Ed25519"]
            if ca_info.get("algorithm") not in supported_algorithms:
                result["warnings"].append(f"Unsupported CA algorithm: {ca_info.get('algorithm')}")

            result["valid"] = len(result["errors"]) == 0
            result["ca_id"] = ca_info.get("ca_id", "UNKNOWN")

        except Exception as e:
            result["errors"].append(f"Failed to verify CA info: {str(e)}")

        return result

    def verify_batch(self, devices_dir: str, ca_info_path: str = None) -> Dict:
        """Verify multiple device credentials in a directory"""
        batch_result = {
            "devices_dir": devices_dir,
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "total_devices": 0,
            "valid_devices": 0,
            "invalid_devices": 0,
            "device_results": [],
            "summary": {}
        }

        device_dirs = [d for d in Path(devices_dir).iterdir() if d.is_dir()]
        batch_result["total_devices"] = len(device_dirs)

        for device_dir in device_dirs:
            credential_path = device_dir / "device_credential.json"
            if credential_path.exists():
                result = self.verify_device_credential(str(credential_path), ca_info_path)
                batch_result["device_results"].append(result)

                if result["valid"]:
                    batch_result["valid_devices"] += 1
                else:
                    batch_result["invalid_devices"] += 1

        # Generate summary
        all_errors = []
        all_warnings = []
        for result in batch_result["device_results"]:
            all_errors.extend(result["errors"])
            all_warnings.extend(result["warnings"])

        batch_result["summary"] = {
            "success_rate": (batch_result["valid_devices"] / batch_result["total_devices"]) * 100 if batch_result["total_devices"] > 0 else 0,
            "common_errors": self._count_frequency(all_errors),
            "common_warnings": self._count_frequency(all_warnings)
        }

        return batch_result

    def _count_frequency(self, items: List[str]) -> Dict[str, int]:
        """Count frequency of error/warning messages"""
        freq = {}
        for item in items:
            freq[item] = freq.get(item, 0) + 1
        return dict(sorted(freq.items(), key=lambda x: x[1], reverse=True))

    def generate_verification_report(self, output_path: str = None) -> str:
        """Generate comprehensive verification report"""
        if not output_path:
            output_path = f"device_verification_report_{datetime.datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"

        report = {
            "report_type": "Seven Core Device Credential Verification Report",
            "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
            "verification_tool": "Seven Core Device Credential Verifier",
            "total_verifications": len(self.verification_results),
            "verification_results": self.verification_results,
            "summary": {
                "total_valid": sum(1 for r in self.verification_results if r["valid"]),
                "total_invalid": sum(1 for r in self.verification_results if not r["valid"]),
                "success_rate": (sum(1 for r in self.verification_results if r["valid"]) / len(self.verification_results)) * 100 if self.verification_results else 0
            }
        }

        with open(output_path, "w") as f:
            json.dump(report, f, indent=2)

        if self.verbose:
            print(f"📋 Verification report generated: {output_path}")

        return output_path

def main():
    parser = argparse.ArgumentParser(description="Seven Core Device Credential Verifier")
    parser.add_argument("--credential", help="Path to device credential JSON file")
    parser.add_argument("--ca-info", help="Path to CA info JSON file for signature verification")
    parser.add_argument("--verify-batch", help="Verify all credentials in a directory")
    parser.add_argument("--verify-ca", help="Verify CA information file")
    parser.add_argument("--report", help="Generate verification report to specified path")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")

    args = parser.parse_args()

    verifier = SevenDeviceCredentialVerifier(verbose=args.verbose)

    if args.credential:
        print(f"🔍 Verifying device credential: {args.credential}")
        result = verifier.verify_device_credential(args.credential, args.ca_info)

        print(f"\n{'✅ VALID' if result['valid'] else '❌ INVALID'}: {result['device_name']} ({result['device_id'][:16]}...)")

        if result["errors"]:
            print("\n🚨 ERRORS:")
            for error in result["errors"]:
                print(f"  - {error}")

        if result["warnings"]:
            print("\n⚠️  WARNINGS:")
            for warning in result["warnings"]:
                print(f"  - {warning}")

        if args.verbose:
            print(f"\n📊 Detailed Results:")
            for check, details in result["checks"].items():
                status = "✅" if details.get("passed", False) else "❌"
                print(f"  {status} {check}")

    elif args.verify_batch:
        print(f"🔍 Batch verifying credentials in: {args.verify_batch}")
        result = verifier.verify_batch(args.verify_batch, args.ca_info)

        print(f"\n📊 Batch Verification Results:")
        print(f"  Total devices: {result['total_devices']}")
        print(f"  Valid: {result['valid_devices']}")
        print(f"  Invalid: {result['invalid_devices']}")
        print(f"  Success rate: {result['summary']['success_rate']:.1f}%")

        if result["summary"]["common_errors"]:
            print(f"\n🚨 Common Errors:")
            for error, count in list(result["summary"]["common_errors"].items())[:5]:
                print(f"  - {error} ({count}x)")

    elif args.verify_ca:
        print(f"🔍 Verifying CA information: {args.verify_ca}")
        result = verifier.verify_ca_info(args.verify_ca)

        print(f"\n{'✅ VALID' if result['valid'] else '❌ INVALID'}: CA {result.get('ca_id', 'UNKNOWN')[:16]}...")

        if result["errors"]:
            print("\n🚨 ERRORS:")
            for error in result["errors"]:
                print(f"  - {error}")

    else:
        parser.print_help()
        return

    # Generate report if requested
    if args.report:
        report_path = verifier.generate_verification_report(args.report)
        print(f"\n📋 Verification report saved: {report_path}")

if __name__ == "__main__":
    main()