import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Modal,
  Animated,
  Easing,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../contexts/EventsContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import ConfirmationDialog from '../components/ConfirmationDialog';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CalendarScreen({ navigation, route }) {
  const { colors, theme } = useTheme();
  const { events, deleteEvent, refreshEvents } = useEvents();
  const { isAdmin } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fabScaleAnim = useRef(new Animated.Value(0)).current;
  const calendarScaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const eventItemAnimations = useRef({}).current;
  const monthTransitionAnim = useRef(new Animated.Value(1)).current;
  const deletingEventId = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // State for context menu
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    eventId: null
  });
  
  // State for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    eventId: null,
    eventTitle: ''
  });
  
  // State for success/error messages
  const [messageDialog, setMessageDialog] = useState({
    visible: false,
    title: '',
    message: '',
    isError: false
  });

  // Loading state for refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Entrance animations
  useEffect(() => {
    const animateEntrance = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(headerSlideAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 700,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(calendarScaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.back(1.1)),
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(fabScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animateEntrance();
    startPulseAnimation();
  }, []);

  // Pulse animation for current day
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Listen for focus events to refresh the calendar
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });
    
    return unsubscribe;
  }, [navigation, refreshEvents]);

  // Enhanced refresh with animations
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Animate refresh
    Animated.sequence([
      Animated.timing(calendarScaleAnim, {
        toValue: 0.98,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(calendarScaleAnim, {
        toValue: 1.02,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(calendarScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await refreshEvents();
      setRefreshKey(prevKey => prevKey + 1);
      
      // Animate events appearing
      LayoutAnimation.configureNext({
        duration: 400,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.opacity,
          springDamping: 0.8,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 0.8,
        },
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Refresh events when component mounts
  useEffect(() => {
    handleRefresh();
  }, []);

  // Generate calendar days with animations
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const calendarArr = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarArr.push(null);
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarArr.push(new Date(year, month, i));
    }

    setCalendarDays(calendarArr);

    // Animate calendar update
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
  }, [currentDate, refreshKey, events]);

  // Enhanced month navigation with smooth transitions
  const prevMonth = () => {
    Animated.sequence([
      Animated.timing(monthTransitionAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(monthTransitionAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    Animated.sequence([
      Animated.timing(monthTransitionAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(monthTransitionAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];

    return events.filter(event => {
      if (!event.date) return false;
      const [year, month, dateNum] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, dateNum);
      return eventDate.getDate() === day.getDate() &&
             eventDate.getMonth() === day.getMonth() &&
             eventDate.getFullYear() === day.getFullYear();
    });
  };

  // Enhanced event press with haptic feedback
  const handleEventPress = (eventId) => {
    // Create press animation
    const animationId = `event_${eventId}`;
    if (!eventItemAnimations[animationId]) {
      eventItemAnimations[animationId] = new Animated.Value(1);
    }

    Animated.sequence([
      Animated.timing(eventItemAnimations[animationId], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(eventItemAnimations[animationId], {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      navigation.navigate('Event', { eventId });
    }, 100);
  };

  // Enhanced long press with context menu animation
  const handleEventLongPress = (eventId, event) => {
    if (isAdmin) {
      const animationId = `event_${eventId}`;
      if (!eventItemAnimations[animationId]) {
        eventItemAnimations[animationId] = new Animated.Value(1);
      }

      // Vibration-like animation
      Animated.sequence([
        Animated.timing(eventItemAnimations[animationId], {
          toValue: 1.05,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(eventItemAnimations[animationId], {
          toValue: 0.98,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(eventItemAnimations[animationId], {
          toValue: 1.02,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(eventItemAnimations[animationId], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      setContextMenu({
        visible: true,
        eventId
      });
    }
  };

  // Handle context menu options with animations
  const handleMenuOption = (option) => {
    const eventId = contextMenu.eventId;
    
    setContextMenu({ visible: false, eventId: null });
    
    switch (option) {
      case 'view':
        navigation.navigate('Event', { eventId });
        break;
      case 'edit':
        navigation.navigate('EventCreation', { eventId, isEditing: true });
        break;
      case 'attendees':
        navigation.navigate('AttendeeList', { eventId });
        break;
      case 'delete':
        const eventToDelete = events.find(e => e.id === eventId);
        setConfirmDialog({
          visible: true,
          eventId: eventId,
          eventTitle: eventToDelete ? eventToDelete.title : 'this event'
        });
        break;
    }
  };

  // Enhanced delete with dramatic animation
  const handleDeleteConfirm = async () => {
    const eventId = confirmDialog.eventId;
    deletingEventId.current = eventId;
    
    setConfirmDialog({ visible: false, eventId: null, eventTitle: '' });
    
    // Create dramatic delete animation
    const animationId = `event_${eventId}`;
    if (!eventItemAnimations[animationId]) {
      eventItemAnimations[animationId] = new Animated.Value(1);
    }

    // Animate deletion
    Animated.sequence([
      Animated.parallel([
        Animated.timing(eventItemAnimations[animationId], {
          toValue: 1.1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(eventItemAnimations[animationId], {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    try {
      // Delay actual deletion to show animation
      setTimeout(async () => {
        await deleteEvent(eventId);
        setRefreshKey(prev => prev + 1);
        
        // Success animation
        setMessageDialog({
          visible: true,
          title: 'Success',
          message: 'Event deleted successfully',
          isError: false
        });

        // Clean up animation ref
        delete eventItemAnimations[animationId];
        deletingEventId.current = null;
      }, 300);
      
    } catch (error) {
      console.error('Error deleting event:', error);
      deletingEventId.current = null;
      
      // Reset animation
      Animated.timing(eventItemAnimations[animationId], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      setMessageDialog({
        visible: true,
        title: 'Error',
        message: 'Failed to delete event. Please try again.',
        isError: true
      });
    }
  };

  // Enhanced FAB press animation
  const handleFabPress = (action) => {
    Animated.sequence([
      Animated.timing(fabScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(fabScaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      if (action === 'manage') {
        navigation.navigate('EventManagement');
      }
    }, 150);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const renderDay = ({ item: day, index }) => {
    const dayEvents = day ? getEventsForDay(day) : [];
    const isToday = day && 
      day.getDate() === new Date().getDate() &&
      day.getMonth() === new Date().getMonth() &&
      day.getFullYear() === new Date().getFullYear();
    
    return (
      <Animated.View 
        style={[
          styles.calendarDay,
          !day && styles.emptyDay,
          isToday && styles.todayDay,
          { 
            backgroundColor: day ? colors.card : colors.inputBackground,
            borderColor: colors.border,
            transform: [{ scale: monthTransitionAnim }],
            opacity: fadeAnim 
          }
        ]}
      >
        {day && (
          <>
            <Animated.View style={[
              styles.dayNumberContainer,
              isToday && { transform: [{ scale: pulseAnim }] }
            ]}>
              <Text style={[
                styles.dayNumber,
                { color: isToday ? colors.secondary : colors.text, fontWeight: isToday ? '800' : 'bold', fontSize: isToday ? 16 : 14 }
              ]}>
                {day.getDate()}
              </Text>
            </Animated.View>
            {dayEvents.map((event, eventIndex) => {
              const animationId = `event_${event.id}`;
              if (!eventItemAnimations[animationId]) {
                eventItemAnimations[animationId] = new Animated.Value(1);
              }

              const isDeleting = deletingEventId.current === event.id;

              return (
                <Animated.View
                  key={event.id}
                  style={{
                    transform: [{ scale: eventItemAnimations[animationId] }],
                    opacity: isDeleting ? 0 : 1,
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.eventItem, 
                      { 
                        backgroundColor: event.color || colors.primary,
                        marginTop: eventIndex * 2,
                      }
                    ]}
                    onPress={() => handleEventPress(event.id)}
                    onLongPress={() => handleEventLongPress(event.id, event)}
                    delayLongPress={500}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.eventTitle, { color: colors.background }]} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text style={[styles.eventTime, { color: colors.background, opacity: 0.9 }]}>
                      {new Date(`2000-01-01T${event.startTime}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <Animated.View 
        style={[
          styles.calendarContainer,
          {
            backgroundColor: colors.card,
            shadowColor: colors.cardShadow,
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: calendarScaleAnim }
            ]
          }
        ]}
      >
        {/* Enhanced Header with slide animation */}
        <Animated.View 
          style={[
            styles.calendarHeader,
            { backgroundColor: colors.primary, transform: [{ translateY: headerSlideAnim }] }
          ]}
        >
          <TouchableOpacity 
            onPress={prevMonth} 
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={colors.background} />
          </TouchableOpacity>
          
          <Animated.View style={{ transform: [{ scale: monthTransitionAnim }] }}>
            <Text style={[styles.headerTitle, { color: colors.background }] }>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
          </Animated.View>
          
          <View style={styles.headerRightSection}>
            <TouchableOpacity 
              onPress={nextMonth} 
              style={styles.navButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={20} color={colors.background} />
            </TouchableOpacity>
            

          </View>
        </Animated.View>

        {/* Weekday Header */}
        <Animated.View 
          style={[
            styles.weekdayHeader,
            { backgroundColor: colors.card, borderBottomColor: colors.border, opacity: fadeAnim }
          ]}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Animated.View
              key={day}
              style={[
                styles.weekdayContainer,
                {
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [-50, 0],
                      outputRange: [-20 - (index * 3), 0],
                    })
                  }]
                }
              ]}
            >
              <Text style={[styles.weekdayText, { color: colors.textSecondary }]}>{day}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Calendar Grid */}
        <FlatList
          key={`calendar-${refreshKey}`}
          data={calendarDays}
          renderItem={renderDay}
          keyExtractor={(_, index) => index.toString()}
          numColumns={7}
          scrollEnabled={false}
          extraData={events}
          showsVerticalScrollIndicator={false}
        />
        
        {/* Floating Action Button */}
        {isAdmin && (
          <Animated.View 
            style={[
              styles.fabContainer,
              { transform: [{ scale: fabScaleAnim }] }
            ]}
          >
            <TouchableOpacity
              style={[styles.fab, styles.fabShadow, { backgroundColor: colors.primary }]}
              onPress={() => handleFabPress('manage')}
              activeOpacity={0.8}
            >
              <Ionicons name="settings-outline" size={24} color={colors.background} />
            </TouchableOpacity>
          </Animated.View>
        )}
        
        {/* Enhanced Context Menu Modal */}
        <Modal
          transparent={true}
          visible={contextMenu.visible}
          animationType="fade"
          onRequestClose={() => setContextMenu({ visible: false, eventId: null })}
        >
          <TouchableOpacity
            style={[styles.modalOverlay, { backgroundColor: theme === 'dark' ? colors.cardShadow + 'cc' : 'rgba(0,0,0,0.6)' }]}
            activeOpacity={1}
            onPress={() => setContextMenu({ visible: false, eventId: null })}
          >
            <Animated.View 
              style={[
                styles.contextMenuContainer,
                {
                  backgroundColor: colors.card,
                  shadowColor: colors.cardShadow,
                  transform: [{ scale: contextMenu.visible ? 1 : 0.8 }],
                  opacity: contextMenu.visible ? 1 : 0,
                }
              ]}
            >
              {[
                { key: 'view', icon: 'eye-outline', text: 'View Event', color: colors.text },
                { key: 'edit', icon: 'create-outline', text: 'Edit Event', color: colors.text },
                { key: 'attendees', icon: 'people-outline', text: 'View Attendees', color: colors.text },
                { key: 'delete', icon: 'trash-outline', text: 'Delete Event', color: colors.error },
              ].map((item, index) => (
                <TouchableOpacity 
                  key={item.key}
                  style={[
                    styles.contextMenuItem,
                    item.key === 'delete' && styles.deleteMenuItem,
                    { borderBottomColor: colors.border }
                  ]}
                  onPress={() => handleMenuOption(item.key)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                  <Text style={[
                    styles.contextMenuText,
                    item.key === 'delete' && styles.deleteMenuText,
                    { color: item.color }
                  ]}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        {/* Loading Overlay */}
        {isRefreshing && (
          <Animated.View style={[styles.loadingOverlay, { backgroundColor: theme === 'dark' ? colors.cardShadow + 'cc' : 'rgba(255,255,255,0.9)', borderRadius: 12 }] }>
            <View style={styles.loadingContainer}>
              <Animated.View
                style={[
                  styles.loadingSpinner,
                  {
                    transform: [{
                      rotate: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }]
                  }
                ]}
              >
                <Ionicons name="refresh" size={24} color={colors.primary} />
              </Animated.View>
              <Text style={[styles.loadingText, { color: colors.primary }]}>Refreshing...</Text>
            </View>
          </Animated.View>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          visible={confirmDialog.visible}
          title="Delete Event"
          message={`Are you sure you want to delete "${confirmDialog.eventTitle}"? This action cannot be undone.`}
          onCancel={() => setConfirmDialog({ visible: false, eventId: null, eventTitle: '' })}
          onConfirm={handleDeleteConfirm}
          cancelText="Cancel"
          confirmText="Delete"
          destructive={true}
          icon="trash-outline"
        />

        {/* Message Dialog (Success/Error) */}
        <ConfirmationDialog
          visible={messageDialog.visible}
          title={messageDialog.title}
          message={messageDialog.message}
          onCancel={() => setMessageDialog({ visible: false, title: '', message: '', isError: false })}
          onConfirm={() => setMessageDialog({ visible: false, title: '', message: '', isError: false })}
          cancelText=""
          confirmText="OK"
          icon={messageDialog.isError ? "alert-circle" : "checkmark-circle"}
          iconColor={messageDialog.isError ? "#ff4d4d" : "#4CAF50"}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#94cfec',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 8,
    marginTop: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#59a2f0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    minWidth: 160,
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 8,
    paddingBottom: 8,
  },
  weekdayContainer: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    padding: 4,
    paddingBottom: 28,
    fontWeight: 'bold',
    color: '#666',
    fontSize: 12,
  },
  calendarDay: {
    flex: 1,
    minHeight: 82,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    padding: 4,
    width: '14.28%',
    backgroundColor: 'white',
  },
  emptyDay: {
    backgroundColor: '#f8f9fa',
  },
  todayDay: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
    borderWidth: 1,
  },
  dayNumberContainer: {
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  dayNumber: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 12,
  },
  todayDayNumber: {
    color: '#ff9800',
    fontSize: 16,
    fontWeight: '800',
  },
  eventItem: {
    borderRadius: 4,
    padding: 3,
    marginBottom: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventTitle: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventTime: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 8,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    alignItems: 'center',
  },
  topFabContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  headerFabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 'auto',
  },
  fab: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1ca3b',
    borderRadius: 25,
    marginTop: 8,
  },
  manageFab: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    borderRadius: 23,
  },
  topFab: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerFab: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  fabShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextMenuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '85%',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  contextMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deleteMenuItem: {
    borderBottomWidth: 0,
  },
  contextMenuText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
    fontWeight: '500',
  },
  deleteMenuText: {
    color: '#ff4d4d',
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingSpinner: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#59a2f0',
    fontWeight: '500',
  },
});