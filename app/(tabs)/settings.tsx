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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    let isMounted = true;
    loadSettings();
    loadRequestCount();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      if (isMounted) {
        setDisplayName(settings.displayName);
        setBio(settings.bio);
        setSelectedAvatar(settings.selectedAvatar);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadRequestCount = async () => {
    try {
      const count = await requestLimitService.getTodayRequestCount();
      if (isMounted) {
        setRequestCount(count);
      }
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
          <LinearGradient
            colors={['#2563eb', '#3b82f6']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <User size={20} color="#ffffff" />
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </LinearGradient>
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
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  avatarOption: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f9ff',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
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
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  usageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButton: {
    marginHorizontal: 20,
    marginBottom: 16,
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
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  resetButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
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
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
  },
});