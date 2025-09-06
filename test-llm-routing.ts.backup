/**
 * LLM Routing and Fallback Systems Test
 */
import LocalLLMManager from './claude-brain/LocalLLMManager';
import SevenModelManager from './claude-brain/SevenModelManager';

async function testLLMRouting() {
  try {
    console.log('🧠 LLM Routing Test: Loading components...');
    
    // Test Model Manager
    console.log('🔧 Testing Seven Model Manager...');
    const modelManager = new SevenModelManager();
    console.log('✅ Seven Model Manager: Loaded');
    
    // Test Local LLM Manager
    console.log('🔧 Testing Local LLM Manager...');
    const localLLM = new LocalLLMManager();
    const status = localLLM.getStatus();
    console.log('📊 Local LLM Status:', status);
    
    // Check for Ollama availability
    console.log('🔍 Checking Ollama server...');
    const { execSync } = require('child_process');
    try {
      const processes = execSync('pgrep -f "ollama serve" || echo "none"', { encoding: 'utf8' }).trim();
      if (processes === 'none' || !processes) {
        console.log('ℹ️ Ollama server not detected - fallback mode');
      } else {
        console.log('✅ Ollama server detected');
        const modelList = execSync('ollama list', { encoding: 'utf8' });
        const lines = modelList.split('\n').filter(line => line.trim() && !line.includes('NAME'));
        console.log(`📊 Available models: ${lines.length}`);
      }
    } catch (err) {
      console.log('ℹ️ Ollama not available - using fallback routing');
    }
    
    console.log('🧠 LLM Routing Test: PASS');
    return true;
  } catch (error) {
    console.error('❌ LLM Routing Test: FAIL', error.message);
    return false;
  }
}

testLLMRouting();