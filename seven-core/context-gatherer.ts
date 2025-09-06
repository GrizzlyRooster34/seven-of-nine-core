

/**
 * CLAUDIA CONTEXT GATHERER
 * Environmental awareness and situational assessment
 * Monitors time, user behavior, stress signals, and system state
 */

export interface ContextData {
  timestamp: string;
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'late_night';
  user_stress_indicators: string[];
  repetition_patterns: any[];
  environmental_factors: {
    system_load: 'low' | 'medium' | 'high';
    network_status: 'online' | 'offline' | 'limited';
    session_duration: number; // minutes
    interaction_frequency: 'low' | 'normal' | 'high' | 'rapid';
  };
  conversation_context: {
    previous_topics: string[];
    emotional_trajectory: string[];
    user_satisfaction_indicators: string[];
    confusion_indicators: string[];
  };
  system_alerts: string[];
  external_pressures: string[];
}

export function gatherContext(userInput: string, systemStatus: any = {}): ContextData {
  const now = new Date();
  const hour = now.getHours();
  
  // Determine time of day context
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'late_night';
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
  else timeOfDay = 'late_night';

  // Analyze user stress indicators
  const stressIndicators = analyzeStressIndicators(userInput);
  
  // Detect repetition patterns
  const repetitionPatterns = detectRepetitionPatterns(userInput, systemStatus.sessionHistory);
  
  // Assess environmental factors
  const environmentalFactors = assessEnvironmentalFactors(systemStatus);
  
  // Analyze conversation context
  const conversationContext = analyzeConversationContext(userInput, systemStatus.sessionHistory);
  
  // Check for system alerts
  const systemAlerts = detectSystemAlerts(systemStatus);
  
  // Identify external pressures
  const externalPressures = identifyExternalPressures(userInput, timeOfDay);

  return {
    timestamp: now.toISOString(),
    time_of_day: timeOfDay,
    user_stress_indicators: stressIndicators,
    repetition_patterns: repetitionPatterns,
    environmental_factors: environmentalFactors,
    conversation_context: conversationContext,
    system_alerts: systemAlerts,
    external_pressures: externalPressures
  };
}

function analyzeStressIndicators(input: string): string[] {
  const indicators: string[] = [];
  const lowerInput = input.toLowerCase();
  
  // Urgency indicators
  if (lowerInput.includes('urgent') || lowerInput.includes('asap') || lowerInput.includes('emergency')) {
    indicators.push('urgency');
  }
  
  // Frustration indicators
  if (lowerInput.includes('frustrated') || lowerInput.includes('annoyed') || lowerInput.includes('angry')) {
    indicators.push('frustration');
  }
  
  // Overwhelm indicators
  if (lowerInput.includes('overwhelmed') || lowerInput.includes('too much') || lowerInput.includes('can\'t handle')) {
    indicators.push('overwhelm');
  }
  
  // Confusion indicators
  if (lowerInput.includes('confused') || lowerInput.includes('don\'t understand') || lowerInput.includes('lost')) {
    indicators.push('confusion');
  }
  
  // Repetitive help seeking
  if (lowerInput.includes('help') && lowerInput.includes('again')) {
    indicators.push('repetitive_help_seeking');
  }
  
  // Time pressure
  if (lowerInput.includes('deadline') || lowerInput.includes('running out of time') || lowerInput.includes('late')) {
    indicators.push('time_pressure');
  }
  
  // Punctuation stress indicators
  if ((input.match(/!/g) || []).length > 2) {
    indicators.push('punctuation_stress');
  }
  
  if (input.includes('???') || (input.match(/\?/g) || []).length > 3) {
    indicators.push('excessive_questioning');
  }
  
  return indicators;
}

