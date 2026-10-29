import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

export const PriceSummary = ({
  totalPrice = 0,
  totalItemCount = 0,
  onCheckout,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(14, insets.bottom + 6);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <View style={styles.textCol}>
        <Text style={styles.label}>Tổng cộng ({totalItemCount} món):</Text>
        <Text style={styles.price}>${totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.checkoutBtn,
          totalItemCount === 0 && styles.checkoutBtnDisabled,
        ]}
        onPress={onCheckout}
        disabled={totalItemCount === 0}
        activeOpacity={0.8}
      >
        <Text style={styles.checkoutBtnText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 4,
  },
  textCol: {
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
