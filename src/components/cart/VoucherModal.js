import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList } from
'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SHOPEE_COLORS } from '../../constants/theme';









const AVAILABLE_VOUCHERS = [
{
  code: 'SHOPEE5OFF',
  discountAmount: 5,
  minOrderValue: 20,
  description: 'Giảm $5 cho đơn hàng từ $20'
},
{
  code: 'SHOPEE10OFF',
  discountAmount: 10,
  minOrderValue: 50,
  description: 'Giảm $10 cho đơn hàng từ $50'
},
{
  code: 'FREESHIPMAX',
  discountAmount: 3,
  minOrderValue: 10,
  description: 'Giảm $3 phí vận chuyển đơn từ $10'
},
{
  code: 'MEGA20',
  discountAmount: 20,
  minOrderValue: 100,
  description: 'Voucher Siêu Sale giảm $20 đơn từ $100'
}];


export const VoucherModal = ({
  visible,
  onClose,
  appliedVoucher,
  onSelectVoucher,
  currentTotal
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Shopee Voucher</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#555555" />
            </TouchableOpacity>
          </View>

          {/* List of Vouchers */}
          <FlatList
            data={AVAILABLE_VOUCHERS}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isApplied = appliedVoucher?.code === item.code;
              const isEligible = currentTotal >= item.minOrderValue;

              return (
                <View
                  style={[
                  styles.voucherCard,
                  !isEligible && styles.voucherCardDisabled]
                  }>
                  
                  <View style={styles.voucherLeft}>
                    <Ionicons
                      name="ticket"
                      size={28}
                      color={isEligible ? SHOPEE_COLORS.primary : '#BBBBBB'} />
                    
                    <Text style={styles.badgeLabel}>SHOPEE</Text>
                  </View>

                  <View style={styles.voucherRight}>
                    <Text style={styles.codeText}>{item.code}</Text>
                    <Text style={styles.descText}>{item.description}</Text>
                    <Text style={styles.conditionText}>
                      {isEligible ?
                      'Đã đủ điều kiện áp dụng' :
                      `Cần mua thêm $${(item.minOrderValue - currentTotal).toFixed(2)}`}
                    </Text>

                    <TouchableOpacity
                      style={[
                      styles.applyBtn,
                      isApplied && styles.applyBtnApplied,
                      !isEligible && styles.applyBtnDisabled]
                      }
                      disabled={!isEligible}
                      onPress={() => {
                        onSelectVoucher(item);
                        onClose();
                      }}>
                      
                      <Text
                        style={[
                        styles.applyBtnText,
                        isApplied && styles.applyBtnTextApplied]
                        }>
                        
                        {isApplied ? 'Đang dùng' : 'Áp dụng'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>);

            }} />
          
        </View>
      </View>
    </Modal>);

};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '75%',
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: SHOPEE_COLORS.text
  },
  closeBtn: {
    padding: 4
  },
  listContent: {
    padding: 16,
    gap: 12
  },
  voucherCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#FFE0D6',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF'
  },
  voucherCardDisabled: {
    opacity: 0.6,
    borderColor: '#EEEEEE'
  },
  voucherLeft: {
    width: 80,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#FFE0D6',
    borderStyle: 'dashed'
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: SHOPEE_COLORS.primary,
    marginTop: 4
  },
  voucherRight: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between'
  },
  codeText: {
    fontSize: 14,
    fontWeight: '700',
    color: SHOPEE_COLORS.text
  },
  descText: {
    fontSize: 12,
    color: SHOPEE_COLORS.textSecondary,
    marginTop: 2
  },
  conditionText: {
    fontSize: 10,
    color: SHOPEE_COLORS.primary,
    marginTop: 4
  },
  applyBtn: {
    backgroundColor: SHOPEE_COLORS.primary,
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 8
  },
  applyBtnApplied: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: SHOPEE_COLORS.primary
  },
  applyBtnDisabled: {
    backgroundColor: '#DDDDDD'
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  applyBtnTextApplied: {
    color: SHOPEE_COLORS.primary
  }
});