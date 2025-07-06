import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Button, Avatar, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const theme = useTheme();

  const todayWord = {
    word: 'Serendipity',
    definition:
      'The occurrence and development of events by chance in a happy or beneficial way.',
    pronunciation: '/ˌsɛrənˈdɪpɪti/',
    example:
      'A fortunate stroke of serendipity brought the two old friends together.',
  };

  const stats = {
    wordsLearned: 142,
    streak: 7,
    level: 5,
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <View style={styles.welcomeHeader}>
              <Avatar.Icon size={64} icon="account" />
              <View style={styles.welcomeText}>
                <Text variant="headlineMedium">Welcome back!</Text>
                <Text
                  variant="bodyMedium"
                  style={{color: theme.colors.outline}}>
                  Ready to expand your vocabulary?
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text
                variant="displaySmall"
                style={{color: theme.colors.primary}}>
                {stats.wordsLearned}
              </Text>
              <Text variant="bodySmall">Words Learned</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text
                variant="displaySmall"
                style={{color: theme.colors.secondary}}>
                {stats.streak}
              </Text>
              <Text variant="bodySmall">Day Streak</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text
                variant="displaySmall"
                style={{color: theme.colors.tertiary}}>
                {stats.level}
              </Text>
              <Text variant="bodySmall">Level</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Word of the Day */}
        <Card style={styles.wordCard}>
          <Card.Title
            title="Word of the Day"
            left={props => <Avatar.Icon {...props} icon="star" />}
          />
          <Card.Content>
            <Text variant="headlineSmall" style={styles.todayWord}>
              {todayWord.word}
            </Text>
            <Text variant="bodySmall" style={styles.pronunciation}>
              {todayWord.pronunciation}
            </Text>
            <Text variant="bodyMedium" style={styles.definition}>
              {todayWord.definition}
            </Text>
            <Text variant="bodySmall" style={styles.example}>
              "{todayWord.example}"
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => console.log('Learn more')}>
              Learn More
            </Button>
            <Button onPress={() => console.log('Add to vocabulary')}>
              Add to Vocabulary
            </Button>
          </Card.Actions>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon="book-open"
            style={styles.actionButton}
            onPress={() => console.log('Dictionary')}>
            Dictionary
          </Button>
          <Button
            mode="contained"
            icon="puzzle"
            style={styles.actionButton}
            onPress={() => console.log('Games')}>
            Word Games
          </Button>
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
    padding: 16,
    gap: 16,
  },
  welcomeCard: {
    marginBottom: 8,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  welcomeText: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
  },
  wordCard: {
    marginVertical: 8,
  },
  todayWord: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pronunciation: {
    fontStyle: 'italic',
    marginBottom: 8,
  },
  definition: {
    marginBottom: 8,
    lineHeight: 20,
  },
  example: {
    fontStyle: 'italic',
    opacity: 0.8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});

export default HomeScreen;
