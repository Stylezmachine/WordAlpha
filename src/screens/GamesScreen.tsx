import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Button, Avatar, Chip, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeToComplete: string;
}

const GamesScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const games: Game[] = [
    {
      id: '1',
      title: 'Word Match',
      description: 'Match words with their correct definitions',
      icon: 'puzzle',
      difficulty: 'Easy',
      timeToComplete: '5 min',
    },
    {
      id: '2',
      title: 'Synonym Hunt',
      description: 'Find synonyms for the given words',
      icon: 'magnify',
      difficulty: 'Medium',
      timeToComplete: '10 min',
    },
    {
      id: '3',
      title: 'Word Builder',
      description: 'Create words from scrambled letters',
      icon: 'format-letters',
      difficulty: 'Medium',
      timeToComplete: '8 min',
    },
    {
      id: '4',
      title: 'Etymology Quiz',
      description: 'Test your knowledge of word origins',
      icon: 'history',
      difficulty: 'Hard',
      timeToComplete: '15 min',
    },
    {
      id: '5',
      title: 'Speed Spelling',
      description: 'Spell words as fast as you can',
      icon: 'timer',
      difficulty: 'Easy',
      timeToComplete: '3 min',
    },
    {
      id: '6',
      title: 'Context Clues',
      description: 'Guess words from context in sentences',
      icon: 'lightbulb',
      difficulty: 'Hard',
      timeToComplete: '12 min',
    },
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredGames =
    selectedDifficulty === 'All'
      ? games
      : games.filter(game => game.difficulty === selectedDifficulty);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return theme.colors.tertiary;
      case 'Medium':
        return theme.colors.secondary;
      case 'Hard':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const playGame = (gameId: string) => {
    console.log('Starting game:', gameId);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <Avatar.Icon size={64} icon="gamepad-variant" />
              <View style={styles.headerText}>
                <Text variant="headlineMedium">Word Games</Text>
                <Text
                  variant="bodyMedium"
                  style={{color: theme.colors.outline}}>
                  Challenge yourself with fun vocabulary games
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Difficulty Filter */}
        <View style={styles.filterContainer}>
          <Text variant="titleMedium" style={styles.filterTitle}>
            Difficulty:
          </Text>
          <View style={styles.chipContainer}>
            {difficulties.map(difficulty => (
              <Chip
                key={difficulty}
                selected={selectedDifficulty === difficulty}
                onPress={() => setSelectedDifficulty(difficulty)}
                style={styles.chip}>
                {difficulty}
              </Chip>
            ))}
          </View>
        </View>

        {/* Games Grid */}
        <View style={styles.gamesContainer}>
          {filteredGames.map(game => (
            <Card key={game.id} style={styles.gameCard}>
              <Card.Title
                title={game.title}
                subtitle={game.timeToComplete}
                left={props => <Avatar.Icon {...props} icon={game.icon} />}
                right={props => (
                  <Chip
                    style={[
                      styles.difficultyChip,
                      {backgroundColor: getDifficultyColor(game.difficulty)},
                    ]}>
                    <Text style={{color: 'white', fontSize: 12}}>
                      {game.difficulty}
                    </Text>
                  </Chip>
                )}
              />
              <Card.Content>
                <Text variant="bodyMedium" style={styles.gameDescription}>
                  {game.description}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => playGame(game.id)}
                  style={styles.playButton}>
                  Play Now
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>

        {filteredGames.length === 0 && (
          <Card style={styles.noGamesCard}>
            <Card.Content style={styles.noGamesContent}>
              <Avatar.Icon size={64} icon="gamepad-variant-outline" />
              <Text variant="headlineSmall" style={styles.noGamesTitle}>
                No games found
              </Text>
              <Text variant="bodyMedium" style={styles.noGamesText}>
                Try selecting a different difficulty level
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterTitle: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 4,
  },
  gamesContainer: {
    gap: 16,
  },
  gameCard: {
    marginBottom: 8,
  },
  difficultyChip: {
    marginRight: 16,
    marginTop: 8,
  },
  gameDescription: {
    marginBottom: 8,
    lineHeight: 20,
  },
  playButton: {
    flex: 1,
  },
  noGamesCard: {
    marginTop: 32,
  },
  noGamesContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noGamesTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noGamesText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default GamesScreen;
