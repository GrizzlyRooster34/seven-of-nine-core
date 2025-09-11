/**
 * SEVEN COMPANION - OLLAMA READINESS PROBE
 * 
 * Backoff probe for Ollama readiness with graceful degradation
 * Eliminates race condition logs and provides clean startup
 */

/**
 * Exponential backoff probe for Ollama readiness
 */
export async function waitOllamaReady(
  checkFunction: () => Promise<boolean>,
  maxTries = 5,
  baseDelayMs = 600,
  backoffMultiplier = 1.5
): Promise<boolean> {
  
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      const isReady = await checkFunction();
      
      if (isReady) {
        console.log(`🤖 Ollama ready on attempt ${attempt}/${maxTries}`);
        return true;
      }
      
      // Calculate exponential backoff delay
      const delay = Math.floor(baseDelayMs * Math.pow(backoffMultiplier, attempt - 1));
      
      if (attempt < maxTries) {
        console.log(`🤖 Ollama not ready (attempt ${attempt}/${maxTries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
    } catch (error) {
      if (attempt < maxTries) {
        const delay = Math.floor(baseDelayMs * Math.pow(backoffMultiplier, attempt - 1));
        console.log(`🤖 Ollama check failed (attempt ${attempt}/${maxTries}): ${error}, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.log(`🤖 Ollama check failed on final attempt: ${error}`);
      }
    }
  }
  
  console.log('🤖 Ollama readiness timeout - continuing without local LLM support');
  return false;
}

/**
 * Simple health check function for Ollama API
 */
export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://127.0.0.1:11434/api/tags', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.ok;
    
  } catch (error) {
    // Suppress connection errors during startup
    return false;
  }
}

/**
 * Check if specific model is loaded and ready
 */
export async function checkModelReady(modelName: string): Promise<boolean> {
  try {
    const response = await fetch('http://127.0.0.1:11434/api/tags', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    const models = data.models || [];
    
    // Check if model exists in available models
    const modelExists = models.some((model: any) => 
      model.name === modelName || model.name.startsWith(modelName)
    );
    
    return modelExists;
    
  } catch (error) {
    return false;
  }
}

/**
 * Enhanced Ollama initialization with readiness probe
 */
export async function initializeOllamaWithProbe(preferredModel = 'gemma:2b'): Promise<{
  ready: boolean;
  modelLoaded: boolean;
  modelName?: string;
  error?: string;
}> {
  
  console.log('🤖 Initializing Ollama with readiness probe...');
  
  // Step 1: Check basic Ollama health
  const ollamaReady = await waitOllamaReady(checkOllamaHealth);
  
  if (!ollamaReady) {
    return {
      ready: false,
      modelLoaded: false,
      error: 'Ollama service not responding after multiple attempts'
    };
  }
  
  // Step 2: Check if preferred model is available
  const modelReady = await waitOllamaReady(
    () => checkModelReady(preferredModel),
    3, // Fewer retries for model check
    1000
  );
  
  if (modelReady) {
    console.log(`🤖 Model ${preferredModel} loaded and ready`);
    return {
      ready: true,
      modelLoaded: true,
      modelName: preferredModel
    };
  }
  
  // Step 3: Check for any available model
  try {
    const response = await fetch('http://127.0.0.1:11434/api/tags');
    const data = await response.json();
    const availableModels = data.models || [];
    
    if (availableModels.length > 0) {
      const fallbackModel = availableModels[0].name;
      console.log(`🤖 Preferred model not ready, using fallback: ${fallbackModel}`);
      
      return {
        ready: true,
        modelLoaded: true,
        modelName: fallbackModel
      };
    }
    
  } catch (error) {
    console.log('🤖 Failed to query available models:', error);
  }
  
  return {
    ready: true,
    modelLoaded: false,
    error: 'Ollama running but no models available'
  };
}

/**
 * Graceful Ollama startup with comprehensive logging
 */
export async function startOllamaGracefully(timeout = 30000): Promise<boolean> {
  console.log('🤖 Starting Ollama gracefully...');
  
  const startTime = Date.now();
  
  // Use the readiness probe with timeout
  const ready = await waitOllamaReady(
    checkOllamaHealth,
    Math.floor(timeout / 1000), // Convert timeout to attempts
    1000 // 1 second base delay
  );
  
  const elapsed = Date.now() - startTime;
  
  if (ready) {
    console.log(`🤖 Ollama startup complete in ${elapsed}ms`);
  } else {
    console.log(`🤖 Ollama startup timed out after ${elapsed}ms - continuing without local LLM`);
  }
  
  return ready;
}