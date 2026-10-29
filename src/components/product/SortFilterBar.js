import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const SortFilterBar = ({ currentSort, onSortChange, totalResults = 0 }) => {
  const options = [
    { key: 'default', label: 'Phổ biến' },
    { key: 'rating', label: 'Đánh giá cao' },
    { key: 'price_asc', label: 'Giá ↑' },
    { key: 'price_desc', label: 'Giá ↓' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.optionsRow}>
        {options.map((opt) => {
          const isActive = currentSort === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.btn, isActive && styles.btnActive]}
              onPress={() => onSortChange(opt.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, isActive && styles.btnTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 6,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnActive: {
    backgroundColor: COLORS.primaryLight,
  },
  btnText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  btnTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
