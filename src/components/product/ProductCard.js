import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions } from
'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SHOPEE_COLORS } from '../../constants/theme';
import { ShopeeBadge } from '../common/ShopeeBadge';
import { RatingStars } from '../common/RatingStars';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 24) / 2; // 2-column layout with 8px margins







export const ProductCard = ({
  product,
  onPress,
  onAddedToCartToast
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const favorite = isFavorite(product.id);

  const formattedPrice = `$${product.price.toFixed(2)}`;
  const originalPrice = product.discountPercentage ?
  `$${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}` :
  null;

  const formattedSold =
  (product.soldCount || 0) > 1000 ?
  `${((product.soldCount || 0) / 1000).toFixed(1)}k` :
  `${product.soldCount || 0}`;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    if (onAddedToCartToast) {
      onAddedToCartToast();
    }
  };

  const handleToggleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => onPress(product)}>
      
      {/* Product Image & Badges */}
      <View style={styles.imageContainer}>
        {imageLoading &&
        <View style={styles.imagePlaceholder}>
            <ActivityIndicator size="small" color={SHOPEE_COLORS.primary} />
          </View>
        }
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
          onLoadEnd={() => setImageLoading(false)} />
        

        {/* Mall / Preferred tag */}
        <View style={styles.topLeftBadge}>
          {product.isMall && <ShopeeBadge type="mall" />}
          {product.isPreferred && <ShopeeBadge type="preferred" />}
        </View>

        {/* Discount % tag */}
        {product.discountPercentage > 0 &&
        <View style={styles.topRightBadge}>
            <ShopeeBadge type="discount" discountPercent={product.discountPercentage} />
          </View>
        }

        {/* Favorite heart icon */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleToggleFav}
          activeOpacity={0.7}>
          
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={18}
            color={favorite ? SHOPEE_COLORS.primary : 'rgba(0,0,0,0.45)'} />
          
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View style={styles.infoContainer}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Voucher tags / Badges */}
        <View style={styles.tagsRow}>
          <View style={styles.freeShipTag}>
            <Text style={styles.freeShipText}>Freeship Xtra</Text>
          </View>
          {product.rating >= 4.5 &&
          <View style={styles.dealTag}>
              <Text style={styles.dealText}>Rẻ Vô Địch</Text>
            </View>
          }
        </View>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.currencySymbol}>$</Text>
          <Text style={styles.priceMain}>{product.price.toFixed(2)}</Text>
          {originalPrice &&
          <Text style={styles.originalPrice}>{originalPrice}</Text>
          }
        </View>

        {/* Rating and Sold Count */}
        <View style={styles.ratingAndSoldRow}>
          <View style={styles.starsWrapper}>
            <RatingStars rating={product.rating} size={9} />
          </View>
          <Text style={styles.soldText}>Đã bán {formattedSold}</Text>
        </View>

        {/* Location & Quick Cart Add */}
        <View style={styles.footerRow}>
          <Text style={styles.locationText} numberOfLines={1}>
            {product.location || 'TP. Hồ Chí Minh'}
          </Text>
          <TouchableOpacity
            style={styles.quickAddBtn}
            onPress={handleQuickAdd}
            activeOpacity={0.7}>
            
            <Ionicons name="cart" size={14} color={SHOPEE_COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>);

};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: SHOPEE_COLORS.cardBg,
    borderRadius: 4,
    marginBottom: 8,
    marginHorizontal: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    position: 'relative',
    backgroundColor: '#F8F8F8'
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  topLeftBadge: {
    position: 'absolute',
    top: 6,
    left: 4,
    zIndex: 2
  },
  topRightBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2
  },
  heartButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  infoContainer: {
    padding: 8
  },
  title: {
    fontSize: 12,
    fontWeight: '400',
    color: SHOPEE_COLORS.text,
    lineHeight: 16,
    height: 32,
    marginBottom: 4
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6
  },
  freeShipTag: {
    borderWidth: 1,
    borderColor: SHOPEE_COLORS.freeshipGreen,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2
  },
  freeShipText: {
    color: SHOPEE_COLORS.freeshipGreen,
    fontSize: 9,
    fontWeight: '700'
  },
  dealTag: {
    borderWidth: 1,
    borderColor: SHOPEE_COLORS.primary,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2
  },
  dealText: {
    color: SHOPEE_COLORS.primary,
    fontSize: 9,
    fontWeight: '700'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4
  },
  currencySymbol: {
    fontSize: 11,
    color: SHOPEE_COLORS.primary,
    fontWeight: '700'
  },
  priceMain: {
    fontSize: 15,
    fontWeight: '700',
    color: SHOPEE_COLORS.primary,
    marginRight: 4
  },
  originalPrice: {
    fontSize: 10,
    color: SHOPEE_COLORS.textMuted,
    textDecorationLine: 'line-through'
  },
  ratingAndSoldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  starsWrapper: {
    flexDirection: 'row'
  },
  soldText: {
    fontSize: 10,
    color: SHOPEE_COLORS.textSecondary
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F6F6F6'
  },
  locationText: {
    fontSize: 10,
    color: SHOPEE_COLORS.textMuted,
    flex: 1
  },
  quickAddBtn: {
    padding: 3,
    borderRadius: 12,
    backgroundColor: SHOPEE_COLORS.primaryLight
  }
});