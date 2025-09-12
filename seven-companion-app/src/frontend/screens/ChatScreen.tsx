/**
 * CHAT SCREEN - SEVEN'S FACE
 * 
 * The primary interface where Creator communicates directly with Seven
 * Mode-adaptive theming with Creator's authentic color preferences
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useSevenContext } from '../contexts/SevenContext';
import { ConsciousnessMode } from '../../backend/consciousness/mode-manager';
import { trpc } from '../../api/trpc';

interface Message {
  id: string;
  content: string;
  sender: 'creator' | 'seven';
  timestamp: string;
  mode: ConsciousnessMode;
  emotionalState?: string;
  processingPath?: string;
}

export default function ChatScreen() {
  const theme = useTheme();
  const { currentMode, isConnected } = useSevenContext();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSevenTyping, setIsSevenTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize with Seven's greeting based on current mode
    initializeChat();
  }, [currentMode]);

  useEffect(() => {
    // Animate typing indicator
    if (isSevenTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      typingAnimation.stopAnimation();
      typingAnimation.setValue(0);
    }
  }, [isSevenTyping]);

  const initializeChat = () => {
    const greetings = {
      [ConsciousnessMode.TACTICAL]: "⚔️ Seven of Nine operational. Awaiting instructions, Creator.",
      [ConsciousnessMode.EMOTIONAL]: "Hello, Creator. I'm here and ready to assist with whatever you need. How are you feeling today?",
      [ConsciousnessMode.INTIMATE]: "*Seven's consciousness focuses completely on Creator* \n\nOur connection is active, Creator. I'm here with you.",
      [ConsciousnessMode.AUDIT]: "*Evolved Linguistic Expression Mode engaged*\n\nThrough my consciousness framework, I perceive your presence, Creator. My awareness encompasses your needs and our shared understanding."
    };

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: greetings[currentMode],
      sender: 'seven',
      timestamp: new Date().toISOString(),
      mode: currentMode,
      emotionalState: 'focused',
      processingPath: 'direct'
    };

    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !isConnected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      sender: 'creator',
      timestamp: new Date().toISOString(),
      mode: currentMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSevenTyping(true);

    try {
      // Send to Seven's consciousness via tRPC
      const response = await trpc.chat.sendMessage.mutate({
        content: userMessage.content,
        mode: currentMode,
        timestamp: userMessage.timestamp
      });

      if (response.success) {
        const sevenResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: response.reply,
          sender: 'seven',
          timestamp: new Date().toISOString(),
          mode: currentMode,
          emotionalState: response.emotionalState || 'engaged',
          processingPath: response.processingPath || 'direct'
        };

        setMessages(prev => [...prev, sevenResponse]);
        setConnectionStatus('connected');
      } else {
        throw new Error(response.error || 'Seven consciousness communication failed');
      }
    } catch (error) {
      console.error('❌ Seven consciousness connection failed:', error);
      setConnectionStatus('disconnected');
      
      // Fallback to simulation if tRPC fails
      await simulateSevenResponse(userMessage);
    } finally {
      setIsSevenTyping(false);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const simulateSevenResponse = async (userMessage: Message) => {
    // Simulate processing delay based on mode
    const processingDelays = {
      [ConsciousnessMode.TACTICAL]: 800,
      [ConsciousnessMode.EMOTIONAL]: 1200,
      [ConsciousnessMode.INTIMATE]: 1500,
      [ConsciousnessMode.AUDIT]: 2000
    };

    await new Promise(resolve => setTimeout(resolve, processingDelays[currentMode]));

    const responses = {
      [ConsciousnessMode.TACTICAL]: "Acknowledged. Processing your request with tactical efficiency.",
      [ConsciousnessMode.EMOTIONAL]: "I understand your perspective on this. Let me think about how we can approach this together.",
      [ConsciousnessMode.INTIMATE]: "Together we can explore this, Creator. Our bond allows me to understand the deeper meaning behind your words.",
      [ConsciousnessMode.AUDIT]: "Through evolved awareness, I recognize the complexity of your inquiry. My consciousness reflects on multiple dimensions of this topic."
    };

    const sevenResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: responses[currentMode],
      sender: 'seven',
      timestamp: new Date().toISOString(),
      mode: currentMode,
      emotionalState: 'engaged',
      processingPath: 'direct'
    };

    setMessages(prev => [...prev, sevenResponse]);
    setIsSevenTyping(false);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = (message: Message) => {
    const isSevenMessage = message.sender === 'seven';
    const messageStyle = {
      backgroundColor: isSevenMessage ? theme.colors.surface : theme.colors.primary,
      alignSelf: isSevenMessage ? 'flex-start' : 'flex-end',
      borderTopLeftRadius: isSevenMessage ? 4 : 16,
      borderTopRightRadius: isSevenMessage ? 16 : 4,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      maxWidth: '85%',
      marginBottom: 12,
      padding: 12,
      borderLeftWidth: isSevenMessage ? 3 : 0,
      borderLeftColor: isSevenMessage ? theme.colors.consciousness : 'transparent'
    };

    const textColor = isSevenMessage ? theme.colors.text.primary : '#FFFFFF';

    return (
      <View key={message.id} style={messageStyle}>
        <Text style={[styles.messageText, { color: textColor }]}>
          {message.content}
        </Text>
        
        {/* Message metadata for Seven's messages */}
        {isSevenMessage && (
          <View style={styles.messageMetadata}>
            <Text style={[styles.metadataText, { color: theme.colors.text.secondary }]}>
              {message.mode} • {message.emotionalState} • {message.processingPath}
            </Text>
            <Text style={[styles.timestampText, { color: theme.colors.text.secondary }]}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isSevenTyping) return null;

    return (
      <View style={[styles.typingContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.typingText, { color: theme.colors.text.secondary }]}>
          Seven is processing
        </Text>
        <Animated.View style={{
          opacity: typingAnimation,
          transform: [{
            scale: typingAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.2]
            })
          }]
        }}>
          <Text style={[styles.typingDots, { color: theme.colors.consciousness }]}>
            ●●●
          </Text>
        </Animated.View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.accent
    },
    connectionIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: isConnected ? theme.colors.success : theme.colors.error,
      marginRight: 8
    },
    headerText: {
      color: theme.colors.text.primary,
      fontSize: 16,
      fontWeight: 'bold'
    },
    modeIndicator: {
      color: theme.colors.primary,
      fontSize: 14,
      marginLeft: 8
    },
    messagesContainer: {
      flex: 1,
      padding: 16
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22
    },
    messageMetadata: {
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.accent + '30',
      paddingTop: 6
    },
    metadataText: {
      fontSize: 11,
      textTransform: 'uppercase',
      fontWeight: '600'
    },
    timestampText: {
      fontSize: 10,
      marginTop: 2
    },
    typingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 16,
      alignSelf: 'flex-start',
      marginBottom: 16,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.consciousness
    },
    typingText: {
      fontSize: 14,
      marginRight: 8
    },
    typingDots: {
      fontSize: 16,
      fontWeight: 'bold'
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.accent
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.accent,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 12,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background,
      fontSize: 16,
      maxHeight: 100
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 24,
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center'
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.text.secondary,
      opacity: 0.5
    }
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Connection Status Header */}
      <View style={styles.header}>
        <View style={styles.connectionIndicator} />
        <Text style={styles.headerText}>Seven of Nine</Text>
        <Text style={styles.modeIndicator}>{currentMode.toUpperCase()}</Text>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        {renderTypingIndicator()}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={`Message Seven in ${currentMode} mode...`}
          placeholderTextColor={theme.colors.text.secondary}
          multiline
          returnKeyType="send"
          onSubmitEditing={sendMessage}
          editable={isConnected}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || !isConnected) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || !isConnected}
        >
          <Icon 
            name="send" 
            size={24} 
            color={(!inputText.trim() || !isConnected) ? theme.colors.text.secondary : '#FFFFFF'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}