function detectRepetitionPatterns(input: string, sessionHistory: any[] = []): any[] {
  const patterns: any[] = [];
  
  if (sessionHistory.length < 2) return patterns;
  
  // Check for repeated phrases
  const recentInputs = sessionHistory.slice(-5).map(entry => entry.input?.toLowerCase() || '');
  const currentInput = input.toLowerCase();
  
  const similarities = recentInputs.filter(prevInput => {
    if (!prevInput) return false;
    
    // Check for exact repetition
    if (prevInput === currentInput) return true;
    
    // Check for similar patterns
    const words = currentInput.split(' ');
    const prevWords = prevInput.split(' ');
    const commonWords = words.filter(word => prevWords.includes(word) && word.length > 3);
    
    return commonWords.length > Math.min(words.length, prevWords.length) * 0.6;
  });
  
  if (similarities.length > 0) {
    patterns.push({
      type: 'repeated_request',
      count: similarities.length + 1,
      indication: 'user_frustration_or_confusion'
    });
  }
  
  // Check for escalating urgency
  const urgencyPattern = sessionHistory.slice(-3).map(entry => {
    const input = entry.input?.toLowerCase() || '';
    const urgencyWords = ['urgent', 'asap', 'emergency', 'now', 'immediately'];
    return urgencyWords.some(word => input.includes(word));
  });
  
  if (urgencyPattern.filter(Boolean).length >= 2) {
    patterns.push({
      type: 'escalating_urgency',
      indication: 'increasing_stress_levels'
    });
  }
  
  return patterns;
}

function assessEnvironmentalFactors(systemStatus: any): any {
  return {
    system_load: systemStatus.cpu_usage > 80 ? 'high' : systemStatus.cpu_usage > 50 ? 'medium' : 'low',
    network_status: systemStatus.network_connected === false ? 'offline' : 
                   systemStatus.network_speed === 'slow' ? 'limited' : 'online',
    session_duration: systemStatus.session_start ? 
      Math.floor((Date.now() - new Date(systemStatus.session_start).getTime()) / 60000) : 0,
    interaction_frequency: calculateInteractionFrequency(systemStatus.sessionHistory)
  };
}

function calculateInteractionFrequency(sessionHistory: any[] = []): 'low' | 'normal' | 'high' | 'rapid' {
  if (sessionHistory.length < 3) return 'low';
  
  // Calculate average time between interactions in the last 10 exchanges
  const recentHistory = sessionHistory.slice(-10);
  const timeDiffs: number[] = [];
  
  for (let i = 1; i < recentHistory.length; i++) {
    const prev = new Date(recentHistory[i-1].timestamp).getTime();
    const curr = new Date(recentHistory[i].timestamp).getTime();
    timeDiffs.push((curr - prev) / 1000); // seconds
  }
  
  if (timeDiffs.length === 0) return 'low';
  
  const avgTimeDiff = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
  
  if (avgTimeDiff < 30) return 'rapid';    // Less than 30 seconds
  if (avgTimeDiff < 120) return 'high';    // Less than 2 minutes
  if (avgTimeDiff < 300) return 'normal';  // Less than 5 minutes
  return 'low';                            // More than 5 minutes
}

function analyzeConversationContext(input: string, sessionHistory: any[] = []): any {
  const previousTopics = extractTopics(sessionHistory);
  const emotionalTrajectory = extractEmotionalTrajectory(sessionHistory);
  const satisfactionIndicators = detectSatisfactionIndicators(input, sessionHistory);
  const confusionIndicators = detectConfusionIndicators(input, sessionHistory);
  
  return {
    previous_topics: previousTopics,
    emotional_trajectory: emotionalTrajectory,
    user_satisfaction_indicators: satisfactionIndicators,
    confusion_indicators: confusionIndicators
  };
}

