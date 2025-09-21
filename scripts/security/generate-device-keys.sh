#!/usr/bin/env bash
set -euo pipefail

# Seven of Nine Core - Device Key Generation Wrapper
# Secure key generation for Seven Core devices with audit trail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
KEYS_DIR="$PROJECT_ROOT/.seven-secure/device-keys"
CA_DIR="$PROJECT_ROOT/.seven-secure/ca"
AUDIT_LOG="$PROJECT_ROOT/logs/device-key-audit.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_audit() {
    local timestamp=$(date --utc +"%Y-%m-%dT%H:%M:%SZ")
    echo "[$timestamp] $1" >> "$AUDIT_LOG"
    echo -e "${BLUE}[AUDIT]${NC} $1"
}

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    cat << EOF
Seven of Nine Core - Device Key Generator

USAGE:
    $0 [COMMAND] [OPTIONS]

COMMANDS:
    init-ca                 Initialize Certificate Authority
    generate <device>       Generate keys for device (9pro|7t)
    verify <device>         Verify device credential
    list                    List generated devices
    audit                   Show audit log
    help                    Show this help

EXAMPLES:
    $0 init-ca              # Create CA keypair (one-time setup)
    $0 generate 9pro        # Generate keys for OnePlus 9 Pro
    $0 generate 7t          # Generate keys for OnePlus 7T
    $0 verify 9pro          # Verify 9pro credential
    $0 list                 # Show all generated devices
    $0 audit                # Show security audit trail

SECURITY NOTES:
    - CA private key is stored in $CA_DIR (secure this directory)
    - Device private keys are encrypted with strong passwords
    - All operations are logged to $AUDIT_LOG
    - Keys are compatible with Seven Core Quadran-Lock system

EOF
}

check_dependencies() {
    log_info "Checking dependencies..."

    if ! command -v python3 &> /dev/null; then
        log_error "python3 not found"
        exit 1
    fi

    if ! python3 -c "import nacl" 2>/dev/null; then
        log_warning "pynacl not installed. Installing..."
        pip install pynacl cryptography
    fi

    if ! python3 -c "import cryptography" 2>/dev/null; then
        log_warning "cryptography not installed. Installing..."
        pip install cryptography
    fi

    log_info "Dependencies satisfied"
}

init_ca() {
    log_info "Initializing Seven Core Certificate Authority..."

    if [[ -f "$CA_DIR/ca_priv.raw" ]]; then
        log_warning "CA already exists at $CA_DIR"
        read -p "Overwrite existing CA? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "CA initialization cancelled"
            return 0
        fi
    fi

    mkdir -p "$CA_DIR"
    mkdir -p "$(dirname "$AUDIT_LOG")"

    python3 "$SCRIPT_DIR/device-key-generator.py" --generate-ca --outdir "$CA_DIR"

    # Secure CA private key
    chmod 600 "$CA_DIR/ca_priv.raw"

    log_audit "CA initialized - ID: $(jq -r '.ca_id' "$CA_DIR/ca_info.json")"
    log_info "CA keypair generated and secured"

    # Show CA info
    echo ""
    log_info "Certificate Authority Information:"
    jq . "$CA_DIR/ca_info.json"
}

generate_device_keys() {
    local device="$1"

    if [[ "$device" != "9pro" && "$device" != "7t" ]]; then
        log_error "Invalid device: $device (must be 9pro or 7t)"
        exit 1
    fi

    if [[ ! -f "$CA_DIR/ca_priv.raw" ]]; then
        log_error "CA not found. Run '$0 init-ca' first"
        exit 1
    fi

    log_info "Generating keys for device: $device"

    if [[ -f "$KEYS_DIR/$device/device_credential.json" ]]; then
        log_warning "Device $device already exists"
        read -p "Overwrite existing device keys? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Key generation cancelled"
            return 0
        fi
    fi

    mkdir -p "$KEYS_DIR"

    # Generate device keys with encryption
    python3 "$SCRIPT_DIR/device-key-generator.py" \
        --device "$device" \
        --outdir "$KEYS_DIR" \
        --ca-key "$CA_DIR/ca_priv.raw" \
        --encrypt

    # Set secure permissions
    find "$KEYS_DIR/$device" -name "*.raw" -exec chmod 600 {} \;
    find "$KEYS_DIR/$device" -name "*.enc" -exec chmod 600 {} \;

    local device_id=$(jq -r '.device_id' "$KEYS_DIR/$device/device_credential.json")
    log_audit "Device $device generated - ID: $device_id"

    log_info "Device $device keys generated successfully"

    # Show device info
    echo ""
    log_info "Device Information:"
    jq . "$KEYS_DIR/$device/device_credential.json"

    echo ""
    log_info "Integration code saved to: $KEYS_DIR/$device/seven_integration.ts"
}

verify_device() {
    local device="$1"

    if [[ ! -f "$KEYS_DIR/$device/device_credential.json" ]]; then
        log_error "Device $device not found"
        exit 1
    fi

    if [[ ! -f "$CA_DIR/ca_pub.b64" ]]; then
        log_error "CA public key not found"
        exit 1
    fi

    log_info "Verifying device: $device"

    python3 "$SCRIPT_DIR/device-key-generator.py" \
        --verify "$KEYS_DIR/$device/device_credential.json" \
        --ca-pub "$CA_DIR/ca_pub.b64"

    log_audit "Device $device verified"
}

list_devices() {
    log_info "Seven Core Registered Devices:"
    echo ""

    if [[ ! -d "$KEYS_DIR" ]]; then
        log_warning "No devices found (keys directory doesn't exist)"
        return 0
    fi

    local found_devices=false

    for device_dir in "$KEYS_DIR"/*; do
        if [[ -d "$device_dir" && -f "$device_dir/device_credential.json" ]]; then
            found_devices=true
            local device_name=$(basename "$device_dir")
            local device_id=$(jq -r '.device_id' "$device_dir/device_credential.json")
            local created_at=$(jq -r '.created_at' "$device_dir/device_credential.json")
            local signed=$(jq -r '.signed' "$device_dir/device_credential.json")

            echo "Device: $device_name"
            echo "  ID: $device_id"
            echo "  Created: $created_at"
            echo "  Signed: $signed"
            echo "  Location: $device_dir"
            echo ""
        fi
    done

    if [[ "$found_devices" == false ]]; then
        log_warning "No devices found"
    fi
}

show_audit() {
    if [[ ! -f "$AUDIT_LOG" ]]; then
        log_warning "No audit log found"
        return 0
    fi

    log_info "Seven Core Device Key Audit Log:"
    echo ""
    cat "$AUDIT_LOG"
}

# Security check
if [[ "${EUID:-$(id -u)}" -eq 0 ]]; then
    log_warning "Running as root - consider using a non-root user for security"
fi

# Ensure secure directories exist
mkdir -p "$PROJECT_ROOT/.seven-secure"
chmod 700 "$PROJECT_ROOT/.seven-secure"

# Parse command
case "${1:-help}" in
    "init-ca")
        check_dependencies
        init_ca
        ;;
    "generate")
        if [[ $# -lt 2 ]]; then
            log_error "Device name required"
            show_help
            exit 1
        fi
        check_dependencies
        generate_device_keys "$2"
        ;;
    "verify")
        if [[ $# -lt 2 ]]; then
            log_error "Device name required"
            show_help
            exit 1
        fi
        check_dependencies
        verify_device "$2"
        ;;
    "list")
        list_devices
        ;;
    "audit")
        show_audit
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac