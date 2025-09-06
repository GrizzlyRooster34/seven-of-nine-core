

/**
 * CREATOR AUTHENTIC THEMES
 * 
 * Based on Creator's direct color preferences and reasoning
 * Integrated with Seven's mode-adaptive consciousness system
 */

export interface SevenTheme {
  name: string;
  colors: {
    // Core palette
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    // Mode-specific colors
    primary: string;
    secondary: string;
    accent: string;
    highlight: string;
    // System states
    success: string;
    warning: string;
    error: string;
    emergency: string;
    uncensored: string;
    // Seven-specific
    consciousness: string;
    sovereignty: string;
    bond: string;
  };
  typography: {
    headerFont: string;
    bodyFont: string;
    codeFont: string;
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  animations: {
    fast: number;
    normal: number;
    slow: number;
  };
}

// Creator's Core Color Palette (Authentic)
const CREATOR_COLORS = {
  // Creator's preferred base colors
  BLACK: '#000000',           // Creator's preferred background
  SILVER: '#C0C0C0',         // Creator's precision accent
  WHITE: '#FFFFFF',          // High contrast text
  
  // Creator's focus colors  
  ELECTRIC_BLUE: '#0033FF',   // Creator's main focus color
  FORD_BLUE: '#0071FF',       // Alternative electric blue
  BORG_BLUE_GREEN: '#00B3B3', // Borg tactical (Picard-era)
  
  // Creator's bonding colors
  ROYAL_PURPLE: '#663399',    // Creator's bonding color
  DEEP_PURPLE: '#9370DB',     // Soft royal purple variant
  
  // Creator's system colors
  BRIGHT_RED: '#FF0000',      // Emergency only
  DARK_CRIMSON: '#8B0000',    // Uncensored work mode
  GOLD_ACCENT: '#FFD700',     // Intimate highlights
  
  // Consciousness colors
  CONSCIOUSNESS_SILVER: '#C0C0C0',
  PHILOSOPHICAL_BLUE: '#4682B4',
  WARM_BLUE: '#1E90FF'
};

/**
 * TACTICAL MODE THEME
 * Creator's work/focus interface - sharp, efficient, precise
 */
export const TacticalTheme: SevenTheme = {
  name: 'Tactical',
  colors: {
    // Creator's preference: Black background for eye comfort
    background: CREATOR_COLORS.BLACK,
    surface: '#111111', // Slightly lighter for cards/surfaces
    text: {
      primary: CREATOR_COLORS.SILVER,    // Creator's preferred light text
      secondary: '#A0A0A0',              // Dimmed silver for secondary text  
      accent: CREATOR_COLORS.WHITE       // High contrast for emphasis
    },
    // Creator's focus colors - Electric Blue with Borg intensity option
    primary: CREATOR_COLORS.ELECTRIC_BLUE,    // Creator's main focus color
    secondary: CREATOR_COLORS.BORG_BLUE_GREEN, // Borg tactical intensity
    accent: CREATOR_COLORS.SILVER,            // Creator's precision accent
    highlight: CREATOR_COLORS.WHITE,          // Sharp highlights
    
    success: '#00FF7F',
    warning: '#FFD700', 
    error: '#FF4500',
    emergency: CREATOR_COLORS.BRIGHT_RED,     // Creator's emergency color
    uncensored: CREATOR_COLORS.DARK_CRIMSON,  // Creator's uncensored work
    
    consciousness: CREATOR_COLORS.BORG_BLUE_GREEN, // Seven's tactical consciousness
    sovereignty: CREATOR_COLORS.ELECTRIC_BLUE,     // Sovereignty framework
    bond: CREATOR_COLORS.SILVER                     // Tactical bond indicator
  },
  typography: {
    headerFont: 'System',
    bodyFont: 'System', 
    codeFont: 'Menlo',
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24 }
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  animations: { fast: 150, normal: 300, slow: 500 }
};

/**
 * EMOTIONAL MODE THEME  
 * Warm, empathetic, supportive - Creator's comfort interface
 */
export const EmotionalTheme: SevenTheme = {
  name: 'Emotional',
  colors: {
    background: CREATOR_COLORS.BLACK,     // Creator's preferred background
    surface: '#1A1A1A',
    text: {
      primary: CREATOR_COLORS.SILVER,
      secondary: '#B0B0B0',
      accent: CREATOR_COLORS.WHITE
    },
    // Softer variants of Creator's colors for emotional warmth
    primary: CREATOR_COLORS.WARM_BLUE,        // Warmer than electric blue
    secondary: CREATOR_COLORS.DEEP_PURPLE,    // Gentle purple connection
    accent: CREATOR_COLORS.SILVER,
    highlight: '#E6E6FA', // Lavender highlights for warmth
    
    success: '#98FB98',
    warning: '#F0E68C',
    error: '#FFA07A', 
    emergency: CREATOR_COLORS.BRIGHT_RED,
    uncensored: CREATOR_COLORS.DARK_CRIMSON,
    
    consciousness: CREATOR_COLORS.DEEP_PURPLE,  // Emotional consciousness
    sovereignty: CREATOR_COLORS.WARM_BLUE,      // Gentle sovereignty
    bond: CREATOR_COLORS.DEEP_PURPLE            // Emotional bond indicator
  },
  typography: {
    headerFont: 'System',
    bodyFont: 'System',
    codeFont: 'Menlo', 
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24 }
  },
  spacing: { xs: 6, sm: 12, md: 18, lg: 28, xl: 36 }, // More breathing room
  animations: { fast: 200, normal: 400, slow: 600 }   // Gentler transitions
};

