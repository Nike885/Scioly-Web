import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { font } from '../utils/theme';


import { useTheme } from '../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

export default function ResourcesScreen({ onNavigate }) {
  const { colors, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const searchScaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    startEntranceAnimations();
  }, []);

  const startEntranceAnimations = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(searchScaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleNavigate = (eventName) => {
    navigation.navigate('EventDetail', { eventName });
  };

  // Event data with theme-aware defaults
  const eventsData = [
    {
      title: 'Lab Events',
      icon: 'flask',
      data: [
        { name: 'Anatomy & Physiology', icon: 'body', color: colors.primary },
        { name: 'Chemistry Lab', icon: 'flask', color: colors.secondary },
        { name: 'Circuit Lab', icon: 'flash', color: '#FF6B9D' },
        { name: 'Codebusters', icon: 'code', color: '#4ECDC4' },
        { name: 'Disease Detectives', icon: 'shield', color: '#45B7D1' },
        { name: 'Experimental Design', icon: 'analytics', color: '#96CEB4' },
        { name: 'Forensics', icon: 'search', color: '#FFEAA7' },
        { name: 'Water Quality', icon: 'water', color: '#DDA0DD' },
      ],
    },
    {
      title: 'Build Events',
      icon: 'construct',
      data: [
        { name: 'Air Trajectory', icon: 'airplane', color: colors.primary },
        { name: 'Boomilever', icon: 'build', color: colors.secondary },
        { name: 'Electric Vehicle', icon: 'car', color: '#FF6B9D' },
        { name: 'Flight', icon: 'airplane', color: '#4ECDC4' },
        { name: 'Robot Tour', icon: 'hardware-chip', color: '#45B7D1' },
        { name: 'Scrambler', icon: 'trending-up', color: '#96CEB4' },
      ],
    },
    {
      title: 'Study Events',
      icon: 'book',
      data: [
        { name: 'Astronomy', icon: 'planet', color: colors.primary },
        { name: 'Botany', icon: 'leaf', color: colors.secondary },
        { name: 'Designer Genes', icon: 'medical', color: '#FF6B9D' },
        { name: 'Dynamic Planet', icon: 'water', color: '#4ECDC4' },
        { name: 'Entomology', icon: 'bug', color: '#45B7D1' },
        { name: 'Fermi Questions', icon: 'calculator', color: '#96CEB4' },
        { name: 'Geologic Mapping', icon: 'map', color: '#FFEAA7' },
        { name: 'Microbe Mission', icon: 'microscope', color: '#DDA0DD' },
        { name: 'Remote Sensing', icon: 'satellite', color: '#FF8A80' },
        { name: 'Rocks and Minerals', icon: 'diamond', color: '#4FC3F7' },
        { name: 'Tower', icon: 'business', color: '#81C784' },
        { name: 'Wind Power', icon: 'leaf', color: '#FFB74D' },
      ],
    },
    {
      title: 'Trial Events',
      icon: 'star',
      data: [
        { name: 'Code Craze', icon: 'code-slash', color: colors.primary },
        { name: 'Ping Pong Parachute', icon: 'tennisball', color: colors.secondary },
        { name: 'Protein Modeling', icon: 'layers', color: '#FF6B9D' },
      ],
    },
  ];

  const filteredEventsData = eventsData.map((section) => ({
    ...section,
    data: section.data.filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));
  
  const hasAnyResults = filteredEventsData.some(section => section.data.length > 0);

  const AnimatedEventCard = ({ event, index }) => {
    const cardScale = useRef(new Animated.Value(0.8)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const cardRotate = useRef(new Animated.Value(-3)).current;

    useEffect(() => {
      Animated.sequence([
        Animated.delay(index * 80),
        Animated.parallel([
          Animated.spring(cardScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(cardRotate, {
            toValue: 0,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [
              { scale: cardScale },
              { rotate: cardRotate.interpolate({
                inputRange: [-3, 0],
                outputRange: ['-3deg', '0deg']
              })}
            ],
            opacity: cardOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.card, { backgroundColor: event.color }]}
          onPress={() => handleNavigate(event.name)}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={event.icon} size={28} color={colors.background} />
          </View>
          <Text style={[styles.eventName, { color: colors.background }]}>{event.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.cardShadow, opacity: fadeAnim, transform: [ { translateY: slideAnim }, { scale: searchScaleAnim } ] },
        ]}
      >
        <View>
          <Ionicons name="library" size={24} color={colors.primary} />
        </View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Resources</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Find study materials and guides</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.card, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={[styles.searchBarContainer, { backgroundColor: colors.background, shadowColor: colors.primary }] }>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchBar, { color: colors.text }]}
            placeholder="Search events..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
{hasAnyResults ? (
          filteredEventsData.map((section, sectionIndex) => (
            <View 
              key={sectionIndex} 
              style={styles.section}
            >
      {searchQuery === '' && (
                <View style={styles.sectionHeader}>
                  <Ionicons name={section.icon} size={24} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
                </View>
      )}
      <View style={styles.grid}>
                {section.data.map((event, eventIndex) => (
                  <AnimatedEventCard 
                    key={eventIndex} 
                    event={event} 
                    index={eventIndex} 
                  />
        ))}
      </View>
            </View>
  ))
) : (
          <View 
            style={styles.noResultsContainer}
          >
            <Ionicons name="search" size={48} color={colors.textSecondary} />
            <Text style={[styles.noResultsText, { color: colors.text }]}>No events found</Text>
            <Text style={[styles.noResultsSubtext, { color: colors.textSecondary }]}>Try a different search term</Text>
          </View>
)}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: font.size.header - 4,
    fontWeight: font.weight.bold,
    marginTop: 4,
    marginBottom: 1,
    fontFamily: font.family,
  },
  headerSubtitle: {
    fontSize: font.size.body - 2,
    fontFamily: font.family,
  },
  searchContainer: {
    padding: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    fontSize: font.size.body,
    fontFamily: font.family,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: font.size.header - 2,
    fontWeight: font.weight.bold,
    marginLeft: 12,
    fontFamily: font.family,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    aspectRatio: 1.4,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    marginBottom: 8,
  },
  eventName: {
    fontWeight: font.weight.bold,
    fontSize: font.size.body - 1,
    textAlign: 'center',
    fontFamily: font.family,
    lineHeight: 18,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: font.size.header - 2,
    fontWeight: font.weight.bold,
    marginTop: 16,
    fontFamily: font.family,
  },
  noResultsSubtext: {
    fontSize: font.size.body,
    marginTop: 8,
    fontFamily: font.family,
  },
});
