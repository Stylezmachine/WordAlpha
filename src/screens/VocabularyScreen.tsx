import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, FlatList} from 'react-native';
import {
  Text,
  Card,
  Button,
  Searchbar,
  Avatar,
  Chip,
  IconButton,
  useTheme,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dateAdded: string;
  mastered: boolean;
}

const VocabularyScreen: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  // Mock vocabulary data
  const vocabularyWords: VocabularyWord[] = [
    {
      id: '1',
      word: 'Ephemeral',
      definition: 'Lasting for a very short time',
      partOfSpeech: 'adjective',
      difficulty: 'Hard',
      dateAdded: '2024-01-15',
      mastered: false,
    },
    {
      id: '2',
      word: 'Ubiquitous',
      definition: 'Present, appearing, or found everywhere',
      partOfSpeech: 'adjective',
      difficulty: 'Medium',
      dateAdded: '2024-01-14',
      mastered: true,
    },
    {
      id: '3',
      word: 'Resilient',
      definition:
        'Able to withstand or recover quickly from difficult conditions',
      partOfSpeech: 'adjective',
      difficulty: 'Easy',
      dateAdded: '2024-01-13',
      mastered: true,
    },
    {
      id: '4',
      word: 'Eloquent',
      definition: 'Fluent or persuasive in speaking or writing',
      partOfSpeech: 'adjective',
      difficulty: 'Medium',
      dateAdded: '2024-01-12',
      mastered: false,
    },
    {
      id: '5',
      word: 'Serendipity',
      definition: 'The occurrence of events by chance in a happy way',
      partOfSpeech: 'noun',
      difficulty: 'Hard',
      dateAdded: '2024-01-11',
      mastered: false,
    },
  ];

  const filters = ['All', 'Mastered', 'Learning', 'Easy', 'Medium', 'Hard'];

  const filteredWords = vocabularyWords.filter(word => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    switch (selectedFilter) {
      case 'Mastered':
        matchesFilter = word.mastered;
        break;
      case 'Learning':
        matchesFilter = !word.mastered;
        break;
      case 'Easy':
      case 'Medium':
      case 'Hard':
        matchesFilter = word.difficulty === selectedFilter;
        break;
    }

    return matchesSearch && matchesFilter;
  });

  const toggleMastered = (wordId: string) => {
    console.log('Toggling mastered status for word:', wordId);
  };

  const removeWord = (wordId: string) => {
    console.log('Removing word:', wordId);
  };

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

  const renderWordCard = ({item: word}: {item: VocabularyWord}) => (
    <Card key={word.id} style={styles.wordCard}>
      <Card.Title
        title={word.word}
        subtitle={word.partOfSpeech}
        left={props => (
          <Avatar.Icon
            {...props}
            icon={word.mastered ? 'check-circle' : 'school'}
            style={{
              backgroundColor: word.mastered
                ? theme.colors.tertiary
                : theme.colors.outline,
            }}
          />
        )}
        right={props => (
          <View style={styles.cardActions}>
            <Chip
              style={[
                styles.difficultyChip,
                {backgroundColor: getDifficultyColor(word.difficulty)},
              ]}>
              <Text style={{color: 'white', fontSize: 10}}>
                {word.difficulty}
              </Text>
            </Chip>
            <IconButton
              icon={word.mastered ? 'star' : 'star-outline'}
              size={20}
              onPress={() => toggleMastered(word.id)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => removeWord(word.id)}
            />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.definition}>
          {word.definition}
        </Text>
        <Text variant="bodySmall" style={styles.dateAdded}>
          Added on {new Date(word.dateAdded).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Search and Filter */}
      <View style={styles.headerContainer}>
        <Searchbar
          placeholder="Search your vocabulary..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}>
          <View style={styles.filterContainer}>
            {filters.map(filter => (
              <Chip
                key={filter}
                selected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
                style={styles.filterChip}>
                {filter}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text variant="titleLarge" style={{color: theme.colors.primary}}>
              {vocabularyWords.length}
            </Text>
            <Text variant="bodySmall">Total Words</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text variant="titleLarge" style={{color: theme.colors.tertiary}}>
              {vocabularyWords.filter(w => w.mastered).length}
            </Text>
            <Text variant="bodySmall">Mastered</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text variant="titleLarge" style={{color: theme.colors.secondary}}>
              {vocabularyWords.filter(w => !w.mastered).length}
            </Text>
            <Text variant="bodySmall">Learning</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Word List */}
      {filteredWords.length > 0 ? (
        <FlatList
          data={filteredWords}
          renderItem={renderWordCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Avatar.Icon size={64} icon="book-outline" />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              {searchQuery || selectedFilter !== 'All'
                ? 'No words found'
                : 'No vocabulary yet'}
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              {searchQuery || selectedFilter !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Start adding words from the dictionary to build your vocabulary'}
            </Text>
          </Card.Content>
        </Card>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  searchbar: {
    marginBottom: 12,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  filterChip: {
    marginRight: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  wordCard: {
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyChip: {
    marginRight: 8,
  },
  definition: {
    marginBottom: 8,
    lineHeight: 20,
  },
  dateAdded: {
    opacity: 0.6,
  },
  emptyCard: {
    margin: 16,
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
  },
});

export default VocabularyScreen;
