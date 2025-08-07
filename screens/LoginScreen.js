import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../utils/theme';
import AnimatedButton from '../components/AnimatedButton';
import * as Animatable from 'react-native-animatable';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
      setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      // AppNavigator will handle navigation
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animatable.View animation="fadeInDown" duration={900} style={styles.loginCard}>
            <Text style={styles.title}>Admin Login</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>
            <AnimatedButton
              onPress={handleLogin}
              style={[styles.loginButton, loading && styles.disabledButton]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                'Log In'
              )}
            </AnimatedButton>
            <Text style={styles.hint}>
              Demo credentials: admin@example.com / password
            </Text>
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
  loginCard: {
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: font.size.body,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: font.family,
  },
  input: {
    fontSize: font.size.body,
    color: colors.text,
    fontFamily: font.family,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 4,
  },
  loginButton: {
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: font.size.small,
    marginTop: 18,
    fontFamily: font.family,
    textAlign: 'center',
  },
});