import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SHOPEE_COLORS } from '../../constants/theme';






export const ShopeeBadge = ({ type, discountPercent }) => {
  if (type === 'mall') {
    return (
      <View style={[styles.badgeContainer, { backgroundColor: SHOPEE_COLORS.mallRed }]}>
        <Text style={styles.badgeText}>Mall</Text>
      </View>);

  }

  if (type === 'preferred') {
    return (
      <View style={[styles.badgeContainer, { backgroundColor: SHOPEE_COLORS.preferredOrange }]}>
        <Text style={styles.badgeText}>Yêu thích</Text>
      </View>);

  }

  if (type === 'discount' && discountPercent) {
    return (
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>-{Math.round(discountPercent)}%</Text>
        <Text style={styles.discountSubtext}>GIẢM</Text>
      </View>);

  }

  if (type === 'freeship') {
    return (
      <View style={[styles.badgeContainer, { backgroundColor: SHOPEE_COLORS.freeshipGreen }]}>
        <Text style={styles.badgeText}>Freeship Xtra</Text>
      </View>);

  }

  return null;
};

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 2,
    alignSelf: 'flex-start'
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  discountBadge: {
    backgroundColor: SHOPEE_COLORS.yellowBadge,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3
  },
  discountText: {
    color: SHOPEE_COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 11
  },
  discountSubtext: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    lineHeight: 9
  }
});