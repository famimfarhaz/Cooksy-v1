import AsyncStorage from '@react-native-async-storage/async-storage';

const REQUEST_COUNT_KEY = 'ingrechef_request_count';
const LAST_RESET_DATE_KEY = 'ingrechef_last_reset_date';
const DAILY_LIMIT = 75;

export const requestLimitService = {
  async getTodayRequestCount(): Promise<number> {
    try {
      await this.checkAndResetIfNewDay();
      const countStr = await AsyncStorage.getItem(REQUEST_COUNT_KEY);
      return countStr ? parseInt(countStr, 10) : 0;
    } catch (error) {
      console.error('Error getting request count:', error);
      return 0;
    }
  },

  async incrementRequestCount(): Promise<void> {
    try {
      const currentCount = await this.getTodayRequestCount();
      const newCount = currentCount + 1;
      await AsyncStorage.setItem(REQUEST_COUNT_KEY, newCount.toString());
    } catch (error) {
      console.error('Error incrementing request count:', error);
    }
  },

  async canMakeRequest(): Promise<boolean> {
    const currentCount = await this.getTodayRequestCount();
    return currentCount < DAILY_LIMIT;
  },

  async resetRequestCount(): Promise<void> {
    try {
      await AsyncStorage.setItem(REQUEST_COUNT_KEY, '0');
      await AsyncStorage.setItem(LAST_RESET_DATE_KEY, new Date().toDateString());
    } catch (error) {
      console.error('Error resetting request count:', error);
    }
  },

  async checkAndResetIfNewDay(): Promise<void> {
    try {
      const lastResetDate = await AsyncStorage.getItem(LAST_RESET_DATE_KEY);
      const today = new Date().toDateString();
      
      if (!lastResetDate || lastResetDate !== today) {
        await this.resetRequestCount();
      }
    } catch (error) {
      console.error('Error checking reset date:', error);
    }
  },
};