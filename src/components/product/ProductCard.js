import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { RatingStars } from '../common/RatingStars';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2; // 2 columns with 12px padding

export const ProductCard = ({ product, onPress, onAddedToCartToast }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const favorite = isFavorite(product.id);

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
      activeOpacity={0.85}
      onPress={() => onPress(product)}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.placeholder}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
          onLoadEnd={() => setImageLoading(false)}
        />

        {/* Favorite Heart Button */}
        <TouchableOpacity
          style={styles.favButton}
          onPress={handleToggleFav}
          activeOpacity={0.7}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={18}
            color={favorite ? COLORS.danger : '#64748B'}
          />
        </TouchableOpacity>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{Math.round(product.discountPercentage)}%
            </Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.ratingRow}>
          <RatingStars rating={product.rating} size={12} />
          <Text style={styles.ratingText}>({product.rating?.toFixed(1)})</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleQuickAdd}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    height: 36,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
