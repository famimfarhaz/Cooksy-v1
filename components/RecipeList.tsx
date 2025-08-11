import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Users } from 'lucide-react-native';
import { Recipe } from '@/types/recipe';

interface RecipeListProps {
  recipes: Recipe[];
  loading: boolean;
  onBookmarkChange?: () => void;
}

export function RecipeList({ recipes, loading, onBookmarkChange }: RecipeListProps) {
  const router = useRouter();

  const handleRecipePress = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => handleRecipePress(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.readyInMinutes} mins</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.servings} servings</Text>
          </View>
        </View>
        {item.usedIngredientCount !== undefined && (
          <Text style={styles.ingredientMatch}>
            Uses {item.usedIngredientCount} of your ingredients
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Finding recipes...</Text>
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No recipes found</Text>
        <Text style={styles.emptySubtitle}>
          Try different ingredients or change your cuisine preference
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.resultsTitle}>
        Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
      </Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 20,
    marginLeft: 4,
  },
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  recipeImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f3f4f6',
  },
  recipeContent: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 26,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    fontWeight: '500',
  },
  ingredientMatch: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    fontWeight: '500',
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});