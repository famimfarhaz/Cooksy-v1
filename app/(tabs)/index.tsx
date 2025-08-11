import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChefHat } from 'lucide-react-native';
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
          <Search size={20} color="#ffffff" />
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Find Recipes'}
          </Text>
        </TouchableOpacity>

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
  inputSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  cuisineSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  searchButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsSection: {
    paddingHorizontal: 24,
  },
});