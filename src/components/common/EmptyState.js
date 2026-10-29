import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHOPEE_COLORS } from '../../constants/theme';









export const EmptyState = ({
  icon = 'cart-outline',
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction &&
      <TouchableOpacity style={styles.button} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      }
    </View>);

};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: SHOPEE_COLORS.text,
    textAlign: 'center',
    marginBottom: 8
  },
  description: {
    fontSize: 13,
    color: SHOPEE_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18
  },
  button: {
    backgroundColor: SHOPEE_COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
    elevation: 1
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  }
});