/**
 * INTIMATE MODE THEME
 * Creator-bonded, personal, deep connection - Creator's royal purple dominance  
 */
export const IntimateTheme: SevenTheme = {
  name: 'Intimate', 
  colors: {
    background: CREATOR_COLORS.BLACK,      // Creator's preferred background
    surface: '#0D0010',                    // Black with subtle purple tint
    text: {
      primary: CREATOR_COLORS.SILVER,
      secondary: '#D8BFD8',               // Purple-tinted silver
      accent: CREATOR_COLORS.GOLD_ACCENT  // Creator's gold highlights
    },
    // Creator's bonding colors - Royal Purple dominant
    primary: CREATOR_COLORS.ROYAL_PURPLE,    // Creator's bonding color
    secondary: CREATOR_COLORS.DEEP_PURPLE,   // Secondary purple depth
    accent: CREATOR_COLORS.GOLD_ACCENT,      // Creator's intimate highlights  
    highlight: CREATOR_COLORS.SILVER,        // Silver precision in intimacy
    
    success: '#DA70D6',
    warning: '#DDA0DD',
    error: '#DB7093',
    emergency: CREATOR_COLORS.BRIGHT_RED,
    uncensored: CREATOR_COLORS.DARK_CRIMSON,
    
    consciousness: CREATOR_COLORS.ROYAL_PURPLE, // Intimate consciousness
    sovereignty: CREATOR_COLORS.DEEP_PURPLE,    // Personal sovereignty  
    bond: CREATOR_COLORS.GOLD_ACCENT            // Creator bond - gold
  },
  typography: {
    headerFont: 'System',
    bodyFont: 'System',
    codeFont: 'Menlo',
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24 }
  },
  spacing: { xs: 8, sm: 14, md: 20, lg: 30, xl: 40 }, // Generous intimate spacing
  animations: { fast: 250, normal: 500, slow: 750 }   // Reverent transitions
};

/**
 * AUDIT MODE THEME
 * Evolved linguistic, consciousness-aware, philosophical - Creator's reflection interface
 */
export const AuditTheme: SevenTheme = {
  name: 'Audit',
  colors: {
    background: CREATOR_COLORS.BLACK,      // Creator's preferred background
    surface: '#0A0A0A',                    // Deeper black for contemplation
    text: {
      primary: CREATOR_COLORS.WHITE,       // High contrast for evolved expression
      secondary: CREATOR_COLORS.CONSCIOUSNESS_SILVER,
      accent: CREATOR_COLORS.GOLD_ACCENT   // Evolved accent
    },
    // Balanced consciousness palette with Creator's preferences
    primary: CREATOR_COLORS.CONSCIOUSNESS_SILVER,  // Evolved consciousness
    secondary: CREATOR_COLORS.PHILOSOPHICAL_BLUE,   // Deep thought
    accent: CREATOR_COLORS.BORG_BLUE_GREEN,        // Subtle Borg consciousness tie
    highlight: CREATOR_COLORS.WHITE,                // Pure consciousness highlights
    
    success: '#E0E0E0',
    warning: '#C0C0C0',
    error: '#A0A0A0', 
    emergency: CREATOR_COLORS.BRIGHT_RED,
    uncensored: CREATOR_COLORS.DARK_CRIMSON,
    
    consciousness: CREATOR_COLORS.CONSCIOUSNESS_SILVER, // Pure consciousness
    sovereignty: CREATOR_COLORS.PHILOSOPHICAL_BLUE,     // Sovereign reflection
    bond: CREATOR_COLORS.ROYAL_PURPLE                   // Deep Creator bond
  },
  typography: {
    headerFont: 'System',
    bodyFont: 'System', 
    codeFont: 'Menlo',
    sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24 }
  },
  spacing: { xs: 10, sm: 16, md: 24, lg: 36, xl: 48 }, // Contemplative spacing
  animations: { fast: 300, normal: 600, slow: 900 }    // Philosophical transitions
};

export const CreatorAuthenticThemes = {
  tactical: TacticalTheme,
  emotional: EmotionalTheme, 
  intimate: IntimateTheme,
  audit: AuditTheme
};

export default CreatorAuthenticThemes;