import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

import { useTheme } from '../contexts/ThemeContext';

export default function ContactScreen({ onNavigate }) {
  const { colors } = useTheme();

  const handleInstagramFollow = () => {
    // Open Instagram profile in new tab
    window.open('https://www.instagram.com/sciolycrhs', '_blank');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Follow Us</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Instagram Section */}
        <View style={styles.instagramSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Follow Us on Instagram
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Stay connected with your Science Olympiad team
          </Text>

          <View style={[styles.instagramCard, { backgroundColor: colors.card }]}>
            <Text style={styles.instagramLogo}>📸</Text>
            <Text style={[styles.instagramHandle, { color: colors.text }]}>
              @sciolycrhs
            </Text>
            <Text style={[styles.instagramName, { color: colors.textSecondary }]}>
              Cypress Ranch Science Olympiad
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.followButton, { backgroundColor: colors.primary }]}
            onPress={handleInstagramFollow}
            activeOpacity={0.8}
          >
            <Text style={styles.instagramIcon}>📸</Text>
            <Text style={[styles.followButtonText, { color: colors.background }]}>
              Follow on Instagram
            </Text>
          </TouchableOpacity>
        </View>

        {/* What You'll Find Section */}
        <View style={styles.whatYouFindSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What You'll Find
          </Text>

          <View style={styles.featuresGrid}>
            <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <Text style={styles.featureIcon}>📅</Text>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Event Updates
              </Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Team Achievements
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contact Information
          </Text>

          <View style={[styles.contactCard, { backgroundColor: colors.card }]}>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📧</Text>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>
                  Email
                </Text>
                <Text style={[styles.contactValue, { color: colors.text }]}>
                  scioly@cypressranch.com
                </Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>🏫</Text>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>
                  School
                </Text>
                <Text style={[styles.contactValue, { color: colors.text }]}>
                  Cypress Ranch High School
                </Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📍</Text>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>
                  Location
                </Text>
                <Text style={[styles.contactValue, { color: colors.text }]}>
                  Cypress, TX
                </Text>
              </View>
            </View>
          </View>
        </View>

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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    paddingBottom: 15,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  instagramSection: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  instagramCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instagramLogo: {
    fontSize: 60,
    marginBottom: 16,
  },
  instagramHandle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instagramName: {
    fontSize: 16,
    textAlign: 'center',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  instagramIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  whatYouFindSection: {
    padding: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  featureCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactSection: {
    padding: 20,
    marginTop: 20,
  },
  contactCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 100,
  },
});