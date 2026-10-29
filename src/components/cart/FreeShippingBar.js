import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHOPEE_COLORS } from '../../constants/theme';







export const FreeShippingBar = ({
  freeShippingEligible,
  amountNeeded,
  threshold
}) => {
  return (
    <View
      style={[
      styles.container,
      freeShippingEligible ? styles.containerEligible : styles.containerProgress]
      }>
      
      <Ionicons
        name="car-outline"
        size={18}
        color={freeShippingEligible ? SHOPEE_COLORS.freeshipGreen : SHOPEE_COLORS.primary}
        style={styles.icon} />
      
      {freeShippingEligible ?
      <Text style={styles.eligibleText}>
          Đơn hàng của bạn đã đạt điều kiện <Text style={styles.bold}>Miễn Phí Vận Chuyển</Text>!
        </Text> :

      <Text style={styles.progressText}>
          Mua thêm <Text style={styles.bold}>${amountNeeded.toFixed(2)}</Text> để được Miễn Phí Vận Chuyển (Đơn từ ${threshold})
        </Text>
      }
    </View>);

};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  containerProgress: {
    backgroundColor: '#FFF4E5'
  },
  containerEligible: {
    backgroundColor: SHOPEE_COLORS.freeshipLight
  },
  icon: {
    marginRight: 8
  },
  progressText: {
    fontSize: 11,
    color: '#D97706',
    flex: 1
  },
  eligibleText: {
    fontSize: 11,
    color: SHOPEE_COLORS.freeshipGreen,
    flex: 1
  },
  bold: {
    fontWeight: '700'
  }
});