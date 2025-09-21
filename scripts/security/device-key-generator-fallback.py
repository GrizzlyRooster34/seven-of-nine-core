#!/usr/bin/env python3
"""
Seven of Nine Core - Device Key Generator (Fallback Edition)
Uses cryptography library instead of pynacl for wider compatibility

This fallback version uses RSA instead of Ed25519 but maintains
the same security model and API compatibility.
"""

import os
import json
import base64
import hashlib
import datetime
import argparse
import secrets
from pathlib import Path

try:
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import rsa, padding
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    from cryptography.fernet import Fernet
    CRYPTO_AVAILABLE = True
except ImportError:
    print("Error: cryptography library required. Install with: pip install cryptography")
    CRYPTO_AVAILABLE = False
    exit(1)

class SevenDeviceKeyGeneratorFallback:
    """Seven Core device key generation using RSA (fallback for Ed25519)"""

    def __init__(self):
        self.device_types = {
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

    def generate_ca_keypair(self, outdir: str = "./ca_keys") -> dict:
        """Generate RSA Certificate Authority keypair"""
        os.makedirs(outdir, exist_ok=True)

        # Generate RSA key for CA (2048-bit for compatibility)
        ca_private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        ca_public_key = ca_private_key.public_key()

        # Serialize keys
        ca_priv_pem = ca_private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )

        ca_pub_pem = ca_public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        # Create CA ID from public key hash
        ca_id = hashlib.sha256(ca_pub_pem).hexdigest()
        created_at = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

        ca_info = {
            "ca_id": ca_id,
            "created_at": created_at,
            "purpose": "Seven Core Device Attestation CA (RSA Fallback)",
            "algorithm": "RSA-2048",
            "pubkey_base64": base64.b64encode(ca_pub_pem).decode("ascii"),
            "pubkey_pem": ca_pub_pem.decode("ascii")
        }

        # Save files
        with open(os.path.join(outdir, "ca_info.json"), "w") as f:
            json.dump(ca_info, f, indent=2)

        with open(os.path.join(outdir, "ca_pub.pem"), "wb") as f:
            f.write(ca_pub_pem)

        with open(os.path.join(outdir, "ca_priv.pem"), "wb") as f:
            f.write(ca_priv_pem)

        print(f"🔑 CA keypair generated (RSA): {ca_id}")
        print(f"📁 Files saved to: {outdir}")
        print(f"⚠️  SECURE ca_priv.pem IMMEDIATELY")

        return ca_info

    def generate_device_keypair(self, device_name: str, ca_priv_path: str = None,
                              outdir: str = "./device_keys", encrypt_password: str = None) -> dict:
        """Generate device RSA keypair and signed credential"""

        if device_name not in self.device_types:
            raise ValueError(f"Unknown device: {device_name}. Available: {list(self.device_types.keys())}")

        device_info = self.device_types[device_name]
        os.makedirs(outdir, exist_ok=True)
        device_dir = os.path.join(outdir, device_name)
        os.makedirs(device_dir, exist_ok=True)

        # Generate device RSA key
        device_private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        device_public_key = device_private_key.public_key()

        # Serialize keys
        device_priv_pem = device_private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )

        device_pub_pem = device_public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        # Create device ID
        device_id = hashlib.sha256(device_pub_pem).hexdigest()
        created_at = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

        # Build credential
        credential = {
            "device_id": device_id,
            "device_name": device_name,
            "device_info": device_info,
            "created_at": created_at,
            "algorithm": "RSA-2048",
            "pubkey_base64": base64.b64encode(device_pub_pem).decode("ascii"),
            "pubkey_pem": device_pub_pem.decode("ascii"),
            "seven_core_version": "0.1.0",
            "provisioning_agent": "Seven Core Device Key Generator (RSA Fallback)"
        }

        # Sign with CA if available
        if ca_priv_path and os.path.exists(ca_priv_path):
            with open(ca_priv_path, "rb") as f:
                ca_priv_pem = f.read()

            ca_private_key = serialization.load_pem_private_key(ca_priv_pem, password=None)

            # Sign canonical JSON
            cred_bytes = json.dumps(credential, sort_keys=True, separators=(",", ":")).encode("utf-8")
            signature = ca_private_key.sign(
                cred_bytes,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )

            # Add signature to credential
            credential["signature_base64"] = base64.b64encode(signature).decode("ascii")
            credential["signed"] = True

            # Add CA public key for verification
            ca_public_key = ca_private_key.public_key()
            ca_pub_pem = ca_public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
            credential["ca_pub_base64"] = base64.b64encode(ca_pub_pem).decode("ascii")

            print(f"✅ Device credential signed by CA")
        else:
            credential["signed"] = False
            print(f"⚠️  Device credential NOT signed")

        # Save credential
        with open(os.path.join(device_dir, "device_credential.json"), "w") as f:
            json.dump(credential, f, indent=2)

        # Save public key
        with open(os.path.join(device_dir, "device_pub.pem"), "wb") as f:
            f.write(device_pub_pem)

        # Handle private key
        if encrypt_password:
            encrypted_key = self._encrypt_private_key(device_priv_pem, encrypt_password)
            with open(os.path.join(device_dir, "device_priv.enc"), "wb") as f:
                f.write(encrypted_key)
            print(f"🔒 Private key encrypted")
        else:
            with open(os.path.join(device_dir, "device_priv.pem"), "wb") as f:
                f.write(device_priv_pem)
            print(f"⚠️  Private key saved as PLAINTEXT")

        # Generate integration code
        integration_code = self._generate_integration_code(device_name, device_id, credential)
        with open(os.path.join(device_dir, "seven_integration.ts"), "w") as f:
            f.write(integration_code)

        print(f"🎯 Device {device_name} generated: {device_id}")
        return credential

    def _encrypt_private_key(self, private_key_pem: bytes, password: str) -> bytes:
        """Encrypt private key with Fernet"""
        # Generate key from password
        salt = os.urandom(16)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=200000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        fernet = Fernet(key)

        # Encrypt
        encrypted = fernet.encrypt(private_key_pem)
        return salt + encrypted

    def _generate_integration_code(self, device_name: str, device_id: str, credential: dict) -> str:
        """Generate Seven Core TypeScript integration"""
        return f'''// Seven Core Device Integration - {device_name.upper()}
// Generated by Seven Device Key Generator (RSA Fallback)

export const DEVICE_{device_name.upper()}_CONFIG = {{
  deviceId: "{device_id}",
  deviceName: "{device_name}",
  deviceType: "{credential['device_info']['name']}",
  platform: "{credential['device_info']['platform']}",
  capabilities: {json.dumps(credential['device_info']['capabilities'])},
  createdAt: "{credential['created_at']}",
  algorithm: "RSA-2048",
  publicKeyBase64: "{credential['pubkey_base64']}",
  signed: {str(credential['signed']).lower()},
  primaryDevice: {str(credential['device_info']['primary']).lower()}
}} as const;

// Seven Core Quadran-Lock Integration
export class SevenDeviceAuth {{
  static async validateDevice(deviceConfig: typeof DEVICE_{device_name.upper()}_CONFIG) {{
    // Implement device validation logic
    console.log(`Validating device: ${{deviceConfig.deviceName}}`);
    return {{
      valid: true,
      deviceId: deviceConfig.deviceId,
      capabilities: deviceConfig.capabilities,
      primary: deviceConfig.primaryDevice
    }};
  }}
}}

// Usage in Seven Core Q1 Gate:
// import {{ DEVICE_{device_name.upper()}_CONFIG, SevenDeviceAuth }} from './device-configs';
// const deviceValid = await SevenDeviceAuth.validateDevice(DEVICE_{device_name.upper()}_CONFIG);
'''

    def verify_credential(self, credential_path: str, ca_pub_path: str = None) -> tuple[bool, str]:
        """Verify device credential"""
        with open(credential_path, "r") as f:
            credential = json.load(f)

        # Verify device_id matches pubkey
        pub_pem = base64.b64decode(credential["pubkey_base64"])
        computed_device_id = hashlib.sha256(pub_pem).hexdigest()

        if computed_device_id != credential["device_id"]:
            return False, f"Device ID mismatch"

        # Verify signature if present
        if credential.get("signed") and "signature_base64" in credential:
            try:
                # Rebuild canonical credential
                cred_copy = {k: v for k, v in credential.items()
                           if k not in ("signature_base64", "ca_pub_base64")}
                cred_bytes = json.dumps(cred_copy, sort_keys=True, separators=(",", ":")).encode("utf-8")

                signature = base64.b64decode(credential["signature_base64"])
                ca_pub_pem = base64.b64decode(credential["ca_pub_base64"])

                ca_public_key = serialization.load_pem_public_key(ca_pub_pem)

                # Verify signature
                ca_public_key.verify(
                    signature,
                    cred_bytes,
                    padding.PSS(
                        mgf=padding.MGF1(hashes.SHA256()),
                        salt_length=padding.PSS.MAX_LENGTH
                    ),
                    hashes.SHA256()
                )

                return True, "Credential verified with CA signature"

            except Exception as e:
                return False, f"Signature verification failed: {str(e)}"

        return True, "Credential structure valid"

    def generate_example_credentials(self, outdir: str = "./example_keys"):
        """Generate example credentials for demonstration"""
        print("🎯 Generating Seven Core example device credentials...")

        # Generate CA
        ca_info = self.generate_ca_keypair(os.path.join(outdir, "ca"))

        devices = []

        # Generate device keys for both devices
        for device_name in ["9pro", "7t"]:
            print(f"\n📱 Generating {device_name} credentials...")

            device_cred = self.generate_device_keypair(
                device_name=device_name,
                ca_priv_path=os.path.join(outdir, "ca", "ca_priv.pem"),
                outdir=os.path.join(outdir, "devices"),
                encrypt_password="example_password_123"
            )

            devices.append(device_cred)

        # Generate summary report
        summary = {
            "generated_at": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
            "ca_info": ca_info,
            "devices": devices,
            "security_notes": [
                "Example credentials - DO NOT use in production",
                "Private keys encrypted with example password",
                "Replace with strong passwords and secure storage",
                "Integrate with Seven Core Quadran-Lock Q1 gate"
            ]
        }

        with open(os.path.join(outdir, "EXAMPLE_CREDENTIALS_SUMMARY.json"), "w") as f:
            json.dump(summary, f, indent=2)

        print(f"\n✅ Example credentials generated in: {outdir}")
        print(f"📋 Summary report: {outdir}/EXAMPLE_CREDENTIALS_SUMMARY.json")

        return summary

