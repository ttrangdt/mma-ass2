import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';








export const NotificationToast = ({
  visible,
  message,
  icon = 'checkmark-circle'
}) => {
  if (!visible) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <View style={styles.toastBubble}>
        <Ionicons name={icon} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </View>);

};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  toastBubble: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    maxWidth: '85%'
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  }
});