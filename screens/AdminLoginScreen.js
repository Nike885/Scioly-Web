import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { font } from '../utils/theme';
import * as Animatable from 'react-native-animatable';
import AnimatedButton from '../components/AnimatedButton';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function AdminLoginScreen({ navigation: navProp }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginAsAdmin } = useAuth();
  const { colors, theme, setThemeMode } = useTheme();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const formSlideAnim = useRef(new Animated.Value(100)).current;

  // Theme toggle state for admin (persisted by ThemeContext per user)
  const isDark = theme === 'dark';

  const handleToggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAdminLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      const result = await loginAsAdmin(email, password);
      if (!result) {
        Alert.alert('Login Failed', 'Invalid credentials or account creation failed');
      }
      // On success, global state will switch navigator
    } catch (error) {
      Alert.alert('Login Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      {/* Removed theme toggle - now always uses account setting */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: logoScaleAnim }
              ]
            }
          ]}
        >
          {/* Header Section */}
          <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
            <Ionicons name="shield-checkmark" size={80} color={colors.primary} style={styles.logo} />
            <Animatable.Text animation="pulse" iterationCount="infinite" duration={1800} style={[styles.title, { color: colors.text }]}>Admin Portal</Animatable.Text>
            <Animatable.Text animation="fadeInUp" delay={300} duration={900} style={[styles.subtitle, { color: colors.textSecondary }]}>Access administrative controls</Animatable.Text>
          </Animatable.View>

          {/* Form Section */}
          <Animated.View 
            style={[
              styles.formContainer,
              { backgroundColor: colors.card, shadowColor: colors.primary, transform: [{ translateY: formSlideAnim }] }
            ]}
          >
            <Animatable.View animation="fadeInUp" delay={300} duration={800} style={styles.form}>
              <View style={[styles.inputGroup, { backgroundColor: colors.inputBackground, borderColor: colors.cardShadow }]}> 
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Admin Email"
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, { color: colors.text }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={[styles.inputGroup, { backgroundColor: colors.inputBackground, borderColor: colors.cardShadow }]}> 
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, { color: colors.text }]}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>

              <AnimatedButton
                onPress={handleAdminLogin} 
                disabled={loading}
                style={[styles.loginButton, { backgroundColor: colors.primary }]}
                variant="primary"
              >
                {loading ? (
                  <Animatable.View animation="rotate" iterationCount="infinite" duration={1000}>
                    <Ionicons name="refresh" size={20} color={colors.background} />
                  </Animatable.View>
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={20} color={colors.background} style={{ marginRight: 8 }} />
                    <Text style={[styles.loginButtonText, { color: colors.background }]}>Sign In as Admin</Text>
                  </>
                )}
              </AnimatedButton>

              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
                <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>Back to Login Options</Text>
              </TouchableOpacity>
            </Animatable.View>

            {/* Hint Section */}
            <Animatable.View animation="fadeInUp" delay={600} duration={800} style={styles.hintContainer}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>Use admin@example.com / password</Text>
            </Animatable.View>
          </Animated.View>
        </Animated.View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    fontSize: font.size.header,
    fontWeight: font.weight.bold,
    marginBottom: 8,
    fontFamily: font.family,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: font.size.body,
    fontFamily: font.family,
    letterSpacing: 0.2,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 0,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  form: {
    borderRadius: 20,
    padding: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: font.size.body,
    fontFamily: font.family,
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  loginButtonText: {
    fontSize: font.size.body,
    fontWeight: font.weight.bold,
    fontFamily: font.family,
    letterSpacing: 0.3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: font.size.body,
    marginLeft: 8,
    fontFamily: font.family,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: font.size.small,
    marginLeft: 8,
    fontFamily: font.family,
    textAlign: 'center',
  },
});