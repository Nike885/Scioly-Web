import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, ScrollView } from 'react-native';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventsProvider } from './contexts/EventsContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { lightColors, darkColors, font } from './utils/theme';
import ErrorBoundary from './components/ErrorBoundary';


// Import screens
import HomeScreen from './screens/HomeScreen';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import DailyQuizScreen from './screens/DailyQuizScreen';
import OfficersScreen from './screens/OfficersScreen';
import UnifiedResourcesScreen from './screens/UnifiedResourcesScreen';
import ChatScreen from './screens/ChatScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';

function AppContent() {
  const { colors, isDark } = useTheme();
  const { user, isAdmin } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  
  useEffect(() => {
    // Show splash for 2.2 seconds
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: colors.primary }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View
          style={styles.logoCircle}
        >
          <img
            src="./assets/images/keyclublogo.png"
            style={styles.logo}
            alt="Logo"
          />
        </View>
        <Text
          style={styles.splashTitle}
        >
          Cypress Ranch Scioly
        </Text>
        <Text
          style={styles.splashSubtitle}
        >
          Vibrant. Connected. Inspired.
        </Text>
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'announcements':
        return <AnnouncementsScreen onNavigate={setCurrentScreen} />;
      case 'quiz':
        return <DailyQuizScreen onNavigate={setCurrentScreen} />;
      case 'officers':
        return <OfficersScreen onNavigate={setCurrentScreen} />;
      case 'resources':
        return <UnifiedResourcesScreen onNavigate={setCurrentScreen} />;
      case 'chat':
        return <ChatScreen onNavigate={setCurrentScreen} />;
      case 'admin':
        return <AdminLoginScreen onNavigate={setCurrentScreen} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  const renderNavigation = () => (
    <View style={[styles.navigation, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'home' && styles.activeNavItem]} 
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={[styles.navText, { color: currentScreen === 'home' ? colors.primary : colors.textSecondary }]}>
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'announcements' && styles.activeNavItem]} 
        onPress={() => setCurrentScreen('announcements')}
      >
        <Text style={[styles.navText, { color: currentScreen === 'announcements' ? colors.primary : colors.textSecondary }]}>
          Announcements
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'quiz' && styles.activeNavItem]} 
        onPress={() => setCurrentScreen('quiz')}
      >
        <Text style={[styles.navText, { color: currentScreen === 'quiz' ? colors.primary : colors.textSecondary }]}>
          Quiz
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'officers' && styles.activeNavItem]} 
        onPress={() => setCurrentScreen('officers')}
      >
        <Text style={[styles.navText, { color: currentScreen === 'officers' ? colors.primary : colors.textSecondary }]}>
          Officers
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'resources' && styles.activeNavItem]} 
        onPress={() => setCurrentScreen('resources')}
      >
        <Text style={[styles.navText, { color: currentScreen === 'resources' ? colors.primary : colors.textSecondary }]}>
          Resources
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, currentScreen === 'chat' && styles.activeNavItem]} 
        onPress={() => setCurrentScreen('chat')}
      >
        <Text style={[styles.navText, { color: currentScreen === 'chat' ? colors.primary : colors.textSecondary }]}>
          Chat
        </Text>
      </TouchableOpacity>
      
      {isAdmin && (
        <TouchableOpacity 
          style={[styles.navItem, currentScreen === 'admin' && styles.activeNavItem]} 
          onPress={() => setCurrentScreen('admin')}
        >
          <Text style={[styles.navText, { color: currentScreen === 'admin' ? colors.primary : colors.textSecondary }]}>
            Admin
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.statusBarBackground} 
      />
      <ScrollView style={styles.content}>
        {renderScreen()}
      </ScrollView>
      {renderNavigation()}
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <EventsProvider>
          <OfflineProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </OfflineProvider>
        </EventsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  splashSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  navigation: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    justifyContent: 'space-around',
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeNavItem: {
    backgroundColor: 'rgba(110, 198, 255, 0.1)',
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
  },
});