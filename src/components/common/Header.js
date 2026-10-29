import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useCart } from '../../hooks/useCart';

export const Header = ({
  searchQuery = '',
  onSearchChange,
  onCameraPress,
  onAiPress,
  onCartPress,
  placeholder = 'Tìm kiếm sản phẩm...',
}) => {
  const { totalItemCount } = useCart();

  return (
    <View style={styles.header}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchChange && onSearchChange('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}

        {onCameraPress && (
          <TouchableOpacity onPress={onCameraPress} style={styles.cameraBtn} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* AI Assistant Button */}
      {onAiPress && (
        <TouchableOpacity onPress={onAiPress} style={styles.aiBtn} activeOpacity={0.7}>
          <Ionicons name="sparkles" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {/* Cart Button */}
      <TouchableOpacity onPress={onCartPress} style={styles.cartBtn} activeOpacity={0.7}>
        <Ionicons name="cart-outline" size={26} color={COLORS.text} />
        {totalItemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {totalItemCount > 99 ? '99+' : totalItemCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Backwards compatibility alias
export const HeaderShopee = Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    height: 42,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  cameraBtn: {
    paddingLeft: 8,
    paddingRight: 4,
    borderLeftWidth: 1,
    borderLeftColor: '#CBD5E1',
    marginLeft: 6,
  },
  aiBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
