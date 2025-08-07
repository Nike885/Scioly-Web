import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Modal,
  Animated,
  Easing,
  Dimensions,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../contexts/EventsContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import ConfirmationDialog from '../components/ConfirmationDialog';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth } = Dimensions.get('window');

export default function EventCreationScreen({ route, navigation }) {
  const { addEvent, getEventById, updateEvent } = useEvents();
  const { isAdmin } = useAuth();
  const { colors, theme } = useTheme();
  
  // Check if we're editing an existing event
  const { eventId, isEditing } = route.params || {};
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [color, setColor] = useState('#4287f5');
  const [attendees, setAttendees] = useState([]);
  
  // For date and time pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const formItemAnimations = useRef([]).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const submitAnimationAnim = useRef(new Animated.Value(0)).current;
  const loadingSpinAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const colorSelectorAnim = useRef(new Animated.Value(1)).current;
  
  // State for confirmation dialogs
  const [successDialog, setSuccessDialog] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: null
  });
  
  const [errorDialog, setErrorDialog] = useState({
    visible: false,
    message: ''
  });

  // Initialize form animations
  useEffect(() => {
    // Initialize form item animations
    for (let i = 0; i < 7; i++) {
      formItemAnimations[i] = new Animated.Value(0);
    }

    // Start entrance animation
    const animateEntrance = () => {
      Animated.sequence([
        Animated.timing(headerSlideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.stagger(100, formItemAnimations.map((anim, index) =>
            Animated.timing(anim, {
              toValue: 1,
              duration: 600,
              delay: index * 50,
              easing: Easing.out(Easing.back(1.1)),
              useNativeDriver: true,
            })
          )),
        ]),
      ]).start();
    };

    animateEntrance();
  }, []);

  // Loading spinner animation
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(loadingSpinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      loadingSpinAnim.setValue(0);
    }
  }, [loading]);

  // Load event data if editing with animation
  useEffect(() => {
    if (isEditing && eventId) {
      const existingEvent = getEventById(eventId);
      if (existingEvent) {
        // Animate form filling
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

        setTitle(existingEvent.title);
        setDescription(existingEvent.description);
        setLocation(existingEvent.location);
        
        const eventDate = new Date(existingEvent.date);
        setDate(eventDate);
        
        if (existingEvent.startTime) {
          const startTimeArr = existingEvent.startTime.split(':');
          const startDateTime = new Date();
          startDateTime.setHours(parseInt(startTimeArr[0]), parseInt(startTimeArr[1]));
          setStartTime(startDateTime);
        }
        
        if (existingEvent.endTime) {
          const endTimeArr = existingEvent.endTime.split(':');
          const endDateTime = new Date();
          endDateTime.setHours(parseInt(endTimeArr[0]), parseInt(endTimeArr[1]));
          setEndTime(endDateTime);
        }
        
        setColor(existingEvent.color || '#4287f5');
        setAttendees(existingEvent.attendees || []);
      }
    }
  }, [isEditing, eventId, getEventById]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Enhanced submit with dramatic animation
  const handleCreateEvent = async () => {
    // Validate input with shake animation
    if (!title.trim() || !description.trim() || !location.trim()) {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(buttonScaleAnim, {
          toValue: 1.05,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScaleAnim, {
          toValue: 0.95,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScaleAnim, {
          toValue: 1.05,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      setErrorDialog({
        visible: true,
        message: 'Please fill in all required fields'
      });
      return;
    }

    // Start submit animation
    setLoading(true);
    
    Animated.parallel([
      Animated.timing(submitAnimationAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      if (isEditing && eventId) {
        // Update existing event
        const updatedEvent = {
          id: eventId,
          title,
          description,
          location,
          date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
          startTime: `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}:00`,
          endTime: `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}:00`,
          color,
          attendees: attendees,
          lastUpdated: new Date().toISOString()
        };
        
        await updateEvent(updatedEvent);
        
        // Success animation
        await animateSuccess();
        
        setSuccessDialog({
          visible: true,
          title: 'Event Updated! ✨',
          message: `"${title}" has been successfully updated with all your changes.`,
          onConfirm: () => {
            setSuccessDialog({ visible: false, title: '', message: '', onConfirm: null });
            navigation.goBack();
          }
        });
      } else {
        // Create new event
        const newEvent = {
          id: Date.now().toString(),
          title,
          description,
          location,
          date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
          startTime: `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}:00`,
          endTime: `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}:00`,
          color,
          attendees: [],
          createdBy: 'Admin',
          createdAt: new Date().toISOString()
        };

        await addEvent(newEvent);
        
        // Success animation
        await animateSuccess();
        
        setSuccessDialog({
          visible: true,
          title: 'Event Created! 🎉',
          message: `"${title}" has been successfully created and added to the calendar. People can now sign up for this amazing event!`,
          onConfirm: () => {
            setSuccessDialog({ visible: false, title: '', message: '', onConfirm: null });
            navigation.navigate('Calendar');
          }
        });
      }
    } catch (err) {
      console.error('Event creation/update error:', err);
      
      // Error animation
      Animated.sequence([
        Animated.timing(buttonScaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
      
      setErrorDialog({
        visible: true,
        message: isEditing ? 'Failed to update event. Please try again.' : 'Failed to create event. Please try again.'
      });
    } finally {
      setLoading(false);
      Animated.parallel([
        Animated.timing(submitAnimationAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Success animation sequence
  const animateSuccess = () => {
    return new Promise((resolve) => {
      Animated.sequence([
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(successAnim, {
          toValue: 0,
          duration: 200,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  // Color selection animation
  const handleColorSelection = (selectedColor) => {
    Animated.sequence([
      Animated.timing(colorSelectorAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(colorSelectorAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
    
    setColor(selectedColor);
  };

  // Enhanced picker modals with animations
  const openPickerModal = (pickerType) => {
    const setState = {
      date: setShowDatePicker,
      startTime: setShowStartTimePicker,
      endTime: setShowEndTimePicker,
    }[pickerType];
    
    setState(true);
  };

  // Color options
  const colorOptions = [
    { color: '#4287f5', name: 'Ocean Blue' },
    { color: '#f54242', name: 'Coral Red' },
    { color: '#42f56f', name: 'Mint Green' },
    { color: '#f5a742', name: 'Sunset Orange' },
    { color: '#a442f5', name: 'Royal Purple' },
    { color: '#f542a4', name: 'Pink Flamingo' },
  ];
  
  // Enhanced date picker with animations
  const renderDatePicker = () => {
    if (!showDatePicker) return null;
    
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);
    
    return (
      <Modal
        transparent={true}
        visible={showDatePicker}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme === 'dark' ? colors.cardShadow + 'cc' : 'rgba(0, 0, 0, 0.6)' }]}>
          <Animated.View 
            style={[
              styles.pickerContainer,
              { backgroundColor: colors.card },
              {
                transform: [{
                  translateY: showDatePicker ? 0 : 300
                }]
              }
            ]}
          >
            <View style={[styles.pickerHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(false)}
                style={styles.pickerHeaderButton}
              >
                <Text style={[styles.pickerCancel, { color: colors.error }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.pickerTitle, { color: colors.text }]}>Select Date 📅</Text>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(false)}
                style={styles.pickerHeaderButton}
              >
                <Text style={[styles.pickerDone, { color: colors.primary }]}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerRow}>
              <Picker
                style={[styles.picker, { color: colors.text }]}
                selectedValue={date.getMonth()}
                onValueChange={(itemValue) => {
                  const newDate = new Date(date);
                  newDate.setMonth(itemValue);
                  setDate(newDate);
                }}
                itemStyle={{ color: colors.text }}
              >
                {months.map((month, index) => (
                  <Picker.Item key={month} label={month} value={index} color={colors.text} />
                ))}
              </Picker>
              
              <Picker
                style={[styles.picker, { color: colors.text }]}
                selectedValue={date.getDate()}
                onValueChange={(itemValue) => {
                  const newDate = new Date(date);
                  newDate.setDate(itemValue);
                  setDate(newDate);
                }}
                itemStyle={{ color: colors.text }}
              >
                {days.map(day => (
                  <Picker.Item key={day} label={day.toString()} value={day} color={colors.text} />
                ))}
              </Picker>
              
              <Picker
                style={[styles.picker, { color: colors.text }]}
                selectedValue={date.getFullYear()}
                onValueChange={(itemValue) => {
                  const newDate = new Date(date);
                  newDate.setFullYear(itemValue);
                  setDate(newDate);
                }}
                itemStyle={{ color: colors.text }}
              >
                {years.map(year => (
                  <Picker.Item key={year} label={year.toString()} value={year} color={colors.text} />
                ))}
              </Picker>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };
  
  // Enhanced time picker components
  const renderTimePicker = (type, time, setTime, visible, setVisible) => {
    if (!visible) return null;
    
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme === 'dark' ? colors.cardShadow + 'cc' : 'rgba(0, 0, 0, 0.6)' }]}>
          <Animated.View style={[styles.pickerContainer, { backgroundColor: colors.card }]}>
            <View style={[styles.pickerHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <TouchableOpacity 
                onPress={() => setVisible(false)}
                style={styles.pickerHeaderButton}
              >
                <Text style={[styles.pickerCancel, { color: colors.error }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.pickerTitle, { color: colors.text }]}>
                {type === 'start' ? 'Start Time ⏰' : 'End Time ⏰'}
              </Text>
              <TouchableOpacity 
                onPress={() => setVisible(false)}
                style={styles.pickerHeaderButton}
              >
                <Text style={[styles.pickerDone, { color: colors.primary }]}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerRow}>
              <Picker
                style={[styles.picker, { color: colors.text }]}
                selectedValue={time.getHours()}
                onValueChange={(itemValue) => {
                  const newTime = new Date(time);
                  newTime.setHours(itemValue);
                  setTime(newTime);
                }}
                itemStyle={{ color: colors.text }}
              >
                {hours.map(hour => (
                  <Picker.Item 
                    key={hour} 
                    label={hour < 10 ? `0${hour}` : `${hour}`}
                    value={hour} 
                    color={colors.text}
                  />
                ))}
              </Picker>
              
              <Text style={[styles.pickerSeparator, { color: colors.text }]}>:</Text>
              
              <Picker
                style={[styles.picker, { color: colors.text }]}
                selectedValue={time.getMinutes()}
                onValueChange={(itemValue) => {
                  const newTime = new Date(time);
                  newTime.setMinutes(itemValue);
                  setTime(newTime);
                }}
                itemStyle={{ color: colors.text }}
              >
                {minutes.map(minute => (
                  <Picker.Item 
                    key={minute} 
                    label={minute < 10 ? `0${minute}` : `${minute}`}
                    value={minute} 
                    color={colors.text}
                  />
                ))}
              </Picker>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Enhanced Header */}
          <Animated.View 
            style={[
              styles.header,
              { backgroundColor: colors.primary, transform: [{ translateY: headerSlideAnim }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.background} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.background }]}>
              {isEditing ? '✏️ Edit Event' : '✨ Create New Event'}
            </Text>
          </Animated.View>

          {/* Enhanced Form Container */}
          <Animated.View 
            style={[
              styles.formContainer,
              { backgroundColor: colors.card },
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Title Field */}
            <Animated.View 
              style={[
                styles.formGroup,
                {
                  opacity: formItemAnimations[0],
                  transform: [{
                    translateX: formItemAnimations[0]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }) || 0
                  }]
                }
              ]}
            >
              <Text style={[styles.label, { color: colors.text }]}>Event Title ✨</Text>
              <TextInput
                style={[styles.input, styles.titleInput, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}
                value={title}
                onChangeText={setTitle}
                placeholder="What's the name of your awesome event?"
                placeholderTextColor={colors.textSecondary}
              />
            </Animated.View>
            
            {/* Description Field */}
            <Animated.View 
              style={[
                styles.formGroup,
                {
                  opacity: formItemAnimations[1],
                  transform: [{
                    translateX: formItemAnimations[1]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }) || 0
                  }]
                }
              ]}
            >
              <Text style={[styles.label, { color: colors.text }]}>Description 📝</Text>
              <TextInput
                style={[styles.input, styles.textArea, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Tell people what makes this event special..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </Animated.View>
            
            {/* Location Field */}
            <Animated.View 
              style={[
                styles.formGroup,
                {
                  opacity: formItemAnimations[2],
                  transform: [{
                    translateX: formItemAnimations[2]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }) || 0
                  }]
                }
              ]}
            >
              <Text style={[styles.label, { color: colors.text }]}>Location 📍</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border, 
                  backgroundColor: colors.inputBackground,
                  color: colors.text 
                }]}
                value={location}
                onChangeText={setLocation}
                placeholder="Where will this amazing event happen?"
                placeholderTextColor={colors.textSecondary}
              />
            </Animated.View>
            

            
            {/* Date Field */}
            <Animated.View 
              style={[
                styles.formGroup,
                {
                  opacity: formItemAnimations[3],
                  transform: [{
                    translateX: formItemAnimations[3]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }) || 0
                  }]
                }
              ]}
            >
              <Text style={[styles.label, { color: colors.text }]}>Date 📅</Text>
              <TouchableOpacity 
                style={[styles.dateTimeButton, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                onPress={() => openPickerModal('date')}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateTimeText, { color: colors.text }]}>{formatDate(date)}</Text>
                <Ionicons name="calendar" size={20} color={colors.primary} />
              </TouchableOpacity>
              {renderDatePicker()}
            </Animated.View>
            
            {/* Time Fields */}
            <Animated.View 
              style={[
                styles.timeContainer,
                {
                  opacity: formItemAnimations[4],
                  transform: [{
                    translateX: formItemAnimations[4]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }) || 0
                  }]
                }
              ]}
            >
              <View style={styles.timeInputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Start Time ⏰</Text>
                <TouchableOpacity 
                  style={[styles.dateTimeButton, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                  onPress={() => openPickerModal('startTime')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dateTimeText, { color: colors.text }]}>{formatTime(startTime)}</Text>
                  <Ionicons name="time" size={20} color={colors.primary} />
                </TouchableOpacity>
                {renderTimePicker('start', startTime, setStartTime, showStartTimePicker, setShowStartTimePicker)}
              </View>
              
              <View style={styles.timeInputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>End Time ⏰</Text>
                <TouchableOpacity 
                  style={[styles.dateTimeButton, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                  onPress={() => openPickerModal('endTime')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dateTimeText, { color: colors.text }]}>{formatTime(endTime)}</Text>
                  <Ionicons name="time" size={20} color={colors.primary} />
                </TouchableOpacity>
                {renderTimePicker('end', endTime, setEndTime, showEndTimePicker, setShowEndTimePicker)}
              </View>
            </Animated.View>
            
            {/* Enhanced Color Selector */}
            <Animated.View 
              style={[
                styles.formGroup,
                {
                  opacity: formItemAnimations[5],
                  transform: [
                    { translateX: formItemAnimations[5]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }) || 0 },
                    { scale: colorSelectorAnim }
                  ]
                }
              ]}
            >
              <Text style={styles.label}>Event Color 🎨</Text>
              <View style={styles.colorSelector}>
                {colorOptions.map((colorOption, index) => (
                  <TouchableOpacity
                    key={colorOption.color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: colorOption.color },
                      color === colorOption.color && styles.selectedColorOption
                    ]}
                    onPress={() => handleColorSelection(colorOption.color)}
                    activeOpacity={0.8}
                  >
                    {color === colorOption.color && (
                      <Ionicons name="checkmark" size={20} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.colorName}>
                {colorOptions.find(c => c.color === color)?.name || 'Custom Color'}
              </Text>
            </Animated.View>
            
            {/* Enhanced Submit Button */}
            <Animated.View 
              style={[
                styles.buttonContainer,
                {
                  opacity: formItemAnimations[6],
                  transform: [
                    { scale: buttonScaleAnim },
                    { translateX: formItemAnimations[6]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }) || 0 }
                  ]
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.createButton,
                  loading && styles.loadingButton,
                  { backgroundColor: color }
                ]}
                onPress={handleCreateEvent}
                disabled={loading}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  {loading ? (
                    <>
                      <Animated.View
                        style={[
                          styles.loadingSpinner,
                          {
                            transform: [{
                              rotate: loadingSpinAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg'],
                              })
                            }]
                          }
                        ]}
                      >
                        <Ionicons name="refresh" size={20} color="white" />
                      </Animated.View>
                      <Text style={styles.buttonText}>
                        {isEditing ? 'Updating Magic...' : 'Creating Magic...'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons 
                        name={isEditing ? "checkmark-circle" : "add-circle"} 
                        size={20} 
                        color="white" 
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>
                        {isEditing ? 'Update Event ✨' : 'Create Event 🎉'}
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Success Animation Overlay */}
          <Animated.View
            style={[
              styles.successOverlay,
              {
                opacity: successAnim,
                transform: [{ scale: successAnim }],
                pointerEvents: successAnim._value > 0 ? 'auto' : 'none',
              }
            ]}
          >
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
              <Text style={styles.successText}>
                {isEditing ? 'Updated!' : 'Created!'}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Dialog */}
      <ConfirmationDialog
        visible={successDialog.visible}
        title={successDialog.title}
        message={successDialog.message}
        onCancel={successDialog.onConfirm}
        onConfirm={successDialog.onConfirm}
        cancelText=""
        confirmText="Awesome! 🎉"
        icon="checkmark-circle"
        iconColor="#4CAF50"
      />

      {/* Error Dialog */}
      <ConfirmationDialog
        visible={errorDialog.visible}
        title="Oops! 😅"
        message={errorDialog.message}
        onCancel={() => setErrorDialog({ visible: false, message: '' })}
        onConfirm={() => setErrorDialog({ visible: false, message: '' })}
        cancelText=""
        confirmText="Try Again"
        icon="alert-circle"
        iconColor="#ff4d4d"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    borderRadius: 16,
    margin: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  titleInput: {
    // Theme colors will be applied dynamically
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInputGroup: {
    width: '48%',
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingVertical: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#333',
    transform: [{ scale: 1.1 }],
  },
  colorName: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 10,
  },
  createButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingButton: {
    backgroundColor: '#cccccc',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingSpinner: {
    marginRight: 10,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    margin: 15,
  },
  successContainer: {
    alignItems: 'center',
    padding: 40,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 15,
  },
  // Modal Picker Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerHeaderButton: {
    padding: 5,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerCancel: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerDone: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    height: 200,
  },
  pickerSeparator: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});