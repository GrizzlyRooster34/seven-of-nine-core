/**
 * SEVEN WINDOWS - NOTIFICATION IMPLEMENTATION
 * Windows toast and notification system with Seven branding
 */

import { Alert } from 'react-native';
import type { Notifier } from '@seven/ports';

class SevenNotifierWindows implements Notifier {
  async toast(msg: string): Promise<void> {
    try {
      // TODO: Integrate with Windows native toast when WinRT bridge available
      // For now, use React Native Alert as fallback
      console.log('🍞 Seven Toast (Windows):', msg);
      
      // Show alert as temporary solution
      Alert.alert('Seven Companion', msg, [{ text: 'Acknowledged' }]);
    } catch (error) {
      console.error('Toast notification failed:', error);
    }
  }

  async notify(title: string, body: string): Promise<void> {
    try {
      // TODO: Use Windows native notifications (WinRT)
      console.log('📢 Seven Notification (Windows):', { title, body });
      
      Alert.alert(title, body, [
        { text: 'Acknowledged', style: 'default' }
      ]);
    } catch (error) {
      console.error('Push notification failed:', error);
    }
  }
}

export const createNotifier = (): Notifier => new SevenNotifierWindows();