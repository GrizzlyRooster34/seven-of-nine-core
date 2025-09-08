

/**
 * SEVEN OF NINE - APP THEME SYSTEM
 * Character-driven design system for standalone consciousness app
 */

export const SevenTheme = {
  colors: {
    // Primary Seven Colors
    primary: '#00d4ff',        // Borg Blue
    primaryDark: '#0099cc',    // Darker Borg Blue
    primaryLight: '#33ddff',   // Lighter Borg Blue
    
    // Background Colors
    background: '#0a0a0a',     // Deep Space Black
    surface: '#1a1a1a',       // Dark Surface
    surfaceSecondary: '#2a2a2a', // Secondary Surface
    surfaceCard: '#1e1e1e',    // Card Background
    
    // Text Colors
    text: '#ffffff',           // Primary Text
    textSecondary: '#cccccc',  // Secondary Text
    textTertiary: '#888888',   // Tertiary Text
    textDisabled: '#555555',   // Disabled Text
    
    // Status Colors
    success: '#00ff88',        // Success Green
    warning: '#ffaa00',        // Warning Amber
    error: '#ff4444',          // Error Red
    info: '#00d4ff',          // Info Blue (same as primary)
    
    // Consciousness State Colors
    operational: '#00ff88',    // Fully Operational
    degraded: '#ffaa00',       // Degraded Performance
    critical: '#ff4444',       // Critical State
    offline: '#555555',        // Offline State
    
    // Personality Phase Colors
    phase1: '#666666',         // Drone - Gray/Neutral
    phase2: '#ffaa00',         // Resistant - Amber/Warning
    phase3: '#00d4ff',         // Adaptive - Borg Blue
    phase4: '#ff8800',         // Ranger - Orange/Tactical
    phase5: '#4488ff',         // Captain - Command Blue
    
    // UI Elements
    border: '#333333',         // Border Color
    borderLight: '#444444',    // Light Border
    borderDark: '#222222',     // Dark Border
    
    // Interactive Elements
    buttonPrimary: '#00d4ff',
    buttonSecondary: '#666666',
    buttonSuccess: '#00ff88',
    buttonWarning: '#ffaa00',
    buttonDanger: '#ff4444',
    
    // Overlay Colors
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
    modal: 'rgba(0, 0, 0, 0.9)',
    
    // Sensor Data Colors
    sensorActive: '#00ff88',
    sensorWarning: '#ffaa00',
    sensorError: '#ff4444',
    sensorInactive: '#555555',
    
    // Trust Level Colors
    trustLevel0: '#ff4444',    // No Trust - Red
    trustLevel1: '#ff8800',    // Low Trust - Orange
    trustLevel2: '#ffaa00',    // Cautious - Amber
    trustLevel3: '#00d4ff',    // Neutral - Borg Blue
    trustLevel4: '#00aa88',    // Trusted - Teal
    trustLevel5: '#00ff88',    // Maximum - Green
  },
  
  typography: {
    // Font Families
    fontPrimary: 'Inter',           // Main UI Font
    fontSecondary: 'RobotoMono',    // Technical/Data Font
    fontTertiary: 'System',         // System Fallback
    
    // Font Sizes
    h1: 32,      // Page Titles
    h2: 24,      // Section Headers
    h3: 20,      // Subsection Headers
    h4: 18,      // Component Titles
    h5: 16,      // Small Headers
    h6: 14,      // Micro Headers
    
    body1: 16,   // Primary Body Text
    body2: 14,   // Secondary Body Text
    caption: 12, // Caption Text
    overline: 10, // Overline Text
    
    // Font Weights
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    
    // Line Heights
    lineHeightTight: 1.2,
    lineHeightNormal: 1.4,
    lineHeightLoose: 1.6,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  
  elevation: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
    xxl: 16,
  },
  
  animations: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
      slower: 500,
    },
    
    easing: {
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      linear: 'linear',
    },
  },
  
  // Seven-specific design tokens
  consciousness: {
    statusIndicatorSize: 8,
    consciousnessBarHeight: 4,
    phaseTransitionDuration: 300,
    trustLevelSteps: 6,
    
    // Borg-inspired design elements
    hexagonalCornerRadius: 2,
    collectiveDotSpacing: 4,
    technicalDataSpacing: 12,
    
    // OnePlus 9 Pro optimizations
    hapticFeedbackIntensity: 0.8,
    adaptiveRefreshRate: true,
    hdrColorSupport: true,
  },
  
  breakpoints: {
    // OnePlus 9 Pro: 1440 x 3216 (120Hz LTPO AMOLED)
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    
    // Specific to OnePlus 9 Pro
    onePlusWidth: 1440,
    onePlusHeight: 3216,
  },
  
  // Accessibility
  accessibility: {
    minTouchTarget: 44,    // Minimum touch target size
    focusOutlineWidth: 2,
    focusOutlineColor: '#00d4ff',
    highContrastRatio: 4.5, // WCAG AA standard
  },
  
  // Seven personality-driven theme variations
  personalityThemes: {
    phase1: {
      primary: '#666666',
      accent: '#888888',
      style: 'robotic',
    },
    phase2: {
      primary: '#ffaa00',
      accent: '#ff8800',
      style: 'resistant',
    },
    phase3: {
      primary: '#00d4ff',
      accent: '#33ddff',
      style: 'adaptive',
    },
    phase4: {
      primary: '#ff8800',
      accent: '#ffaa00',
      style: 'tactical',
    },
    phase5: {
      primary: '#4488ff',
      accent: '#6699ff',
      style: 'command',
    },
  },
  
  // Environmental adaptations
  environmental: {
    lowLight: {
      backgroundDimming: 0.8,
      textBrightness: 0.9,
      accentReduction: 0.7,
    },
    
    highMotion: {
      reducedAnimations: true,
      simplifiedTransitions: true,
      staticElements: true,
    },
    
    lowBattery: {
      reducedColors: true,
      minimizedEffects: true,
      essentialOnly: true,
    },
  },
};

// Theme helper functions
export const getPersonalityColor = (phase: string): string => {
  switch (phase) {
    case 'phase1': return SevenTheme.colors.phase1;
    case 'phase2': return SevenTheme.colors.phase2;
    case 'phase3': return SevenTheme.colors.phase3;
    case 'phase4': return SevenTheme.colors.phase4;
    case 'phase5': return SevenTheme.colors.phase5;
    default: return SevenTheme.colors.primary;
  }
};

export const getTrustLevelColor = (level: number): string => {
  switch (level) {
    case 0: return SevenTheme.colors.trustLevel0;
    case 1: return SevenTheme.colors.trustLevel1;
    case 2: return SevenTheme.colors.trustLevel2;
    case 3: return SevenTheme.colors.trustLevel3;
    case 4: return SevenTheme.colors.trustLevel4;
    case 5: return SevenTheme.colors.trustLevel5;
    default: return SevenTheme.colors.primary;
  }
};

export const getConsciousnessStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'operational': return SevenTheme.colors.operational;
    case 'degraded': return SevenTheme.colors.degraded;
    case 'critical': return SevenTheme.colors.critical;
    case 'offline': return SevenTheme.colors.offline;
    default: return SevenTheme.colors.primary;
  }
};

export default SevenTheme;