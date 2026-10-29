import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/theme';

export const CategoryBar = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <TouchableOpacity
          style={[styles.pill, selectedCategory === 'all' && styles.pillActive]}
          onPress={() => onSelectCategory('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.text, selectedCategory === 'all' && styles.textActive]}>
            Tất cả
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <TouchableOpacity
              key={cat.slug}
              style={[styles.pill, isSelected && styles.pillActive]}
              onPress={() => onSelectCategory(cat.slug)}
              activeOpacity={0.7}
            >
              <Text style={[styles.text, isSelected && styles.textActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  pillActive: {
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  textActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
