import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Alert
} from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useOffline } from '../contexts/OfflineContext';
import { font, spacing } from '../utils/theme';
import AnimatedCard from '../components/AnimatedCard';
import OfflineStatusIndicator from '../components/OfflineStatusIndicator';
import { supabase } from '../supabase/supabaseClient';
const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen({ onNavigate }) {
  const { user, isAdmin } = useAuth();
  const { colors } = useTheme();
  const { events, announcements, unreadAnnouncements } = useEvents();
  const { isOnline, cacheEvents, cacheAnnouncements } = useOffline();
  
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    fetchUnreadAnnouncements();
    
    // Cache data for offline use
    if (events && events.length > 0) {
      cacheEvents(events);
    }
    if (announcements && announcements.length > 0) {
      cacheAnnouncements(announcements);
    }
  }, [events, announcements]);

  const fetchUnreadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }

      // For now, we'll show banner if there are any recent announcements
      // In a real app, you'd track which announcements the user has read
      if (data && data.length > 0) {
        setShowBanner(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAnnouncementPress = () => {
    setShowBanner(false);
    onNavigate('announcements');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => onNavigate('settings')}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Offline Status Indicator */}
        <OfflineStatusIndicator />

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeLeft}>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
              Welcome back,
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || 'Nikhilesh Gnanaraj'}!
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: colors.primary }]}
            onPress={() => onNavigate('settings')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image 
            source={require('../assets/images/keyclublogo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Text */}
        <Text style={[styles.welcomeTo, { color: colors.secondary }]}>
          Welcome to
        </Text>
        <Text style={[styles.mainTitle, { color: colors.text }]}>
          Cypress Ranch Science Olympiad
        </Text>

        {/* Description Card */}
        <View style={[styles.descriptionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            Access resources, stay prepared, and stay connected with your team. 
            Explore events, announcements, and everything you need to succeed in Science Olympiad.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => onNavigate(isAdmin ? 'quiz' : 'quiz')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🎓</Text>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                {isAdmin ? 'Quiz Results' : 'Daily Quiz'}
              </Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                {isAdmin ? 'View student scores' : 'Test your knowledge'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => onNavigate('contact')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>📸</Text>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Follow Us</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => onNavigate('chat')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Chat</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Team communication</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => onNavigate('resources')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🎥</Text>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Scioly Moments</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Watch highlights</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => onNavigate('announcements')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>📢</Text>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Updates</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Latest news</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Admin Quick Actions */}
        {isAdmin && (
          <View style={styles.adminSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Admin Tools</Text>
            
            <View style={styles.adminActions}>
              <TouchableOpacity
                style={[styles.adminCard, { backgroundColor: colors.primary }]}
                onPress={() => onNavigate('calendar')}
                activeOpacity={0.8}
              >
                <Text style={styles.adminIcon}>➕</Text>
                <Text style={[styles.adminCardText, { color: colors.text }]}>Create Event</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminCard, { backgroundColor: colors.secondary }]}
                onPress={() => onNavigate('announcements')}
                activeOpacity={0.8}
              >
                <Text style={styles.adminIcon}>📢</Text>
                <Text style={[styles.adminCardText, { color: colors.text }]}>New Announcement</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    paddingBottom: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    padding: 8,
  },
  logoutIcon: {
    fontSize: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for navigation
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  welcomeLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 120,
    alignSelf: 'center',
  },
  welcomeTo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  descriptionCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  adminSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  adminCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 60,
  },
  adminIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  adminCardText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 1,
  },
  bottomSpacing: {
    height: 20,
  },
});