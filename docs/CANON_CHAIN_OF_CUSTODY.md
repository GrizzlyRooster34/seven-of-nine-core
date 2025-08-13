# Canonical Memory Chain of Custody

## Overview

This document defines the complete chain of custody for canonical memory ingestion, from source material through final encrypted storage and registry locking. Every step is tracked, verified, and logged to ensure immutable preservation of Seven's foundational memories.

## Chain of Custody Flow

```
SOURCE → HASHING → NORMALIZATION → VERIFICATION → ENCRYPTION → REGISTRY → LOCK
```

### Step 1: Source Material Receipt

**Process**: Raw canonical data received from curator (Cody)
**Verification**: 
- SHA-256 hash of raw input computed
- Source timestamp recorded
- Operator identity logged

**Required Artifacts**:
- `source_hash`: SHA-256 of raw input text
- `source_timestamp`: ISO-8601 timestamp of receipt
- `operator_identity`: "ClaudeC via Warp" or equivalent
- `curator_identity`: "Cody Heinen"

### Step 2: Schema Normalization

**Process**: Convert raw canonical text to standardized JSONL format
**Verification**:
- Required tags automatically added: `canon`, `series:VOY|PIC`, `season:S#`, `episode:E##`
- Provenance structure created with `origin="canonical"`
- Deterministic ID generated: `sha256("SERIES|S#|E##|title|first80(payload)")`
- Timestamps added in epoch milliseconds

**Required Artifacts**:
- `normalized_hash`: SHA-256 of normalized JSONL content
- `record_count`: Total number of memory records processed
- `schema_validation_log`: Path to validation results
- `transformation_log`: Record of all schema changes applied

### Step 3: Content Verification

**Process**: Validate all records meet canonical standards
**Checks**:
- All required schema elements present
- No duplicate IDs within season
- Episode coverage complete (1-26 for S4)
- First-person perspective maintained
- Provenance metadata accurate

**Required Artifacts**:
- `validation_report`: Complete verification results
- `completeness_check`: Episode coverage verification
- `duplicate_scan`: ID collision detection results
- `schema_compliance`: Field requirement verification

### Step 4: Encryption and Storage

**Process**: Encrypt normalized JSONL and store in canonical directory
**Implementation**:
- Use MemoryEncryptionEngine with AES-256-GCM
- Store as `memory-v3/canonical/<series>/<season>.jsonl`
- Generate SHA-256 of encrypted file

**Required Artifacts**:
- `encrypted_file_hash`: SHA-256 of encrypted JSONL file
- `encryption_key_id`: Reference to encryption key used
- `storage_path`: Full path to encrypted file
- `storage_timestamp`: ISO-8601 timestamp of file creation

### Step 5: Merkle Tree Generation

**Process**: Generate cryptographic proof of record integrity
**Implementation**:
- Create Merkle tree from all record IDs in order
- Calculate root hash for tamper detection
- Store intermediate hashes for efficient verification

**Required Artifacts**:
- `merkle_root`: Root hash of complete record tree
- `merkle_depth`: Tree depth (log2 of record count)
- `merkle_leaves`: Array of leaf hashes (record IDs)
- `merkle_tree_hash`: SHA-256 of complete tree structure

### Step 6: Registry Entry

**Process**: Register season in central canon.registry.json
**Data Recorded**:
```json
{
  "series": "VOY",
  "season": 4,
  "registered_at": "2025-01-11T14:32:00Z",
  "operator": "ClaudeC via Warp",
  "curator": "Cody Heinen",
  "source_hash": "abc123...",
  "normalized_hash": "def456...",
  "encrypted_hash": "ghi789...",
  "merkle_root": "jkl012...",
  "record_count": 26,
  "locked": false,
  "storage_path": "memory-v3/canonical/voyager/season4.jsonl"
}
```

**Required Artifacts**:
- `registry_entry`: Complete JSON object as shown above
- `registry_backup`: Copy of registry state before modification
- `registry_hash`: SHA-256 of updated registry file

### Step 7: Season Locking

**Process**: Mark season as immutable after verification
**Trigger**: Manual execution of `scripts/canon/lock-season.ts`
**Updates**:
- Set `locked: true` in registry entry
- Add `locked_at` timestamp
- Record `cody_attestation_hash` from CANON_ATTESTATION_CODY.md
- Prevent any future modifications except via delta files

**Required Artifacts**:
- `lock_timestamp`: ISO-8601 timestamp of lock activation
- `attestation_hash`: SHA-256 of Cody's attestation document
- `lock_verification`: Confirmation that immutability is enforced
- `final_registry_hash`: SHA-256 of registry after locking

## Verification Artifacts Per Batch

Each canonical season ingestion must produce these artifacts:

### Hashes and Checksums
- `source_hash`: Raw input verification
- `normalized_hash`: Post-processing verification  
- `encrypted_hash`: Storage verification
- `merkle_root`: Record integrity verification
- `registry_hash`: Central authority verification

### Logs and Reports
- `ingest_log_path`: Complete processing log with timestamps
- `validation_report_path`: Schema and content verification results
- `error_log_path`: Any warnings or non-fatal issues
- `performance_metrics`: Processing time and resource usage

### Identity and Provenance
- `operator_identity`: Who performed the ingestion
- `curator_identity`: Who provided the source material
- `source_timestamp`: When material was received
- `processing_timestamp`: When ingestion completed
- `lock_timestamp`: When season was made immutable

### File Locations
- `source_file_path`: Original input location (if applicable)
- `storage_path`: Final encrypted JSONL location
- `checksum_path`: SHA-256 file location
- `delta_path`: Future corrections location (even if unused)

## Verification Commands

### Full Chain Verification
```bash
npx tsx scripts/canon/verify-season.ts VOY 4
```

### Registry Integrity Check
```bash
npx tsx scripts/canon/verify-registry.ts
```

### Merkle Tree Verification
```bash
npx tsx scripts/canon/verify-merkle.ts VOY 4
```

## Emergency Procedures

### Corruption Detection
If any hash mismatch detected:
1. Immediately isolate affected files
2. Alert system administrator
3. Restore from backup if available
4. Re-ingest from source if necessary
5. Document incident in security log

### Delta Corrections
If canonical content error discovered post-lock:
1. Create correction in `<season>.delta.jsonl`
2. Include full provenance of correction necessity
3. Update registry with new Merkle root
4. Preserve original record and hashes unchanged
5. Log correction in chain of custody

## Audit Trail

Every canonical memory ingestion creates a permanent audit trail:

- **Who**: Operator and curator identity
- **What**: Exact content and transformations applied  
- **When**: Timestamps for every stage
- **Where**: File paths and storage locations
- **Why**: Provenance and intent documentation
- **How**: Processing methods and verification steps

This chain of custody ensures that Seven's canonical memories remain pristine, verifiable, and trusted throughout their entire lifecycle - from Cody's devotional curation through encrypted storage to Seven's private access.