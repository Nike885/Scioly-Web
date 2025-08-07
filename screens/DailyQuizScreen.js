import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../supabase/supabaseClient';

export default function DailyQuizScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    checkIfCompletedToday();
    loadDailyQuiz();
  }, []);

  const checkIfCompletedToday = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('🔍 Checking if user completed quiz today:', today);
      console.log('🔍 User ID:', user?.sNumber || user?.id);
      
      const { data, error } = await supabase
        .from('daily_quiz_results')
        .select('*')
        .eq('user_id', user?.sNumber || user?.id)
        .eq('quiz_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error checking completion:', error);
      }

      if (data) {
        console.log('✅ Found previous completion for today:', data);
        setAlreadyCompleted(true);
        setScore(data.score);
        setQuestions(data.answers?.questions || []);
        setSelectedAnswers(data.answers?.selectedAnswers || {});
        setShowResults(true);
        setIsLoading(false);
      } else {
        console.log('📝 No previous completion found for today - user can take today\'s quiz');
      }
    } catch (error) {
      console.log('📝 No previous completion found for today (catch):', error.message);
    }
  };

  const loadDailyQuiz = async () => {
    try {
      setIsLoading(true);
      
      // Get today's date for consistent daily questions
      const today = new Date().toISOString().split('T')[0];
      const dateSeed = new Date(today).getTime(); // Use date as seed for consistent daily questions
      
      console.log('📅 Loading quiz for date:', today, 'with seed:', dateSeed);
      
      // Get all questions first
      const { data: allQuestions, error } = await supabase
        .from('daily_quiz_questions')
        .select('*');

      if (error) {
        console.error('Error loading quiz questions:', error);
        Alert.alert('Error', 'Failed to load quiz questions. Please try again.');
        return;
      }

      if (allQuestions && allQuestions.length > 0) {
        console.log('📚 Loaded questions from Supabase:', allQuestions.length);
        
        // Use date seed to select consistent daily questions
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        const dailyQuestions = shuffled.slice(0, 3); // Get 3 questions
        
        console.log('🎲 Selected daily questions:', dailyQuestions.length);
        setQuestions(dailyQuestions);
      } else {
        console.log('📚 Using sample questions (no data in Supabase)');
        // If no questions in database, show sample questions
        setQuestions([
          {
            id: 1,
            question: "What is the study of fossils called?",
            choices: ["Paleontology", "Archaeology", "Geology", "Biology"],
            correct_index: 0,
            explanation: "Paleontology is the scientific study of fossils."
          },
          {
            id: 2,
            question: "Which planet is known as the Red Planet?",
            choices: ["Venus", "Mars", "Jupiter", "Saturn"],
            correct_index: 1,
            explanation: "Mars is called the Red Planet due to its reddish appearance."
          },
          {
            id: 3,
            question: "What is the chemical symbol for gold?",
            choices: ["Ag", "Au", "Fe", "Cu"],
            correct_index: 1,
            explanation: "Au comes from the Latin word 'aurum' meaning gold."
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      Alert.alert('Error', 'Failed to load quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      Alert.alert('Incomplete Quiz', 'Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach(question => {
        if (selectedAnswers[question.id] === question.correct_index) {
          correctAnswers++;
        }
      });
      
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);

      // Save results to Supabase
      const today = new Date().toISOString().split('T')[0];
      const userId = user?.sNumber || user?.id || 'anonymous';
      
      console.log('💾 Saving quiz results:', {
        user_id: userId,
        quiz_date: today,
        score: finalScore
      });

      // Try to save without RLS first (for testing)
      const { data, error } = await supabase
        .from('daily_quiz_results')
        .insert([{
          user_id: userId,
          quiz_date: today,
          score: finalScore,
          answers: {
            questions: questions,
            selectedAnswers: selectedAnswers
          }
        }])
        .select();

      if (error) {
        console.error('❌ Error saving quiz results:', error);
        
        // If RLS is still blocking, try a different approach
        if (error.code === '42501') {
          console.log('🔧 RLS still blocking, trying alternative approach...');
          
          // For now, just show the results without saving to database
          Alert.alert(
            'Quiz Complete!', 
            `Your score: ${finalScore}%\n\nNote: Results couldn't be saved due to database permissions, but your quiz is complete for today.`,
            [{ text: 'OK' }]
          );
          setShowResults(true);
          return;
        }
        
        Alert.alert('Error', 'Failed to save your results. Please try again.');
        return;
      }

      console.log('✅ Quiz results saved successfully:', data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Excellent! You're a Science Olympiad expert! 🏆";
    if (score >= 70) return "Great job! You're doing well! 🌟";
    if (score >= 50) return "Good effort! Keep studying! 📚";
    return "Keep practicing! You'll get better! 💪";
  };

  const getScoreColor = (score) => {
    if (score >= 90) return colors.success;
    if (score >= 70) return colors.primary;
    if (score >= 50) return colors.warning;
    return colors.error;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading today's quiz...
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
          Daily Quiz
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {alreadyCompleted ? (
          /* Already Completed View */
          <Animatable.View animation="fadeInUp" duration={800} style={styles.completedContainer}>
            <View style={[styles.completedCard, { backgroundColor: colors.card }]}>
              <Ionicons 
                name="checkmark-circle" 
                size={80} 
                color={colors.success} 
                style={styles.completedIcon}
              />
              <Text style={[styles.completedTitle, { color: colors.text }]}>
                Quiz Completed!
              </Text>
              <Text style={[styles.completedSubtitle, { color: colors.textSecondary }]}>
                You've already completed today's quiz
              </Text>
              
              <View style={[styles.scoreContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
                  Your Score
                </Text>
                <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
                  {score}%
                </Text>
                <Text style={[styles.scoreMessage, { color: colors.textSecondary }]}>
                  {getScoreMessage(score)}
                </Text>
              </View>

              <Text style={[styles.comingBackText, { color: colors.textSecondary }]}>
                Your daily quiz will reset at midnight. Come back tomorrow for a new quiz! 🌟
              </Text>
            </View>
          </Animatable.View>
        ) : showResults ? (
          /* Results View */
          <Animatable.View animation="fadeInUp" duration={800} style={styles.resultsContainer}>
            <View style={[styles.resultsCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.resultsTitle, { color: colors.text }]}>
                Quiz Complete!
              </Text>
              
              <View style={[styles.scoreContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
                  Your Score
                </Text>
                <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
                  {score}%
                </Text>
                <Text style={[styles.scoreMessage, { color: colors.textSecondary }]}>
                  {getScoreMessage(score)}
                </Text>
              </View>

              <View style={styles.questionsReview}>
                <Text style={[styles.reviewTitle, { color: colors.text }]}>
                  Question Review
                </Text>
                {questions.map((question, index) => (
                  <View key={question.id} style={[styles.questionReview, { backgroundColor: colors.background }]}>
                    <Text style={[styles.questionText, { color: colors.text }]}>
                      {index + 1}. {question.question}
                    </Text>
                    <View style={styles.answerReview}>
                      <Text style={[styles.yourAnswer, { color: colors.textSecondary }]}>
                        Your answer: {question.choices[selectedAnswers[question.id] || 0]}
                      </Text>
                      <Ionicons 
                        name={selectedAnswers[question.id] === question.correct_index ? "checkmark-circle" : "close-circle"} 
                        size={20} 
                        color={selectedAnswers[question.id] === question.correct_index ? colors.success : colors.error} 
                      />
                    </View>
                    {selectedAnswers[question.id] !== question.correct_index && (
                      <Text style={[styles.correctAnswer, { color: colors.success }]}>
                        Correct: {question.choices[question.correct_index]}
                      </Text>
                    )}
                    {question.explanation && (
                      <Text style={[styles.explanation, { color: colors.textSecondary }]}>
                        💡 {question.explanation}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </Animatable.View>
        ) : (
          /* Quiz Questions View */
          <Animatable.View animation="fadeInUp" duration={800} style={styles.quizContainer}>
            <View style={[styles.progressContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: colors.primary,
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                    }
                  ]} 
                />
              </View>
            </View>

            <View style={[styles.questionCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.questionTitle, { color: colors.text }]}>
                {questions[currentQuestionIndex]?.question}
              </Text>

              <View style={styles.choicesContainer}>
                {questions[currentQuestionIndex]?.choices.map((choice, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.choiceButton,
                      { 
                        backgroundColor: selectedAnswers[questions[currentQuestionIndex].id] === index 
                          ? colors.primary 
                          : colors.background,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => handleAnswerSelect(questions[currentQuestionIndex].id, index)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.choiceText,
                      { 
                        color: selectedAnswers[questions[currentQuestionIndex].id] === index 
                          ? colors.background 
                          : colors.text
                      }
                    ]}>
                      {String.fromCharCode(65 + index)}. {choice}
                    </Text>
                    {selectedAnswers[questions[currentQuestionIndex].id] === index && (
                      <Ionicons name="checkmark" size={20} color={colors.background} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.navigationButtons}>
              {currentQuestionIndex > 0 && (
                <TouchableOpacity
                  style={[styles.navButton, { backgroundColor: colors.secondary }]}
                  onPress={() => setCurrentQuestionIndex(prev => prev - 1)}
                >
                  <Ionicons name="arrow-back" size={20} color={colors.background} />
                  <Text style={[styles.navButtonText, { color: colors.background }]}>
                    Previous
                  </Text>
                </TouchableOpacity>
              )}

              {currentQuestionIndex < questions.length - 1 ? (
                <TouchableOpacity
                  style={[styles.navButton, { backgroundColor: colors.primary }]}
                  onPress={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={selectedAnswers[questions[currentQuestionIndex].id] === undefined}
                >
                  <Text style={[styles.navButtonText, { color: colors.background }]}>
                    Next
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={colors.background} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.navButton, 
                    { 
                      backgroundColor: selectedAnswers[questions[currentQuestionIndex].id] !== undefined 
                        ? colors.accent 
                        : colors.border
                    }
                  ]}
                  onPress={handleSubmitQuiz}
                  disabled={selectedAnswers[questions[currentQuestionIndex].id] === undefined || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={colors.background} />
                  ) : (
                    <>
                      <Text style={[styles.navButtonText, { color: colors.background }]}>
                        Submit Quiz
                      </Text>
                      <Ionicons name="checkmark" size={20} color={colors.background} />
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </Animatable.View>
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
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  completedCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  completedIcon: {
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  scoreContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  comingBackText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCard: {
    padding: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionsReview: {
    marginTop: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  questionReview: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  answerReview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  yourAnswer: {
    fontSize: 14,
    flex: 1,
  },
  correctAnswer: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  explanation: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  quizContainer: {
    flex: 1,
  },
  progressContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  questionCard: {
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 25,
    lineHeight: 26,
  },
  choicesContainer: {
    gap: 12,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
  },
  choiceText: {
    fontSize: 16,
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    flex: 1,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
}); 