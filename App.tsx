import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {View, ActivityIndicator} from 'react-native';

// Auth
import {AuthProvider, useAuth} from './src/services/AuthContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DictionaryScreen from './src/screens/DictionaryScreen';
import GamesScreen from './src/screens/GamesScreen';
import VocabularyScreen from './src/screens/VocabularyScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import MultiplayerLobbyScreen from './src/screens/MultiplayerLobbyScreen';
import CategoryChallengeScreen from './src/screens/CategoryChallengeScreen';

// Theme
import {theme} from './src/theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Dictionary':
              iconName = 'book';
              break;
            case 'Games':
              iconName = 'games';
              break;
            case 'Friends':
              iconName = 'group';
              break;
            case 'Vocabulary':
              iconName = 'library-books';
              break;
            case 'Progress':
              iconName = 'trending-up';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'WordAlpha'}}
      />
      <Tab.Screen
        name="Dictionary"
        component={DictionaryScreen}
        options={{title: 'Dictionary'}}
      />
      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{title: 'Word Games'}}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{title: 'Friends'}}
      />
      <Tab.Screen
        name="Vocabulary"
        component={VocabularyScreen}
        options={{title: 'My Vocabulary'}}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{title: 'Progress'}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="MultiplayerLobby"
            component={MultiplayerLobbyScreen}
            options={{
              headerShown: true,
              title: 'Multiplayer Games',
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="CategoryChallenge"
            component={CategoryChallengeScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
