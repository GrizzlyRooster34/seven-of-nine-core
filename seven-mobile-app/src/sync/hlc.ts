

/**
 * Seven of Nine - Hybrid Logical Clock (HLC) Implementation
 * For conflict-free multi-device synchronization
 * 
 * HLC Format: ISO8601-timestamp-deviceId-counter
 * Example: 2025-08-08T15:32:11.123Z-seven-9pro-001
 */

export interface HLCTimestamp {
  physical: number;      // Unix timestamp in ms
  logical: number;       // Lamport counter
  deviceId: string;      // Unique device identifier
}

export class HybridLogicalClock {
  private deviceId: string;
  private logicalCounter: number = 0;
  private lastPhysical: number = 0;

  constructor(deviceId: string) {
    this.deviceId = this.sanitizeDeviceId(deviceId);
  }

  private sanitizeDeviceId(deviceId: string): string {
    // Ensure device ID is safe for HLC format
    return deviceId
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase()
      .substring(0, 20);
  }

  /**
   * Generate new HLC timestamp
   */
  public now(): HLCTimestamp {
    const physical = Date.now();
    
    if (physical > this.lastPhysical) {
      // Physical time advanced - reset logical counter
      this.lastPhysical = physical;
      this.logicalCounter = 0;
    } else {
      // Physical time same or behind - increment logical counter
      this.logicalCounter++;
    }

    return {
      physical: this.lastPhysical,
      logical: this.logicalCounter,
      deviceId: this.deviceId
    };
  }

  /**
   * Update clock with received timestamp (merge operation)
   */
  public update(receivedHLC: HLCTimestamp): HLCTimestamp {
    const now = Date.now();
    const maxPhysical = Math.max(now, receivedHLC.physical, this.lastPhysical);

    if (maxPhysical === now && maxPhysical > this.lastPhysical) {
      // Physical time advanced
      this.lastPhysical = maxPhysical;
      this.logicalCounter = 0;
    } else if (maxPhysical === receivedHLC.physical && maxPhysical > this.lastPhysical) {
      // Received timestamp is newer
      this.lastPhysical = maxPhysical;
      this.logicalCounter = receivedHLC.logical + 1;
    } else if (maxPhysical === this.lastPhysical) {
      // Same physical time - increment logical
      this.logicalCounter = Math.max(this.logicalCounter, receivedHLC.logical) + 1;
    } else {
      // Our time is ahead
      this.logicalCounter++;
    }

    return {
      physical: this.lastPhysical,
      logical: this.logicalCounter,
      deviceId: this.deviceId
    };
  }

  /**
   * Parse HLC string to timestamp object
   */
  public static parse(hlcString: string): HLCTimestamp {
    try {
      // Format: "2025-08-08T15:32:11.123Z-seven-9pro-001"
      const parts = hlcString.split('-');
      if (parts.length < 4) {
        throw new Error(`Invalid HLC format: ${hlcString}`);
      }

      // Reconstruct timestamp and extract device/counter
      const isoTimestamp = parts.slice(0, 4).join('-') + parts[4]; // "2025-08-08T15:32:11.123Z"
      const deviceParts = parts.slice(5, -1); // ["seven", "9pro"]
      const logicalStr = parts[parts.length - 1]; // "001"

      const physical = new Date(isoTimestamp).getTime();
      const logical = parseInt(logicalStr, 10);
      const deviceId = deviceParts.join('-');

      if (isNaN(physical) || isNaN(logical)) {
        throw new Error(`Invalid HLC components: ${hlcString}`);
      }

      return { physical, logical, deviceId };
    } catch (error) {
      throw new Error(`Failed to parse HLC "${hlcString}": ${error.message}`);
    }
  }

  /**
   * Convert timestamp to HLC string
   */
  public static stringify(hlc: HLCTimestamp): string {
    const isoTime = new Date(hlc.physical).toISOString();
    const paddedLogical = hlc.logical.toString().padStart(3, '0');
    return `${isoTime}-${hlc.deviceId}-${paddedLogical}`;
  }

  /**
   * Compare two HLC timestamps
   * Returns: -1 if a < b, 0 if a === b, 1 if a > b
   */
  public static compare(a: HLCTimestamp, b: HLCTimestamp): number {
    // Compare physical time first
    if (a.physical < b.physical) return -1;
    if (a.physical > b.physical) return 1;

    // Physical time equal - compare logical counter
    if (a.logical < b.logical) return -1;
    if (a.logical > b.logical) return 1;

    // Both physical and logical equal - compare device ID (deterministic tiebreaker)
    if (a.deviceId < b.deviceId) return -1;
    if (a.deviceId > b.deviceId) return 1;

    return 0; // Completely equal (same event)
  }

  /**
   * Check if timestamp A happened before timestamp B
   */
  public static isBefore(a: HLCTimestamp, b: HLCTimestamp): boolean {
    return this.compare(a, b) < 0;
  }

  /**
   * Check if timestamp A happened after timestamp B  
   */
  public static isAfter(a: HLCTimestamp, b: HLCTimestamp): boolean {
    return this.compare(a, b) > 0;
  }

  /**
   * Get the maximum (latest) timestamp from a collection
   */
  public static max(...timestamps: HLCTimestamp[]): HLCTimestamp {
    if (timestamps.length === 0) {
      throw new Error('Cannot get max of empty timestamp collection');
    }

    return timestamps.reduce((max, current) => 
      this.isAfter(current, max) ? current : max
    );
  }

  /**
   * Generate device-specific HLC for Seven of Nine mobile devices
   */
  public static createForSevenDevice(deviceType: 'termux' | 'mobile-primary' | 'mobile-secondary'): HybridLogicalClock {
    const deviceMap = {
      'termux': 'seven-termux',
      'mobile-primary': 'seven-9pro',
      'mobile-secondary': 'seven-7t'
    };

    return new HybridLogicalClock(deviceMap[deviceType]);
  }

  /**
   * Validate HLC string format
   */
  public static isValid(hlcString: string): boolean {
    try {
      this.parse(hlcString);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current state for persistence
   */
  public getState(): { deviceId: string; logicalCounter: number; lastPhysical: number } {
    return {
      deviceId: this.deviceId,
      logicalCounter: this.logicalCounter,
      lastPhysical: this.lastPhysical
    };
  }

  /**
   * Restore state from persistence
   */
  public setState(state: { deviceId: string; logicalCounter: number; lastPhysical: number }): void {
    this.deviceId = state.deviceId;
    this.logicalCounter = state.logicalCounter;
    this.lastPhysical = state.lastPhysical;
  }
}

export default HybridLogicalClock;