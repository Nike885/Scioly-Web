// screens/StudentVerificationScreen.js - Updated for Supabase
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import SupabaseService from '../services/SupabaseService';
import { useTheme } from '../contexts/ThemeContext';
import { font } from '../utils/theme';

const { width: screenWidth } = Dimensions.get('window');

export default function StudentVerificationScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const [sNumber, setSNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startEntranceAnimations();
  }, []);

  const startEntranceAnimations = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const animateButtonPress = () => {
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
  };

  const handleVerification = async () => {
    animateButtonPress();
    
    // Reset state
    setErrorMessage('');
    setIsSuccess(false);
    
    // Input validation
    if (!sNumber.trim()) {
      setErrorMessage('Please enter your S-Number.');
      return;
    }

    if (!sNumber.toLowerCase().startsWith('s')) {
      setErrorMessage('Please enter a valid S-Number starting with "s" (e.g., s150712).');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Verifying S-Number:', sNumber);

      // Check if student exists in Supabase
      const student = await SupabaseService.getStudent(sNumber);
      
      if (!student) {
        setErrorMessage('Your S-Number was not found in our system. Please contact your scioly webmaster to be added to the roster.');
        setLoading(false);
        return;
      }

      console.log('✅ Found student:', student);

      // Check if they already have an auth account
      const authUser = await SupabaseService.getAuthUser(sNumber);
      
      if (authUser) {
        // Already has account - redirect to login
        setIsSuccess(true);
        setErrorMessage('An account with this S-Number already exists. Redirecting to login...');
        setTimeout(() => {
          navigation.navigate('StudentLogin');
        }, 2000);
      } else {
        // No account yet - proceed to account creation
        console.log('👤 Student exists but no auth account - proceeding to registration');
        navigation.navigate('StudentAccountCreation', { 
          sNumber: sNumber,
          studentData: student
        });
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      setErrorMessage('Could not connect to the database. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View 
            style={[
              styles.card,
              { 
                backgroundColor: colors.card,
                shadowColor: colors.cardShadow,
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: cardScale }
                ]
              }
            ]}
          >
            <Animatable.View animation="bounceIn" delay={300}>
              <Ionicons name="school" size={48} color={colors.primary} style={styles.icon} />
            </Animatable.View>
            
            <Animatable.Text animation="fadeInUp" delay={400} style={[styles.title, { color: colors.text }]}>
              Student Verification
            </Animatable.Text>
            
            <Animatable.Text animation="fadeInUp" delay={500} style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter your S-Number to get started
            </Animatable.Text>
            
            {errorMessage ? (
              <Animatable.View 
                animation="shake" 
                style={[
                  styles.messageContainer, 
                  isSuccess 
                    ? { backgroundColor: colors.success + '20', borderColor: colors.success } 
                    : { backgroundColor: colors.error + '20', borderColor: colors.error }
                ]}
              >
                <Ionicons 
                  name={isSuccess ? "checkmark-circle" : "alert-circle"} 
                  size={20} 
                  color={isSuccess ? colors.success : colors.error} 
                  style={styles.messageIcon}
                />
                <Text style={[styles.messageText, { color: isSuccess ? colors.success : colors.error }]}>
                  {errorMessage}
                </Text>
              </Animatable.View>
            ) : null}
            
            <Animatable.View animation="fadeInUp" delay={600} style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Student ID Number</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                <Ionicons name="person" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="s123456"
                  placeholderTextColor={colors.textSecondary}
                  value={sNumber}
                  onChangeText={setSNumber}
                  style={[styles.input, { color: colors.text }]}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </Animatable.View>
            
            <Animatable.View animation="fadeInUp" delay={700}>
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    { backgroundColor: colors.primary },
                    loading && { backgroundColor: colors.textSecondary }
                  ]} 
                  onPress={handleVerification} 
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.background} size="small" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color={colors.background} style={styles.buttonIcon} />
                      <Text style={[styles.buttonText, { color: colors.background }]}>Verify</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </Animatable.View>
            
            <Animatable.Text animation="fadeInUp" delay={800} style={[styles.infoText, { color: colors.textSecondary }]}>
              Your S-Number must be in our system to create an account. If you're not in the system yet, please contact your scioly webmaster.
            </Animatable.Text>
            
            <Animatable.View animation="fadeInUp" delay={900}>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => navigation.navigate('StudentLogin')}
                activeOpacity={0.7}
              >
                <Ionicons name="log-in" size={16} color={colors.primary} style={styles.linkIcon} />
                <Text style={[styles.linkText, { color: colors.primary }]}>Already have an account? Log in</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 32,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: font.weight.bold,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: font.family,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: font.family,
    lineHeight: 22,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  messageIcon: {
    marginRight: 8,
  },
  messageText: {
    fontSize: 14,
    flex: 1,
    fontFamily: font.family,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: font.weight.semibold,
    fontFamily: font.family,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    fontFamily: font.family,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: font.weight.bold,
    fontFamily: font.family,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: font.family,
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  linkIcon: {
    marginRight: 6,
  },
  linkText: {
    fontSize: 14,
    fontWeight: font.weight.semibold,
    fontFamily: font.family,
  },
  debugContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: font.weight.bold,
    marginBottom: 8,
    fontFamily: font.family,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: font.family,
  },
});