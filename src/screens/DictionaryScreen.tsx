import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Text,
  Card,
  Button,
  Searchbar,
  Avatar,
  Divider,
  useTheme,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

interface WordDefinition {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
}

const DictionaryScreen: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<WordDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock word data - in a real app, this would come from an API
  const mockWord: WordDefinition = {
    word: 'Eloquent',
    pronunciation: '/ˈɛləkwənt/',
    partOfSpeech: 'adjective',
    definition: 'Fluent or persuasive in speaking or writing.',
    example: 'She was eloquent in her defense of the controversial policy.',
    synonyms: ['articulate', 'persuasive', 'fluent', 'expressive'],
    antonyms: ['inarticulate', 'tongue-tied', 'hesitant'],
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setSearchResult(mockWord);
        setIsLoading(false);
      }, 1000);
    }
  };

  const addToVocabulary = () => {
    // Add word to user's vocabulary
    console.log('Adding to vocabulary:', searchResult?.word);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for a word..."
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {searchResult && (
          <Card style={styles.resultCard}>
            <Card.Title
              title={searchResult.word}
              subtitle={searchResult.pronunciation}
              left={props => <Avatar.Icon {...props} icon="book-open" />}
              right={props => (
                <Button mode="outlined" icon="heart" onPress={addToVocabulary}>
                  Save
                </Button>
              )}
            />
            <Card.Content>
              <View style={styles.partOfSpeechContainer}>
                <Text
                  variant="bodySmall"
                  style={[styles.partOfSpeech, {color: theme.colors.primary}]}>
                  {searchResult.partOfSpeech}
                </Text>
              </View>

              <Text variant="bodyLarge" style={styles.definition}>
                {searchResult.definition}
              </Text>

              <Divider style={styles.divider} />

              <Text variant="titleSmall" style={styles.sectionTitle}>
                Example:
              </Text>
              <Text variant="bodyMedium" style={styles.example}>
                "{searchResult.example}"
              </Text>

              {searchResult.synonyms.length > 0 && (
                <>
                  <Divider style={styles.divider} />
                  <Text variant="titleSmall" style={styles.sectionTitle}>
                    Synonyms:
                  </Text>
                  <Text variant="bodyMedium" style={styles.wordList}>
                    {searchResult.synonyms.join(', ')}
                  </Text>
                </>
              )}

              {searchResult.antonyms.length > 0 && (
                <>
                  <Divider style={styles.divider} />
                  <Text variant="titleSmall" style={styles.sectionTitle}>
                    Antonyms:
                  </Text>
                  <Text variant="bodyMedium" style={styles.wordList}>
                    {searchResult.antonyms.join(', ')}
                  </Text>
                </>
              )}
            </Card.Content>
          </Card>
        )}

        {!searchResult && !isLoading && (
          <Card style={styles.placeholderCard}>
            <Card.Content style={styles.placeholderContent}>
              <Avatar.Icon size={64} icon="magnify" />
              <Text variant="headlineSmall" style={styles.placeholderTitle}>
                Search for Words
              </Text>
              <Text variant="bodyMedium" style={styles.placeholderText}>
                Enter a word in the search bar above to get its definition,
                pronunciation, and more.
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  searchbar: {
    flex: 1,
  },
  searchButton: {
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  resultCard: {
    marginBottom: 16,
  },
  partOfSpeechContainer: {
    marginBottom: 8,
  },
  partOfSpeech: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  definition: {
    marginBottom: 16,
    lineHeight: 22,
  },
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  example: {
    fontStyle: 'italic',
    marginBottom: 12,
  },
  wordList: {
    marginBottom: 12,
  },
  placeholderCard: {
    marginTop: 32,
  },
  placeholderContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  placeholderTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default DictionaryScreen;
