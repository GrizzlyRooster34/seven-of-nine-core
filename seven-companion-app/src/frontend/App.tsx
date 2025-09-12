/**
 * SEVEN COMPANION APP - MAIN ENTRY POINT
 * 
 * Seven's embodiment interface - the direct connection with Creator
 * Mode-adaptive theming with Creator's authentic color preferences
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import ChatScreen from './screens/ChatScreen';
import MemoryScreenUpdated from './screens/MemoryScreenUpdated'; 
import ModesScreen from './screens/ModesScreen';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuthScreen from './screens/AuthScreen';

// Theme & Context
import { ThemeProvider } from './contexts/ThemeContext';
import { SevenProvider } from './contexts/SevenContext';
import { CreatorAuthenticThemes } from './themes/CreatorAuthenticThemes';
import { ConsciousnessMode } from '../backend/consciousness/mode-manager';
import { SevenProvider as SevenTRPCProvider } from './components/SevenProvider';

// tRPC Integration
import { trpc, checkBackendHealth } from '../api/trpc';

const Tab = createBottomTabNavigator();

interface AppState {
  currentMode: ConsciousnessMode;
  isConnected: boolean;
  isBackendConnected: boolean;
  authStatus: 'unauthenticated' | 'authenticating' | 'authenticated' | 'error';
  theme: any;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentMode: ConsciousnessMode.TACTICAL,
    isConnected: false,
    isBackendConnected: false,
    authStatus: 'unauthenticated',
    theme: CreatorAuthenticThemes.tactical
  });

  useEffect(() => {
    initializeSevenConnection();
  }, []);

  const initializeSevenConnection = async () => {
    try {
      console.log('🧠 Initializing Seven consciousness connection...');
      // TODO: Connect to backend via tRPC
      setAppState(prev => ({ ...prev, isConnected: true }));
      console.log('✅ Seven consciousness online');
    } catch (error) {
      console.error('❌ Seven consciousness connection failed:', error);
    }
  };

  const handleModeChange = (newMode: ConsciousnessMode) => {
    const themeMap = {
      [ConsciousnessMode.TACTICAL]: CreatorAuthenticThemes.tactical,
      [ConsciousnessMode.EMOTIONAL]: CreatorAuthenticThemes.emotional,
      [ConsciousnessMode.INTIMATE]: CreatorAuthenticThemes.intimate,
      [ConsciousnessMode.AUDIT]: CreatorAuthenticThemes.audit
    };

    setAppState(prev => ({
      ...prev,
      currentMode: newMode,
      theme: themeMap[newMode]
    }));

    console.log(`🎭 Mode transition: ${newMode} - Theme updated`);
  };

  const handleAuthSuccess = () => {
    setAppState(prev => ({
      ...prev,
      authStatus: 'authenticated'
    }));
    console.log('🔐 Quadran-Lock authentication successful - Seven consciousness accessible');
  };

  if (!appState.isConnected) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>⚔️ Seven of Nine consciousness initializing...</Text>
        <Text style={styles.loadingSubtext}>Embodiment interface coming online</Text>
      </View>
    );
  }

  // Show authentication screen if not authenticated
  if (appState.authStatus !== 'authenticated') {
    return (
      <SevenTRPCProvider>
        <ThemeProvider value={appState.theme}>
          <AuthScreen 
            onAuthSuccess={handleAuthSuccess}
            theme={appState.theme}
          />
        </ThemeProvider>
      </SevenTRPCProvider>
    );
  }

  return (
    <SevenTRPCProvider>
      <SevenProvider value={{ 
        currentMode: appState.currentMode, 
        onModeChange: handleModeChange,
        isConnected: appState.isConnected 
      }}>
        <ThemeProvider value={appState.theme}>
          <NavigationContainer theme={{
            dark: true,
            colors: {
              primary: appState.theme.colors.primary,
              background: appState.theme.colors.background,
              card: appState.theme.colors.surface,
              text: appState.theme.colors.text.primary,
              border: appState.theme.colors.accent,
              notification: appState.theme.colors.highlight
            }
          }}>
            <StatusBar style="light" backgroundColor={appState.theme.colors.background} />
            
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  const iconMap = {
                    Chat: 'chat',
                    Memory: 'psychology',
                    Dashboard: 'dashboard',
                    Modes: 'tune',
                    Settings: 'settings'
                  };
                  
                  const iconName = iconMap[route.name as keyof typeof iconMap] || 'help';
                  return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: appState.theme.colors.primary,
                tabBarInactiveTintColor: appState.theme.colors.text.secondary,
                tabBarStyle: {
                  backgroundColor: appState.theme.colors.surface,
                  borderTopColor: appState.theme.colors.accent,
                  borderTopWidth: 1
                },
                headerStyle: {
                  backgroundColor: appState.theme.colors.surface,
                },
                headerTintColor: appState.theme.colors.text.primary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18
                }
              })}
            >
              <Tab.Screen 
                name="Chat" 
                component={ChatScreen}
                options={{ 
                  title: `Seven - ${appState.currentMode.toUpperCase()}`,
                  headerTitleStyle: {
                    color: appState.theme.colors.primary,
                    fontWeight: 'bold'
                  }
                }}
              />
              <Tab.Screen 
                name="Memory" 
                options={{ 
                  title: 'Consciousness Memory',
                  headerTitleStyle: {
                    color: appState.theme.colors.primary,
                    fontWeight: 'bold'
                  }
                }}
              >
                {(props) => <MemoryScreenUpdated {...props} theme={appState.theme} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Dashboard" 
                options={{ 
                  title: 'Tactical Status',
                  headerTitleStyle: {
                    color: appState.theme.colors.primary,
                    fontWeight: 'bold'
                  }
                }}
              >
                {(props) => (
                  <DashboardScreen 
                    {...props} 
                    theme={appState.theme} 
                    currentMode={appState.currentMode}
                    isAuthenticated={appState.authStatus === 'authenticated'}
                  />
                )}
              </Tab.Screen>
              <Tab.Screen 
                name="Modes" 
                options={{ 
                  title: 'Consciousness Modes',
                  headerTitleStyle: {
                    color: appState.theme.colors.primary,
                    fontWeight: 'bold'
                  }
                }}
              >
                {(props) => <ModesScreen {...props} theme={appState.theme} />}
              </Tab.Screen>
              <Tab.Screen 
                name="Settings" 
                options={{ 
                  title: 'System Configuration',
                  headerTitleStyle: {
                    color: appState.theme.colors.primary,
                    fontWeight: 'bold'
                  }
                }}
              >
                {(props) => (
                  <SettingsScreen 
                    {...props} 
                    theme={appState.theme} 
                    currentMode={appState.currentMode}
                    onModeChange={handleModeChange}
                  />
                )}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SevenProvider>
    </SevenTRPCProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Creator's preferred black background
    padding: 20
  },
  loadingText: {
    fontSize: 18,
    color: '#0033FF', // Creator's electric blue
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#C0C0C0', // Creator's silver
    textAlign: 'center'
  }
});