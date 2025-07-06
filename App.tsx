import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DictionaryScreen from './src/screens/DictionaryScreen';
import GamesScreen from './src/screens/GamesScreen';
import VocabularyScreen from './src/screens/VocabularyScreen';
import ProgressScreen from './src/screens/ProgressScreen';

// Theme
import {theme} from './src/theme/theme';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
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
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
