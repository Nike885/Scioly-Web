import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useOffline } from '../contexts/OfflineContext';

export default function SettingsScreen({ onNavigate }) {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { isOnline, forceOfflineMode, setForceOfflineMode } = useOffline();
  
  const [notifications, setNotifications] = useState({
    announcements: true,
    events: true,
    chat: true,
    reminders: true,
  });

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Connection Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📶</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Connection</Text>
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>☁️</Text>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Force Offline Mode</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Currently {isOnline ? 'online' : 'offline'} - messages sent immediately.
                </Text>
              </View>
            </View>
            <Switch
              value={forceOfflineMode}
              onValueChange={setForceOfflineMode}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={forceOfflineMode ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>✅</Text>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Network Status</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Connected to internet.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔔</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📢</Text>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Announcements</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive notifications for announcements.
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.announcements}
              onValueChange={() => toggleNotification('announcements')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={notifications.announcements ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📅</Text>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Events</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive notifications for events.
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.events}
              onValueChange={() => toggleNotification('events')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={notifications.events ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💬</Text>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Chat</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive notifications for chat.
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.chat}
              onValueChange={() => toggleNotification('chat')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={notifications.chat ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⏰</Text>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Reminders</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive notifications for reminders.
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.reminders}
              onValueChange={() => toggleNotification('reminders')}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={notifications.reminders ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🛡️</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
          </View>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔑</Text>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Change Password</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Update your account password.
                </Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>ℹ️</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>App Version</Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>1.0.0</Text>
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Build Number</Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>2024.1</Text>
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Founder & Creator</Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>Nikhilesh Gnanaraj</Text>
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Development</Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>React Native & Expo</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButtonLarge, { backgroundColor: '#FF6B6B' }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIconLarge}>🚪</Text>
          <Text style={[styles.logoutText, { color: '#FFFFFF' }]}>Logout</Text>
        </TouchableOpacity>

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
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 16,
    color: '#666',
  },
  logoutButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutIconLarge: {
    fontSize: 20,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
}); 