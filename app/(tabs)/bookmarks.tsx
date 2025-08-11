import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark } from 'lucide-react-native';
import { RecipeList } from '@/components/RecipeList';
import { bookmarkService } from '@/services/bookmarkService';
import { Recipe } from '@/types/recipe';

export default function BookmarksScreen() {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const bookmarks = await bookmarkService.getBookmarks();
      setBookmarkedRecipes(bookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Bookmark size={32} color="#2563eb" />
            <Text style={styles.title}>Bookmarks</Text>
          </View>
          <Text style={styles.subtitle}>
            Your favorite recipes
          </Text>
        </View>

        {bookmarkedRecipes.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Bookmark size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No bookmarks yet</Text>
            <Text style={styles.emptySubtitle}>
              Start exploring recipes and bookmark your favorites to see them here
            </Text>
          </View>
        ) : (
          <View style={styles.resultsSection}>
            <RecipeList 
              recipes={bookmarkedRecipes} 
              loading={loading}
              onBookmarkChange={loadBookmarks}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultsSection: {
    paddingHorizontal: 24,
  },
});