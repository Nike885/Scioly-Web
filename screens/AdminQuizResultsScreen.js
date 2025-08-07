import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../supabase/supabaseClient';

export default function AdminQuizResultsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
  
  const [quizResults, setQuizResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 100,
  });

  useEffect(() => {
    loadTodayQuizResults();
  }, []);

  const loadTodayQuizResults = async () => {
    try {
      setIsLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      console.log('📊 Loading quiz results for:', today);
      
      const { data, error } = await supabase
        .from('daily_quiz_results')
        .select('*')
        .eq('quiz_date', today)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading quiz results:', error);
        return;
      }

      console.log('✅ Loaded quiz results:', data?.length || 0);

      // Fetch student names for each result
      if (data && data.length > 0) {
        const resultsWithNames = await Promise.all(
          data.map(async (result) => {
            try {
              // Try to get student name from students table
              const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('name')
                .eq('s_number', result.user_id)
                .single();

              if (studentData && studentData.name) {
                return {
                  ...result,
                  studentName: studentData.name
                };
              } else {
                // Fallback to user_id if no name found
                return {
                  ...result,
                  studentName: result.user_id
                };
              }
            } catch (error) {
              console.log('Could not fetch name for user:', result.user_id);
              return {
                ...result,
                studentName: result.user_id
              };
            }
          })
        );

        setQuizResults(resultsWithNames);
      } else {
        setQuizResults([]);
      }

      // Calculate stats
      if (data && data.length > 0) {
        const scores = data.map(result => result.score);
        const totalParticipants = data.length;
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalParticipants);
        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);

        setStats({
          totalParticipants,
          averageScore,
          highestScore,
          lowestScore,
        });
      }
    } catch (error) {
      console.error('Error loading quiz results:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTodayQuizResults();
  };

  const getScoreColor = (score) => {
    if (score >= 90) return colors.success;
    if (score >= 70) return colors.primary;
    if (score >= 50) return colors.warning;
    return colors.error;
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🏆';
    if (score >= 70) return '🌟';
    if (score >= 50) return '📚';
    return '💪';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading today's quiz results...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.background} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.background }]}>
          Today's Quiz Results
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Stats Cards */}
        <Animatable.View animation="fadeInDown" duration={800} style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats.totalParticipants}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Participants
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="analytics" size={24} color={colors.secondary} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats.averageScore}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Average
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={24} color={colors.accent} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats.highestScore}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Highest
              </Text>
            </View>
          </View>
        </Animatable.View>

        {/* Results List */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              Quiz Results
            </Text>
            <Text style={[styles.resultsSubtitle, { color: colors.textSecondary }]}>
              {quizResults.length > 0 
                ? `${quizResults.length} student${quizResults.length > 1 ? 's' : ''} completed today's quiz`
                : 'No students have completed today\'s quiz yet'
              }
            </Text>
          </View>

          {quizResults.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Ionicons name="clipboard-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Results Yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Students haven't taken today's quiz yet. Check back later!
              </Text>
            </View>
          ) : (
            quizResults.map((result, index) => (
              <Animatable.View 
                key={result.id}
                animation="fadeInUp" 
                duration={600} 
                delay={index * 100}
                style={[styles.resultCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.resultHeader}>
                  <View style={styles.userInfo}>
                    <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
                      <Ionicons name="person" size={20} color={colors.background} />
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={[styles.userName, { color: colors.text }]}>
                        {result.studentName}
                      </Text>
                      <Text style={[styles.completionTime, { color: colors.textSecondary }]}>
                        Completed at {formatTime(result.completed_at)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.scoreContainer}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(result.score) }]}>
                      {result.score}%
                    </Text>
                    <Text style={[styles.scoreEmoji, { fontSize: 20 }]}>
                      {getScoreEmoji(result.score)}
                    </Text>
                  </View>
                </View>

                <View style={styles.resultDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                      {new Date(result.quiz_date).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  {result.answers && (
                    <View style={styles.detailItem}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {result.answers.questions?.length || 0} questions answered
                      </Text>
                    </View>
                  )}
                </View>
              </Animatable.View>
            ))
          )}
        </Animatable.View>

        {/* Refresh Hint */}
        <View style={styles.refreshHint}>
          <Text style={[styles.refreshText, { color: colors.textSecondary }]}>
            Pull down to refresh results
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  statsContainer: {
    marginBottom: 25,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultsSubtitle: {
    fontSize: 14,
  },
  emptyState: {
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  completionTime: {
    fontSize: 12,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scoreEmoji: {
    fontSize: 20,
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    marginLeft: 6,
  },
  refreshHint: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  refreshText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
}); 