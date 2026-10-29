import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { dummyJsonApi } from '../api/dummyJsonApi';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { COLORS } from '../constants/theme';
import { RatingStars } from '../components/common/RatingStars';
import { NotificationToast } from '../components/common/NotificationToast';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { addToCart, totalItemCount } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let isMounted = true;
    dummyJsonApi
      .getProductById(productId)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Không thể tải chi tiết sản phẩm.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    showToast(`Đã thêm ${quantity} sản phẩm vào giỏ!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigation.navigate('Cart');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết sản phẩm...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>{error || 'Không tìm thấy sản phẩm'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const favorite = isFavorite(product.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => toggleFavorite(product)}>
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={favorite ? COLORS.danger : COLORS.text}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={24} color={COLORS.text} />
            {totalItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalItemCount > 99 ? '99+' : totalItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Info Block */}
        <View style={styles.infoBlock}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <RatingStars rating={product.rating} size={14} showText />
            <Text style={styles.categoryTag}>{product.category}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Thương hiệu:</Text>
            <Text style={styles.metaValue}>{product.brand || 'Khác'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Tình trạng:</Text>
            <Text style={styles.metaValue}>
              {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descBlock}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {/* Quantity Controls */}
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Ionicons name="remove" size={16} color={quantity <= 1 ? '#CBD5E1' : COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.stepQty}>{quantity}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Ionicons name="add" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={handleBuyNow}
          activeOpacity={0.8}
        >
          <Text style={styles.buyNowText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>

      <NotificationToast visible={toastVisible} message={toastMessage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.danger,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    width: width,
    height: width * 0.75,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  image: {
    width: '90%',
    height: '90%',
  },
  infoBlock: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
    lineHeight: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  categoryTag: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'capitalize',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  metaLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  descBlock: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
  },
  stepBtn: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  stepQty: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    height: 40,
    borderRadius: 8,
  },
  addToCartText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  buyNowBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 40,
    borderRadius: 8,
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.danger,
    marginTop: 12,
  },
  backBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
