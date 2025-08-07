import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { font } from '../utils/theme';

import { useTheme } from '../contexts/ThemeContext';


const { width: screenWidth } = Dimensions.get('window');

export default function OfficersScreen({ onNavigate }) {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const { colors, theme } = useTheme();
  const [resetCards, setResetCards] = useState(0);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    startEntranceAnimations();
    return () => subscription?.remove();
  }, []);

  // Reset cards when screen comes into focus
  useEffect(() => {
    setResetCards(prev => prev + 1);
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
        Animated.spring(headerScaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Calculate responsive layout
  const isWeb = screenData.width > 768;
  const isTablet = screenData.width > 480 && screenData.width <= 768;
  const isMobile = screenData.width <= 480;
  
  // Determine number of columns based on screen size
  const getNumColumns = () => {
    if (isWeb) return screenData.width > 1200 ? 4 : 3;
    if (isTablet) return 3;
    return 2; // mobile
  };
  
  const numColumns = getNumColumns();
  const cardWidth = (screenData.width - (20 * 2) - (10 * (numColumns - 1))) / numColumns;
  const cardHeight = isWeb ? 520 : 480;

  // Officer data with vibrant colors and contact info
  const officers = [
    {
      id: '1',
      name: "Svar Chandak",
      position: "President",
      imageSource: require('../assets/images/officers/ssvar.png'),
      color: colors.primary,
      icon: "star",
      email: "chandaksvar@gmail.com",
    },
    {
      id: '2',
      name: "Dhruv Mantri",
      position: "President",
      imageSource: require('../assets/images/officers/sdhruv.png'),
      color: colors.secondary,
      icon: "star",
      email: "dhruvmantri28@gmail.com",
    },
    {
      id: '3',
      name: "Cody Nguyen",
      position: "Secretary",
      imageSource: require('../assets/images/officers/scody.png'),
      color: colors.accent,
      icon: "document-text",
      email: "Codng0639@gmail.com",
    },
    {
      id: '4',
      name: "Gitali Yempati",
      position: "Competitive Events Manager",
      imageSource: require('../assets/images/officers/sgitali.png'),
      color: '#FF6B9D',
      icon: "trophy",
      email: "gitali.yempati@gmail.com",
    },
    {
      id: '5',
      name: "Nikhilesh Gnanaraj",
      position: "Webmaster",
      imageSource: require('../assets/images/officers/snikki.png'),
      color: '#4ECDC4',
      icon: "laptop",
      email: "nik15gnaj@gmail.com",
    },
    {
      id: '6',
      name: "Arjun Diwakar",
      position: "Lab Captain",
      imageSource: require('../assets/images/officers/sarjun.png'),
      color: '#45B7D1',
      icon: "flask",
      email: "diwaj2020@gmail.com",
    },
    {
      id: '7',
      name: "Manyu Dubbyreddy",
      position: "Build Captain",
      imageSource: require('../assets/images/officers/smanyu.png'),
      color: '#96CEB4',
      icon: "construct",
      email: "manyud29@gmail.com",
    },
    {
      id: '8',
      name: "Sarah Castro",
      position: "Treasurer",
      imageSource: require('../assets/images/officers/ssarah.png'),
      color: '#FFEAA7',
      icon: "wallet",
      email: "sarahcas332@gmail.com",
    },
    {
      id: '9',
      name: "Sophia Nguyen",
      position: "Study Captain",
      imageSource: require('../assets/images/officers/ssophia.png'),
      color: '#DDA0DD',
      icon: "book",
      email: "sophia.ngu520@gmail.com",
    },
  ];

  const AnimatedOfficerCard = ({ item, index, resetTrigger }) => {
    const cardScale = useRef(new Animated.Value(0.9)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const cardRotate = useRef(new Animated.Value(-5)).current;
    const iconScale = useRef(new Animated.Value(0)).current;
    const cardFloat = useRef(new Animated.Value(0)).current;
    const nameGlow = useRef(new Animated.Value(0)).current;
    const flipAnim = useRef(new Animated.Value(0)).current;
    const [isFlipped, setIsFlipped] = useState(false);

    // Reset flip state when resetTrigger changes
    useEffect(() => {
      if (resetTrigger > 0) {
        setIsFlipped(false);
        flipAnim.setValue(0);
      }
    }, [resetTrigger]);

    useEffect(() => {
      // Initial entrance animation
      Animated.sequence([
        Animated.delay(index * 150),
        Animated.parallel([
          Animated.spring(cardScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(cardRotate, {
            toValue: 0,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(300),
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.delay(200),
        Animated.spring(nameGlow, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous floating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(cardFloat, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(cardFloat, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    const handleCardPress = () => {
      const toValue = isFlipped ? 0 : 1;
      setIsFlipped(!isFlipped);
      
      Animated.spring(flipAnim, {
        toValue,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
      styles.cardContainer, 
      { 
        width: cardWidth,
        marginLeft: 10.5,
            marginBottom: isWeb ? 25 : 20,
            transform: [
              { scale: cardScale },
              { rotate: cardRotate.interpolate({
                inputRange: [-5, 0],
                outputRange: ['-5deg', '0deg']
              })},
              {
                translateY: cardFloat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8]
                })
              }
            ],
            opacity: cardOpacity,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleCardPress}
          style={[styles.officerCard, { height: cardHeight, backgroundColor: colors.card, shadowColor: colors.cardShadow }]}
        >
          {/* Front of card */}
          <Animated.View
            style={[
              styles.cardFace,
              {
                transform: [{
                  rotateY: flipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }],
                backfaceVisibility: 'hidden',
              }
            ]}
          >
            <View style={[styles.cardBackground, { backgroundColor: item.color }]}>
              {/* Gradient overlay */}
             <View style={[styles.gradientOverlay, { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.1)' }]} />
              
              {/* Icon badge */}
              <Animated.View 
                style={[
                  styles.iconBadge, 
                 { 
                   backgroundColor: colors.background,
                   transform: [{ scale: iconScale }],
                   shadowColor: colors.cardShadow
                 }
                ]}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
              </Animated.View>
              
            {/* Officer photo */}
            <View style={[
              styles.photoContainer, 
              { 
                width: cardWidth - 40,
                height: isWeb ? 260 : 240,
                  marginTop: isWeb ? 35 : 30,
                },
            ]}>
              <Image
                source={item.imageSource}
                style={styles.officerImage}
                resizeMode="cover"
              />
               <View style={[styles.photoOverlay, { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.1)' }]} />
            </View>
            
              {/* Officer name with glow effect */}
              <Animated.View 
                style={[
                  styles.nameContainer,
                  {
                    opacity: nameGlow,
                    transform: [{
                      scale: nameGlow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1]
                      })
                    }]
                  }
                ]}
              >
              <Text style={[
                styles.officerName, 
                  { fontSize: isWeb ? 22 : isMobile ? 16 : 18, color: colors.background },
              ]}>
                {item.name}
              </Text>
              </Animated.View>
          
          {/* Position banner */}
             <View style={[styles.positionContainer, { backgroundColor: colors.background, shadowColor: colors.cardShadow }]}> 
           <Text style={[
             styles.positionText,
                  { fontSize: isWeb ? 16 : isMobile ? 14 : 15, color: item.color },
           ]}>
             {item.position}
           </Text>
         </View>

                   {/* Click to see contact info hint */}
          <View style={[styles.contactHint, { backgroundColor: colors.background }]}>
            <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.contactHintText, { color: colors.textSecondary }]}>
              Tap for contact info
            </Text>
          </View>
        </View>
          </Animated.View>

          {/* Back of card */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardBack,
              {
                transform: [{
                  rotateY: flipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['180deg', '360deg']
                  })
                }],
                backfaceVisibility: 'hidden',
              }
            ]}
          >
            <View style={[styles.cardBackground, { backgroundColor: item.color }]}>
              {/* Contact info */}
              <View style={[styles.contactContainer, { backgroundColor: colors.background }]}>
                <View style={styles.contactHeader}>
                  <Ionicons name="mail" size={24} color={item.color} />
                  <Text style={[styles.contactTitle, { color: colors.text }]}>
                    {item.name}
                  </Text>
                </View>
                <View style={styles.emailContainer}>
                  <Text style={[styles.emailText, { color: colors.textSecondary, marginBottom: 2 }]}>
                    {item.email.split('@')[0]}
                  </Text>
                  <Text style={[styles.emailText, { color: colors.textSecondary }]}>
                    @{item.email.split('@')[1]}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.copyButton, { backgroundColor: item.color }]}
                  onPress={() => {
                    Clipboard.setString(item.email);
                    Alert.alert('Copied!', 'Email address copied to clipboard');
                  }}
                >
                  <Ionicons name="copy-outline" size={14} color={colors.background} />
                  <Text style={[styles.copyButtonText, { color: colors.background }]}>
                    Copy Email
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
  );
  };

  // Use ScrollView with flexWrap for web, FlatList for mobile
  if (isWeb) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        
        <Animated.View
          style={[
            styles.header,
           { backgroundColor: colors.primary, opacity: fadeAnim, transform: [ { translateY: slideAnim }, { scale: headerScaleAnim } ] },
          ]}
        >
          <View>
           <Ionicons name="people" size={40} color={colors.background} />
          </View>
         <Text style={[styles.headerTitle, { fontSize: 28, color: colors.background }]}>Our Leadership Team</Text>
        </Animated.View>

        <ScrollView 
         contentContainerStyle={[styles.webContainer, { padding: 20, backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.webGrid, { maxWidth: 1400, alignSelf: 'center' }]}> 
            {officers.map((item, index) => (
              <View key={item.id} style={{ marginBottom: 25 }}>
                <AnimatedOfficerCard item={item} index={index} resetTrigger={resetCards} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Mobile/Tablet layout with FlatList
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <Animated.View
        style={[
          styles.header,
         { backgroundColor: colors.primary, opacity: fadeAnim, transform: [ { translateY: slideAnim }, { scale: headerScaleAnim } ] },
        ]}
      >
        <View>
         <Ionicons name="people" size={32} color={colors.background} />
        </View>
       <Text style={[styles.headerTitle, { color: colors.background }]}>Our Leadership Team</Text>
      </Animated.View>

      <FlatList
        data={officers}
        renderItem={({ item, index }) => <AnimatedOfficerCard item={item} index={index} resetTrigger={resetCards} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={numColumns}
        key={numColumns}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 6,
    alignItems: 'center',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: font.size.header - 6,
    fontWeight: font.weight.bold,
    marginTop: 2,
    marginBottom: 1,
    textAlign: 'center',
    fontFamily: font.family,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: font.size.body - 3,
    textAlign: 'center',
    opacity: 0.9,
    fontFamily: font.family,
    lineHeight: 14,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    paddingBottom: 30,
  },
  webContainer: {
    flexGrow: 1,
  },
  webGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    marginBottom: 20,
  },
  officerCard: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cardFace: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  photoContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  officerImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nameContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  officerName: {
    fontWeight: font.weight.bold,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
    fontFamily: font.family,
    letterSpacing: 0.5,
  },
  positionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  positionText: {
    fontWeight: font.weight.bold,
    textAlign: 'center',
    fontFamily: font.family,
    letterSpacing: 0.3,
  },
  contactHint: {
    position: 'absolute',
    bottom: 70,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    opacity: 0.9,
  },
  contactHintText: {
    fontSize: 11,
    marginLeft: 6,
    fontWeight: '600',
  },
  contactContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    margin: 10,
    width: '95%',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emailContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
    width: '100%',
  },
  emailText: {
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
    flexWrap: 'nowrap',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});