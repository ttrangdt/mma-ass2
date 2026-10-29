import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onPressProduct,
}) => {
  const { product, quantity } = item;

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    } else {
      Alert.alert(
        'Xóa sản phẩm',
        `Xóa "${product.title}" khỏi giỏ hàng?`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: () => onRemove(product.id),
          },
        ]
      );
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(product.id, quantity + 1);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => onPressProduct && onPressProduct(product.id)}
        activeOpacity={0.8}
        style={styles.imageWrapper}
      >
        <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
      </TouchableOpacity>

      <View style={styles.info}>
        <TouchableOpacity
          onPress={() => onPressProduct && onPressProduct(product.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
        </TouchableOpacity>

        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        <View style={styles.bottomRow}>
          {/* Stepper */}
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={handleDecrease}
              activeOpacity={0.6}
            >
              <Ionicons
                name={quantity <= 1 ? 'trash-outline' : 'remove'}
                size={14}
                color={quantity <= 1 ? COLORS.danger : COLORS.text}
              />
            </TouchableOpacity>

            <View style={styles.qtyBox}>
              <Text style={styles.qtyText}>{quantity}</Text>
            </View>

            <TouchableOpacity
              style={styles.stepBtn}
              onPress={handleIncrease}
              activeOpacity={0.6}
            >
              <Ionicons name="add" size={14} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Subtotal */}
          <Text style={styles.subtotal}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 12,
  },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 18,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  qtyBox: {
    paddingHorizontal: 10,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
});
