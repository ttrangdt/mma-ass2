import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHOPEE_COLORS } from '../../constants/theme';















export const PriceSummary = ({
  totalPrice,
  finalPrice,
  discountAmount,
  selectedItemCount,
  totalItemCount,
  allSelected,
  onToggleSelectAll,
  onCheckout,
  appliedVoucher,
  onOpenVoucherModal
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Shopee Voucher Row */}
      <TouchableOpacity
        style={styles.voucherRow}
        onPress={onOpenVoucherModal}
        activeOpacity={0.7}>
        
        <View style={styles.voucherLeft}>
          <Ionicons name="ticket-outline" size={18} color={SHOPEE_COLORS.primary} />
          <Text style={styles.voucherTitle}>Shopee Voucher</Text>
        </View>
        <View style={styles.voucherRight}>
          <Text style={styles.voucherCode}>
            {appliedVoucher ? appliedVoucher.code : 'Chọn hoặc nhập mã'}
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#999999" />
        </View>
      </TouchableOpacity>

      {/* Main Checkout Footer */}
      <View style={styles.checkoutBar}>
        {/* Select All Checkbox */}
        <TouchableOpacity
          style={styles.selectAllRow}
          onPress={onToggleSelectAll}
          activeOpacity={0.7}>
          
          <Ionicons
            name={allSelected ? 'checkbox' : 'square-outline'}
            size={22}
            color={allSelected ? SHOPEE_COLORS.primary : '#999999'} />
          
          <Text style={styles.selectAllText}>Tất cả</Text>
        </TouchableOpacity>

        {/* Total Price Column */}
        <View style={styles.priceContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalAmount}>${finalPrice.toFixed(2)}</Text>
          </View>
          {discountAmount > 0 &&
          <Text style={styles.savingsText}>
              Tiết kiệm ${discountAmount.toFixed(2)}
            </Text>
          }
        </View>

        {/* Buy Now Button */}
        <TouchableOpacity
          style={[
          styles.checkoutBtn,
          selectedItemCount === 0 && styles.checkoutBtnDisabled]
          }
          onPress={onCheckout}
          disabled={selectedItemCount === 0}
          activeOpacity={0.8}>
          
          <Text style={styles.checkoutBtnText}>
            Mua Hàng ({selectedItemCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>);

};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8
  },
  voucherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  voucherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  voucherTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: SHOPEE_COLORS.text
  },
  voucherRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  voucherCode: {
    fontSize: 12,
    color: SHOPEE_COLORS.primary,
    fontWeight: '500'
  },
  checkoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56
  },
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    gap: 6
  },
  selectAllText: {
    fontSize: 12,
    color: SHOPEE_COLORS.textSecondary
  },
  priceContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
    justifyContent: 'center'
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  totalLabel: {
    fontSize: 11,
    color: SHOPEE_COLORS.text,
    marginRight: 4
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: SHOPEE_COLORS.primary
  },
  savingsText: {
    fontSize: 10,
    color: SHOPEE_COLORS.primary
  },
  checkoutBtn: {
    backgroundColor: SHOPEE_COLORS.primary,
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkoutBtnDisabled: {
    backgroundColor: '#CCCCCC'
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  }
});