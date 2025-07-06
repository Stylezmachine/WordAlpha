import React, {createContext, useContext, useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {User, UserStats} from '../types/User';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      async (firebaseUser: FirebaseAuthTypes.User | null) => {
        if (firebaseUser) {
          try {
            const userDoc = await firestore()
              .collection('users')
              .doc(firebaseUser.uid)
              .get();

            if (userDoc.exists) {
              const userData = userDoc.data() as User;
              setUser(userData);

              // Update last active timestamp
              await firestore()
                .collection('users')
                .doc(firebaseUser.uid)
                .update({
                  lastActive: new Date().toISOString(),
                });
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<void> => {
    try {
      const {user: firebaseUser} = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const defaultStats: UserStats = {
        totalGamesPlayed: 0,
        gamesWon: 0,
        wordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalScore: 0,
        averageScore: 0,
      };

      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        stats: defaultStats,
        friends: [],
        friendRequests: [],
      };

      await firestore().collection('users').doc(firebaseUser.uid).set(newUser);
      setUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await auth().signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      const updatedUser = {...user, ...updates};
      await firestore().collection('users').doc(user.uid).update(updates);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
