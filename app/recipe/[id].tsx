import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Users, Bookmark, BookmarkCheck } from 'lucide-react-native';
import { spoonacularService } from '@/services/spoonacularService';
import { bookmarkService } from '@/services/bookmarkService';
import { requestLimitService } from '@/services/requestLimitService';
import { RecipeDetail } from '@/types/recipe';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      loadRecipe();
      checkBookmarkStatus();
    }
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  const loadRecipe = async () => {
    try {
      const canMakeRequest = await requestLimitService.canMakeRequest();
      if (!canMakeRequest) {
        Alert.alert(
          'Daily Limit Reached',
          'You have reached your daily limit of 75 API requests.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      const recipeDetail = await spoonacularService.getRecipeDetail(Number(id));
      if (isMounted) {
        setRecipe(recipeDetail);
      }
      await requestLimitService.incrementRequestCount();
    } catch (error) {
      Alert.alert('Error', 'Failed to load recipe details');
      console.error('Recipe detail error:', error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const bookmarked = await bookmarkService.isBookmarked(Number(id));
      if (isMounted) {
        setIsBookmarked(bookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleBookmark = async () => {
    if (!recipe) return;

    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(recipe.id);
        setIsBookmarked(false);
      } else {
        await bookmarkService.addBookmark({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          readyInMinutes: recipe.readyInMinutes,
          servings: recipe.servings,
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update bookmark');
      console.error('Bookmark error:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Recipe not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkButton} onPress={toggleBookmark}>
          {isBookmarked ? (
            <BookmarkCheck size={24} color="#2563eb" />
          ) : (
            <Bookmark size={24} color="#6b7280" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color="#6b7280" />
              <Text style={styles.metaText}>{recipe.readyInMinutes} mins</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={16} color="#6b7280" />
              <Text style={styles.metaText}>{recipe.servings} servings</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.extendedIngredients?.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>
                  • {ingredient.original}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.analyzedInstructions?.[0]?.steps?.map((step, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <Text style={styles.instructionText}>{step.step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  bookmarkButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  recipeImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#f3f4f6',
  },
  content: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 20,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 20,
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
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  ingredientItem: {
    marginBottom: 12,
  },
  ingredientText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 26,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 26,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
  },
});