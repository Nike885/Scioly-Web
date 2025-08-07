import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Animated,
  Easing,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SupabaseService from '../services/SupabaseService';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { font, spacing, shadows } from '../utils/theme';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';
import * as Animatable from 'react-native-animatable';

export default function ContactScreen() {
  const { user, isAdmin } = useAuth();
  const { colors } = useTheme();
  
  // FAQ dropdown states
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [animatedValues] = useState({});
  
  // Contact form states
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Support questions management (admin only)
  const [supportQuestions, setSupportQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, status, name
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Dialog states
  const [dialogs, setDialogs] = useState({
    error: { visible: false, message: '' },
    success: { visible: false, message: '' },
    export: { visible: false },
    video: { visible: false, video: null },
    respond: { visible: false, question: null, response: '' }
  });

  // FAQ data
  const faqData = [
    {
      id: 1,
      question: "How do I choose my events?",
      answer: "Browse events in the resources tab. Tap any event to view details. Fill out the interest form choosing your events at the first meeting."
    },
    {
      id: 2,
      question: "What if I forgot my password?",
      answer: "Contact your webmaster to reset your password."
    },
    {
      id: 3,
      question: "How can I prepare for my events",
      answer: "Use the resources tab to get all the information you need about your events."
    },
    {
      id: 4,
      question: "How can I get on the team?",
      answer: "Work hard and do good in your events."
    }
  ];

  // Show dialog helper
  const showDialog = (type, data = {}) => {
    setDialogs(prev => ({
      ...prev,
      [type]: { visible: true, ...data }
    }));
  };

  // Hide dialog helper
  const hideDialog = (type) => {
    setDialogs(prev => ({
      ...prev,
      [type]: { visible: false }
    }));
  };

  // Sort questions based on selected criteria
  const sortQuestions = (questions, criteria) => {
    const questionsCopy = [...questions];
    
    switch (criteria) {
      case 'newest':
        return questionsCopy.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
      case 'oldest':
        return questionsCopy.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
      case 'status':
        return questionsCopy.sort((a, b) => {
          const aResolved = (a.resolved === 'true' || a.status === 'resolved');
          const bResolved = (b.resolved === 'true' || b.status === 'resolved');
          if (aResolved === bResolved) {
            // If same status, sort by newest
            return new Date(b.submitted_at) - new Date(a.submitted_at);
          }
          // Open questions first, then resolved
          return aResolved - bResolved;
        });
      case 'name':
        return questionsCopy.sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          if (nameA === nameB) {
            // If same name, sort by newest
            return new Date(b.submitted_at) - new Date(a.submitted_at);
          }
          return nameA.localeCompare(nameB);
        });
      case 'subject':
        return questionsCopy.sort((a, b) => {
          const subjectA = (a.subject || '').toLowerCase();
          const subjectB = (b.subject || '').toLowerCase();
          if (subjectA === subjectB) {
            // If same subject, sort by newest
            return new Date(b.submitted_at) - new Date(a.submitted_at);
          }
          return subjectA.localeCompare(subjectB);
        });
      default:
        return questionsCopy.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    }
  };

  // Get sorted questions
  const getSortedQuestions = () => {
    return sortQuestions(supportQuestions, sortBy);
  };

  // Handle sort option selection
  const handleSortChange = (newSortBy) => {
    console.log('Changing sort to:', newSortBy);
    setSortBy(newSortBy);
    setShowSortMenu(false);
  };

  // Sort options for the dropdown
  const sortOptions = [
    { key: 'newest', label: 'Newest First', icon: 'time' },
    { key: 'oldest', label: 'Oldest First', icon: 'time-outline' },
    { key: 'status', label: 'By Status (Open First)', icon: 'flag' },
    { key: 'name', label: 'By Student Name', icon: 'person' },
    { key: 'subject', label: 'By Subject', icon: 'chatbubble' }
  ];

  // Handle admin response to question
  const handleRespondToQuestion = (question) => {
    setDialogs(prev => ({
      ...prev,
      respond: { 
        visible: true, 
        question: question,
        response: question.admin_response || '' // Pre-fill if already has response
      }
    }));
  };

  // Submit admin response
  const submitAdminResponse = async () => {
    const { question, response } = dialogs.respond;
    
    if (!response.trim()) {
      showDialog('error', { message: 'Please enter a response before submitting.' });
      return;
    }

    try {
      console.log('Submitting admin response for question:', question.id);
      
      // Update the question with admin response using Supabase
      await SupabaseService.updateSupportQuestion(question.id, {
        admin_response: response.trim(),
        responded_at: new Date().toISOString(),
        responded_by: user?.name || 'Admin',
        resolved: true,
        status: 'resolved'
      });
      
      console.log('Admin response saved successfully');
      
      // Update local state
      setSupportQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === question.id ? {
            ...q,
            admin_response: response.trim(),
            responded_at: new Date().toISOString(),
            responded_by: user?.name || 'Admin',
            resolved: true,
            status: 'resolved'
          } : q
        )
      );
      
      // Hide response dialog
      hideDialog('respond');
      
      // Show success message
      showDialog('success', { 
        message: 'Response sent successfully! The student will be able to see your response when they check their questions.',
        onConfirm: () => {
          hideDialog('success');
          // Refresh from server to ensure sync
          loadSupportQuestions();
        }
      });
      
    } catch (error) {
      console.error('Failed to submit admin response:', error);
      showDialog('error', { 
        message: 'Failed to submit response. Please try again.'
      });
    }
  };

  // Mark question as resolved without response
  const markAsResolved = async (question) => {
    try {
      console.log('Marking question as resolved:', question.id);
      
      // Update the question status using Supabase
      await SupabaseService.updateSupportQuestion(question.id, {
        resolved: true,
        status: 'resolved',
        responded_at: new Date().toISOString(),
        responded_by: user?.name || 'Admin'
      });
      
      console.log('Question marked as resolved');
      
      // Update local state
      setSupportQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === question.id ? {
            ...q,
            resolved: true,
            status: 'resolved',
            responded_at: new Date().toISOString(),
            responded_by: user?.name || 'Admin'
          } : q
        )
      );
      
      // Show success message
      showDialog('success', { 
        message: 'Question marked as resolved.',
        onConfirm: () => {
          hideDialog('success');
          // Refresh from server to ensure sync
          loadSupportQuestions();
        }
      });
      
    } catch (error) {
      console.error('Failed to mark as resolved:', error);
      showDialog('error', { 
        message: 'Failed to update question status. Please try again.'
      });
    }
  };

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Load questions for both admin and students
    loadSupportQuestions();
    startEntranceAnimations();
    startPulseAnimation();
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

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Load support questions from Supabase
  const loadSupportQuestions = async () => {
    try {
      setLoadingQuestions(true);
      console.log('Loading support questions from Supabase...');
      
      const questions = await SupabaseService.getAllSupportQuestions();
      
      setSupportQuestions(questions);
      console.log(`Loaded ${questions.length} support questions`);
    } catch (error) {
      console.error('Failed to load support questions:', error);
      showDialog('error', { message: 'Failed to load support questions from database.' });
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Save question to Supabase
  const saveQuestionToSupabase = async (questionData) => {
    try {
      await SupabaseService.submitSupportQuestion({
        studentId: user?.id,
        name: user?.name || user?.sNumber || 'Unknown User',
        sNumber: user?.sNumber || 'N/A',
        subject: questionData.subject,
        message: questionData.message,
        userType: isAdmin ? 'admin' : 'student'
      });
      return true;
    } catch (error) {
      console.error('Failed to save question to Supabase:', error);
      throw error;
    }
  };

  // Export questions to CSV (admin only)
  const exportQuestions = async () => {
    if (!isAdmin) return;
    
    try {
      setExporting(true);
      
      // Create CSV content
      const headers = [
        'ID',
        'Name',
        'Student S-Number',
        'Subject',
        'Message',
        'Submitted At',
        'Status',
        'User Type',
        'Resolved',
        'Admin Response',
        'Responded At',
        'Responded By'
      ];
      
      const csvContent = [
        headers.join(','),
        ...supportQuestions.map(q => [
          q.id || '',
          `"${q.name || ''}"`,
          q.s_number || q.studentSNumber || '',
          `"${q.subject || ''}"`,
          `"${(q.message || '').replace(/"/g, '""')}"`,
          q.submitted_at || '',
          q.status || '',
          q.user_type || '',
          q.resolved || '',
          `"${(q.admin_response || '').replace(/"/g, '""')}"`,
          q.responded_at || '',
          q.responded_by || ''
        ].join(','))
      ].join('\n');
      
      // Use React Native's Share API to share the CSV data
      const result = await Share.share({
        message: csvContent,
        title: `Support Questions Export - ${new Date().toLocaleDateString()}`,
      });
      
      if (result.action === Share.sharedAction) {
        showDialog('success', { 
          message: `Successfully shared ${supportQuestions.length} support questions!`
        });
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      showDialog('error', { message: 'Could not export questions. Please try again.' });
    } finally {
      setExporting(false);
    }
  };

  const videoGuides = [
    {
      id: 1,
      title: "Science Olympiad is For You",
      description: "A fun and inspiring intro to what SciOly is all about for students, parents, and teachers.",
      thumbnail: "play-circle",
      duration: "4:12",
      url: "https://www.youtube.com/watch?v=ni0nWk-puYo"
    },
    {
      id: 2,
      title: "Science Olympiad 2024 Highlights (MSU)",
      description: "See real competitions in action and get motivated for your next event!",
      thumbnail: "play-circle",
      duration: "5:28",
      url: "https://www.youtube.com/watch?v=XOB5zSdi3AU"
    },
    {
      id: 3,
      title: "2024 National Awards Ceremony",
      description: "Watch the excitement of national finals and what it feels like to win.",
      thumbnail: "play-circle",
      duration: "3:45",
      url: "https://www.youtube.com/watch?v=cpRVjHQMkaI"
    }
  ];

  // Initialize animated value for FAQ item
  const initializeAnimation = (id) => {
    if (!animatedValues[id]) {
      animatedValues[id] = new Animated.Value(0);
    }
    return animatedValues[id];
  };

  // Toggle FAQ expansion
  const toggleFaq = (id) => {
    const animatedValue = initializeAnimation(id);
    
    if (expandedFaq === id) {
      // Collapse
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
      setExpandedFaq(null);
    } else {
      // Collapse previous if any
      if (expandedFaq !== null) {
        const prevAnimatedValue = initializeAnimation(expandedFaq);
        Animated.timing(prevAnimatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
      
      // Expand new
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
      setExpandedFaq(id);
    }
  };

  // Handle video guide press
  const handleVideoPress = async (video) => {
    try {
      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(video.url);
      
      if (supported) {
        await Linking.openURL(video.url);
      } else {
        showDialog('error', { 
          message: "Cannot open this video. Please check your internet connection."
        });
      }
    } catch (error) {
      console.error('Error opening video:', error);
      showDialog('error', { 
        message: "Failed to open video. Please try again."
      });
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async () => {
    if (!contactForm.subject || !contactForm.message) {
      showDialog('error', { message: 'Please fill out all fields before submitting.' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      await saveQuestionToSupabase(contactForm);
      
      showDialog('success', { 
        message: 'Thank you for your message. Your question has been saved and an officer will get back to you within 24-48 hours.',
        onConfirm: () => {
          setContactForm({ 
            subject: '', 
            message: '' 
          });
          hideDialog('success');
        }
      });
    } catch (error) {
      console.error('Failed to submit question:', error);
      showDialog('error', { 
        message: 'Failed to save your question. Please try again or contact an officer directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render FAQ item
  const renderFaqItem = (item) => {
    const animatedValue = initializeAnimation(item.id);
    const isExpanded = expandedFaq === item.id;
    
    const maxHeight = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 200],
    });

    const iconRotation = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <View key={item.id} style={[styles.faqItem, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.faqQuestion}
          onPress={() => toggleFaq(item.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.faqQuestionText, { color: colors.text }]}>{item.question}</Text>
          <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
            <Ionicons name="chevron-down" size={20} color="#4299e1" />
          </Animated.View>
        </TouchableOpacity>
        
        <Animated.View style={[styles.faqAnswer, { maxHeight }]}>
          <Text style={[styles.faqAnswerText, { color: colors.textSecondary }]}>{item.answer}</Text>
        </Animated.View>
      </View>
    );
  };

  // Render support question item (admin only)
  const renderSupportQuestion = (question, index) => (
    <View key={question.id || index} style={styles.questionItem}>
      <View style={styles.questionHeader}>
        <View style={styles.questionInfo}>
          <Text style={[styles.questionSubject, { color: colors.text }]}>{question.subject}</Text>
          <Text style={[styles.questionMeta, { color: colors.textSecondary }]}>
            From: {question.name} • S-Number: {question.s_number || question.studentSNumber || 'N/A'}
          </Text>
          <Text style={[styles.questionMeta, { color: colors.textSecondary }]}>
            Submitted: {new Date(question.submitted_at).toLocaleDateString()} at {new Date(question.submitted_at).toLocaleTimeString()}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: (question.resolved === true || question.status === 'resolved') ? "#4CAF50" : "#FF6B35" }
        ]}>
          <Text style={[styles.statusText, { color: colors.background }]}>
            {(question.resolved === true || question.status === 'resolved') ? 'RESOLVED' : 'OPEN'}
          </Text>
        </View>
      </View>
      
      <View style={styles.questionMessageContainer}>
        <Text style={[styles.questionMessage, { color: colors.text }]}>{question.message}</Text>
      </View>
      
      {question.admin_response && (
        <View style={styles.adminResponseContainer}>
          <View style={styles.adminResponseHeader}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={[styles.adminResponseLabel, { color: colors.text }]}>Admin Response:</Text>
          </View>
          <Text style={[styles.adminResponseText, { color: colors.text }]}>{question.admin_response}</Text>
          <Text style={[styles.adminResponseMeta, { color: colors.textSecondary }]}>
            Responded by {question.responded_by} on {new Date(question.responded_at).toLocaleDateString()}
          </Text>
        </View>
      )}
      
      {/* Admin Action Buttons */}
      {isAdmin && (
        <View style={[styles.adminActions, { borderTopColor: colors.border }]}>
          {(question.resolved !== true && question.status !== 'resolved') ? (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.respondButton, { backgroundColor: "#4299e1" }]}
                onPress={() => handleRespondToQuestion(question)}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubble-outline" size={16} color={colors.background} />
                <Text style={[styles.actionButtonText, { color: colors.background }]}>Respond to Student</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.resolveButton, { backgroundColor: "#4CAF50" }]}
                onPress={() => markAsResolved(question)}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-outline" size={16} color={colors.background} />
                <Text style={[styles.actionButtonText, { color: colors.background }]}>Mark as Resolved</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.resolvedIndicator, { backgroundColor: "#4CAF50" + '20', borderColor: "#4CAF50" + '40' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.resolvedText, { color: colors.text }]}>Question Resolved</Text>
              {question.admin_response && (
                <Text style={[styles.resolvedSubtext, { color: colors.textSecondary }]}>Response sent to student</Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderVideoGuide = (video) => (
    <TouchableOpacity
      key={video.id}
      style={[styles.videoItem, { borderBottomColor: colors.border }]}
      onPress={() => handleVideoPress(video)}
      activeOpacity={0.7}
    >
      <View style={styles.videoThumbnail}>
        <Ionicons name={video.thumbnail} size={40} color="#FFFFFF" />
        <Text style={[styles.videoDuration, { backgroundColor: colors.card, color: colors.text }]}>{video.duration}</Text>
        <View style={[styles.playOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
          <Ionicons name="play" size={16} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={[styles.videoTitle, { color: colors.text }]}>{video.title}</Text>
        <Text style={[styles.videoDescription, { color: colors.textSecondary }]}>{video.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: headerScaleAnim },
              ],
            },
          ]}
        >
          <Animatable.View animation="bounceIn" delay={200}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="help-circle" size={40} color="#4299e1" />
            </Animated.View>
          </Animatable.View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Get help, watch guides, or reach out to us
          </Text>
        </Animated.View>

        {/* Admin Section - Support Questions Management */}
        {isAdmin && (
          <>
            <Animatable.View 
              style={[styles.adminSection, { backgroundColor: colors.card, shadowColor: colors.primary }]}
              animation="fadeInUp"
              delay={100}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons name="settings" size={24} color="#4299e1" />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Support Management</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.sortButton}
                  onPress={() => setShowSortMenu(!showSortMenu)}
                >
                  <Ionicons name="funnel" size={16} color="#4299e1" />
                  <Text style={[styles.sortButtonText, { color: "#4299e1" }]}>Sort</Text>
                  <Ionicons name={showSortMenu ? "chevron-up" : "chevron-down"} size={14} color="#4299e1" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.exportButton, { backgroundColor: "#4CAF50" }]}
                  onPress={exportQuestions}
                  disabled={exporting || supportQuestions.length === 0}
                >
                  {exporting ? (
                    <ActivityIndicator size="small" color={colors.background} />
                  ) : (
                    <Ionicons name="download" size={16} color={colors.background} />
                  )}
                  <Text style={[styles.exportButtonText, { color: colors.background }]}>
                    {exporting ? 'Exporting...' : 'Export CSV'}
                  </Text>
                </TouchableOpacity>
              </View>
              {showSortMenu && (
                <Animatable.View style={styles.sortMenu} animation="fadeInDown">
                  <Text style={[styles.sortMenuTitle, { color: colors.text }]}>Sort Questions By:</Text>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.sortOption,
                        sortBy === option.key && styles.activeSortOption
                      ]}
                      onPress={() => handleSortChange(option.key)}
                    >
                      <Ionicons 
                        name={option.icon} 
                        size={16} 
                        color={sortBy === option.key ? "#4299e1" : "#666666"} 
                      />
                      <Text style={[
                        styles.sortOptionText,
                        { color: colors.textSecondary },
                        sortBy === option.key && { color: "#4299e1", fontWeight: 'bold' }
                      ]}>
                        {option.label}
                      </Text>
                      {sortBy === option.key && (
                        <Ionicons name="checkmark" size={16} color="#4299e1" />
                      )}
                    </TouchableOpacity>
                  ))}
                </Animatable.View>
              )}
              {loadingQuestions ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading support questions...</Text>
                </View>
              ) : (
                <View style={styles.questionsContainer}>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: colors.text }]}>{supportQuestions.length}</Text>
                      <Text style={[styles.statLabel, { color: colors.text }]}>Total</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: colors.text }]}>{supportQuestions.filter(q => q.resolved !== true && q.status !== 'resolved').length}</Text>
                      <Text style={[styles.statLabel, { color: colors.text }]}>Open</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: colors.text }]}>{supportQuestions.filter(q => q.resolved === true || q.status === 'resolved').length}</Text>
                      <Text style={[styles.statLabel, { color: colors.text }]}>Resolved</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => {
                      console.log('Manual refresh triggered');
                      loadSupportQuestions();
                    }}
                  >
                    <Ionicons name="refresh" size={16} color="#4299e1" />
                    <Text style={[styles.refreshButtonText, { color: "#4299e1" }]}>Refresh</Text>
                  </TouchableOpacity>
                  <ScrollView 
                    style={styles.questionsScrollView}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  >
                    {getSortedQuestions().slice(0, 10).map(renderSupportQuestion)}
                    {supportQuestions.length > 10 && (
                      <Text style={[styles.moreQuestionsText, { color: colors.textSecondary }]}>
                        Showing 10 of {supportQuestions.length} questions. 
                        Export CSV to view all questions.
                      </Text>
                    )}
                  </ScrollView>
                  {/* Admin Recent Activity Card */}
                  <Animatable.View style={styles.adminCard} animation="fadeInUp" delay={200}>
                    <View style={styles.sectionHeader}>
                      <View style={styles.sectionIconContainer}>
                        <Ionicons name="time" size={20} color="#FF6B35" />
                      </View>
                      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
                    </View>
                    {getSortedQuestions().slice(0, 3).map((q, i) => (
                      <View key={q.id} style={[styles.adminActivityRow, { borderBottomColor: colors.border }]}>
                        <Ionicons name={q.resolved ? "checkmark-circle" : "time"} size={16} color={q.resolved ? "#4CAF50" : "#FF6B35"} style={{marginRight: 8}} />
                        <Text style={[styles.adminActivityText, { color: colors.text }]}>
                          <Text style={{fontWeight: 'bold'}}>{q.subject}</Text> by {q.name || q.email || 'Unknown'}
                          {'  '}
                          <Text style={{color: colors.textSecondary, fontSize: 12}}>
                            ({new Date(q.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                          </Text>
                        </Text>
                        <Text style={[styles.adminActivityStatus, {color: q.resolved ? "#4CAF50" : "#FF6B35"}]}> {q.resolved ? 'Resolved' : 'Open'} </Text>
                      </View>
                    ))}
                    {getSortedQuestions().length === 0 && (
                      <Text style={[styles.adminActivityText, { color: colors.textSecondary }]}>No recent activity.</Text>
                    )}
                  </Animatable.View>
                  {/* Admin Tips Card */}
                  <Animatable.View style={styles.adminCard} animation="fadeInUp" delay={300}>
                    <View style={styles.sectionHeader}>
                      <View style={styles.sectionIconContainer}>
                        <Ionicons name="bulb" size={20} color="#FFD700" />
                      </View>
                      <Text style={[styles.sectionTitle, { color: colors.text }]}>Admin Tips</Text>
                    </View>
                    <View style={styles.adminTipsList}>
                      <Text style={[styles.adminTipItem, { color: colors.text }]}>• Respond to open questions promptly for better student experience.</Text>
                      <Text style={[styles.adminTipItem, { color: colors.text }]}>• Use the Export CSV button to keep records or analyze trends.</Text>
                      <Text style={[styles.adminTipItem, { color: colors.text }]}>• Mark questions as resolved after responding to keep your dashboard organized.</Text>
                    </View>
                  </Animatable.View>
                </View>
              )}
            </Animatable.View>
          </>
        )}

        {/* Quick Actions Grid */}
        {!isAdmin && (
          <Animatable.View 
            style={styles.quickActionsSection}
            animation="fadeInUp"
            delay={200}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="flash" size={24} color="#FF6B35" />
              </View>
                              <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Help</Text>
            </View>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: "#4299e1" }]}> 
                  <Ionicons name="help-buoy" size={24} color={colors.background} />
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>FAQ</Text>
                <Text style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>Common questions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: "#FF6B35" }]}> 
                  <Ionicons name="play-circle" size={24} color={colors.background} />
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>Videos</Text>
                <Text style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>Watch guides</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: "#4CAF50" }]}> 
                  <Ionicons name="mail" size={24} color={colors.background} />
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>Contact</Text>
                <Text style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>Send message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#FF6B9D' }]}> 
                  <Ionicons name="people" size={24} color={colors.background} />
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>Officers</Text>
                <Text style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>Meet the team</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}

        {/* FAQ Section */}
        {!isAdmin && (
          <Animatable.View 
            style={styles.faqSection}
            animation="fadeInUp"
            delay={300}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="help-buoy" size={24} color="#4299e1" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
            </View>
            <View style={styles.faqContainer}>
              {faqData.map(renderFaqItem)}
            </View>
          </Animatable.View>
        )}

        {/* Video Guides Section */}
        {!isAdmin && (
          <Animatable.View 
            style={styles.videoSection}
            animation="fadeInUp"
            delay={400}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="play-circle" size={24} color="#FF6B35" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Video Guides</Text>
            </View>
            <View style={styles.videoContainer}>
              {videoGuides.map(renderVideoGuide)}
            </View>
          </Animatable.View>
        )}

        {/* Contact Form Section */}
        {!isAdmin && (
          <Animatable.View 
            style={styles.contactSection}
            animation="fadeInUp"
            delay={500}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="mail" size={24} color="#4CAF50" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
            </View>
            <View style={styles.contactForm}>
              <Text style={[styles.contactFormDescription, { color: colors.textSecondary }]}>
                Can't find what you're looking for? Send us a message and we'll get back to you!
              </Text>
              {/* Show user info */}
              <View style={styles.userInfoDisplay}>
                <Text style={[styles.userInfoLabel, { color: "#4299e1" }]}>Submitting as:</Text>
                <Text style={[styles.userInfoValue, { color: colors.text }]}>
                  {user?.name || user?.sNumber || 'Unknown User'}
                  {user?.sNumber && ` (${user.sNumber})`}
                </Text>
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Subject *</Text>
                                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text
                    }]}
                    value={contactForm.subject}
                    onChangeText={(text) => setContactForm(prev => ({ ...prev, subject: text }))}
                    placeholder="Brief description of your inquiry"
                    placeholderTextColor={colors.textSecondary}
                  />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Message *</Text>
                                  <TextInput
                    style={[styles.input, styles.textArea, { 
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text
                    }]}
                    value={contactForm.message}
                    onChangeText={(text) => setContactForm(prev => ({ ...prev, message: text }))}
                    placeholder="Please provide details about your question or issue..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
              </View>
              <AnimatedButton
                onPress={handleContactSubmit}
                disabled={isSubmitting}
                icon={<Ionicons name="send" size={20} color={colors.background} />}
                backgroundColor="#4299e1"
                style={styles.submitButton}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </AnimatedButton>
            </View>
          </Animatable.View>
        )}

        {/* Student Questions & Responses Section */}
        {!isAdmin && user && (
          <Animatable.View 
            style={styles.studentQuestionsSection}
            animation="fadeInUp"
            delay={600}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="chatbubbles" size={24} color="#FF6B9D" />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>My Questions & Responses</Text>
            </View>
            <View style={styles.studentQuestionsContainer}>
              {(() => {
                // Only show questions where the s_number matches the current user's sNumber (case-insensitive)
                const userQuestions = supportQuestions.filter(q =>
                  (q.s_number && user.sNumber && q.s_number.toLowerCase() === user.sNumber.toLowerCase())
                );
                if (userQuestions.length === 0) {
                  return (
                    <View style={styles.noStudentQuestionsContainer}>
                      <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
                      <Text style={[styles.noStudentQuestionsText, { color: colors.text }]}>No questions submitted yet</Text>
                      <Text style={[styles.noStudentQuestionsSubtext, { color: colors.textSecondary }]}>
                        Submit a question above and check back here for responses!
                      </Text>
                    </View>
                  );
                }
                return (
                  <ScrollView 
                    style={styles.studentQuestionsScrollView}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  >
                    {userQuestions.map((question, index) => (
                      <View key={question.id} style={[styles.studentQuestionCard, { backgroundColor: colors.card, borderLeftColor: "#4299e1" }]}>
                        <View style={styles.studentQuestionHeader}>
                          <View style={styles.studentQuestionMeta}>
                            <Text style={[styles.studentQuestionSubject, { color: colors.text }]}>{question.subject}</Text>
                            <Text style={[styles.studentQuestionDate, { color: colors.textSecondary }]}>
                              {new Date(question.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </Text>
                          </View>
                          <View style={[
                            styles.studentQuestionStatus,
                            { backgroundColor: question.resolved ? "#4CAF50" : "#FF6B35" }
                          ]}>
                            <Ionicons 
                              name={question.resolved ? "checkmark-circle" : "time"} 
                              size={16} 
                              color={colors.background} 
                            />
                            <Text style={[styles.studentQuestionStatusText, { color: colors.background }]}>
                              {question.resolved ? 'Resolved' : 'Pending'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.studentQuestionContent}>
                          <Text style={[styles.studentQuestionLabel, { color: colors.text }]}>Your Question:</Text>
                          <Text style={[styles.studentQuestionMessage, { color: colors.text }]}>{question.message}</Text>
                        </View>
                        {question.admin_response && (
                          <View style={[styles.studentResponseContainer, { backgroundColor: "#4CAF50" + '10', borderLeftColor: "#4CAF50" }]}>
                            <View style={styles.studentResponseHeader}>
                              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                              <Text style={[styles.studentResponseLabel, { color: colors.text }]}>Admin Response:</Text>
                              <Text style={[styles.studentResponseDate, { color: colors.textSecondary }]}>
                                {new Date(question.responded_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </Text>
                            </View>
                            <Text style={[styles.studentResponseMessage, { color: colors.text }]}>{question.admin_response}</Text>
                            {question.responded_by && (
                              <Text style={[styles.studentResponseBy, { color: colors.textSecondary }]}>
                                - {question.responded_by}
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                );
              })()}
            </View>
          </Animatable.View>
        )}

        {/* Quick Contact Info */}
        <Animatable.View 
          style={[styles.quickContact, { backgroundColor: colors.card, borderColor: colors.border }]}
          animation="fadeInUp"
          delay={700}
        >
          <View style={[styles.quickContactIcon, { backgroundColor: "#4299e1" + '20' }]}>
            <Ionicons name="chatbubbles" size={24} color="#4299e1" />
          </View>
          <Text style={[styles.quickContactTitle, { color: colors.text }]}>Need Immediate Help?</Text>
          <Text style={[styles.quickContactText, { color: colors.textSecondary }]}>
            Speak with an officer during club meetings directly.
          </Text>
        </Animatable.View>
      </ScrollView>

      {/* Error Dialog */}
      <ConfirmationDialog
        visible={dialogs.error.visible}
        title="Error"
        message={dialogs.error.message}
        onCancel={() => hideDialog('error')}
        onConfirm={() => hideDialog('error')}
        cancelText=""
        confirmText="OK"
        icon="alert-circle"
        iconColor={colors.danger}
      />

      {/* Success Dialog */}
      <ConfirmationDialog
        visible={dialogs.success.visible}
        title="Success"
        message={dialogs.success.message}
        onCancel={() => {
          if (dialogs.success.onConfirm) dialogs.success.onConfirm();
          hideDialog('success');
        }}
        onConfirm={() => {
          if (dialogs.success.onConfirm) dialogs.success.onConfirm();
          hideDialog('success');
        }}
        cancelText=""
        confirmText="OK"
        icon="checkmark-circle"
        iconColor={colors.success}
      />

      {/* Export Dialog */}
      <ConfirmationDialog
        visible={dialogs.export.visible}
        title="Export Complete"
        message={dialogs.export.message}
        onCancel={() => hideDialog('export')}
        onConfirm={() => hideDialog('export')}
        cancelText=""
        confirmText="OK"
        icon="download"
        iconColor={colors.success}
      />

      {/* Admin Response Dialog */}
      <Modal
        visible={dialogs.respond.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => hideDialog('respond')}
      >
        <KeyboardAvoidingView 
          style={styles.responseModalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            hideDialog('respond');
          }}>
            <View style={styles.responseModalOverlay}>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={[styles.responseModalContainer, { backgroundColor: colors.card }]}>
                  <View style={styles.responseModalHeader}>
                    <Ionicons name="chatbubble" size={24} color="#4299e1" />
                    <Text style={[styles.responseModalTitle, { color: colors.text }]}>Respond to Student</Text>
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={() => hideDialog('respond')}
                    >
                      <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  
                  {dialogs.respond.question && (
                    <View style={styles.questionPreview}>
                                        <Text style={[styles.questionPreviewTitle, { color: colors.textSecondary }]}>Student Question:</Text>
                  <Text style={[styles.questionPreviewSubject, { color: colors.text }]}>{dialogs.respond.question.subject}</Text>
                  <Text style={[styles.questionPreviewFrom, { color: colors.textSecondary }]}>
                    From: {dialogs.respond.question.name} ({dialogs.respond.question.s_number || dialogs.respond.question.studentSNumber})
                  </Text>
                  <Text style={[styles.questionPreviewMessage, { color: colors.text }]}>{dialogs.respond.question.message}</Text>
                    </View>
                  )}
                  
                  <Text style={[styles.responseLabel, { color: colors.text }]}>Your Response:</Text>
                  <TextInput
                    style={[styles.responseInput, { 
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text
                    }]}
                    value={dialogs.respond.response}
                    onChangeText={(text) => setDialogs(prev => ({
                      ...prev,
                      respond: { ...prev.respond, response: text }
                    }))}
                    placeholder="Type your response to the student here..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    returnKeyType="done"
                    blurOnSubmit={true}
                  />
                  
                  <Text style={[styles.responseNote, { color: colors.textSecondary }]}>
                    This response will be saved and the question will be marked as resolved.
                  </Text>
                  
                  <View style={styles.responseModalButtons}>
                    <TouchableOpacity
                      style={[styles.responseCancelButton, { borderColor: colors.border }]}
                      onPress={() => {
                        Keyboard.dismiss();
                        hideDialog('respond');
                      }}
                    >
                      <Text style={[styles.responseCancelButtonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.responseSendButton, { backgroundColor: "#4299e1" }]}
                      onPress={() => {
                        Keyboard.dismiss();
                        submitAdminResponse();
                      }}
                    >
                      <Ionicons name="send" size={16} color={colors.background} />
                      <Text style={[styles.responseSendButtonText, { color: colors.background }]}>Send Response</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Video Dialog */}
      <ConfirmationDialog
        visible={dialogs.video.visible}
        title={dialogs.video.video?.title || "Video Guide"}
        message={dialogs.video.message}
        onCancel={() => hideDialog('video')}
        onConfirm={() => {
          // In a real app, you would open the video URL
          // Linking.openURL(dialogs.video.video?.url);
          console.log("Opening video:", dialogs.video.video?.title);
          hideDialog('video');
        }}
        cancelText="Cancel"
        confirmText="Watch"
        icon="play-circle"
        iconColor={colors.primary}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: font.size.header + 2,
    fontWeight: font.weight.bold,
    marginTop: 12,
    marginBottom: 6,
    fontFamily: font.family,
    letterSpacing: 1,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: font.size.body + 1,
    marginBottom: 16,
    fontFamily: font.family,
    textAlign: 'center',
    letterSpacing: 0.4,
    lineHeight: 22,
  },
  section: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  faqContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    overflow: 'hidden',
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
    padding: 15,
  },
  videoContainer: {
    borderRadius: 8,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  videoThumbnail: {
    width: 70,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  contactForm: {
    // backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 15,
  },
  contactFormDescription: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfoDisplay: {
    // backgroundColor: 'rgba(89, 162, 240, 0.1)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    // borderColor: 'rgba(89, 162, 240, 0.3)',
  },
  userInfoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  userInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendIcon: {
    marginLeft: 8,
  },
  questionsContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 15,
  },
  questionsCount: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(89, 162, 240, 0.2)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
  },
  refreshButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  questionsScrollView: {
    maxHeight: 400,
  },
  questionItem: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  questionInfo: {
    flex: 1,
    marginRight: 15,
  },
  questionSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22,
  },
  questionMeta: {
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 16,
  },
  questionMessageContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  questionMessage: {
    fontSize: 15,
    lineHeight: 20,
  },
  adminResponseContainer: {
    // backgroundColor: 'rgba(39, 174, 96, 0.1)',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 3,
    marginBottom: 15,
  },
  adminResponseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminResponseLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  adminResponseText: {
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 20,
  },
  adminResponseMeta: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  noQuestionsContainer: {
    alignItems: 'center',
    padding: 30,
  },
  noQuestionsText: {
    fontSize: 16,
    marginTop: 10,
  },
  moreQuestionsText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 15,
    padding: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(89, 162, 240, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortMenu: {
    // backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    // borderColor: 'rgba(89, 162, 240, 0.3)',
  },
  sortMenuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 5,
  },
  activeSortOption: {
    // backgroundColor: 'rgba(89, 162, 240, 0.2)',
  },
  sortOptionText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  activeSortOptionText: {
    fontWeight: 'bold',
  },
  sortIndicator: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  adminActions: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  respondButton: {
  },
  resolveButton: {
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  resolvedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    // backgroundColor: 'rgba(39, 174, 96, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    // borderColor: 'rgba(39, 174, 96, 0.3)',
  },
  resolvedText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resolvedSubtext: {
    fontSize: 12,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  responseDialogContent: {
    marginVertical: 15,
  },
  questionPreview: {
    // backgroundColor: 'rgba(89, 162, 240, 0.1)',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 3,
  },
  questionPreviewTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questionPreviewSubject: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  questionPreviewFrom: {
    fontSize: 13,
    marginBottom: 8,
  },
  questionPreviewMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  responseInput: {
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 10,
  },
  responseNote: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  quickContact: {
    margin: 15,
    padding: 15,
    // backgroundColor: 'rgba(62, 57, 11, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: 'rgba(245, 236, 215, 0.5)',
    alignItems: 'center',
  },
  quickContactIcon: {
    // backgroundColor: 'rgba(89, 162, 240, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
  },
  quickContactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quickContactText: {
    fontSize: 14,
    textAlign: 'center',
  },
  adminSection: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionIconContainer: {
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
  },
  quickActionsSection: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  quickActionCard: {
    width: '45%', // Two columns
    aspectRatio: 1.2,
    // backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  faqSection: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  videoSection: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  contactSection: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  responseModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  responseModalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  responseModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  responseModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  questionPreview: {
    // backgroundColor: 'rgba(89, 162, 240, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
  },
  questionPreviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionPreviewSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  questionPreviewFrom: {
    fontSize: 13,
    marginBottom: 10,
  },
  questionPreviewMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  responseInput: {
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 12,
  },
  responseNote: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
  },
  responseModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  responseCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  responseCancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  responseSendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  responseSendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  studentQuestionsSection: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  studentQuestionsContainer: {
    marginTop: 16,
  },
  noStudentQuestionsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noStudentQuestionsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noStudentQuestionsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  studentQuestionsScrollView: {
    maxHeight: 400,
  },
  studentQuestionCard: {
    // backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
  },
  studentQuestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  studentQuestionMeta: {
    flex: 1,
  },
  studentQuestionSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  studentQuestionDate: {
    fontSize: 12,
  },
  studentQuestionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  studentQuestionStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  studentQuestionContent: {
    marginBottom: 12,
  },
  studentQuestionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  studentQuestionMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  studentResponseContainer: {
    // backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
  },
  studentResponseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentResponseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
    flex: 1,
  },
  studentResponseDate: {
    fontSize: 12,
  },
  studentResponseMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  studentResponseBy: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  adminCard: {
    marginTop: 20,
    padding: 15,
    // backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  adminActivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  adminActivityText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  adminActivityStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  adminTipsList: {
    marginTop: 10,
  },
  adminTipItem: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 5,
  },
});