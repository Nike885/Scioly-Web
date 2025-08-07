import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { EventsProvider } from './contexts/EventsContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { lightColors, darkColors, font } from './utils/theme';
import ErrorBoundary from './components/ErrorBoundary';
import notificationService from './services/NotificationService';

// Create theme-aware navigation themes
const createNavigationTheme = (isDark) => {
  const colors = isDark ? darkColors : lightColors;
  
  return {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      primary: colors.primary,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };
};

function AppContent() {
  const { colors, isDark } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize notifications
      await notificationService.initialize();
      
      // Show splash for 2.2 seconds
      const timer = setTimeout(() => setShowSplash(false), 2200);
      return () => clearTimeout(timer);
    };
    
    initializeApp();
  }, []);

  if (showSplash) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: colors.primary }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <Animatable.View
          animation="zoomIn"
          duration={900}
          style={styles.logoCircle}
        >
          <Animatable.Image
            animation="pulse"
            iterationCount="infinite"
            duration={1200}
            source={require('./assets/images/keyclublogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animatable.View>
        <Animatable.Text
          animation="fadeInUp"
          delay={700}
          duration={900}
          style={styles.splashTitle}
        >
          Cypress Ranch Scioly
        </Animatable.Text>
        <Animatable.Text
          animation="fadeInUp"
          delay={1100}
          duration={900}
          style={styles.splashSubtitle}
        >
          Vibrant. Connected. Inspired.
        </Animatable.Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={createNavigationTheme(isDark)}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.statusBarBackground} 
      />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <OfflineProvider>
          <EventsProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </EventsProvider>
        </OfflineProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    padding: 32,
    marginBottom: 18,
    shadowColor: '#FF8A65',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  logo: {
    width: 110,
    height: 110,
  },
  splashTitle: {
    color: '#fff',
    fontSize: font.size.header + 2,
    fontWeight: font.weight.bold,
    fontFamily: font.family,
    marginTop: 10,
    letterSpacing: 1.2,
    textShadowColor: '#FF8A65',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  splashSubtitle: {
    color: '#FFD54F',
    fontSize: font.size.body + 2,
    fontWeight: font.weight.semibold,
    fontFamily: font.family,
    marginTop: 8,
    letterSpacing: 0.6,
    textShadowColor: 'rgba(110, 198, 255, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});