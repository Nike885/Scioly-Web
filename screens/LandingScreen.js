import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, font } from '../utils/theme';
import AnimatedButton from '../components/AnimatedButton';
import * as Animatable from 'react-native-animatable';

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={900} style={styles.logoWrap}>
      <Image 
        source={require('../assets/images/keyclublogo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      </Animatable.View>
      <Animatable.Text animation="fadeInUp" delay={200} duration={900} style={styles.title}>
        Cypress Ranch Science Olympiad
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={400} duration={900} style={styles.subtitle}>
        Access Resources, Stay prepared, Stay connected.
      </Animatable.Text>
      <View style={styles.buttonContainer}>
        <AnimatedButton onPress={() => navigation.navigate('StudentVerification')} style={styles.button}>
          Sign Up
        </AnimatedButton>
        <AnimatedButton onPress={() => navigation.navigate('StudentLogin')} style={styles.button} variant="secondary">
          Login
        </AnimatedButton>
        <AnimatedButton onPress={() => navigation.navigate('AdminLogin')} style={[styles.button, styles.adminButton]} variant="accent">
          Admin Login
        </AnimatedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 18,
  },
  logoWrap: {
    marginBottom: 18,
    alignItems: 'center', 
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: { 
    fontSize: font.size.header,
    fontWeight: font.weight.bold,
    color: colors.text,
    marginTop: 10,
    marginBottom: 2,
    fontFamily: font.family,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: font.size.body + 2,
    color: colors.textSecondary,
    marginBottom: 18,
    fontFamily: font.family,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 18,
  },
  button: { 
    marginVertical: 6,
  },
  adminButton: {
    marginTop: 10,
  },
});