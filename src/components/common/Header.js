import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
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
        <Ionicons name="search" size={17} color="#94A3B8" style={styles.searchIcon} />
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
            <Ionicons name="close-circle" size={16} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}

        {onCameraPress && (
          <TouchableOpacity onPress={onCameraPress} style={styles.cameraBtn} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={19} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* AI Assistant Button */}
      {onAiPress && (
        <TouchableOpacity onPress={onAiPress} style={styles.aiBtn} activeOpacity={0.7}>
          <Ionicons name="sparkles" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {/* Cart Button */}
      <TouchableOpacity onPress={onCartPress} style={styles.cartBtn} activeOpacity={0.7}>
        <Ionicons name="cart-outline" size={24} color={COLORS.text} />
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
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
  },
  cameraBtn: {
    paddingLeft: 6,
    paddingRight: 2,
    borderLeftWidth: 1,
    borderLeftColor: '#CBD5E1',
    marginLeft: 4,
  },
  aiBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    position: 'relative',
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.danger,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