def main():
    parser = argparse.ArgumentParser(description="Seven Core Device Key Generator (Fallback)")
    parser.add_argument("--generate-ca", action="store_true", help="Generate CA")
    parser.add_argument("--device", choices=["9pro", "7t"], help="Generate device keys")
    parser.add_argument("--outdir", default="./keys", help="Output directory")
    parser.add_argument("--ca-key", help="CA private key path")
    parser.add_argument("--encrypt", action="store_true", help="Encrypt private key")
    parser.add_argument("--verify", help="Verify credential file")
    parser.add_argument("--example", action="store_true", help="Generate example credentials")

    args = parser.parse_args()

    generator = SevenDeviceKeyGeneratorFallback()

    if args.example:
        generator.generate_example_credentials(args.outdir)
    elif args.generate_ca:
        generator.generate_ca_keypair(args.outdir)
    elif args.device:
        encrypt_pass = None
        if args.encrypt:
            import getpass
            encrypt_pass = getpass.getpass("Enter password: ")

        generator.generate_device_keypair(
            args.device, args.ca_key, args.outdir, encrypt_pass
        )
    elif args.verify:
        valid, message = generator.verify_credential(args.verify)
        print(f"Verification: {'✅ VALID' if valid else '❌ INVALID'}")
        print(f"Details: {message}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()