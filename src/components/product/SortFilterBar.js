import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SHOPEE_COLORS } from '../../constants/theme';







export const SortFilterBar = ({
  currentSort,
  onSortChange,
  totalResults
}) => {
  const isPriceSort = currentSort === 'price_asc' || currentSort === 'price_desc';

  const handlePriceToggle = () => {
    if (currentSort === 'price_asc') {
      onSortChange('price_desc');
    } else {
      onSortChange('price_asc');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, currentSort === 'default' && styles.tabActive]}
        onPress={() => onSortChange('default')}
        activeOpacity={0.7}>
        
        <Text
          style={[styles.tabText, currentSort === 'default' && styles.tabTextActive]}>
          
          Phổ biến
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, currentSort === 'rating' && styles.tabActive]}
        onPress={() => onSortChange('rating')}
        activeOpacity={0.7}>
        
        <Text
          style={[styles.tabText, currentSort === 'rating' && styles.tabTextActive]}>
          
          Đánh giá cao
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, currentSort === 'sold' && styles.tabActive]}
        onPress={() => onSortChange('sold')}
        activeOpacity={0.7}>
        
        <Text style={[styles.tabText, currentSort === 'sold' && styles.tabTextActive]}>
          Bán chạy
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, isPriceSort && styles.tabActive]}
        onPress={handlePriceToggle}
        activeOpacity={0.7}>
        
        <Text style={[styles.tabText, isPriceSort && styles.tabTextActive]}>Giá</Text>
        <View style={styles.priceIcons}>
          <Ionicons
            name="caret-up"
            size={10}
            color={
            currentSort === 'price_asc' ?
            SHOPEE_COLORS.primary :
            SHOPEE_COLORS.textMuted
            } />
          
          <Ionicons
            name="caret-down"
            size={10}
            color={
            currentSort === 'price_desc' ?
            SHOPEE_COLORS.primary :
            SHOPEE_COLORS.textMuted
            } />
          
        </View>
      </TouchableOpacity>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE'
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabActive: {
    borderBottomColor: SHOPEE_COLORS.primary
  },
  tabText: {
    fontSize: 13,
    color: SHOPEE_COLORS.textSecondary,
    fontWeight: '500'
  },
  tabTextActive: {
    color: SHOPEE_COLORS.primary,
    fontWeight: '700'
  },
  priceIcons: {
    marginLeft: 3,
    justifyContent: 'center'
  }
});