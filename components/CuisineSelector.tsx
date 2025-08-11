import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';

const CUISINES = [
  { value: '', label: 'Any Cuisine' },
  { value: 'american', label: 'American' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'indian', label: 'Indian' },
  { value: 'italian', label: 'Italian' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'thai', label: 'Thai' },
  { value: 'french', label: 'French' },
  { value: 'korean', label: 'Korean' },
  { value: 'middle eastern', label: 'Middle Eastern' },
];

interface CuisineSelectorProps {
  selectedCuisine: string;
  onCuisineSelect: (cuisine: string) => void;
}

export function CuisineSelector({ selectedCuisine, onCuisineSelect }: CuisineSelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedLabel = CUISINES.find(c => c.value === selectedCuisine)?.label || 'Any Cuisine';

  const handleSelect = (cuisine: string) => {
    onCuisineSelect(cuisine);
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.selectedText}>{selectedLabel}</Text>
        <ChevronDown size={20} color="#6b7280" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Cuisine</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.optionsList}>
              {CUISINES.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine.value}
                  style={[
                    styles.option,
                    selectedCuisine === cuisine.value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(cuisine.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedCuisine === cuisine.value && styles.selectedOptionText,
                    ]}
                  >
                    {cuisine.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  optionsList: {
    padding: 20,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});