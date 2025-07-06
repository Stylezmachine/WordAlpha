import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Avatar, ProgressBar, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
}

const ProgressScreen: React.FC = () => {
  const theme = useTheme();

  const stats = {
    totalWords: 142,
    masteredWords: 89,
    currentStreak: 7,
    longestStreak: 15,
    timeStudied: 24, // hours
    gamesPlayed: 35,
    currentLevel: 5,
    nextLevelProgress: 0.7,
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Add your first word to vocabulary',
      icon: 'star',
      unlocked: true,
    },
    {
      id: '2',
      title: 'Word Collector',
      description: 'Add 50 words to your vocabulary',
      icon: 'book-multiple',
      unlocked: true,
    },
    {
      id: '3',
      title: 'Master Learner',
      description: 'Master 25 words',
      icon: 'school',
      unlocked: true,
    },
    {
      id: '4',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: 'fire',
      unlocked: true,
    },
    {
      id: '5',
      title: 'Game Master',
      description: 'Play 50 vocabulary games',
      icon: 'gamepad-variant',
      unlocked: false,
      progress: 0.7,
    },
    {
      id: '6',
      title: 'Vocabulary Expert',
      description: 'Add 200 words to vocabulary',
      icon: 'trophy',
      unlocked: false,
      progress: 0.71,
    },
  ];

  const weeklyData = [
    {day: 'Mon', words: 5},
    {day: 'Tue', words: 8},
    {day: 'Wed', words: 3},
    {day: 'Thu', words: 7},
    {day: 'Fri', words: 6},
    {day: 'Sat', words: 4},
    {day: 'Sun', words: 2},
  ];

  const masteryPercentage = (stats.masteredWords / stats.totalWords) * 100;

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Level Progress */}
        <Card style={styles.levelCard}>
          <Card.Content>
            <View style={styles.levelHeader}>
              <Avatar.Icon size={64} icon="medal" />
              <View style={styles.levelInfo}>
                <Text variant="headlineMedium">Level {stats.currentLevel}</Text>
                <Text
                  variant="bodyMedium"
                  style={{color: theme.colors.outline}}>
                  {Math.round(stats.nextLevelProgress * 100)}% to next level
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={stats.nextLevelProgress}
              style={styles.levelProgress}
              color={theme.colors.primary}
            />
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Avatar.Icon
                size={40}
                icon="book"
                style={{backgroundColor: theme.colors.primary}}
              />
              <Text variant="titleLarge" style={styles.statNumber}>
                {stats.totalWords}
              </Text>
              <Text variant="bodySmall">Total Words</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Avatar.Icon
                size={40}
                icon="check-circle"
                style={{backgroundColor: theme.colors.tertiary}}
              />
              <Text variant="titleLarge" style={styles.statNumber}>
                {stats.masteredWords}
              </Text>
              <Text variant="bodySmall">Mastered</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Avatar.Icon
                size={40}
                icon="fire"
                style={{backgroundColor: theme.colors.secondary}}
              />
              <Text variant="titleLarge" style={styles.statNumber}>
                {stats.currentStreak}
              </Text>
              <Text variant="bodySmall">Day Streak</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Avatar.Icon
                size={40}
                icon="clock"
                style={{backgroundColor: theme.colors.outline}}
              />
              <Text variant="titleLarge" style={styles.statNumber}>
                {stats.timeStudied}h
              </Text>
              <Text variant="bodySmall">Time Studied</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Mastery Progress */}
        <Card style={styles.masteryCard}>
          <Card.Title
            title="Vocabulary Mastery"
            left={props => <Avatar.Icon {...props} icon="chart-line" />}
          />
          <Card.Content>
            <View style={styles.masteryInfo}>
              <Text variant="bodyLarge">
                {masteryPercentage.toFixed(1)}% Complete
              </Text>
              <Text variant="bodyMedium" style={{color: theme.colors.outline}}>
                {stats.masteredWords} of {stats.totalWords} words mastered
              </Text>
            </View>
            <ProgressBar
              progress={masteryPercentage / 100}
              style={styles.masteryProgress}
              color={theme.colors.tertiary}
            />
          </Card.Content>
        </Card>

        {/* Weekly Activity */}
        <Card style={styles.activityCard}>
          <Card.Title
            title="This Week's Activity"
            left={props => <Avatar.Icon {...props} icon="calendar-week" />}
          />
          <Card.Content>
            <View style={styles.weeklyChart}>
              {weeklyData.map((data, index) => (
                <View key={data.day} style={styles.dayColumn}>
                  <View
                    style={[
                      styles.dayBar,
                      {
                        height: Math.max(data.words * 8, 4),
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                  <Text variant="bodySmall" style={styles.dayLabel}>
                    {data.day}
                  </Text>
                  <Text variant="bodySmall" style={styles.dayCount}>
                    {data.words}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Achievements */}
        <Card style={styles.achievementsCard}>
          <Card.Title
            title="Achievements"
            left={props => <Avatar.Icon {...props} icon="trophy" />}
          />
          <Card.Content>
            <View style={styles.achievementsGrid}>
              {achievements.map(achievement => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <Avatar.Icon
                    size={48}
                    icon={achievement.icon}
                    style={[
                      styles.achievementIcon,
                      {
                        backgroundColor: achievement.unlocked
                          ? theme.colors.primary
                          : theme.colors.outline,
                      },
                    ]}
                  />
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.achievementTitle,
                      {opacity: achievement.unlocked ? 1 : 0.6},
                    ]}>
                    {achievement.title}
                  </Text>
                  {achievement.progress && !achievement.unlocked && (
                    <ProgressBar
                      progress={achievement.progress}
                      style={styles.achievementProgress}
                      color={theme.colors.primary}
                    />
                  )}
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
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
  levelCard: {
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelProgress: {
    height: 8,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  statContent: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontWeight: 'bold',
  },
  masteryCard: {
    marginBottom: 16,
  },
  masteryInfo: {
    marginBottom: 12,
  },
  masteryProgress: {
    height: 8,
    borderRadius: 4,
  },
  activityCard: {
    marginBottom: 16,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 20,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayBar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  dayLabel: {
    marginBottom: 4,
  },
  dayCount: {
    fontWeight: 'bold',
  },
  achievementsCard: {
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  achievementItem: {
    alignItems: 'center',
    width: '30%',
    minWidth: 80,
  },
  achievementIcon: {
    marginBottom: 8,
  },
  achievementTitle: {
    textAlign: 'center',
    fontSize: 11,
    marginBottom: 4,
  },
  achievementProgress: {
    height: 4,
    width: '100%',
    borderRadius: 2,
  },
});

export default ProgressScreen;
