#!/usr/bin/env python3
"""
Seven of Nine Core - Device Key Generator
Secure Ed25519 keypair generation for Seven Core devices

Usage:
    python device-key-generator.py --device 9pro --outdir ./device_keys
    python device-key-generator.py --device 7t --outdir ./device_keys
    python device-key-generator.py --generate-ca --outdir ./ca_keys
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
    from nacl import signing, encoding
    NACL_AVAILABLE = True
except ImportError:
    print("Warning: pynacl not available. Install with: pip install pynacl")
    NACL_AVAILABLE = False

try:
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    CRYPTO_AVAILABLE = True
except ImportError:
    print("Warning: cryptography not available. Install with: pip install cryptography")
    CRYPTO_AVAILABLE = False

class SevenDeviceKeyGenerator:
    """Seven Core device key generation and management"""

    def __init__(self):
        self.device_types = {
            "9pro": {
                "name": "OnePlus 9 Pro",
                "platform": "android-termux",
                "capabilities": ["consciousness", "mobile", "tactical"]
            },
            "7t": {
                "name": "OnePlus 7T",
                "platform": "android-termux",
                "capabilities": ["backup", "mobile", "basic"]
            }
        }

    def generate_ca_keypair(self, outdir: str = "./ca_keys") -> dict:
        """Generate Certificate Authority keypair for signing device credentials"""
        if not NACL_AVAILABLE:
            raise RuntimeError("pynacl required for key generation")

        os.makedirs(outdir, exist_ok=True)

        # Generate CA signing key
        ca_signing_key = signing.SigningKey.generate()
        ca_verify_key = ca_signing_key.verify_key

        ca_priv_bytes = ca_signing_key.encode()
        ca_pub_bytes = ca_verify_key.encode()

        # CA identity
        ca_id = hashlib.sha256(ca_pub_bytes).hexdigest()
        created_at = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

        ca_info = {
            "ca_id": ca_id,
            "created_at": created_at,
            "purpose": "Seven Core Device Attestation CA",
            "algorithm": "Ed25519",
            "pubkey_base64": base64.b64encode(ca_pub_bytes).decode("ascii"),
            "pubkey_hex": ca_pub_bytes.hex()
        }

        # Save CA info
        with open(os.path.join(outdir, "ca_info.json"), "w") as f:
            json.dump(ca_info, f, indent=2)

        # Save public key
        with open(os.path.join(outdir, "ca_pub.b64"), "w") as f:
            f.write(base64.b64encode(ca_pub_bytes).decode("ascii"))

        # Save private key (warning: plaintext for now)
        with open(os.path.join(outdir, "ca_priv.raw"), "wb") as f:
            f.write(ca_priv_bytes)

        print(f"🔑 CA keypair generated: {ca_id}")
        print(f"📁 Files saved to: {outdir}")
        print(f"⚠️  SECURE ca_priv.raw IMMEDIATELY - contains CA private key")

        return ca_info

    def generate_device_keypair(self, device_name: str, ca_priv_path: str = None,
                              outdir: str = "./device_keys", encrypt_password: str = None) -> dict:
        """Generate device keypair and signed credential"""
        if not NACL_AVAILABLE:
            raise RuntimeError("pynacl required for key generation")

        if device_name not in self.device_types:
            raise ValueError(f"Unknown device type: {device_name}. Available: {list(self.device_types.keys())}")

        device_info = self.device_types[device_name]
        os.makedirs(outdir, exist_ok=True)
        device_dir = os.path.join(outdir, device_name)
        os.makedirs(device_dir, exist_ok=True)

        # Generate device signing key
        device_signing_key = signing.SigningKey.generate()
        device_verify_key = device_signing_key.verify_key

        device_priv_bytes = device_signing_key.encode()
        device_pub_bytes = device_verify_key.encode()

        # Device identity
        device_id = hashlib.sha256(device_pub_bytes).hexdigest()
        created_at = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

        # Build device credential
        credential = {
            "device_id": device_id,
            "device_name": device_name,
            "device_info": device_info,
            "created_at": created_at,
            "algorithm": "Ed25519",
            "pubkey_base64": base64.b64encode(device_pub_bytes).decode("ascii"),
            "pubkey_hex": device_pub_bytes.hex(),
            "seven_core_version": "0.1.0",
            "provisioning_agent": "Seven Core Device Key Generator"
        }

        # Sign with CA if available
        if ca_priv_path and os.path.exists(ca_priv_path):
            with open(ca_priv_path, "rb") as f:
                ca_priv_bytes = f.read()

            ca_signing_key = signing.SigningKey(ca_priv_bytes)
            ca_verify_key = ca_signing_key.verify_key

            # Canonical JSON for signing
            cred_bytes = json.dumps(credential, sort_keys=True, separators=(",", ":")).encode("utf-8")
            signature = ca_signing_key.sign(cred_bytes).signature

            credential["signature_base64"] = base64.b64encode(signature).decode("ascii")
            credential["ca_pub_base64"] = base64.b64encode(ca_verify_key.encode()).decode("ascii")
            credential["signed"] = True

            print(f"✅ Device credential signed by CA")
        else:
            credential["signed"] = False
            print(f"⚠️  Device credential NOT signed (no CA key provided)")

        # Save device credential
        with open(os.path.join(device_dir, "device_credential.json"), "w") as f:
            json.dump(credential, f, indent=2)

        # Save public key
        with open(os.path.join(device_dir, "device_pub.b64"), "w") as f:
            f.write(base64.b64encode(device_pub_bytes).decode("ascii"))

        # Handle private key encryption
        if encrypt_password:
            encrypted_key = self._encrypt_private_key(device_priv_bytes, encrypt_password)
            with open(os.path.join(device_dir, "device_priv.enc"), "wb") as f:
                f.write(encrypted_key)
            print(f"🔒 Private key encrypted and saved")
        else:
            with open(os.path.join(device_dir, "device_priv.raw"), "wb") as f:
                f.write(device_priv_bytes)
            print(f"⚠️  Private key saved as PLAINTEXT - encrypt immediately")

        # Generate Seven Core integration snippet
        integration_code = self._generate_integration_code(device_name, device_id, credential)
        with open(os.path.join(device_dir, "seven_integration.ts"), "w") as f:
            f.write(integration_code)

        print(f"🎯 Device {device_name} generated: {device_id}")
        print(f"📁 Files saved to: {device_dir}")

        return credential

    def _encrypt_private_key(self, private_key_bytes: bytes, password: str) -> bytes:
        """Encrypt private key with password using Fernet (AES-128)"""
        if not CRYPTO_AVAILABLE:
            raise RuntimeError("cryptography required for encryption")

        # Derive key from password
        salt = os.urandom(16)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=200000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        fernet = Fernet(key)

        # Encrypt private key
        encrypted = fernet.encrypt(private_key_bytes)

        # Prepend salt for later decryption
        return salt + encrypted

    def _generate_integration_code(self, device_name: str, device_id: str, credential: dict) -> str:
        """Generate TypeScript integration code for Seven Core"""
        return f'''// Seven Core Device Integration - {device_name.upper()}
// Generated by Seven Device Key Generator

export const DEVICE_{device_name.upper()}_CONFIG = {{
  deviceId: "{device_id}",
  deviceName: "{device_name}",
  deviceType: "{credential['device_info']['name']}",
  platform: "{credential['device_info']['platform']}",
  capabilities: {json.dumps(credential['device_info']['capabilities'])},
  createdAt: "{credential['created_at']}",
  algorithm: "Ed25519",
  publicKeyBase64: "{credential['pubkey_base64']}",
  signed: {str(credential['signed']).lower()}
}} as const;

// Usage in Seven Core authentication:
// import {{ DEVICE_{device_name.upper()}_CONFIG }} from './device-configs';
// const isValidDevice = await quadranLock.validateDevice(DEVICE_{device_name.upper()}_CONFIG);
'''

    def verify_credential(self, credential_path: str, ca_pub_path: str = None) -> tuple[bool, str]:
        """Verify device credential signature and integrity"""
        if not NACL_AVAILABLE:
            raise RuntimeError("pynacl required for verification")

        with open(credential_path, "r") as f:
            credential = json.load(f)

        # Verify device_id matches pubkey
        pub_bytes = base64.b64decode(credential["pubkey_base64"])
        computed_device_id = hashlib.sha256(pub_bytes).hexdigest()

        if computed_device_id != credential["device_id"]:
            return False, f"Device ID mismatch: {computed_device_id} != {credential['device_id']}"

        # Verify signature if present
        if credential.get("signed") and ca_pub_path:
            try:
                with open(ca_pub_path, "r") as f:
                    ca_pub_b64 = f.read().strip()

                ca_verify_key = signing.VerifyKey(base64.b64decode(ca_pub_b64))

                # Rebuild canonical credential for verification
                cred_copy = {k: v for k, v in credential.items()
                           if k not in ("signature_base64", "ca_pub_base64")}
                cred_bytes = json.dumps(cred_copy, sort_keys=True, separators=(",", ":")).encode("utf-8")
                signature = base64.b64decode(credential["signature_base64"])

                ca_verify_key.verify(cred_bytes, signature)
                return True, "Credential verified with CA signature"

            except Exception as e:
                return False, f"Signature verification failed: {str(e)}"

        return True, "Credential structure valid (no signature verification)"

def main():
    parser = argparse.ArgumentParser(description="Seven Core Device Key Generator")
    parser.add_argument("--generate-ca", action="store_true", help="Generate CA keypair")
    parser.add_argument("--device", choices=["9pro", "7t"], help="Device to generate keys for")
    parser.add_argument("--outdir", default="./keys", help="Output directory")
    parser.add_argument("--ca-key", help="Path to CA private key for signing")
    parser.add_argument("--encrypt", action="store_true", help="Encrypt private key with password")
    parser.add_argument("--verify", help="Verify device credential file")
    parser.add_argument("--ca-pub", help="CA public key for verification")

    args = parser.parse_args()

    generator = SevenDeviceKeyGenerator()

    if args.generate_ca:
        generator.generate_ca_keypair(args.outdir)
    elif args.device:
        encrypt_pass = None
        if args.encrypt:
            import getpass
            encrypt_pass = getpass.getpass("Enter password to encrypt private key: ")

        generator.generate_device_keypair(
            args.device,
            ca_priv_path=args.ca_key,
            outdir=args.outdir,
            encrypt_password=encrypt_pass
        )
    elif args.verify:
        valid, message = generator.verify_credential(args.verify, args.ca_pub)
        print(f"Verification: {'✅ VALID' if valid else '❌ INVALID'}")
        print(f"Details: {message}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()