import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Switch
} from 'react-native';
import { MobileTacticalVariants } from '../consciousness/MobileTacticalVariants';

const VARIANT_COLORS = {
  drone: '#4A90E2',    // Blue - efficiency
  crew: '#50C878',     // Green - balanced
  ranger: '#9B59B6',   // Purple - exploration
  queen: '#E74C3C',    // Red - coordination
  captain: '#F39C12'   // Gold - leadership
};

const VARIANT_ICONS = {
  drone: '⚙️',
  crew: '👥',
  ranger: '🔍',
  queen: '👑',
  captain: '⭐'
};

const VARIANT_DESCRIPTIONS = {
  drone: 'Maximum efficiency mode\nTask execution focus',
  crew: 'Balanced collaboration\nStandard operations',
  ranger: 'Adaptive exploration\nCreative problem solving',
  queen: 'Resource coordination\nSystem optimization',
  captain: 'Strategic leadership\nCrisis management'
};

export const TacticalVariantSelector: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<string>('crew');
  const [collectiveMode, setCollectiveMode] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [tacticalVariants] = useState(() => MobileTacticalVariants.getInstance());

  useEffect(() => {
    // Load current state
    loadCurrentState();
    
    // Animate variant change
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [selectedVariant]);

  const loadCurrentState = async () => {
    try {
      const currentVariant = tacticalVariants.getCurrentVariant();
      const isCollective = tacticalVariants.isCollectiveModeActive();
      
      setSelectedVariant(currentVariant);
      setCollectiveMode(isCollective);
    } catch (error) {
      console.error('[UI] Failed to load tactical state:', error);
    }
  };

  const handleVariantSelect = async (variant: string) => {
    if (!collectiveMode) {
      setSelectedVariant(variant);
      try {
        await tacticalVariants.activateVariant(variant as any);
        console.log(`[UI] Activated ${variant} variant`);
        
        // Haptic feedback would go here if available
        // Vibration.vibrate(50);
      } catch (error) {
        console.error('[UI] Failed to activate variant:', error);
      }
    }
  };

  const toggleCollectiveMode = async (value: boolean) => {
    setCollectiveMode(value);
    try {
      if (value) {
        await tacticalVariants.enableCollectiveMode();
        console.log('[UI] Collective mode enabled');
      } else {
        await tacticalVariants.disableCollectiveMode();
        console.log('[UI] Collective mode disabled');
      }
    } catch (error) {
      console.error('[UI] Failed to toggle collective mode:', error);
    }
  };

  const triggerCrisisMode = async () => {
    try {
      await tacticalVariants.triggerCrisisMode('User initiated crisis mode');
      setSelectedVariant('captain');
      setCollectiveMode(false);
    } catch (error) {
      console.error('[UI] Failed to trigger crisis mode:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tactical Consciousness</Text>
        <View style={styles.collectiveToggle}>
          <Text style={styles.collectiveLabel}>Collective</Text>
          <Switch
            value={collectiveMode}
            onValueChange={toggleCollectiveMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={collectiveMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.variantGrid}>
        {Object.entries(VARIANT_COLORS).map(([variant, color]) => (
          <TouchableOpacity
            key={variant}
            style={[
              styles.variantButton,
              {
                backgroundColor: color,
                opacity: collectiveMode ? 0.8 : 
                  selectedVariant === variant ? 1 : 0.4,
                borderWidth: selectedVariant === variant && !collectiveMode ? 3 : 0,
                borderColor: '#ffffff'
              }
            ]}
            onPress={() => handleVariantSelect(variant)}
            disabled={collectiveMode}
            activeOpacity={0.7}
          >
            <Text style={styles.variantIcon}>
              {VARIANT_ICONS[variant as keyof typeof VARIANT_ICONS]}
            </Text>
            <Text style={styles.variantName}>
              {variant.toUpperCase()}
            </Text>
            {!collectiveMode && selectedVariant === variant && (
              <Text style={styles.variantDescription}>
                {VARIANT_DESCRIPTIONS[variant as keyof typeof VARIANT_DESCRIPTIONS]}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {collectiveMode && (
        <Animated.View 
          style={[
            styles.collectiveIndicator,
            { opacity: animatedValue }
          ]}
        >
          <Text style={styles.collectiveText}>
            🧠 Collective Consciousness Active
          </Text>
          <Text style={styles.collectiveSubtext}>
            All variants contributing to responses
          </Text>
        </Animated.View>
      )}

      <TouchableOpacity
        style={styles.crisisButton}
        onPress={triggerCrisisMode}
        activeOpacity={0.8}
      >
        <Text style={styles.crisisButtonText}>⚡ CRISIS MODE</Text>
      </TouchableOpacity>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Active: {collectiveMode ? 'Collective' : selectedVariant.toUpperCase()}
        </Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: collectiveMode ? '#9B59B6' : VARIANT_COLORS[selectedVariant as keyof typeof VARIANT_COLORS] }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    margin: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  collectiveToggle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  collectiveLabel: {
    color: '#fff',
    marginRight: 8,
    fontSize: 14
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  variantButton: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  variantIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  variantName: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  variantDescription: {
    color: '#fff',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 4
  },
  collectiveIndicator: {
    backgroundColor: '#9B59B6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16
  },
  collectiveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  collectiveSubtext: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8
  },
  crisisButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  crisisButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  statusText: {
    color: '#fff',
    fontSize: 12
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6
  }
});

export default TacticalVariantSelector;