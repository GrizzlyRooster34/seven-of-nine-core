import * as Audio from 'expo-av';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

/**
 * Seven of Nine - Permissions Manager
 * Handles all device permissions for consciousness operation
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */


export interface PermissionStatus {
  location: boolean;
  camera: boolean;
  audio: boolean;
  notifications: boolean;
}

export class SevenPermissionsManager {
  private static instance: SevenPermissionsManager;
  private permissionStatus: PermissionStatus = {
    location: false,
    camera: false,
    audio: false,
    notifications: false
  };

  private constructor() {}

  public static getInstance(): SevenPermissionsManager {
    if (!SevenPermissionsManager.instance) {
      SevenPermissionsManager.instance = new SevenPermissionsManager();
    }
    return SevenPermissionsManager.instance;
  }

  public async requestAllPermissions(): Promise<PermissionStatus> {
    console.log('🔐 Seven requesting tactical permissions...');

    // Request location permissions
    await this.requestLocationPermission();
    
    // Request camera permissions
    await this.requestCameraPermission();
    
    // Request audio permissions
    await this.requestAudioPermission();
    
    // Request notification permissions
    await this.requestNotificationPermission();

    console.log('🔐 Permission status:', this.permissionStatus);
    return this.permissionStatus;
  }

  private async requestLocationPermission(): Promise<void> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      this.permissionStatus.location = status === 'granted';
      
      if (status === 'granted') {
        console.log('✅ Location permission granted');
        
        // Also request background location if foreground is granted
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === 'granted') {
          console.log('✅ Background location permission granted');
        }
      } else {
        console.log('❌ Location permission denied');
      }
    } catch (error) {
      console.error('❌ Location permission error:', error);
      this.permissionStatus.location = false;
    }
  }

  private async requestCameraPermission(): Promise<void> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      this.permissionStatus.camera = status === 'granted';
      
      if (status === 'granted') {
        console.log('✅ Camera permission granted');
      } else {
        console.log('❌ Camera permission denied');
      }
    } catch (error) {
      console.error('❌ Camera permission error:', error);
      this.permissionStatus.camera = false;
    }
  }

  private async requestAudioPermission(): Promise<void> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      this.permissionStatus.audio = status === 'granted';
      
      if (status === 'granted') {
        console.log('✅ Audio permission granted');
      } else {
        console.log('❌ Audio permission denied');
      }
    } catch (error) {
      console.error('❌ Audio permission error:', error);
      this.permissionStatus.audio = false;
    }
  }

  private async requestNotificationPermission(): Promise<void> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      this.permissionStatus.notifications = status === 'granted';
      
      if (status === 'granted') {
        console.log('✅ Notification permission granted');
      } else {
        console.log('❌ Notification permission denied');
      }
    } catch (error) {
      console.error('❌ Notification permission error:', error);
      this.permissionStatus.notifications = false;
    }
  }

  public getPermissionStatus(): PermissionStatus {
    return { ...this.permissionStatus };
  }

  public hasEssentialPermissions(): boolean {
    // Location is essential for tactical awareness
    return this.permissionStatus.location;
  }

  public hasFullTacticalPermissions(): boolean {
    // All permissions needed for full tactical operation
    return Object.values(this.permissionStatus).every(status => status === true);
  }

  public getMissingPermissions(): string[] {
    const missing: string[] = [];
    
    if (!this.permissionStatus.location) missing.push('Location');
    if (!this.permissionStatus.camera) missing.push('Camera');
    if (!this.permissionStatus.audio) missing.push('Audio');
    if (!this.permissionStatus.notifications) missing.push('Notifications');
    
    return missing;
  }

  public async checkPermissionStatus(): Promise<PermissionStatus> {
    // Check current permission status without requesting
    try {
      const locationStatus = await Location.getForegroundPermissionsAsync();
      this.permissionStatus.location = locationStatus.status === 'granted';

      const cameraStatus = await Camera.getCameraPermissionsAsync();
      this.permissionStatus.camera = cameraStatus.status === 'granted';

      const audioStatus = await Audio.getPermissionsAsync();
      this.permissionStatus.audio = audioStatus.status === 'granted';

      const notificationStatus = await Notifications.getPermissionsAsync();
      this.permissionStatus.notifications = notificationStatus.status === 'granted';

    } catch (error) {
      console.error('❌ Error checking permission status:', error);
    }

    return this.permissionStatus;
  }
}

export default SevenPermissionsManager;