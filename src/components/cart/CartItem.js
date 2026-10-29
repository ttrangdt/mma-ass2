import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert } from
'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SHOPEE_COLORS } from '../../constants/theme';
import { ShopeeBadge } from '../common/ShopeeBadge';









export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onToggleSelect,
  onPressProduct
}) => {
  const { product, quantity, selected, selectedVariation } = item;

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    } else {
      Alert.alert(
        'Xóa sản phẩm',
        `Bạn có muốn bỏ "${product.title}" khỏi giỏ hàng?`,
        [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => onRemove(product.id)
        }]

      );
    }
  };

  const handleIncrease = () => {
    if (quantity < (product.stock || 99)) {
      onUpdateQuantity(product.id, quantity + 1);
    }
  };

  const originalPrice = product.discountPercentage ?
  (product.price * (1 + product.discountPercentage / 100)).toFixed(2) :
  null;

  return (
    <View style={styles.card}>
      {/* Shop Info Header */}
      <View style={styles.shopHeader}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onToggleSelect(product.id)}
          activeOpacity={0.7}>
          
          <Ionicons
            name={selected ? 'checkbox' : 'square-outline'}
            size={20}
            color={selected ? SHOPEE_COLORS.primary : '#999999'} />
          
        </TouchableOpacity>
        <View style={styles.shopNameRow}>
          {product.isMall ?
          <ShopeeBadge type="mall" /> :

          <ShopeeBadge type="preferred" />
          }
          <Text style={styles.shopName} numberOfLines={1}>
            {product.brand || 'Shopee Official Store'}
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#888888" />
        </View>
        <TouchableOpacity
          style={styles.deleteTopBtn}
          onPress={() => onRemove(product.id)}
          activeOpacity={0.7}>
          
          <Ionicons name="trash-outline" size={18} color="#999999" />
        </TouchableOpacity>
      </View>

      {/* Main Item Row */}
      <View style={styles.itemContent}>
        <TouchableOpacity
          style={styles.checkboxBody}
          onPress={() => onToggleSelect(product.id)}
          activeOpacity={0.7}>
          
          <Ionicons
            name={selected ? 'checkbox' : 'square-outline'}
            size={20}
            color={selected ? SHOPEE_COLORS.primary : '#999999'} />
          
        </TouchableOpacity>

        {/* Thumbnail */}
        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={() => onPressProduct && onPressProduct(product.id)}
          activeOpacity={0.8}>
          
          <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoCol}>
          <TouchableOpacity
            onPress={() => onPressProduct && onPressProduct(product.id)}
            activeOpacity={0.8}>
            
            <Text style={styles.title} numberOfLines={2}>
              {product.title}
            </Text>
          </TouchableOpacity>

          {/* Variation chip */}
          <View style={styles.variationChip}>
            <Text style={styles.variationText} numberOfLines={1}>
              Phân loại: {selectedVariation || 'Mặc định'}
            </Text>
          </View>

          {/* Price & Quantity Controls */}
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {originalPrice &&
              <Text style={styles.originalPrice}>${originalPrice}</Text>
              }
            </View>

            {/* Stepper */}
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[styles.stepBtn, quantity <= 1 && styles.stepBtnDisabled]}
                onPress={handleDecrease}
                activeOpacity={0.6}>
                
                <Ionicons
                  name={quantity <= 1 ? 'trash-outline' : 'remove'}
                  size={14}
                  color={quantity <= 1 ? SHOPEE_COLORS.danger : '#555555'} />
                
              </TouchableOpacity>

              <View style={styles.qtyBox}>
                <Text style={styles.qtyText}>{quantity}</Text>
              </View>

              <TouchableOpacity
                style={[
                styles.stepBtn,
                quantity >= (product.stock || 99) && styles.stepBtnDisabled]
                }
                onPress={handleIncrease}
                activeOpacity={0.6}>
                
                <Ionicons name="add" size={14} color="#555555" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>);

};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    marginBottom: 8
  },
  checkboxContainer: {
    marginRight: 8
  },
  shopNameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  shopName: {
    fontSize: 13,
    fontWeight: '700',
    color: SHOPEE_COLORS.text,
    maxWidth: '70%'
  },
  deleteTopBtn: {
    padding: 4
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  checkboxBody: {
    marginRight: 8,
    marginTop: 30
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
    marginRight: 10
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  infoCol: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 80
  },
  title: {
    fontSize: 13,
    color: SHOPEE_COLORS.text,
    lineHeight: 17,
    fontWeight: '400'
  },
  variationChip: {
    backgroundColor: '#F6F6F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginVertical: 4
  },
  variationText: {
    fontSize: 11,
    color: SHOPEE_COLORS.textSecondary
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: SHOPEE_COLORS.primary
  },
  originalPrice: {
    fontSize: 11,
    color: SHOPEE_COLORS.textMuted,
    textDecorationLine: 'line-through'
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 2
  },
  stepBtn: {
    width: 26,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA'
  },
  stepBtnDisabled: {
    opacity: 0.5
  },
  qtyBox: {
    width: 32,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF'
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '600',
    color: SHOPEE_COLORS.text
  }
});