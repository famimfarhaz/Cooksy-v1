import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'ingrechef_settings';

export interface UserSettings {
  displayName: string;
  bio: string;
  selectedAvatar: number;
}

const DEFAULT_SETTINGS: UserSettings = {
  displayName: '',
  bio: '',
  selectedAvatar: 0,
};

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      return settingsJson ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },
};