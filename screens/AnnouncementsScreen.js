import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { font } from '../utils/theme';
import * as Animatable from 'react-native-animatable';
import AnimatedButton from '../components/AnimatedButton';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = -80;

export default function AnnouncementsScreen() {
  const { colors } = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const { isAdmin } = useAuth();
  const navigation = useNavigation();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.8)).current;
  const fabBounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAnnouncements();
    startEntranceAnimations();

    const channel = supabase
      .channel('public:announcements')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => {
          fetchAnnouncements();
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'announcements' },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      Animated.spring(fabBounceAnim, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('date', { ascending: false });

    if (data) {
      console.log('Fetched announcements:', data.map(a => ({ 
        title: a.title, 
         
      })));
    }

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setAnnouncements(data);
    }
  };

  const deleteAnnouncement = async (id) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Animate the removal
      setAnnouncements(prev => prev.filter(item => item.id !== id));
    }
  };

  const SwipeableAnnouncementCard = ({ item, index }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const cardOpacity = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const deleteOpacity = useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const { translationX } = event.nativeEvent;
        
        if (translationX < SWIPE_THRESHOLD) {
          // Swipe threshold reached - delete the item
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -screenWidth,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(cardOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(cardScale, {
              toValue: 0.8,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            deleteAnnouncement(item.id);
          });
        } else {
          // Reset position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    };

    const showDeleteButton = () => {
      Animated.timing(deleteOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    const hideDeleteButton = () => {
      Animated.timing(deleteOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 100}
        duration={600}
        style={styles.cardContainer}
      >
        <View style={[styles.deleteBackground, { backgroundColor: colors.error }]}>
          <Animated.View style={[styles.deleteButton, { opacity: deleteOpacity }]}>
            <Ionicons name="trash" size={24} color="white" />
            <Text style={styles.deleteText}>Delete</Text>
          </Animated.View>
        </View>
        
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          onBegan={() => showDeleteButton()}
          onEnded={() => hideDeleteButton()}
        >
          <Animated.View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                shadowColor: colors.primary,
                borderLeftColor: colors.primary,
                transform: [
                  { translateX },
                  { scale: cardScale }
                ],
                opacity: cardOpacity,
              },
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <Ionicons name="megaphone" size={20} color={colors.primary} style={styles.icon} />
                  <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.date, { color: colors.textSecondary }]}>
                    {(() => {
                      const date = new Date(item.date);
                      // Adjust for timezone offset to get the correct local date
                      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                      return new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }).format(localDate);
                    })()}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.message, { color: colors.text }]}>{item.message}</Text>
              

              
              {isAdmin && (
                <View style={[styles.swipeHint, { borderTopColor: colors.cardShadow }]}>
                  <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
                  <Text style={[styles.swipeHintText, { color: colors.textSecondary }]}>Swipe left to delete</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </Animatable.View>
    );
  };

  const AnimatedFAB = () => {
    const fabScale = useRef(new Animated.Value(0)).current;
    const fabRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.sequence([
        Animated.delay(800),
        Animated.parallel([
          Animated.spring(fabScale, {
            toValue: 1,
            tension: 50,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(fabRotate, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, []);

    const rotation = fabRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            transform: [
              { scale: fabScale },
              { rotate: rotation }
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabTouchable}
          onPress={() => navigation.navigate('CreateAnnouncement')}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: headerScaleAnim }
            ],
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.header, { color: colors.text }]}>Announcements</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Stay updated with the latest news and updates
            </Text>
          </View>
        </View>
      </Animated.View>
      
      {announcements.length === 0 ? (
        <Animatable.View
          animation="fadeIn"
          delay={400}
          style={styles.emptyContainer}
        >
          <Ionicons name="megaphone-outline" size={80} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Announcements Yet</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Check back later for updates and important information.
          </Text>
        </Animatable.View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <SwipeableAnnouncementCard item={item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      {isAdmin && <AnimatedFAB />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flex: 1,
  },
  header: {
    fontSize: font.size.header,
    fontWeight: font.weight.bold,
    marginBottom: 4,
    fontFamily: font.family,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: font.size.body,
    fontFamily: font.family,
    letterSpacing: 0.2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: font.size.small,
    fontWeight: font.weight.bold,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
    flex: 1,
    fontFamily: font.family,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: font.size.small,
    marginLeft: 4,
    fontFamily: font.family,
  },
  message: {
    fontSize: font.size.body,
    lineHeight: 22,
    fontFamily: font.family,
    marginBottom: 12,
  },

  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  swipeHintText: {
    fontSize: font.size.small,
    marginLeft: 6,
    fontFamily: font.family,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: font.size.title,
    fontWeight: font.weight.bold,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: font.family,
  },
  emptyText: {
    fontSize: font.size.body,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: font.family,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 30,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabTouchable: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});