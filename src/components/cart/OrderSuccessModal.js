import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity } from
'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHOPEE_COLORS } from '../../constants/theme';








export const OrderSuccessModal = ({
  visible,
  onClose,
  totalPaid,
  itemCount
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={64} color={SHOPEE_COLORS.freeshipGreen} />
          </View>
          <Text style={styles.title}>Đặt hàng thành công!</Text>
          <Text style={styles.subtitle}>
            Cảm ơn bạn đã mua sắm tại Shopee Mall. Đơn hàng của bạn đang được chuẩn bị để giao đến bạn sớm nhất.
          </Text>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số lượng sản phẩm:</Text>
              <Text style={styles.infoValue}>{itemCount} món</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tổng tiền thanh toán:</Text>
              <Text style={styles.infoPrice}>${totalPaid.toFixed(2)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phương thức:</Text>
              <Text style={styles.infoValue}>Thanh toán khi nhận hàng (COD)</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>);

};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center'
  },
  iconCircle: {
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: SHOPEE_COLORS.text,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 13,
    color: SHOPEE_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 14,
    gap: 8,
    marginBottom: 20
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoLabel: {
    fontSize: 12,
    color: SHOPEE_COLORS.textSecondary
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: SHOPEE_COLORS.text
  },
  infoPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: SHOPEE_COLORS.primary
  },
  button: {
    width: '100%',
    backgroundColor: SHOPEE_COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  }
});