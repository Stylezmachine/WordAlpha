import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Avatar,
  useTheme,
  ProgressBar,
  Chip,
  IconButton,
  Divider,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../services/AuthContext';
import {GameRoom, GamePlayer, CategoryAnswers} from '../types/User';

interface CategoryChallengeScreenProps {
  navigation: any;
  route: any;
}

const CategoryChallengeScreen: React.FC<CategoryChallengeScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const {user} = useAuth();
  const {gameRoom: initialGameRoom} = route.params || {};

  const [gameRoom, setGameRoom] = useState<GameRoom | null>(initialGameRoom);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute per round
  const [answers, setAnswers] = useState<CategoryAnswers>({
    names: '',
    animals: '',
    places: '',
    things: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<GamePlayer | null>(null);

  useEffect(() => {
    if (gameRoom && user) {
      const player = gameRoom.players.find(p => p.userId === user.uid);
      setCurrentPlayer(player || null);
    }
  }, [gameRoom, user]);

  useEffect(() => {
    if (gameRoom?.gameState === 'playing' && timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitAnswers();
    }
  }, [timeLeft, isSubmitted, gameRoom?.gameState]);

  const categories = [
    {
      id: 'names',
      title: 'Names',
      description: 'First names of people',
      placeholder: 'e.g., Alice, Bob...',
      icon: 'account',
    },
    {
      id: 'animals',
      title: 'Animals',
      description: 'Any type of animal',
      placeholder: 'e.g., Elephant, Bird...',
      icon: 'paw',
    },
    {
      id: 'places',
      title: 'Places',
      description: 'Cities, countries, landmarks',
      placeholder: 'e.g., Paris, Australia...',
      icon: 'map-marker',
    },
    {
      id: 'things',
      title: 'Things',
      description: 'Objects, items, concepts',
      placeholder: 'e.g., Apple, Book...',
      icon: 'cube-outline',
    },
  ];

  const getRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  };

  const handleStartGame = () => {
    if (!gameRoom) {
      return;
    }

    const newLetter = getRandomLetter();
    const updatedGameRoom: GameRoom = {
      ...gameRoom,
      gameState: 'playing',
      currentLetter: newLetter,
      startedAt: new Date().toISOString(),
    };

    setGameRoom(updatedGameRoom);
    setTimeLeft(60);
    setAnswers({names: '', animals: '', places: '', things: ''});
    setIsSubmitted(false);

    // In real app, update Firebase
    Alert.alert('Game Started!', `Your letter is: ${newLetter}`);
  };

  const handleSubmitAnswers = () => {
    if (!gameRoom || !currentPlayer) {
      return;
    }

    setIsSubmitted(true);

    // Calculate score based on valid answers
    const score = calculateScore(answers, gameRoom.currentLetter || '');

    // In real app, submit to Firebase
    Alert.alert(
      'Answers Submitted!',
      `Your score for this round: ${score} points\n\nWaiting for other players...`,
    );

    // Mock: Show results after 2 seconds
    setTimeout(() => {
      showRoundResults();
    }, 2000);
  };

  const calculateScore = (answers: CategoryAnswers, letter: string): number => {
    let score = 0;
    const letterLower = letter.toLowerCase();

    Object.entries(answers).forEach(([category, answer]) => {
      if (answer.trim() && answer.toLowerCase().startsWith(letterLower)) {
        score += 10; // 10 points per valid answer
      }
    });

    return score;
  };

  const showRoundResults = () => {
    if (!gameRoom) {
      return;
    }

    // Mock results
    const results = gameRoom.players.map(player => ({
      ...player,
      roundScore: Math.floor(Math.random() * 40) + 10, // Random score 10-50
    }));

    const resultText = results
      .sort((a, b) => b.roundScore - a.roundScore)
      .map(
        (player, index) =>
          `${index + 1}. ${player.displayName}: ${player.roundScore} pts`,
      )
      .join('\n');

    Alert.alert(
      'Round Results',
      `Letter: ${gameRoom.currentLetter}\n\n${resultText}`,
      [
        {
          text: 'Next Round',
          onPress: () => {
            if (gameRoom.currentRound < gameRoom.maxRounds) {
              startNextRound();
            } else {
              endGame();
            }
          },
        },
      ],
    );
  };

  const startNextRound = () => {
    if (!gameRoom) {
      return;
    }

    const updatedGameRoom: GameRoom = {
      ...gameRoom,
      currentRound: gameRoom.currentRound + 1,
      currentLetter: getRandomLetter(),
    };

    setGameRoom(updatedGameRoom);
    setTimeLeft(60);
    setAnswers({names: '', animals: '', places: '', things: ''});
    setIsSubmitted(false);
  };

  const endGame = () => {
    if (!gameRoom) {
      return;
    }

    // Calculate final scores
    const finalResults = gameRoom.players.map(player => ({
      ...player,
      finalScore: Math.floor(Math.random() * 200) + 100, // Random final score
    }));

    const winner = finalResults.reduce((prev, current) =>
      prev.finalScore > current.finalScore ? prev : current,
    );

    Alert.alert(
      'Game Over!',
      `🏆 Winner: ${winner.displayName}\n\nFinal Scores:\n${finalResults
        .sort((a, b) => b.finalScore - a.finalScore)
        .map(
          (player, index) =>
            `${index + 1}. ${player.displayName}: ${player.finalScore} pts`,
        )
        .join('\n')}`,
      [
        {
          text: 'Play Again',
          onPress: () => {
            // Reset game
            const resetGameRoom: GameRoom = {
              ...gameRoom,
              gameState: 'waiting',
              currentRound: 1,
              currentLetter: '',
            };
            setGameRoom(resetGameRoom);
          },
        },
        {
          text: 'Exit',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const handleAnswerChange = (
    category: keyof CategoryAnswers,
    value: string,
  ) => {
    setAnswers(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getValidationColor = (answer: string, letter: string) => {
    if (!answer.trim()) {
      return theme.colors.outline;
    }
    if (answer.toLowerCase().startsWith(letter.toLowerCase())) {
      return theme.colors.primary;
    }
    return theme.colors.error;
  };

  if (!gameRoom) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.errorContainer}>
          <Avatar.Icon size={64} icon="alert-circle-outline" />
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Game Not Found
          </Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Game Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.gameHeader}>
              <View style={styles.gameInfo}>
                <Text variant="headlineSmall">Category Challenge</Text>
                <Text variant="bodyMedium">
                  Round {gameRoom.currentRound} of {gameRoom.maxRounds}
                </Text>
              </View>
              <IconButton
                icon="close"
                mode="outlined"
                onPress={() => navigation.goBack()}
              />
            </View>

            {gameRoom.gameState === 'playing' && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.timerSection}>
                  <Text variant="headlineLarge" style={styles.letter}>
                    {gameRoom.currentLetter}
                  </Text>
                  <View style={styles.timerContainer}>
                    <Text variant="titleLarge" style={styles.timer}>
                      {formatTime(timeLeft)}
                    </Text>
                    <ProgressBar
                      progress={(60 - timeLeft) / 60}
                      style={styles.progressBar}
                    />
                  </View>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Players */}
        <Card style={styles.playersCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Players ({gameRoom.players.length})
            </Text>
            <View style={styles.playersList}>
              {gameRoom.players.map(player => (
                <View key={player.userId} style={styles.playerItem}>
                  <Avatar.Text
                    size={32}
                    label={player.displayName.slice(0, 2)}
                  />
                  <Text variant="bodyMedium" style={styles.playerName}>
                    {player.displayName}
                  </Text>
                  {gameRoom.gameState === 'waiting' && (
                    <Chip
                      mode={player.isReady ? 'flat' : 'outlined'}
                      icon={player.isReady ? 'check' : 'clock-outline'}>
                      {player.isReady ? 'Ready' : 'Waiting'}
                    </Chip>
                  )}
                  {gameRoom.gameState === 'playing' && (
                    <Text variant="bodySmall">Score: {player.score}</Text>
                  )}
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Game Content */}
        {gameRoom.gameState === 'waiting' && (
          <Card style={styles.waitingCard}>
            <Card.Content style={styles.waitingContent}>
              <Avatar.Icon size={64} icon="timer-sand" />
              <Text variant="headlineSmall" style={styles.waitingTitle}>
                Waiting for Players
              </Text>
              <Text variant="bodyMedium" style={styles.waitingText}>
                Game will start when all players are ready
              </Text>
              {gameRoom.hostId === user?.uid && (
                <Button
                  mode="contained"
                  onPress={handleStartGame}
                  style={styles.startButton}>
                  Start Game
                </Button>
              )}
            </Card.Content>
          </Card>
        )}

        {gameRoom.gameState === 'playing' && (
          <Card style={styles.gameCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Fill in words starting with "{gameRoom.currentLetter}"
              </Text>
              <Text variant="bodySmall" style={styles.instructionText}>
                Enter one word for each category. Make sure it starts with the
                given letter!
              </Text>

              {categories.map(category => (
                <View key={category.id} style={styles.categoryContainer}>
                  <View style={styles.categoryHeader}>
                    <Avatar.Icon size={32} icon={category.icon} />
                    <View style={styles.categoryInfo}>
                      <Text variant="titleSmall">{category.title}</Text>
                      <Text
                        variant="bodySmall"
                        style={styles.categoryDescription}>
                        {category.description}
                      </Text>
                    </View>
                  </View>
                  <TextInput
                    mode="outlined"
                    placeholder={category.placeholder}
                    value={answers[category.id as keyof CategoryAnswers]}
                    onChangeText={value =>
                      handleAnswerChange(
                        category.id as keyof CategoryAnswers,
                        value,
                      )
                    }
                    disabled={isSubmitted}
                    style={[
                      styles.categoryInput,
                      {
                        borderColor: getValidationColor(
                          answers[category.id as keyof CategoryAnswers] || '',
                          gameRoom.currentLetter || '',
                        ),
                      },
                    ]}
                    autoCapitalize="words"
                  />
                </View>
              ))}

              {!isSubmitted ? (
                <Button
                  mode="contained"
                  onPress={handleSubmitAnswers}
                  style={styles.submitButton}
                  disabled={timeLeft === 0}>
                  Submit Answers
                </Button>
              ) : (
                <Card style={styles.submittedCard}>
                  <Card.Content style={styles.submittedContent}>
                    <Avatar.Icon size={48} icon="check-circle" />
                    <Text variant="titleMedium">Answers Submitted!</Text>
                    <Text variant="bodyMedium">
                      Waiting for other players to finish...
                    </Text>
                  </Card.Content>
                </Card>
              )}
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
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    marginVertical: 16,
    textAlign: 'center',
  },
  headerCard: {
    marginBottom: 16,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gameInfo: {
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  letter: {
    fontWeight: 'bold',
    color: '#6366f1',
    fontSize: 48,
  },
  timerContainer: {
    flex: 1,
    marginLeft: 24,
  },
  timer: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  playersCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  playersList: {
    gap: 12,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playerName: {
    flex: 1,
  },
  waitingCard: {
    marginBottom: 16,
  },
  waitingContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  waitingTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  waitingText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  startButton: {
    minWidth: 120,
  },
  gameCard: {
    marginBottom: 16,
  },
  instructionText: {
    opacity: 0.7,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryDescription: {
    opacity: 0.7,
  },
  categoryInput: {
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 16,
  },
  submittedCard: {
    marginTop: 16,
    backgroundColor: '#f0f9ff',
  },
  submittedContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});

export default CategoryChallengeScreen;
