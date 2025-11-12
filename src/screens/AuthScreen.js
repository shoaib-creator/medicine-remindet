import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState('email'); // 'email', 'phone', 'google'
  const [accountType, setAccountType] = useState('patient'); // 'patient' or 'clinic'
  
  // Email/Password fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Phone fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaVerifier = useRef(null);
  
  const { login, signup, signInWithGoogle, signInWithPhone, verifyPhoneCode } = useAuth();

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = isLogin 
      ? await login(email, password) 
      : await signup(email, password, accountType);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Authentication failed');
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const result = await signInWithGoogle(accountType);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Google Sign-In failed');
    }
  };

  const handlePhoneSendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setLoading(true);
    
    try {
      // For web, create recaptcha verifier
      if (Platform.OS === 'web' && !recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
      
      const result = await signInWithPhone(phoneNumber, recaptchaVerifier.current, accountType);
      setLoading(false);
      
      if (result.success) {
        setConfirmationResult(result.confirmationResult);
        Alert.alert('Success', 'Verification code sent to your phone');
      } else {
        Alert.alert('Error', result.error || 'Failed to send code');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to send code');
    }
  };

  const handlePhoneVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    const result = await verifyPhoneCode(confirmationResult, verificationCode, accountType);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Verification failed');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setConfirmationResult(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>💊</Text>
          </View>
          <Text style={styles.title}>Medicine Reminder</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </Text>
        </View>

        {/* Account Type Selection (Only for Signup) */}
        {!isLogin && (
          <View style={styles.accountTypeContainer}>
            <Text style={styles.accountTypeLabel}>I am a:</Text>
            <View style={styles.accountTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  accountType === 'patient' && styles.accountTypeButtonActive
                ]}
                onPress={() => setAccountType('patient')}
              >
                <Ionicons 
                  name="person" 
                  size={24} 
                  color={accountType === 'patient' ? 'white' : '#4A90E2'} 
                />
                <Text style={[
                  styles.accountTypeText,
                  accountType === 'patient' && styles.accountTypeTextActive
                ]}>
                  Patient
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.accountTypeButton,
                  accountType === 'clinic' && styles.accountTypeButtonActive
                ]}
                onPress={() => setAccountType('clinic')}
              >
                <Ionicons 
                  name="medkit" 
                  size={24} 
                  color={accountType === 'clinic' ? 'white' : '#4A90E2'} 
                />
                <Text style={[
                  styles.accountTypeText,
                  accountType === 'clinic' && styles.accountTypeTextActive
                ]}>
                  Clinic
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Auth Method Tabs */}
        <View style={styles.authMethodTabs}>
          <TouchableOpacity
            style={[styles.authMethodTab, authMethod === 'email' && styles.authMethodTabActive]}
            onPress={() => setAuthMethod('email')}
          >
            <Ionicons name="mail" size={20} color={authMethod === 'email' ? '#4A90E2' : '#7F8C8D'} />
            <Text style={[styles.authMethodTabText, authMethod === 'email' && styles.authMethodTabTextActive]}>
              Email
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.authMethodTab, authMethod === 'phone' && styles.authMethodTabActive]}
            onPress={() => setAuthMethod('phone')}
          >
            <Ionicons name="call" size={20} color={authMethod === 'phone' ? '#4A90E2' : '#7F8C8D'} />
            <Text style={[styles.authMethodTabText, authMethod === 'phone' && styles.authMethodTabTextActive]}>
              Phone
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.authMethodTab, authMethod === 'google' && styles.authMethodTabActive]}
            onPress={() => setAuthMethod('google')}
          >
            <Ionicons name="logo-google" size={20} color={authMethod === 'google' ? '#4A90E2' : '#7F8C8D'} />
            <Text style={[styles.authMethodTabText, authMethod === 'google' && styles.authMethodTabTextActive]}>
              Google
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {/* Email/Password Auth */}
          {authMethod === 'email' && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#7F8C8D" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#95A5A6"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="#7F8C8D" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#95A5A6"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color="#7F8C8D"
                  />
                </TouchableOpacity>
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={24} color="#7F8C8D" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#95A5A6"
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.authButton}
                onPress={handleEmailAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.authButtonText}>
                    {isLogin ? 'Login' : 'Sign Up'}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Phone Auth */}
          {authMethod === 'phone' && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={24} color="#7F8C8D" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number (+1234567890)"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholderTextColor="#95A5A6"
                />
              </View>

              {!confirmationResult ? (
                <TouchableOpacity
                  style={styles.authButton}
                  onPress={handlePhoneSendCode}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.authButtonText}>Send Code</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    <Ionicons name="keypad-outline" size={24} color="#7F8C8D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="6-Digit Code"
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      keyboardType="number-pad"
                      maxLength={6}
                      placeholderTextColor="#95A5A6"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={handlePhoneVerify}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.authButtonText}>Verify Code</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
              
              <div id="recaptcha-container"></div>
            </>
          )}

          {/* Google Auth */}
          {authMethod === 'google' && (
            <TouchableOpacity
              style={[styles.authButton, styles.googleButton]}
              onPress={handleGoogleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={24} color="white" style={styles.buttonIcon} />
                  <Text style={styles.authButtonText}>
                    {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.toggleTextBold}>
                {isLogin ? 'Sign Up' : 'Login'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  accountTypeContainer: {
    marginBottom: 24,
  },
  accountTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  accountTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  accountTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  accountTypeButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  accountTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  accountTypeTextActive: {
    color: 'white',
  },
  authMethodTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  authMethodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  authMethodTabActive: {
    backgroundColor: '#F0F8FF',
  },
  authMethodTabText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  authMethodTabTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2C3E50',
  },
  authButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    flexDirection: 'row',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  buttonIcon: {
    marginRight: 12,
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  toggleTextBold: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95A5A6',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
