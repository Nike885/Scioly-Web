import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const VideoShowcaseScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [status, setStatus] = useState({});
  const videoRef = useRef(null);

  // Configure audio to play even in silent mode
  React.useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true, // This is the key setting!
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Audio configuration error:', error);
      }
    };
    
    configureAudio();
  }, []);

  const handlePlayVideo = () => {
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    setIsPlaying(false);
    setIsFullscreen(false);
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        // If video finished, restart from beginning
        if (status.didJustFinish || status.positionMillis >= status.durationMillis) {
          await videoRef.current.setPositionAsync(0);
        }
        await videoRef.current.playAsync();
      }
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const onPlaybackStatusUpdate = (status) => {
    setStatus(status);
    setIsPlaying(status.isPlaying);
    
    // Reset video when it finishes
    if (status.didJustFinish) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.setPositionAsync(0);
      }
    }
  };

  const formatTime = (milliseconds) => {
    if (!milliseconds) return '0:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (status.durationMillis && status.positionMillis) {
      return status.positionMillis / status.durationMillis;
    }
    return 0;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Ionicons name="play-circle" size={48} color="#4299e1" />
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Scioly Moments
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Experience the excitement and fun of Science Olympiad
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.tabContent}>
          {/* Hero Section */}
          <View style={[styles.heroSection, { backgroundColor: colors.card }]}>
            <View style={styles.heroContent}>
              <Ionicons name="videocam" size={40} color="#4299e1" />
              <Text style={[styles.heroTitle, { color: colors.text }]}>
                Watch Our Journey
              </Text>
              <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
                Get a glimpse into the amazing world of Science Olympiad through 
                our carefully curated moments. From intense competitions to 
                team building activities, discover what makes Scioly so special.
              </Text>
            </View>
          </View>

          {/* Call to Action */}
          <View style={[styles.ctaSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.ctaTitle, { color: colors.text }]}>
              Ready to Experience Scioly?
            </Text>
            <Text style={[styles.ctaDescription, { color: colors.textSecondary }]}>
              Watch our video to see what makes Science Olympiad so special and 
              why students love being part of this amazing community.
            </Text>
            
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: '#4299e1' }]}
              onPress={handlePlayVideo}
              activeOpacity={0.8}
            >
              <Ionicons name="play-circle" size={24} color="#FFFFFF" />
              <Text style={styles.ctaButtonText}>Watch Scioly Moments</Text>
            </TouchableOpacity>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              What You'll See
            </Text>
            
            <View style={styles.featuresGrid}>
              {[
                {
                  icon: 'trophy',
                  title: 'Competition Highlights',
                  description: 'Exciting moments from various Science Olympiad events'
                },
                {
                  icon: 'people',
                  title: 'Team Building',
                  description: 'Students working together and forming lasting friendships'
                },
                {
                  icon: 'library',
                  title: 'Learning & Discovery',
                  description: 'The joy of scientific exploration and problem-solving'
                },
                {
                  icon: 'heart',
                  title: 'Fun Memories',
                  description: 'Laughter, celebrations, and unforgettable experiences'
                }
              ].map((feature, index) => (
                <View
                  key={index}
                  style={[styles.featureCard, { backgroundColor: colors.card }]}
                >
                  <View style={styles.featureIcon}>
                    <Ionicons name={feature.icon} size={24} color="#4299e1" />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                    {feature.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Video Modal */}
      {showVideo && (
        <View style={[styles.videoModal, isFullscreen && styles.fullscreenModal]}>
          <View style={[
            styles.videoModalContent, 
            { backgroundColor: colors.card },
            isFullscreen && styles.fullscreenContent
          ]}>
            <View style={[styles.videoModalHeader, isFullscreen && styles.fullscreenHeader]}>
              <Text style={[styles.videoModalTitle, { color: colors.text }, isFullscreen && styles.fullscreenTitle]}>
                Scioly Moments
              </Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleFullscreenToggle}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={isFullscreen ? 'contract' : 'expand'} 
                    size={isFullscreen ? 20 : 24} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleCloseVideo}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={isFullscreen ? 20 : 24} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[styles.videoWrapper, isFullscreen && styles.fullscreenVideoWrapper]}>
              <Video
                ref={videoRef}
                style={[styles.video, isFullscreen && styles.fullscreenVideo]}
                source={require('../assets/videos/scioly_moments.mp4')}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                shouldPlay={false}
                isMuted={false}
                volume={1.0}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                onError={(error) => {
                  console.error('Video error:', error);
                }}
              />
              
              {!isPlaying && (
                <TouchableOpacity
                  style={styles.playOverlay}
                  onPress={handlePlayPause}
                  activeOpacity={0.8}
                >
                  <View style={styles.playButton}>
                    <Ionicons
                      name="play"
                      size={32}
                      color="#FFFFFF"
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            
            {!isFullscreen && (
              <View style={styles.videoControls}>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${getProgress() * 100}%`,
                          backgroundColor: '#4299e1',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                    {formatTime(status.positionMillis)} / {formatTime(status.durationMillis)}
                  </Text>
                </View>

                <View style={styles.controlButtons}>
                  <TouchableOpacity
                    style={[styles.controlButton, { backgroundColor: colors.card }]}
                    onPress={handlePlayPause}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isPlaying ? 'pause' : 'play'}
                      size={20}
                      color="#4299e1"
                    />
                    <Text style={[styles.controlButtonText, { color: colors.text }]}>
                      {isPlaying ? 'Pause' : 'Play'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSection: {
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaSection: {
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  featuresSection: {
    marginTop: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  videoModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullscreenModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  videoModalContent: {
    width: width - 20,
    maxHeight: height * 0.9,
    borderRadius: 16,
    overflow: 'hidden',
  },
  fullscreenContent: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  videoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 4,
  },
  videoModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoWrapper: {
    position: 'relative',
    backgroundColor: '#000',
    width: '100%',
    height: 500,
  },
  fullscreenVideoWrapper: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(66, 153, 225, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoControls: {
    padding: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeText: {
    fontSize: 12,
    textAlign: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.3)',
  },
  controlButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  fullscreenModal: {
    backgroundColor: '#000',
  },
  fullscreenContent: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    maxHeight: '100%',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 4,
  },
  fullscreenVideoWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  fullscreenHeader: {
    padding: 8,
    minHeight: 40,
  },
  fullscreenTitle: {
    fontSize: 16,
  },
});

export default VideoShowcaseScreen; 