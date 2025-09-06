

/**
 * Termux Voice Bridge (Optional)
 * termux:api integration for speech recognition/synthesis
 */

export class TermuxVoiceBridge {
  async setupVoiceRecognition(): Promise<void> {
    console.log('Setting up Termux voice recognition...');
    
    // Check if termux:api is available
    try {
      execSync('which termux-speech-to-text', { stdio: 'pipe' });
      console.log('✅ termux:api speech-to-text available');
    } catch {
      console.log('❌ termux:api not installed. Install with: pkg install termux-api');
      return;
    }
  }

  async listenForVoiceCommand(): Promise<string> {
    try {
      const result = execSync('termux-speech-to-text', { 
        encoding: 'utf8',
        timeout: 10000 
      });
      
      return result.trim();
    } catch (error) {
      console.log('Voice recognition failed:', error);
      return '';
    }
  }

  async speakResponse(text: string): Promise<void> {
    try {
      execSync(`termux-tts-speak "${text}"`, { stdio: 'inherit' });
    } catch (error) {
      console.log('Text-to-speech failed:', error);
    }
  }
}
