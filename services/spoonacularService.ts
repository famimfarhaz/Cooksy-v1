const API_KEY = 'cfb9ab770bf54970b513163d511f1a45';
const BASE_URL = 'https://api.spoonacular.com/recipes';

import { Recipe, RecipeDetail } from '@/types/recipe';

export const spoonacularService = {
  async searchRecipes(ingredients: string, cuisine: string): Promise<Recipe[]> {
    const ingredientList = ingredients
      .split(/[,\n]/)
      .map(i => i.trim())
      .filter(i => i.length > 0)
      .join(',+');

    const params = new URLSearchParams({
      apiKey: API_KEY,
      includeIngredients: ingredientList,
      number: '10',
      instructionsRequired: 'true',
      addRecipeInformation: 'true',
      fillIngredients: 'true',
    });

    if (cuisine) {
      params.append('cuisine', cuisine);
    }

    console.log('API Request URL:', `${BASE_URL}/complexSearch?${params}`);
    
    const response = await fetch(`${BASE_URL}/complexSearch?${params}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data.results || [];
  },

  async getRecipeDetail(recipeId: number): Promise<RecipeDetail> {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      includeNutrition: 'false',
    });

    const response = await fetch(`${BASE_URL}/${recipeId}/information?${params}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },
};