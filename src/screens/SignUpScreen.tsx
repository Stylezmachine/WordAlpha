import React, {useState} from 'react';
import {View, StyleSheet, Alert, ScrollView} from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Avatar,
  useTheme,
  HelperText,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../services/AuthContext';

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const {signUp} = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    // Validation
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your display name');
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email.trim(), password, displayName.trim());
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Avatar.Icon size={80} icon="account-plus" />
          <Text variant="headlineMedium" style={styles.title}>
            Join WordAlpha
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Create your account and start playing with friends
          </Text>
        </View>

        {/* Sign Up Form */}
        <Card style={styles.signUpCard}>
          <Card.Content style={styles.cardContent}>
            <TextInput
              label="Display Name"
              mode="outlined"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
            <HelperText type="info" visible={displayName.length > 0}>
              This name will be visible to other players
            </HelperText>

            <TextInput
              label="Email"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />
            <HelperText
              type={email && !validateEmail(email) ? 'error' : 'info'}
              visible={email.length > 0}>
              {email && !validateEmail(email)
                ? 'Please enter a valid email address'
                : 'We will use this for your account verification'}
            </HelperText>

            <TextInput
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
            />
            <HelperText
              type={password && !validatePassword(password) ? 'error' : 'info'}
              visible={password.length > 0}>
              {password && !validatePassword(password)
                ? 'Password must be at least 6 characters'
                : 'Minimum 6 characters required'}
            </HelperText>

            <TextInput
              label="Confirm Password"
              mode="outlined"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              style={styles.input}
              left={<TextInput.Icon icon="lock-check" />}
            />
            <HelperText
              type={
                confirmPassword && password !== confirmPassword
                  ? 'error'
                  : 'info'
              }
              visible={confirmPassword.length > 0}>
              {confirmPassword && password !== confirmPassword
                ? 'Passwords do not match'
                : 'Re-enter your password to confirm'}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleSignUp}
              loading={isLoading}
              disabled={isLoading}
              style={styles.signUpButton}>
              Create Account
            </Button>

            <View style={styles.loginSection}>
              <Text variant="bodyMedium">Already have an account?</Text>
              <Button mode="text" onPress={navigateToLogin}>
                Sign In
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text variant="titleMedium" style={styles.benefitsTitle}>
            What you'll get:
          </Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Avatar.Icon size={32} icon="account-multiple" />
              <Text variant="bodySmall">Connect with friends</Text>
            </View>
            <View style={styles.benefitItem}>
              <Avatar.Icon size={32} icon="gamepad-variant" />
              <Text variant="bodySmall">Play multiplayer games</Text>
            </View>
            <View style={styles.benefitItem}>
              <Avatar.Icon size={32} icon="chart-line" />
              <Text variant="bodySmall">Track your progress</Text>
            </View>
            <View style={styles.benefitItem}>
              <Avatar.Icon size={32} icon="trophy" />
              <Text variant="bodySmall">Earn achievements</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  signUpCard: {
    marginBottom: 30,
  },
  cardContent: {
    padding: 20,
  },
  input: {
    marginBottom: 4,
  },
  signUpButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitsSection: {
    alignItems: 'center',
  },
  benefitsTitle: {
    marginBottom: 16,
  },
  benefitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  benefitItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    gap: 8,
  },
});

export default SignUpScreen;
