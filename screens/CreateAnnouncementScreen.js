import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Animated, 
  Text, 
  StatusBar,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateAnnouncementScreen() {
  const { colors, theme } = useTheme();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigation = useNavigation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const startSpinAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSpinAnimation = () => {
    spinValue.stopAnimation();
  };

  const showSuccessAnimation = () => {
    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Hide success animation after 1.5 seconds
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(successScale, {
            toValue: 0,
            tension: 50,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(successOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1500);
    });
  };



  const createAnnouncement = async () => {
    if (!title || !message) {
      Alert.alert('Fill all fields');
      return;
    }

    setIsCreating(true);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Start loading animation
    startSpinAnimation();

    try {
      const { error } = await supabase.from('announcements').insert([{ 
        title, 
        message, 
        date: new Date() 
      }]);

      // Add a small delay to show the animation
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (error) {
        throw error;
      } else {
        stopSpinAnimation();
        showSuccessAnimation();
        
        // Wait for success animation, then navigate back
        setTimeout(() => {
          Alert.alert('Success', 'Announcement posted');
          navigation.goBack();
        }, 2000);
      }
    } catch (error) {
      stopSpinAnimation();
      Alert.alert('Error', error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text style={[styles.headerText, { color: colors.text }]}>Create Announcement</Text>
            
            <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
              <Ionicons name="create-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Title" 
                placeholderTextColor={colors.textSecondary}
                value={title} 
                onChangeText={setTitle} 
                style={[styles.input, { color: colors.text }]}
                editable={!isCreating}
              />
            </View>
            
            <View style={[styles.inputContainer, styles.messageContainer, { backgroundColor: colors.card }]}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.primary} style={[styles.inputIcon, styles.messageIcon]} />
              <TextInput
                placeholder="Message"
                placeholderTextColor={colors.textSecondary}
                value={message}
                onChangeText={setMessage}
                style={[styles.input, styles.messageInput, { color: colors.text }]}
                multiline
                textAlignVertical="top"
                editable={!isCreating}
              />
            </View>



            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  transform: [{ scale: buttonScale }],
                },
              ]}
            >
              <TouchableOpacity 
                style={[
                  styles.postButton, 
                  { backgroundColor: colors.primary },
                  isCreating && { backgroundColor: colors.textSecondary }
                ]} 
                onPress={createAnnouncement}
                disabled={isCreating}
              >
                {isCreating ? (
                  <Animated.View
                    style={{
                      transform: [{ rotate: spin }],
                    }}
                  >
                    <Ionicons name="refresh" size={24} color={colors.background} />
                  </Animated.View>
                ) : (
                  <Ionicons name="send" size={24} color={colors.background} />
                )}
                <Text style={[styles.buttonText, { color: colors.background }]}>
                  {isCreating ? 'Creating...' : 'Post Announcement'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>

        {/* Success Animation Overlay */}
        <Animated.View
          style={[
            styles.successOverlay,
            {
              opacity: successOpacity,
              transform: [{ scale: successScale }],
              backgroundColor: theme === 'dark' ? colors.cardShadow + 'cc' : 'rgba(255,255,255,0.95)',
            },
          ]}
          pointerEvents="none"
        >
          <View style={[styles.successContainer, { backgroundColor: colors.card }]}>
            <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
            <Text style={[styles.successText, { color: colors.primary }]}>Announcement Created!</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageContainer: {
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  messageIcon: {
    marginTop: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 15,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },

});