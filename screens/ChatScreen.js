import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';


import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useOffline } from '../contexts/OfflineContext';
import { font } from '../utils/theme';
import { supabase } from '../supabase/supabaseClient';

export default function ChatScreen({ onNavigate }) {
  const { colors, theme } = useTheme();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const { user } = useAuth();
  const { isOnline, cacheChatMessages, getCachedChatMessages, addMessageToQueue } = useOffline();
  
  const flatListRef = useRef(null);
  const [isFocused, setIsFocused] = useState(true);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.9)).current;

  // Check if user is admin for read-only mode
  const isAdmin = user?.role === 'admin' || user?.sNumber === 'admin';
  
  // Debug logging
  console.log('ChatScreen - User:', user);
  console.log('ChatScreen - isAdmin:', isAdmin);
  console.log('ChatScreen - user.role:', user?.role);
  console.log('ChatScreen - user.sNumber:', user?.sNumber);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (isFocused && flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        try {
          flatListRef.current.scrollToEnd({ animated: false });
        } catch (e) {
          // ignore
        }
      }, 300);
    }
  }, [isFocused, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        try {
          flatListRef.current.scrollToEnd({ animated: false });
        } catch (e) {
          // ignore
        }
      }, 100);
    }
  }, [messages]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      if (isOnline) {
        console.log('📱 Loading messages from Supabase');
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('timestamp', { ascending: true }) // oldest to newest
          .limit(100);

        if (error) {
          console.error('Error loading messages:', error);
          if (error.code === '42P01') {
            // Table doesn't exist - show helpful message
            Alert.alert(
              'Chat Setup Required',
              'The chat feature needs to be set up in the database. Please contact your administrator to create the chat_messages table.',
              [{ text: 'OK' }]
            );
          }
          // Fallback to cached messages
          const cachedMessages = await getCachedChatMessages();
          setMessages(cachedMessages);
        } else {
          setMessages(data || []);
          // Cache messages for offline use
          await cacheChatMessages(data || []);
        }
      } else {
        // Load from cache when offline
        console.log('📱 Loading messages from cache (offline mode)');
        const cachedMessages = await getCachedChatMessages();
        setMessages(cachedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !user || isAdmin) return; // Prevent admins from sending messages

    const newMessage = {
      message: messageText.trim(),
      sender_name: user.name || user.email?.split('@')[0] || 'Anonymous',
      sender_id: user.sNumber, // Always use sNumber for sender_id
      timestamp: new Date().toISOString(),
    };

    setIsSending(true);
    setMessageText('');

    try {
      if (isOnline) {
        // Send to Supabase when online
        const { error } = await supabase
          .from('chat_messages')
          .insert([newMessage]);

        if (error) {
          console.error('Error sending message:', error);
          if (error.code === '42P01') {
            // Table doesn't exist - show helpful message and queue the message
            Alert.alert(
              'Chat Setup Required',
              'The chat feature needs to be set up. Your message will be queued for when the chat is ready.',
              [{ text: 'OK' }]
            );
            await addMessageToQueue(newMessage);
          } else {
            // Add to offline queue if online send fails
            await addMessageToQueue(newMessage);
            Alert.alert('Message Queued', 'Message will be sent when connection is restored.');
          }
        } else {
          // Add to local state
          setMessages(prev => [...prev, newMessage]);
        }
      } else {
        // Add to offline queue when offline
        console.log('📱 Adding message to offline queue');
        await addMessageToQueue(newMessage);
        // Add to local state for immediate display
        setMessages(prev => [...prev, newMessage]);
        Alert.alert('Message Queued', 'Message will be sent when you\'re back online.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const MessageBubble = ({ item }) => {
    const isSelf = item.sender_id === user?.sNumber; // Always compare to user.sNumber
    const name = item.sender_name || 'Anonymous';

    return (
      <View style={[
        styles.messageBubble,
        isSelf ? styles.ownMessage : styles.otherMessage,
        {
          backgroundColor: isSelf ? colors.primary : colors.card,
          borderColor: colors.border,
        }
      ]}>
        <Text style={[
          styles.senderName,
          { color: isSelf ? colors.background : colors.textSecondary }
        ]}>
          {isSelf ? 'You' : name}
        </Text>
        <Text style={[
          styles.messageText,
          { color: isSelf ? colors.background : colors.text }
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.timestamp,
          { color: isSelf ? colors.background + '80' : colors.textSecondary }
        ]}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
    >
      <View style={styles.inner}>
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: headerScaleAnim }
              ],
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Animatable.View animation="bounceIn" delay={200}>
              <Ionicons name="chatbubbles" size={32} color={colors.primary} />
            </Animatable.View>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>Live Chat</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }] }>
                Connected as: {user.name || user.email?.split('@')[0] || 'Anonymous'}
                {isAdmin && ' (Admin - View Only)'}
                {!isOnline && ' (Offline Mode)'}
              </Text>
            </View>
          </View>
        </Animated.View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageBubble item={item} />
          )}
          keyExtractor={(item, idx) =>
            item.id
              ? item.id.toString()
              : (item.timestamp ? `${item.sender_id || 'unknown'}-${item.timestamp}` : idx.toString())
          }
          style={[styles.list, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          inverted={false}
          removeClippedSubviews={false}
          maxToRenderPerBatch={100}
          windowSize={50}
          initialNumToRender={50}
          updateCellsBatchingPeriod={100}
          disableVirtualization={false}
          onContentSizeChange={() => {
            if (flatListRef.current && messages.length > 0) {
              setTimeout(() => {
                try {
                  flatListRef.current.scrollToEnd({ animated: false });
                } catch (e) {
                  // ignore
                }
              }, 50);
            }
          }}
        />

        {/* Show input section only for non-admin users */}
        {!isAdmin && (
          <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.cardShadow }] }>
            <View style={[styles.messageInputWrapper, { backgroundColor: colors.card, shadowColor: colors.primary }] }>
              <Ionicons name="chatbubble-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type your message..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.messageInput, { color: colors.text }]}
                multiline
                maxLength={500}
              />
            </View>
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!messageText.trim() || isSending}
              style={[
                styles.sendButton,
                {
                  opacity: messageText.trim() && !isSending ? 1 : 0.5,
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]}
            >
              {isSending ? (
                <ActivityIndicator color={colors.background} size="small" />
              ) : (
                <Ionicons name="send" size={24} color={colors.background} />
              )}
            </TouchableOpacity>
          </View>
        )}
        
        {/* Admin view-only message */}
        {isAdmin && (
          <View style={[styles.adminMessageContainer, { backgroundColor: colors.card, borderTopColor: colors.cardShadow }] }>
            <Ionicons name="eye-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <Text style={[styles.adminMessageText, { color: colors.textSecondary }]}>
              🔒 ADMIN MODE: View Only - You cannot send messages
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: font.weight.bold,
    fontFamily: font.family,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: font.family,
    marginTop: 2,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageBubble: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    borderWidth: 1,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: font.weight.semibold,
    fontFamily: font.family,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: font.family,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: font.family,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  messageInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: font.family,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  adminMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adminMessageText: {
    marginLeft: 8,
    fontSize: font.size.body,
    fontFamily: font.family,
    lineHeight: 20,
  },
});