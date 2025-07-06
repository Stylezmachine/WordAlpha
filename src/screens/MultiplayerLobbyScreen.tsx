import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../services/AuthContext';
import {GameRoom, GamePlayer} from '../types/User';

interface MultiplayerLobbyScreenProps {
  navigation: any;
}

const MultiplayerLobbyScreen: React.FC<MultiplayerLobbyScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState<'lobby' | 'myGames'>('lobby');
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([]);
  const [myGames, setMyGames] = useState<GameRoom[]>([]);
  const [createGameVisible, setCreateGameVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [maxRounds, setMaxRounds] = useState('3');

  useEffect(() => {
    // Mock game rooms - In real app, this would come from Firebase
    setGameRooms([
      {
        id: 'room1',
        hostId: 'host1',
        hostName: 'Alice Smith',
        players: [
          {
            userId: 'host1',
            displayName: 'Alice Smith',
            score: 0,
            isReady: true,
          },
          {
            userId: 'player2',
            displayName: 'Bob Johnson',
            score: 0,
            isReady: false,
          },
        ],
        gameState: 'waiting',
        gameType: 'category-challenge',
        currentRound: 1,
        maxRounds: 3,
        currentLetter: '',
        categories: [],
        rounds: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'room2',
        hostId: 'host2',
        hostName: 'Charlie Brown',
        players: [
          {
            userId: 'host2',
            displayName: 'Charlie Brown',
            score: 0,
            isReady: true,
          },
        ],
        gameState: 'waiting',
        gameType: 'category-challenge',
        currentRound: 1,
        maxRounds: 5,
        currentLetter: '',
        categories: [],
        rounds: [],
        createdAt: new Date().toISOString(),
      },
    ]);

    // Mock user's games
    setMyGames([]);
  }, []);

  const createGame = async () => {
    if (!user || !roomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }

    const roundCount = parseInt(maxRounds);
    if (isNaN(roundCount) || roundCount < 1 || roundCount > 10) {
      Alert.alert('Error', 'Rounds must be between 1 and 10');
      return;
    }

    const newGameRoom: GameRoom = {
      id: `room_${Date.now()}`,
      hostId: user.uid,
      hostName: user.displayName,
      players: [
        {
          userId: user.uid,
          displayName: user.displayName,
          score: 0,
          isReady: true,
        },
      ],
      gameState: 'waiting',
      gameType: 'category-challenge',
      currentRound: 1,
      maxRounds: roundCount,
      currentLetter: '',
      categories: [],
      rounds: [],
      createdAt: new Date().toISOString(),
    };

    // In real app, create room in Firebase
    setMyGames(prev => [newGameRoom, ...prev]);
    setCreateGameVisible(false);
    setRoomName('');
    setMaxRounds('3');

    // Navigate to game
    navigation.navigate('CategoryChallenge', {gameRoom: newGameRoom});
  };

  const joinGame = async (gameRoom: GameRoom) => {
    if (!user) {
      return;
    }

    // Check if room is full (max 4 players)
    if (gameRoom.players.length >= 4) {
      Alert.alert('Error', 'This game room is full');
      return;
    }

    // Check if already in game
    if (gameRoom.players.some(p => p.userId === user.uid)) {
      // Navigate back to existing game
      navigation.navigate('CategoryChallenge', {gameRoom});
      return;
    }

    const newPlayer: GamePlayer = {
      userId: user.uid,
      displayName: user.displayName,
      score: 0,
      isReady: false,
    };

    const updatedGameRoom: GameRoom = {
      ...gameRoom,
      players: [...gameRoom.players, newPlayer],
    };

    // In real app, update Firebase
    setGameRooms(prev =>
      prev.map(room => (room.id === gameRoom.id ? updatedGameRoom : room)),
    );

    navigation.navigate('CategoryChallenge', {gameRoom: updatedGameRoom});
  };

  const getGameStatusColor = (gameState: string) => {
    switch (gameState) {
      case 'waiting':
        return theme.colors.primary;
      case 'playing':
        return theme.colors.secondary;
      case 'finished':
        return theme.colors.outline;
      default:
        return theme.colors.outline;
    }
  };

  const getGameStatusText = (gameState: string) => {
    switch (gameState) {
      case 'waiting':
        return 'Waiting for players';
      case 'playing':
        return 'In progress';
      case 'finished':
        return 'Finished';
      default:
        return 'Unknown';
    }
  };

  const renderGameRoom = ({item: room}: {item: GameRoom}) => (
    <Card style={styles.gameCard}>
      <Card.Content>
        <View style={styles.gameHeader}>
          <View style={styles.gameInfo}>
            <Text variant="titleMedium" style={styles.hostName}>
              {room.hostName}'s Game
            </Text>
            <Text variant="bodySmall" style={{color: theme.colors.outline}}>
              {room.maxRounds} rounds • Created{' '}
              {new Date(room.createdAt).toLocaleTimeString()}
            </Text>
          </View>
          <Chip
            mode="flat"
            icon={room.gameState === 'playing' ? 'play' : 'clock-outline'}
            style={{
              backgroundColor: getGameStatusColor(room.gameState) + '20',
            }}>
            {getGameStatusText(room.gameState)}
          </Chip>
        </View>

        <View style={styles.playersSection}>
          <Text variant="bodyMedium" style={styles.playersTitle}>
            Players ({room.players.length}/4)
          </Text>
          <View style={styles.playersList}>
            {room.players.map(player => (
              <View key={player.userId} style={styles.playerChip}>
                <Avatar.Text size={24} label={player.displayName.slice(0, 2)} />
                <Text variant="bodySmall" style={styles.playerName}>
                  {player.displayName}
                </Text>
                {room.gameState === 'waiting' && (
                  <View
                    style={[
                      styles.readyIndicator,
                      {
                        backgroundColor: player.isReady
                          ? theme.colors.primary
                          : theme.colors.outline,
                      },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.gameActions}>
          <Button
            mode="contained"
            onPress={() => joinGame(room)}
            disabled={
              room.players.length >= 4 &&
              !room.players.some(p => p.userId === user?.uid)
            }
            style={styles.joinButton}>
            {room.players.some(p => p.userId === user?.uid)
              ? 'Rejoin'
              : 'Join Game'}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text variant="headlineMedium" style={styles.title}>
            Multiplayer
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Play Category Challenge with friends
          </Text>
        </View>
        <IconButton
          icon="plus"
          mode="contained"
          onPress={() => setCreateGameVisible(true)}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Chip
          selected={activeTab === 'lobby'}
          onPress={() => setActiveTab('lobby')}
          style={styles.tab}>
          Game Lobby ({gameRooms.length})
        </Chip>
        <Chip
          selected={activeTab === 'myGames'}
          onPress={() => setActiveTab('myGames')}
          style={styles.tab}>
          My Games ({myGames.length})
        </Chip>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'lobby' && (
          <>
            {gameRooms.length > 0 ? (
              <FlatList
                data={gameRooms}
                renderItem={renderGameRoom}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <Avatar.Icon size={64} icon="gamepad-variant-outline" />
                  <Text variant="headlineSmall" style={styles.emptyTitle}>
                    No Active Games
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Be the first to create a multiplayer game!
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => setCreateGameVisible(true)}
                    style={styles.emptyButton}>
                    Create Game
                  </Button>
                </Card.Content>
              </Card>
            )}
          </>
        )}

        {activeTab === 'myGames' && (
          <>
            {myGames.length > 0 ? (
              <FlatList
                data={myGames}
                renderItem={renderGameRoom}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <Avatar.Icon size={64} icon="history" />
                  <Text variant="headlineSmall" style={styles.emptyTitle}>
                    No Games Yet
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Create or join games to see them here.
                  </Text>
                </Card.Content>
              </Card>
            )}
          </>
        )}
      </View>

      {/* Create Game Dialog */}
      <Portal>
        <Dialog
          visible={createGameVisible}
          onDismiss={() => setCreateGameVisible(false)}>
          <Dialog.Title>Create New Game</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Room Name"
              value={roomName}
              onChangeText={setRoomName}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="Enter a name for your game room"
            />
            <TextInput
              label="Number of Rounds"
              value={maxRounds}
              onChangeText={setMaxRounds}
              mode="outlined"
              keyboardType="numeric"
              style={styles.dialogInput}
              placeholder="1-10 rounds"
            />
            <Text variant="bodySmall" style={styles.dialogHelper}>
              Players will compete in {maxRounds} rounds of Category Challenge.
              Each round features a random letter and 4 categories: Names,
              Animals, Places, and Things.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCreateGameVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={createGame}>
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  gameCard: {
    marginBottom: 12,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gameInfo: {
    flex: 1,
  },
  hostName: {
    fontWeight: 'bold',
  },
  playersSection: {
    marginBottom: 12,
  },
  playersTitle: {
    marginBottom: 8,
    fontWeight: '500',
  },
  playersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
  },
  playerName: {
    fontSize: 12,
  },
  readyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gameActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  joinButton: {
    minWidth: 100,
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
  dialogInput: {
    marginBottom: 12,
  },
  dialogHelper: {
    opacity: 0.7,
    lineHeight: 18,
  },
});

export default MultiplayerLobbyScreen;