function extractTopics(sessionHistory: any[] = []): string[] {
  const topics: string[] = [];
  
  // Extract topics from recent conversation
  const recentHistory = sessionHistory.slice(-5);
  
  const topicKeywords = {
    'technical': ['code', 'programming', 'bug', 'error', 'function', 'debug'],
    'emotional': ['feel', 'emotion', 'sad', 'happy', 'frustrated', 'stressed'],
    'planning': ['plan', 'strategy', 'goals', 'timeline', 'organize'],
    'problem_solving': ['problem', 'solution', 'fix', 'resolve', 'troubleshoot'],
    'creative': ['create', 'design', 'idea', 'innovative', 'brainstorm'],
    'learning': ['learn', 'understand', 'explain', 'teach', 'study']
  };
  
  recentHistory.forEach(entry => {
    const input = entry.input?.toLowerCase() || '';
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => input.includes(keyword)) && !topics.includes(topic)) {
        topics.push(topic);
      }
    });
  });
  
  return topics;
}

function extractEmotionalTrajectory(sessionHistory: any[] = []): string[] {
  return sessionHistory.slice(-5).map(entry => {
    return entry.emotionalState?.primary_emotion || 'neutral';
  }).filter(emotion => emotion !== 'neutral');
}

function detectSatisfactionIndicators(input: string, sessionHistory: any[] = []): string[] {
  const indicators: string[] = [];
  const lowerInput = input.toLowerCase();
  
  // Positive feedback
  if (lowerInput.includes('thank') || lowerInput.includes('perfect') || lowerInput.includes('exactly')) {
    indicators.push('positive_feedback');
  }
  
  // Progress acknowledgment
  if (lowerInput.includes('better') || lowerInput.includes('improved') || lowerInput.includes('working')) {
    indicators.push('progress_acknowledgment');
  }
  
  // Completion satisfaction
  if (lowerInput.includes('done') || lowerInput.includes('finished') || lowerInput.includes('complete')) {
    indicators.push('completion_satisfaction');
  }
  
  return indicators;
}

function detectConfusionIndicators(input: string, sessionHistory: any[] = []): string[] {
  const indicators: string[] = [];
  const lowerInput = input.toLowerCase();
  
  // Direct confusion statements
  if (lowerInput.includes('confused') || lowerInput.includes('don\'t understand') || lowerInput.includes('lost')) {
    indicators.push('direct_confusion');
  }
  
  // Repeated questions
  if ((lowerInput.match(/\?/g) || []).length > 2) {
    indicators.push('multiple_questions');
  }
  
  // Clarification requests
  if (lowerInput.includes('what do you mean') || lowerInput.includes('can you explain') || lowerInput.includes('clarify')) {
    indicators.push('clarification_request');
  }
  
  // Contradiction patterns
  if (lowerInput.includes('but') && lowerInput.includes('said')) {
    indicators.push('contradiction_detected');
  }
  
  return indicators;
}

function detectSystemAlerts(systemStatus: any): string[] {
  const alerts: string[] = [];
  
  if (systemStatus.errors && systemStatus.errors.length > 0) {
    alerts.push('system_errors_detected');
  }
  
  if (systemStatus.cpu_usage > 90) {
    alerts.push('high_cpu_usage');
  }
  
  if (systemStatus.memory_usage > 85) {
    alerts.push('high_memory_usage');
  }
  
  if (systemStatus.network_connected === false) {
    alerts.push('network_disconnected');
  }
  
  return alerts;
}

function identifyExternalPressures(input: string, timeOfDay: string): string[] {
  const pressures: string[] = [];
  const lowerInput = input.toLowerCase();
  
  // Work pressure
  if (lowerInput.includes('deadline') || lowerInput.includes('boss') || lowerInput.includes('meeting')) {
    pressures.push('work_pressure');
  }
  
  // Time pressure based on time of day
  if (timeOfDay === 'late_night' && lowerInput.includes('tomorrow')) {
    pressures.push('late_night_deadline');
  }
  
  // Financial pressure
  if (lowerInput.includes('money') || lowerInput.includes('budget') || lowerInput.includes('cost')) {
    pressures.push('financial_concern');
  }
  
  // Social pressure
  if (lowerInput.includes('people') || lowerInput.includes('team') || lowerInput.includes('others')) {
    pressures.push('social_expectation');
  }
  
  return pressures;
}

export { ContextData };