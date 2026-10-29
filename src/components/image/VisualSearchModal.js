import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SHOPEE_COLORS } from '../../constants/theme';

const SAMPLE_PRESETS = [
  {
    label: '📱 Điện thoại',
    keyword: 'phone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
  },
  {
    label: '🌸 Nước hoa',
    keyword: 'fragrance',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=80',
  },
  {
    label: '💄 Làm đẹp',
    keyword: 'beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
  },
  {
    label: '💻 Laptop',
    keyword: 'laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80',
  },
];

export const VisualSearchModal = ({
  visible,
  onClose,
  onSearchByKeyword,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handlePickImage = async (useCamera = false) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền máy ảnh để tìm kiếm hình ảnh!');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền thư viện ảnh!');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        simulateAiVisionSearch();
      }
    } catch (e) {
      console.warn('Image picker error', e);
    }
  };

  const simulateAiVisionSearch = (keyword) => {
    setAnalyzing(true);
    const sampleKeywords = ['phone', 'perfume', 'laptop', 'beauty', 'watch', 'essence', 'mascara'];
    const targetKeyword = keyword || sampleKeywords[Math.floor(Math.random() * sampleKeywords.length)];

    setTimeout(() => {
      setAnalyzing(false);
      onSearchByKeyword(targetKeyword);
      onClose();
      setSelectedImage(null);
    }, 1200);
  };

  const handleSelectPreset = (preset) => {
    setSelectedImage(preset.image);
    simulateAiVisionSearch(preset.keyword);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="camera" size={20} color={SHOPEE_COLORS.primary} />
              <Text style={styles.title}>Tìm kiếm bằng hình ảnh</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {selectedImage ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
                {analyzing ? (
                  <View style={styles.analyzingOverlay}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.analyzingText}>Shopee AI đang nhận diện sản phẩm...</Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.guidanceBox}>
                <Ionicons name="scan-outline" size={54} color={SHOPEE_COLORS.primary} />
                <Text style={styles.guidanceTitle}>Chụp hoặc tải ảnh lên</Text>
                <Text style={styles.guidanceDesc}>
                  Tìm ngay sản phẩm trên Shopee tương tự với hình ảnh của bạn với độ chính xác cao.
                </Text>
              </View>
            )}

            {/* Online Sample Presets (Rất tiện lợi cho Expo Snack) */}
            <View style={styles.presetSection}>
              <Text style={styles.presetLabel}>Hoặc thử nhanh với ảnh mẫu online:</Text>
              <View style={styles.presetRow}>
                {SAMPLE_PRESETS.map((p, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.presetChip}
                    onPress={() => handleSelectPreset(p)}
                    disabled={analyzing}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.presetChipText}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtnCamera}
                onPress={() => handlePickImage(true)}
                disabled={analyzing}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.actionBtnCameraText}>Chụp ảnh</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnGallery}
                onPress={() => handlePickImage(false)}
                disabled={analyzing}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="images-outline"
                  size={20}
                  color={SHOPEE_COLORS.primary}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.actionBtnGalleryText}>Chọn từ thư viện</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: SHOPEE_COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 16,
    alignItems: 'center',
  },
  previewContainer: {
    width: 180,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  guidanceBox: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  guidanceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: SHOPEE_COLORS.text,
    marginTop: 8,
  },
  guidanceDesc: {
    fontSize: 12,
    color: SHOPEE_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 17,
  },
  presetSection: {
    width: '100%',
    marginVertical: 12,
  },
  presetLabel: {
    fontSize: 12,
    color: SHOPEE_COLORS.textMuted,
    marginBottom: 8,
    fontWeight: '500',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#FFF5F1',
    borderWidth: 1,
    borderColor: '#FFD7C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  presetChipText: {
    fontSize: 11,
    color: SHOPEE_COLORS.primary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
  actionBtnCamera: {
    flex: 1,
    backgroundColor: SHOPEE_COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionBtnCameraText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  actionBtnGallery: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: SHOPEE_COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionBtnGalleryText: {
    color: SHOPEE_COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
