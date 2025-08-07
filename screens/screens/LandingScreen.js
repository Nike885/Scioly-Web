import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function LandingScreen({ onLogin }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Welcome to Science Olympiad!</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Track your progress and compete with others</Text>
      
      <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary }]} onPress={onLogin}>
        <Text style={[styles.buttonText, { color: colors.background }]}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.signupButton, { borderColor: colors.primary }]}> 
        <Text style={[styles.buttonText, { color: colors.primary }]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  loginButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: 200,
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});