import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, User } from 'lucide-react-native';
import { ProgressBar } from '@/components/ProgressBar';
import { settingsService } from '@/services/settingsService';
import { requestLimitService } from '@/services/requestLimitService';

const CHEF_HAT_IMAGES = [
  'https://i.postimg.cc/cC52fdqf/chef-hat.png',
  'https://i.postimg.cc/BbvR8Xzq/chef-hat-1.png',
  'https://i.postimg.cc/G3MZWxB9/toque.png',
];

export default function SettingsScreen() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    loadSettings();
    loadRequestCount();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      setDisplayName(settings.displayName);
      setBio(settings.bio);
      setSelectedAvatar(settings.selectedAvatar);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadRequestCount = async () => {
    try {
      const count = await requestLimitService.getTodayRequestCount();
      setRequestCount(count);
    } catch (error) {
      console.error('Error loading request count:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await settingsService.saveSettings({
        displayName,
        bio,
        selectedAvatar,
      });
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
      console.error('Error saving settings:', error);
    }
  };

  const resetRequestCount = async () => {
    try {
      await requestLimitService.resetRequestCount();
      setRequestCount(0);
      Alert.alert('Success', 'Request count reset successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset request count');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <SettingsIcon size={32} color="#2563eb" />
            <Text style={styles.title}>Settings</Text>
          </View>
          <Text style={styles.subtitle}>
            Customize your profile and preferences
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <View style={styles.avatarContainer}>
            {CHEF_HAT_IMAGES.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarOption,
                  selectedAvatar === index && styles.selectedAvatar,
                ]}
                onPress={() => setSelectedAvatar(index)}
              >
                <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <TextInput
            style={[styles.textInput, styles.bioInput]}
            placeholder="Tell us about yourself..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily API Usage</Text>
          <ProgressBar current={requestCount} total={75} />
          <Text style={styles.usageText}>
            {requestCount} / 75 requests used today
          </Text>
          {requestCount >= 75 && (
            <View style={styles.limitReachedContainer}>
              <Text style={styles.limitReachedText}>
                Daily limit reached! Upgrade to premium for unlimited access.
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <User size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        {__DEV__ && (
          <TouchableOpacity style={styles.resetButton} onPress={resetRequestCount}>
            <Text style={styles.resetButtonText}>Reset Request Count (Dev)</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <View style={styles.creditContainer}>
            <Text style={styles.creditText}>Built by Famim Farhaz</Text>
          </View>
        </View>
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  avatarOption: {
    padding: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  usageText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  limitReachedContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  limitReachedText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  creditContainer: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  creditText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '400',
  },
});