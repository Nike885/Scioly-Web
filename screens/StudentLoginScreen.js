import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../utils/theme';
import AnimatedButton from '../components/AnimatedButton';
import * as Animatable from 'react-native-animatable';

export default function StudentLoginScreen({ navigation }) {
  const [sNumber, setSNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginAsStudent } = useAuth();
  
  // Login with S-Number/password
  const handleLogin = async () => {
    if (!sNumber.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter both S-Number and password.');
      return;
    }
    if (!sNumber.startsWith('s')) {
      Alert.alert('Invalid S-Number', 'Please enter a valid S-Number starting with "s" (e.g., s150712).');
      return;
    }
    setLoading(true);
    try {
      const success = await loginAsStudent(sNumber.toLowerCase(), password);
      if (success) {
        // AppNavigator will handle navigation
      }
    } catch (error) {
      console.error('Student login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animatable.View animation="fadeInDown" duration={900} style={styles.formCard}>
              <Text style={styles.title}>Student Login</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>S-Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your S-Number"
                  value={sNumber}
                  onChangeText={setSNumber}
                  style={styles.input}
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <AnimatedButton
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  variant="secondary"
                >
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                </AnimatedButton>
              </View>
            </View>
            <AnimatedButton
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
              variant="secondary"
              disabled={loading}
            >
              Forgot your password?
            </AnimatedButton>
            <AnimatedButton
              onPress={handleLogin}
              style={[styles.button, loading && styles.disabledButton]} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  Log In <Ionicons name="arrow-forward" size={20} color={colors.card} style={styles.buttonIcon} />
                </>
              )}
            </AnimatedButton>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            <AnimatedButton
              onPress={() => navigation.navigate('StudentVerification')}
              style={styles.signupButton}
              variant="primary"
              disabled={loading}
            >
              Don't have an account? Sign Up
            </AnimatedButton>
            <View style={styles.helpContainer}>
              <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
              <Text style={styles.helpText}>
                Need help? Contact your webmaster.
              </Text>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  formCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: font.size.header,
    fontWeight: font.weight.bold,
    color: colors.text,
    marginBottom: 18,
    fontFamily: font.family,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: font.size.body,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: font.family,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: font.size.body,
    color: colors.text,
    fontFamily: font.family,
    paddingVertical: 8,
  },
  eyeIcon: {
    marginLeft: 6,
    backgroundColor: 'transparent',
    padding: 0,
    minWidth: 30,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    backgroundColor: 'transparent',
    padding: 0,
  },
  button: {
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 8,
    color: colors.textSecondary,
    fontSize: font.size.small,
    fontFamily: font.family,
  },
  signupButton: {
    marginTop: 0,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    justifyContent: 'center',
  },
  helpText: {
    color: colors.textSecondary,
    fontSize: font.size.small,
    marginLeft: 6,
    fontFamily: font.family,
  },
});
            