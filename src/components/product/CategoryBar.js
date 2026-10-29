import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SHOPEE_COLORS } from '../../constants/theme';







const CATEGORY_ICONS = {
  all: 'grid',
  beauty: 'sparkles',
  fragrances: 'flask',
  furniture: 'bed',
  groceries: 'nutrition',
  laptops: 'laptop',
  smartphones: 'phone-portrait',
  'skin-care': 'water',
  'home-decoration': 'color-palette',
  kitchen: 'restaurant',
  mens: 'shirt',
  womens: 'bag-handle'
};

export const CategoryBar = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const allCategories = [
  { slug: 'all', name: 'Tất cả' },
  ...categories];


  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const iconName =
          CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS[cat.slug.toLowerCase()] || 'pricetag';

          return (
            <TouchableOpacity
              key={cat.slug}
              style={[styles.categoryItem, isSelected && styles.categoryItemActive]}
              onPress={() => onSelectCategory(cat.slug)}
              activeOpacity={0.7}>
              
              <View
                style={[
                styles.iconCircle,
                isSelected && styles.iconCircleActive]
                }>
                
                <Ionicons
                  name={iconName}
                  size={18}
                  color={isSelected ? '#FFFFFF' : SHOPEE_COLORS.primary} />
                
              </View>
              <Text
                style={[styles.categoryName, isSelected && styles.categoryNameActive]}
                numberOfLines={1}>
                
                {cat.name}
              </Text>
            </TouchableOpacity>);

        })}
      </ScrollView>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  scrollContent: {
    paddingHorizontal: 10,
    gap: 12
  },
  categoryItem: {
    alignItems: 'center',
    width: 68
  },
  categoryItemActive: {},
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#FFE0D6'
  },
  iconCircleActive: {
    backgroundColor: SHOPEE_COLORS.primary,
    borderColor: SHOPEE_COLORS.primaryDark
  },
  categoryName: {
    fontSize: 11,
    color: SHOPEE_COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500'
  },
  categoryNameActive: {
    color: SHOPEE_COLORS.primary,
    fontWeight: '700'
  }
});