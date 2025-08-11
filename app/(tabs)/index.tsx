import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChefHat, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CuisineSelector } from '@/components/CuisineSelector';
import { RecipeList } from '@/components/RecipeList';
import { requestLimitService } from '@/services/requestLimitService';
import { spoonacularService } from '@/services/spoonacularService';
import { Recipe } from '@/types/recipe';

export default function HomeScreen() {
  const [ingredients, setIngredients] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!ingredients.trim()) {
      Alert.alert('Error', 'Please enter some ingredients');
      return;
    }

    const canMakeRequest = await requestLimitService.canMakeRequest();
    if (!canMakeRequest) {
      Alert.alert(
        'Daily Limit Reached',
        'You have reached your daily limit of 75 API requests. Please try again tomorrow or upgrade to premium for unlimited access.'
      );
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const searchResults = await spoonacularService.searchRecipes(
        ingredients,
        selectedCuisine
      );
      setRecipes(searchResults);
      await requestLimitService.incrementRequestCount();
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch recipes. Please try again.');
      console.error('Recipe search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <ChefHat size={32} color="#2563eb" />
            <Text style={styles.title}>IngreChef</Text>
          </View>
          <Text style={styles.subtitle}>
            Discover recipes with your ingredients
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputSection}>
            <Text style={styles.label}>What ingredients do you have?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter ingredients (e.g., chicken, rice, tomatoes)"
                value={ingredients}
                onChangeText={setIngredients}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9ca3af"
              />
              {ingredients.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setIngredients('')}
                >
                  <X size={16} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.cuisineSection}>
            <Text style={styles.label}>Preferred Cuisine</Text>
            <CuisineSelector
              selectedCuisine={selectedCuisine}
              onCuisineSelect={setSelectedCuisine}
            />
          </View>

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#cbd5e1', '#cbd5e1'] : ['#2563eb', '#3b82f6']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Search size={20} color="#ffffff" />
              <Text style={styles.searchButtonText}>
                {loading ? 'SEARCHING...' : 'FIND RECIPES'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {hasSearched && (
          <View style={styles.resultsSection}>
            <RecipeList recipes={recipes} loading={loading} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    padding: 24,
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
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  textInput: {
    padding: 18,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  cuisineSection: {
    marginBottom: 24,
  },
  searchButton: {
    ...Platform.select({
      ios: {
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  searchButtonDisabled: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});