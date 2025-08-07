import React from 'react';
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
  Linking,
  Alert,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../contexts/ThemeContext';
import { font, spacing } from '../utils/theme';
import AnimatedCard from '../components/AnimatedCard';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function InstagramFollowScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleInstagramPress = async () => {
    const url = 'https://www.instagram.com/sciolycrhs?igsh=a3ltYTZxYXBqZm9j';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Instagram');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open Instagram');
    }
  };

  const handleSharePress = () => {
    Alert.alert(
      'Share Instagram',
      'Share our Instagram account with your friends!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => {
          // You can implement sharing functionality here
          Alert.alert('Share', 'Sharing functionality can be implemented here');
        }}
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Follow Us on Instagram
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Stay connected with your Science Olympiad team
        </Text>
      </View>

      {/* Instagram Icon Card */}
      <Animatable.View animation="fadeInDown" duration={800} style={styles.iconCard}>
        <AnimatedCard style={[styles.instagramCard, { backgroundColor: colors.card }]} animationDelay={200}>
          <View style={styles.instagramIconContainer}>
            <Animatable.View 
              style={styles.instagramIcon}
              animation="pulse"
              iterationCount="infinite"
              duration={3000}
            >
              <Ionicons name="logo-instagram" size={80} color="#E4405F" />
            </Animatable.View>
            <Animatable.Text 
              animation="fadeInUp" 
              delay={300} 
              style={[styles.instagramHandle, { color: colors.text }]}
            >
              @sciolycrhs
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeInUp" 
              delay={400} 
              style={[styles.instagramDescription, { color: colors.textSecondary }]}
            >
              Cypress Ranch Science Olympiad
            </Animatable.Text>
          </View>
        </AnimatedCard>
      </Animatable.View>

      {/* Follow Button */}
      <Animatable.View animation="fadeInUp" delay={400} style={styles.buttonContainer}>
        <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
          <TouchableOpacity
            style={[styles.followButton, { backgroundColor: colors.primary }]}
            onPress={handleInstagramPress}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-instagram" size={24} color={colors.background} />
            <Text style={[styles.followButtonText, { color: colors.background }]}>
              Follow on Instagram
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>

      {/* Features Section */}
      <Animatable.View animation="fadeInUp" delay={600} style={styles.featuresSection}>
        <Animatable.Text 
          animation="pulse" 
          iterationCount="infinite" 
          duration={2000}
          style={[styles.sectionTitle, { color: colors.text }]}
        >
          What You'll Find
        </Animatable.Text>
        
        <View style={styles.featuresGrid}>
          <Animatable.View animation="zoomIn" delay={700} duration={600} style={styles.featureCardWrapper}>
            <AnimatedCard style={[styles.featureCard, { backgroundColor: colors.card }]} animationDelay={700}>
              <Animatable.View animation="bounceIn" delay={800} duration={800}>
                <Ionicons name="calendar" size={32} color={colors.primary} />
              </Animatable.View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Event Updates</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Competition dates & schedules
              </Text>
            </AnimatedCard>
          </Animatable.View>

          <Animatable.View animation="zoomIn" delay={800} duration={600} style={styles.featureCardWrapper}>
            <AnimatedCard style={[styles.featureCard, { backgroundColor: colors.card }]} animationDelay={800}>
              <Animatable.View animation="bounceIn" delay={900} duration={800}>
                <Ionicons name="trophy" size={32} color={colors.secondary} />
              </Animatable.View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Team Achievements</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Victories & awards
              </Text>
            </AnimatedCard>
          </Animatable.View>

          <Animatable.View animation="zoomIn" delay={900} duration={600} style={styles.featureCardWrapper}>
            <AnimatedCard style={[styles.featureCard, { backgroundColor: colors.card }]} animationDelay={900}>
              <Animatable.View animation="bounceIn" delay={1000} duration={800}>
                <Ionicons name="people" size={32} color={colors.accent} />
              </Animatable.View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Team Photos</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Behind the scenes
              </Text>
            </AnimatedCard>
          </Animatable.View>

          <Animatable.View animation="zoomIn" delay={1000} duration={600} style={styles.featureCardWrapper}>
            <AnimatedCard style={[styles.featureCard, { backgroundColor: colors.card }]} animationDelay={1000}>
              <Animatable.View animation="bounceIn" delay={1100} duration={800}>
                <Ionicons name="bulb" size={32} color={colors.info} />
              </Animatable.View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Study Tips</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Resources & guides
              </Text>
            </AnimatedCard>
          </Animatable.View>
        </View>
      </Animatable.View>

      {/* Share Section */}
      <Animatable.View animation="fadeInUp" delay={1100} style={styles.shareSection}>
        <AnimatedCard style={[styles.shareCard, { backgroundColor: colors.card }]} animationDelay={1200}>
          <Text style={[styles.shareTitle, { color: colors.text }]}>
            Spread the Word
          </Text>
          <Text style={[styles.shareDescription, { color: colors.textSecondary }]}>
            Help your friends stay connected with the Science Olympiad team
          </Text>
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: colors.secondary }]}
            onPress={handleSharePress}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social" size={20} color={colors.background} />
            <Text style={[styles.shareButtonText, { color: colors.background }]}>
              Share Instagram
            </Text>
          </TouchableOpacity>
        </AnimatedCard>
      </Animatable.View>

      {/* Footer */}
      <Animatable.View animation="fadeInUp" delay={1300} style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Stay connected with your Science Olympiad family! 🧪🔬
        </Text>
      </Animatable.View>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: font.size.header,
    fontWeight: font.weight.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: font.size.body,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  iconCard: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  instagramCard: {
    padding: 30,
    alignItems: 'center',
    borderRadius: 20,
  },
  instagramIconContainer: {
    alignItems: 'center',
  },
  instagramIcon: {
    marginBottom: 16,
  },
  instagramHandle: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
    marginBottom: 4,
  },
  instagramDescription: {
    fontSize: font.size.body,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  followButtonText: {
    fontSize: font.size.body,
    fontWeight: font.weight.bold,
    marginLeft: 8,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  featureCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 140,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: font.size.body,
    fontWeight: font.weight.bold,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  featureDescription: {
    fontSize: font.size.small,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  shareSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  shareCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  shareTitle: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  shareDescription: {
    fontSize: font.size.body,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: font.size.body,
    fontWeight: font.weight.bold,
    marginLeft: 6,
  },
  footer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: font.size.body,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});