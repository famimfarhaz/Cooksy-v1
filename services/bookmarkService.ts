import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '@/types/recipe';

const BOOKMARKS_KEY = 'ingrechef_bookmarks';

export const bookmarkService = {
  async getBookmarks(): Promise<Recipe[]> {
    try {
      const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_KEY);
      return bookmarksJson ? JSON.parse(bookmarksJson) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  },

  async addBookmark(recipe: Recipe): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const isAlreadyBookmarked = bookmarks.some(b => b.id === recipe.id);
      
      if (!isAlreadyBookmarked) {
        bookmarks.push(recipe);
        await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  async removeBookmark(recipeId: number): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const filteredBookmarks = bookmarks.filter(b => b.id !== recipeId);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },

  async isBookmarked(recipeId: number): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some(b => b.id === recipeId);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  },
};