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
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Offline Status Indicator */}
      <OfflineStatusIndicator />

      {/* Header with Settings Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || 'User'}!
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: colors.primary }]}
          onPress={() => onNavigate('admin')}
        >
          <Ionicons name="settings-outline" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      {/* Unread Announcements Banner */}
      {showBanner && unreadAnnouncements > 0 && (
        <View 
          style={styles.bannerWrap}
        >
          <TouchableOpacity
            style={[styles.banner, { backgroundColor: colors.accent }]}
            onPress={handleAnnouncementPress}
            activeOpacity={0.8}
          >
            <Ionicons name="megaphone" size={24} color={colors.background} />
            <View style={styles.bannerContent}>
              <Text style={[styles.bannerTitle, { color: colors.background }]}>
                New Announcements!
              </Text>
              <Text style={[styles.bannerText, { color: colors.background }]}>
                {unreadAnnouncements} unread announcement{unreadAnnouncements > 1 ? 's' : ''}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      )}

      {/* Logo Section */}
      <View style={styles.logoWrap}>
        <img 
          src="./assets/images/keyclublogo.png" 
          style={styles.logo}
          alt="Logo"
        />
      </View>

      {/* Welcome Text */}
      <Text style={[styles.welcome, { color: colors.secondary }]}>
        Welcome to
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>
        Cypress Ranch Science Olympiad
      </Text>

      {/* Subtitle Card */}
      <AnimatedCard style={[styles.card, { backgroundColor: colors.card }]} animationDelay={600}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Access resources, stay prepared, and stay connected with your team. 
          Explore events, announcements, and everything you need to succeed in Science Olympiad.
        </Text>
      </AnimatedCard>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
                           <TouchableOpacity
                   style={[styles.actionCard, { backgroundColor: colors.card }]}
                   onPress={() => onNavigate(isAdmin ? 'admin' : 'quiz')}
                   activeOpacity={0.8}
                 >
                   <Ionicons name={isAdmin ? "analytics" : "school"} size={32} color={colors.primary} />
                   <Text style={[styles.actionTitle, { color: colors.text }]}>
                     {isAdmin ? 'Quiz Results' : 'Daily Quiz'}
                   </Text>
                   <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                     {isAdmin ? 'View student scores' : 'Test your knowledge'}
                   </Text>
                 </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => onNavigate('resources')}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-instagram" size={32} color="#E4405F" />
            <Text style={[styles.actionTitle, { color: colors.text }]}>Follow Us</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => onNavigate('chat')}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubbles" size={32} color={colors.accent} />
            <Text style={[styles.actionTitle, { color: colors.text }]}>Chat</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Team communication</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => onNavigate('resources')}
            activeOpacity={0.8}
          >
            <Ionicons name="videocam" size={32} color="#4299e1" />
            <Text style={[styles.actionTitle, { color: colors.text }]}>Scioly Moments</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Watch highlights</Text>
          </TouchableOpacity>

                           <TouchableOpacity
                   style={[styles.actionCard, { backgroundColor: colors.card }]}
                   onPress={() => onNavigate('announcements')}
                   activeOpacity={0.8}
                 >
            <Ionicons name="megaphone" size={32} color={colors.info} />
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
              onPress={() => onNavigate('announcements')}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={24} color={colors.text} />
              <Text style={[styles.adminCardText, { color: colors.text }]}>Create Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.adminCard, { backgroundColor: colors.secondary }]}
              onPress={() => navigation.navigate('CreateAnnouncement')}
              activeOpacity={0.8}
            >
              <Ionicons name="megaphone" size={24} color={colors.text} />
              <Text style={[styles.adminCardText, { color: colors.text }]}>New Announcement</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: font.size.body,
    fontWeight: font.weight.regular,
  },
  userName: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 10,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 22,
    marginHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 320,
    maxWidth: 420,
  },
  bannerContent: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  bannerText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  logoWrap: {
    marginBottom: 18,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  logo: {
    width: 180,
    height: 120,
    alignSelf: 'center',
  },
  welcome: {
    fontSize: font.size.body + 2,
    fontWeight: font.weight.bold,
    fontFamily: font.family,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  title: {
    fontSize: font.size.header,
    fontWeight: font.weight.bold,
    marginTop: 6,
    marginBottom: 2,
    fontFamily: font.family,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  card: {
    marginTop: 18,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: font.size.body + 1,
    fontFamily: font.family,
    textAlign: 'center',
    letterSpacing: 0.3,
    paddingVertical: 10,
  },
  quickActions: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
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
  actionTitle: {
    fontSize: font.size.body,
    fontWeight: font.weight.bold,
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: font.size.small,
    textAlign: 'center',
  },
  adminSection: {
    marginTop: 20,
    paddingHorizontal: 20,
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
  adminCardText: {
    fontSize: font.size.small,
    fontWeight: font.weight.bold,
    marginLeft: 8,
    textAlign: 'center',
    flexShrink: 1,
  },
});