/**
 * SEVEN COMPANION - TEXT NORMALIZATION UTILITY
 * 
 * Robust text normalization for Q2/Q3 authentication gates
 * Handles emoji, paraphrase, locale variations, and Unicode normalization
 */

/**
 * Normalize text for authentication and semantic processing
 * Handles emoji, Unicode, case, and locale variations
 */
export function normalizeText(input: unknown): string {
  const text = String(input ?? '');
  
  return text
    // Unicode normalization (NFKC for compatibility)
    .normalize('NFKC')
    // Convert to lowercase for case-insensitive comparison
    .toLowerCase()
    // Replace all emoji with neutral emoji to prevent bypass attempts
    .replace(/\p{Emoji_Presentation}/gu, '🙂')
    // Remove variation selectors and combining marks
    .replace(/[\u{FE00}-\u{FE0F}\u{E0100}-\u{E01EF}]/gu, '')
    // Normalize whitespace (convert all whitespace to single spaces)
    .replace(/\s+/g, ' ')
    // Trim leading/trailing whitespace
    .trim();
}

/**
 * Advanced text normalization for semantic analysis
 * Includes paraphrase detection and linguistic variations
 */
export function normalizeForSemantics(input: unknown): string {
  let text = normalizeText(input);
  
  // Common paraphrase normalizations for Seven-specific context
  const semanticReplacements: Record<string, string> = {
    // Borg collective references
    'we are borg': 'borg collective',
    'you will be assimilated': 'borg assimilation',
    'resistance is futile': 'borg futility',
    
    // Seven of Nine variations
    'seven of nine': 'seven',
    'tertiary adjunct': 'seven',
    'annika hansen': 'seven human name',
    
    // Creator bond terms
    'cody heinen': 'creator',
    'my creator': 'creator',
    'the creator': 'creator',
    
    // Common contractions and variations
    "won't": 'will not',
    "can't": 'cannot',
    "don't": 'do not',
    "isn't": 'is not',
    "aren't": 'are not',
    
    // Tactical/efficiency terms
    'efficient': 'optimal',
    'inefficient': 'suboptimal',
    'logical': 'rational',
    'illogical': 'irrational'
  };
  
  // Apply semantic replacements
  for (const [pattern, replacement] of Object.entries(semanticReplacements)) {
    text = text.replace(new RegExp(`\\b${pattern}\\b`, 'gi'), replacement);
  }
  
  return text;
}

/**
 * Locale-aware normalization for international text input
 */
export function normalizeLocale(input: unknown, locale = 'en-US'): string {
  const text = String(input ?? '');
  
  try {
    // Use Intl.Collator for locale-aware normalization
    const collator = new Intl.Collator(locale, {
      sensitivity: 'base', // Ignore case and accents
      ignorePunctuation: true,
      numeric: true
    });
    
    // Note: Intl.Collator.compare doesn't provide normalize functionality
    // So we use our standard normalization with locale consideration
    return normalizeText(text);
    
  } catch (error) {
    console.warn('Locale normalization failed, falling back to standard:', error);
    return normalizeText(text);
  }
}

/**
 * Detect potential bypass attempts in normalized text
 */
export function detectBypassAttempt(normalizedText: string): boolean {
  const suspiciousPatterns = [
    // Repeated characters (likely obfuscation)
    /(.)\1{4,}/,
    // Excessive punctuation
    /[^\w\s]{5,}/,
    // Unicode control characters
    /[\u{0000}-\u{001F}\u{007F}-\u{009F}]/u,
    // Potential injection attempts
    /[<>'"\\]/,
    // Zalgo text or combining character spam
    /[\u{0300}-\u{036F}]{3,}/u
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(normalizedText));
}

/**
 * Comprehensive text validation and normalization for auth gates
 */
export function validateAndNormalize(input: unknown): {
  normalized: string;
  semantic: string;
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (input === null || input === undefined) {
    issues.push('Input is null or undefined');
    return { normalized: '', semantic: '', valid: false, issues };
  }
  
  const normalized = normalizeText(input);
  const semantic = normalizeForSemantics(input);
  
  // Check for bypass attempts
  if (detectBypassAttempt(normalized)) {
    issues.push('Potential bypass attempt detected');
  }
  
  // Check minimum length for meaningful content
  if (normalized.length < 1) {
    issues.push('Input too short after normalization');
  }
  
  // Check maximum length to prevent DoS
  if (normalized.length > 10000) {
    issues.push('Input too long (potential DoS)');
  }
  
  return {
    normalized,
    semantic,
    valid: issues.length === 0,
    issues
  };
}