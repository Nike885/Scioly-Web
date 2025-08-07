import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { colors, font } from '../utils/theme';
import AnimatedButton from '../components/AnimatedButton';
import * as Animatable from 'react-native-animatable';

export default function StudentAccountCreationScreen(props) {
  const { route, navigation } = props;
  const { registerStudent } = useAuth();
  const params = route?.params || {};
  const sNumber = params.sNumber || '';
  const studentData = params.studentData || {};
  
  const [name, setName] = useState(studentData.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectTimer, setRedirectTimer] = useState(null);

  // Check if we have valid data
  useEffect(() => {
    if (!sNumber) {
      setErrorMessage('Missing student information. Please try the verification process again.');
      const timer = setTimeout(() => {
        navigation.navigate('StudentVerification');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [sNumber, navigation]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);

  const handleCreateAccount = async () => {
    // Reset state
    setErrorMessage('');
    setSuccessMessage('');
    
    // Input validation
    if (!name.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating account for:', sNumber);
      
      // Use the AuthContext registerStudent method which uses Supabase
      const success = await registerStudent(sNumber, password, name.trim());
      
      if (success) {
        console.log('Account creation successful');
        
        // Display success message
        setSuccessMessage('Your account has been successfully created! Redirecting you to the login page...');
        
        // Set a timer to redirect to login
        const timer = setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              { name: 'Landing' },
              { name: 'StudentLogin' }
            ],
          });
        }, 3000);
        
        setRedirectTimer(timer);
      } else {
        setErrorMessage('Could not create your account. Please try again later.');
      }
      
    } catch (error) {
      console.error('Account creation error:', error);
      setErrorMessage(error.message || 'Could not create your account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animatable.View animation="fadeInDown" duration={900} style={styles.formCard}>
            <Text style={styles.title}>Create Account</Text>
            
            {errorMessage ? (
              <View style={[styles.messageContainer, styles.errorMessage]}>
                <Text style={styles.messageText}>{errorMessage}</Text>
              </View>
            ) : null}
            
            {successMessage ? (
              <View style={[styles.messageContainer, styles.successMessage]}>
                <Text style={styles.messageText}>{successMessage}</Text>
              </View>
            ) : null}
            
            <View style={styles.sNumberDisplay}>
              <Text style={styles.sNumberLabel}>Student ID:</Text>
              <Text style={styles.sNumberValue}>{sNumber}</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                editable={!loading && !successMessage}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Create Password</Text>
              <TextInput
                placeholder="Choose a password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                editable={!loading && !successMessage}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                placeholder="Enter password again"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry
                editable={!loading && !successMessage}
              />
            </View>
            
            {!successMessage && (
              <>
                <AnimatedButton
                  title="Create Account"
                  onPress={handleCreateAccount} 
                  loading={loading}
                  disabled={loading || Boolean(successMessage)}
                  style={styles.button}
                />
                
                <AnimatedButton
                  title="Cancel"
                  onPress={() => navigation.goBack()}
                  disabled={loading || Boolean(successMessage)}
                  style={styles.cancelButton}
                  textStyle={styles.cancelButtonText}
                />
              </>
            )}
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  formCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: font.size.header,
    fontWeight: font.weight.bold,
    color: colors.text,
    marginBottom: 18,
    fontFamily: font.family,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  sNumberDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddeeff',
  },
  sNumberLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginRight: 8,
  },
  sNumberValue: {
    fontSize: 16,
    color: '#0d1b2a',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    color: '#0d1b2a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  }
});