import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Image,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import { font, spacing, shadows } from '../utils/theme';
import AnimatedButton from '../components/AnimatedButton';

export default function SettingsScreen({ navigation }) {
  const { colors, theme, toggleTheme, isDark } = useTheme();
  const { user, changePassword, logout } = useAuth();
  const { isOnline, forceOnlineMode, forceOfflineModeEnabled } = useOffline();
  
  const [profileData, setProfileData] = useState({
    displayName: user?.name || '',
    bio: user?.bio || '',
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [notifications, setNotifications] = useState({
    announcements: true,
    events: true,
    chat: true,
    reminders: true,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [forceOffline, setForceOffline] = useState(false);

  const handleProfileSave = async () => {
    try {
      // Here you would typically update the user profile in your backend
      // For now, we'll just show a success message
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Landing' }],
            });
          },
        },
      ]
    );
  };

  const renderSection = ({ title, icon, children, animationDelay = 0 }) => (
    <Animatable.View
      style={styles.section}
      animation="fadeInUp"
      delay={animationDelay}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: colors.primary }]}>
          <Ionicons name={icon} size={20} color={colors.background} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {children}
    </Animatable.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animatable.View style={styles.header} animation="fadeInDown">
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <View style={styles.headerSpacer} />
        </Animatable.View>

        {/* Profile Section */}
        {renderSection({
          title: 'Profile',
          icon: 'person',
          animationDelay: 100,
          children: (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.profileHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Ionicons name="person" size={40} color={colors.background} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: colors.text }]}>
                    {user?.name || 'User'}
                  </Text>
                  <Text style={[styles.profileRole, { color: colors.textSecondary }]}>
                    {user?.sNumber || 'Student'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: colors.primary }]}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color={colors.background} />
                </TouchableOpacity>
              </View>

              {isEditing && (
                <Animatable.View animation="fadeInUp" style={styles.editForm}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Display Name</Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                        borderColor: colors.border
                      }]}
                      value={profileData.displayName}
                      onChangeText={(text) => setProfileData(prev => ({ ...prev, displayName: text }))}
                      placeholder="Enter display name"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Bio</Text>
                    <TextInput
                      style={[styles.input, styles.textArea, { 
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                        borderColor: colors.border
                      }]}
                      value={profileData.bio}
                      onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
                      placeholder="Tell us about yourself..."
                      placeholderTextColor={colors.textSecondary}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <AnimatedButton
                    onPress={handleProfileSave}
                    style={styles.saveButton}
                  >
                    Save Changes
                  </AnimatedButton>
                </Animatable.View>
              )}
            </View>
          ),
        })}

        {/* Theme Section */}
        {renderSection({
          title: 'Appearance',
          icon: 'color-palette',
          animationDelay: 200,
          children: (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons 
                    name={isDark ? "moon" : "sunny"} 
                    size={24} 
                    color={colors.primary} 
                  />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Dark Mode
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      Switch between light and dark themes
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isDark ? colors.background : colors.card}
                />
              </View>
            </View>
          ),
        })}

        {/* Offline Mode Section */}
        {renderSection({
          title: 'Connection',
          icon: 'wifi',
          animationDelay: 250,
          children: (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons 
                    name={forceOffline ? "cloud-offline" : "cloud"} 
                    size={24} 
                    color={forceOffline ? colors.error : colors.primary} 
                  />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Force Offline Mode
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      {forceOffline ? 'Currently offline - messages will be queued' : 'Currently online - messages sent immediately'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={forceOffline}
                  onValueChange={(value) => {
                    setForceOffline(value);
                    if (value) {
                      forceOfflineModeEnabled();
                      Alert.alert('Offline Mode', 'App is now in offline mode. Messages will be queued until you go back online.');
                    } else {
                      forceOnlineMode();
                      Alert.alert('Online Mode', 'App is now online. Queued messages will be sent.');
                    }
                  }}
                  trackColor={{ false: colors.border, true: colors.error }}
                  thumbColor={forceOffline ? colors.background : colors.card}
                />
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons 
                    name={isOnline ? "checkmark-circle" : "close-circle"} 
                    size={24} 
                    color={isOnline ? colors.success : colors.error} 
                  />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Network Status
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      {isOnline ? 'Connected to internet' : 'No internet connection'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ),
        })}

        {/* Notifications Section */}
        {renderSection({
          title: 'Notifications',
          icon: 'notifications',
          animationDelay: 300,
          children: (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {Object.entries(notifications).map(([key, value]) => (
                <View key={key} style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Ionicons 
                      name={
                        key === 'announcements' ? 'megaphone' :
                        key === 'events' ? 'calendar' :
                        key === 'chat' ? 'chatbubbles' :
                        'alarm'
                      } 
                      size={24} 
                      color={colors.primary} 
                    />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: colors.text }]}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                        Receive notifications for {key}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={(newValue) => 
                      setNotifications(prev => ({ ...prev, [key]: newValue }))
                    }
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={value ? colors.background : colors.card}
                  />
                </View>
              ))}
            </View>
          ),
        })}

        {/* Security Section */}
        {renderSection({
          title: 'Security',
          icon: 'shield-checkmark',
          animationDelay: 400,
          children: (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => setIsChangingPassword(!isChangingPassword)}
              >
                <View style={styles.settingInfo}>
                  <Ionicons name="key" size={24} color={colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Change Password
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      Update your account password
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {isChangingPassword && (
                <Animatable.View animation="fadeInUp" style={styles.passwordForm}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Current Password</Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                        borderColor: colors.border
                      }]}
                      value={passwordData.currentPassword}
                      onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                      placeholder="Enter current password"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                        borderColor: colors.border
                      }]}
                      value={passwordData.newPassword}
                      onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                      placeholder="Enter new password"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm New Password</Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                        borderColor: colors.border
                      }]}
                      value={passwordData.confirmPassword}
                      onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                      placeholder="Confirm new password"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry
                    />
                  </View>

                  <AnimatedButton
                    onPress={handlePasswordChange}
                    style={styles.saveButton}
                  >
                    Update Password
                  </AnimatedButton>
                </Animatable.View>
              )}
            </View>
          ),
        })}

        {/* About Section */}
        {renderSection({
          title: 'About',
          icon: 'information-circle',
          animationDelay: 500,
          children: (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.aboutItem}>
                <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>App Version</Text>
                <Text style={[styles.aboutValue, { color: colors.text }]}>1.0.0</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Build Number</Text>
                <Text style={[styles.aboutValue, { color: colors.text }]}>2024.1</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Founder & Creator</Text>
                <Text style={[styles.aboutValue, { color: colors.text }]}>Nikhilesh Gnanaraj</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Development</Text>
                <Text style={[styles.aboutValue, { color: colors.text }]}>React Native & Expo</Text>
              </View>
            </View>
          ),
        })}

        {/* Logout Button */}
        <Animatable.View animation="fadeInUp" delay={600} style={styles.logoutContainer}>
          <AnimatedButton
            onPress={handleLogout}
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            variant="error"
          >
            <Ionicons name="log-out-outline" size={20} color={colors.background} />
            <Text style={[styles.logoutText, { color: colors.background }]}>Logout</Text>
          </AnimatedButton>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    ...shadows.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: font.size.body,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editForm: {
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: font.size.small,
    fontWeight: font.weight.semibold,
    marginBottom: 8,
  },
  input: {
    fontSize: font.size.body,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: font.size.body,
    fontWeight: font.weight.semibold,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: font.size.small,
  },
  passwordForm: {
    marginTop: 16,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: font.size.body,
  },
  aboutValue: {
    fontSize: font.size.body,
    fontWeight: font.weight.semibold,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: font.size.body,
    fontWeight: font.weight.bold,
    marginLeft: 8,
  },
}); 