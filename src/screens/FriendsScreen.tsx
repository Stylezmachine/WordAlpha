import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {
  Text,
  Card,
  Button,
  Searchbar,
  Avatar,
  Chip,
  IconButton,
  Badge,
  useTheme,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../services/AuthContext';
import {FriendProfile, FriendRequest} from '../types/User';

const FriendsScreen: React.FC = () => {
  const theme = useTheme();
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>(
    'friends',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - In real app, this would come from Firebase
  useEffect(() => {
    // Mock friends data
    setFriends([
      {
        uid: '1',
        displayName: 'Alice Smith',
        avatar: undefined,
        isOnline: true,
        lastActive: new Date().toISOString(),
        stats: {
          totalGamesPlayed: 25,
          gamesWon: 18,
          wordsLearned: 150,
          currentStreak: 5,
          longestStreak: 12,
          totalScore: 2500,
          averageScore: 100,
        },
      },
      {
        uid: '2',
        displayName: 'Bob Johnson',
        avatar: undefined,
        isOnline: false,
        lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        stats: {
          totalGamesPlayed: 15,
          gamesWon: 8,
          wordsLearned: 95,
          currentStreak: 2,
          longestStreak: 7,
          totalScore: 1200,
          averageScore: 80,
        },
      },
    ]);

    // Mock friend requests
    setFriendRequests([
      {
        id: '1',
        fromUserId: '3',
        fromUserName: 'Charlie Brown',
        toUserId: user?.uid || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    // Mock search results - In real app, search Firebase users collection
    setTimeout(() => {
      setSearchResults([
        {
          uid: '4',
          displayName: 'David Wilson',
          avatar: undefined,
          isOnline: true,
          lastActive: new Date().toISOString(),
          stats: {
            totalGamesPlayed: 10,
            gamesWon: 6,
            wordsLearned: 75,
            currentStreak: 3,
            longestStreak: 5,
            totalScore: 800,
            averageScore: 80,
          },
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const sendFriendRequest = async (userId: string, userName: string) => {
    try {
      // In real app, add to Firebase
      Alert.alert('Success', `Friend request sent to ${userName}`);
      // Remove from search results after sending request
      setSearchResults(prev => prev.filter(user => user.uid !== userId));
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      // In real app, update Firebase
      const request = friendRequests.find(req => req.id === requestId);
      if (request) {
        Alert.alert(
          'Success',
          `You are now friends with ${request.fromUserName}`,
        );
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    try {
      // In real app, update Firebase
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      Alert.alert('Success', 'Friend request declined');
    } catch (error) {
      Alert.alert('Error', 'Failed to decline friend request');
    }
  };

  const inviteToGame = (friendId: string, friendName: string) => {
    Alert.alert(
      'Invite to Game',
      `Invite ${friendName} to play Category Challenge?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Invite',
          onPress: () => {
            // Navigate to game creation with friend
            Alert.alert('Success', `Game invitation sent to ${friendName}`);
          },
        },
      ],
    );
  };

  const getLastActiveText = (lastActive: string) => {
    const diff = Date.now() - new Date(lastActive).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    return `${days}d ago`;
  };

  const renderFriend = ({item: friend}: {item: FriendProfile}) => (
    <Card style={styles.friendCard}>
      <Card.Content>
        <View style={styles.friendHeader}>
          <View style={styles.friendInfo}>
            <View style={styles.avatarContainer}>
              <Avatar.Text size={48} label={friend.displayName.slice(0, 2)} />
              {friend.isOnline && <Badge style={styles.onlineBadge} />}
            </View>
            <View style={styles.friendDetails}>
              <Text variant="titleMedium">{friend.displayName}</Text>
              <Text variant="bodySmall" style={{color: theme.colors.outline}}>
                {friend.isOnline
                  ? 'Online'
                  : getLastActiveText(friend.lastActive)}
              </Text>
              <Text variant="bodySmall">
                Won {friend.stats.gamesWon}/{friend.stats.totalGamesPlayed}{' '}
                games
              </Text>
            </View>
          </View>
          <View style={styles.friendActions}>
            <IconButton
              icon="gamepad-variant"
              mode="contained"
              onPress={() => inviteToGame(friend.uid, friend.displayName)}
            />
            <IconButton
              icon="message"
              mode="outlined"
              onPress={() =>
                Alert.alert('Coming Soon', 'Chat feature coming soon!')
              }
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderFriendRequest = ({item: request}: {item: FriendRequest}) => (
    <Card style={styles.requestCard}>
      <Card.Content>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <Avatar.Text size={40} label={request.fromUserName.slice(0, 2)} />
            <View style={styles.requestDetails}>
              <Text variant="titleMedium">{request.fromUserName}</Text>
              <Text variant="bodySmall" style={{color: theme.colors.outline}}>
                Wants to be friends
              </Text>
            </View>
          </View>
          <View style={styles.requestActions}>
            <Button
              mode="contained"
              onPress={() => acceptFriendRequest(request.id)}
              style={styles.acceptButton}>
              Accept
            </Button>
            <Button
              mode="outlined"
              onPress={() => declineFriendRequest(request.id)}
              style={styles.declineButton}>
              Decline
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSearchResult = ({item: user}: {item: FriendProfile}) => (
    <Card style={styles.searchCard}>
      <Card.Content>
        <View style={styles.searchHeader}>
          <View style={styles.searchInfo}>
            <Avatar.Text size={40} label={user.displayName.slice(0, 2)} />
            <View style={styles.searchDetails}>
              <Text variant="titleMedium">{user.displayName}</Text>
              <Text variant="bodySmall" style={{color: theme.colors.outline}}>
                Level: {Math.floor(user.stats.totalScore / 1000) + 1}
              </Text>
            </View>
          </View>
          <Button
            mode="contained"
            onPress={() => sendFriendRequest(user.uid, user.displayName)}>
            Add Friend
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header with tabs */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Friends
        </Text>
        <View style={styles.tabContainer}>
          <Chip
            selected={activeTab === 'friends'}
            onPress={() => setActiveTab('friends')}
            style={styles.tab}>
            Friends ({friends.length})
          </Chip>
          <Chip
            selected={activeTab === 'requests'}
            onPress={() => setActiveTab('requests')}
            style={styles.tab}>
            Requests ({friendRequests.length})
          </Chip>
          <Chip
            selected={activeTab === 'search'}
            onPress={() => setActiveTab('search')}
            style={styles.tab}>
            Add Friends
          </Chip>
        </View>
      </View>

      {/* Search bar for Add Friends tab */}
      {activeTab === 'search' && (
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search by username or email..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            style={styles.searchbar}
          />
          <Button
            mode="contained"
            onPress={handleSearch}
            loading={isLoading}
            disabled={!searchQuery.trim()}
            style={styles.searchButton}>
            Search
          </Button>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'friends' && (
          <>
            {friends.length > 0 ? (
              <FlatList
                data={friends}
                renderItem={renderFriend}
                keyExtractor={item => item.uid}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <Avatar.Icon size={64} icon="account-multiple-outline" />
                  <Text variant="headlineSmall" style={styles.emptyTitle}>
                    No Friends Yet
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Add friends to play multiplayer games together!
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => setActiveTab('search')}
                    style={styles.emptyButton}>
                    Find Friends
                  </Button>
                </Card.Content>
              </Card>
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {friendRequests.length > 0 ? (
              <FlatList
                data={friendRequests}
                renderItem={renderFriendRequest}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <Avatar.Icon size={64} icon="account-clock-outline" />
                  <Text variant="headlineSmall" style={styles.emptyTitle}>
                    No Friend Requests
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Friend requests will appear here when someone wants to
                    connect with you.
                  </Text>
                </Card.Content>
              </Card>
            )}
          </>
        )}

        {activeTab === 'search' && (
          <>
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={item => item.uid}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : searchQuery && !isLoading ? (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <Avatar.Icon size={64} icon="account-search-outline" />
                  <Text variant="headlineSmall" style={styles.emptyTitle}>
                    No Users Found
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Try searching with a different username or email.
                  </Text>
                </Card.Content>
              </Card>
            ) : !searchQuery ? (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <Avatar.Icon size={64} icon="magnify" />
                  <Text variant="headlineSmall" style={styles.emptyTitle}>
                    Find New Friends
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptyText}>
                    Search for other players by their username or email to send
                    friend requests.
                  </Text>
                </Card.Content>
              </Card>
            ) : null}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    gap: 8,
  },
  searchbar: {
    flex: 1,
  },
  searchButton: {
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  friendCard: {
    marginBottom: 12,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
  },
  friendDetails: {
    flex: 1,
  },
  friendActions: {
    flexDirection: 'row',
    gap: 4,
  },
  requestCard: {
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestDetails: {
    flex: 1,
    marginLeft: 12,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    minWidth: 80,
  },
  declineButton: {
    minWidth: 80,
  },
  searchCard: {
    marginBottom: 12,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchDetails: {
    flex: 1,
    marginLeft: 12,
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
});

export default FriendsScreen;
