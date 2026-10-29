import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform } from
'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHOPEE_COLORS } from '../../constants/theme';
import { useCart } from '../../hooks/useCart';













export const HeaderShopee = ({
  searchQuery,
  onSearchChange,
  onCameraPress,
  onCartPress,
  onAiPress,
  showBack = false,
  onBackPress,
  placeholder = 'Shopee bao ship 0Đ - Đón sale lớn...',
  title
}) => {
  const { totalItemCount } = useCart();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.contentRow}>
        {showBack &&
        <TouchableOpacity onPress={onBackPress} style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        }

        {title ?
        <View style={styles.titleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          </View> :

        <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#888888" style={styles.searchIcon} />
            <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={onSearchChange}
            returnKeyType="search" />
          
            {searchQuery && searchQuery.length > 0 ?
          <TouchableOpacity onPress={() => onSearchChange && onSearchChange('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={16} color="#999999" />
              </TouchableOpacity> :
          null}

            {onCameraPress &&
          <TouchableOpacity
            onPress={onCameraPress}
            style={styles.cameraBtn}
            activeOpacity={0.7}>
            
                <Ionicons name="camera-outline" size={20} color={SHOPEE_COLORS.primary} />
              </TouchableOpacity>
          }
          </View>
        }

        {/* Right action buttons */}
        <View style={styles.rightIcons}>
          {onAiPress &&
          <TouchableOpacity onPress={onAiPress} style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons name="sparkles" size={22} color="#FFF8B2" />
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            </TouchableOpacity>
          }

          <TouchableOpacity onPress={onCartPress} style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="cart-outline" size={25} color="#FFFFFF" />
            {totalItemCount > 0 &&
            <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalItemCount > 99 ? '99+' : totalItemCount}
                </Text>
              </View>
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>);

};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: SHOPEE_COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 48 : 38,
    paddingBottom: 10,
    paddingHorizontal: 12
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 8
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 38,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 6
  },
  searchIcon: {
    marginRight: 6
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: SHOPEE_COLORS.text,
    paddingVertical: 0
  },
  clearBtn: {
    padding: 4
  },
  cameraBtn: {
    paddingLeft: 6,
    paddingRight: 2,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
    marginLeft: 4
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconButton: {
    padding: 6,
    position: 'relative',
    marginLeft: 2
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: SHOPEE_COLORS.primary
  },
  badgeText: {
    color: SHOPEE_COLORS.primary,
    fontSize: 10,
    fontWeight: '800'
  },
  aiBadge: {
    position: 'absolute',
    top: 2,
    right: 0,
    backgroundColor: '#FFEB3B',
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 1
  },
  aiBadgeText: {
    color: '#D03B1F',
    fontSize: 8,
    fontWeight: '900'
  }
});