import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Avatar,
  useTheme,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../services/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const {signIn} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Avatar.Icon size={100} icon="book-open" />
          <Text variant="headlineLarge" style={styles.appTitle}>
            WordAlpha
          </Text>
          <Text variant="bodyLarge" style={styles.appSubtitle}>
            Learn Together, Play Together
          </Text>
        </View>

        {/* Login Form */}
        <Card style={styles.loginCard}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineSmall" style={styles.loginTitle}>
              Welcome Back
            </Text>

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

            <TextInput
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}>
              Sign In
            </Button>

            <View style={styles.signUpSection}>
              <Text variant="bodyMedium">Don't have an account?</Text>
              <Button mode="text" onPress={navigateToSignUp}>
                Sign Up
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Features Preview */}
        <View style={styles.featuresSection}>
          <Text variant="titleMedium" style={styles.featuresTitle}>
            Play with Friends
          </Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Avatar.Icon size={40} icon="account-group" />
              <Text variant="bodySmall">Add Friends</Text>
            </View>
            <View style={styles.featureItem}>
              <Avatar.Icon size={40} icon="gamepad-variant" />
              <Text variant="bodySmall">Multiplayer Games</Text>
            </View>
            <View style={styles.featureItem}>
              <Avatar.Icon size={40} icon="trophy" />
              <Text variant="bodySmall">Compete & Win</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  appSubtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  loginCard: {
    marginBottom: 30,
  },
  cardContent: {
    padding: 20,
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  signUpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresSection: {
    alignItems: 'center',
  },
  featuresTitle: {
    marginBottom: 16,
  },
  featuresList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
});

export default LoginScreen;
