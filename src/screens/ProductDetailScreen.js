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
  Share,
  SafeAreaView,
  Alert } from
'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { dummyJsonApi } from '../api/dummyJsonApi';

import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { SHOPEE_COLORS } from '../constants/theme';
import { ShopeeBadge } from '../components/common/ShopeeBadge';
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { addToCart, totalItemCount } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let isMounted = true;
    dummyJsonApi.
    getProductById(productId).
    then((data) => {
      if (isMounted) {
        setProduct(data);
        setLoading(false);
      }
    }).
    catch((err) => {
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

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Xem ngay ${product.title} giá chỉ $${product.price} trên Shopee!`
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedQuantity);
    showToast(`Đã thêm ${selectedQuantity} sản phẩm vào giỏ!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, selectedQuantity);
    navigation.navigate('Cart');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={SHOPEE_COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết sản phẩm...</Text>
      </View>);

  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={SHOPEE_COLORS.danger} />
        <Text style={styles.errorText}>{error || 'Không tìm thấy sản phẩm'}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.goBack()}>
          
          <Text style={styles.retryBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>);

  }

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const favorite = isFavorite(product.id);
  const originalPrice = product.discountPercentage ?
  (product.price * (1 + product.discountPercentage / 100)).toFixed(2) :
  null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Shopee Detail Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.iconCircle} onPress={handleShare} activeOpacity={0.7}>
            <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => toggleFavorite(product)}
            activeOpacity={0.7}>
            
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={22}
              color={favorite ? '#FFD839' : '#FFFFFF'} />
            
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.7}>
            
            <Ionicons name="cart-outline" size={22} color="#FFFFFF" />
            {totalItemCount > 0 &&
            <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {totalItemCount > 99 ? '99+' : totalItemCount}
                </Text>
              </View>
            }
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Gallery Carousel */}
        <View style={styles.imageCarouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(index);
            }}>
            
            {images.map((imgUrl, idx) =>
            <Image
              key={idx}
              source={{ uri: imgUrl }}
              style={styles.productLargeImage}
              resizeMode="cover" />

            )}
          </ScrollView>

          {/* Shopee 1/5 Image Counter Badge */}
          <View style={styles.imageIndicatorBadge}>
            <Text style={styles.imageIndicatorText}>
              {activeImageIndex + 1}/{images.length}
            </Text>
          </View>
        </View>

        {/* Shopee Flash Sale Banner Bar */}
        <View style={styles.flashSaleBar}>
          <View style={styles.flashSaleLeft}>
            <Text style={styles.flashSaleLabel}>FLASH SALE</Text>
            <Text style={styles.flashSaleSub}>KẾT THÚC TRONG</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>02</Text>
            </View>
            <Text style={styles.colonText}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>45</Text>
            </View>
            <Text style={styles.colonText}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>18</Text>
            </View>
          </View>
          <View style={styles.flashSaleRight}>
            <Text style={styles.soldBadgeText}>Đang bán chạy</Text>
          </View>
        </View>

        {/* Price & Title Block */}
        <View style={styles.sectionBlock}>
          <View style={styles.priceRow}>
            <Text style={styles.currency}>$</Text>
            <Text style={styles.currentPrice}>{product.price.toFixed(2)}</Text>
            {originalPrice &&
            <Text style={styles.originalPrice}>${originalPrice}</Text>
            }
            {product.discountPercentage > 0 &&
            <View style={styles.discountTag}>
                <Text style={styles.discountTagText}>
                  -{Math.round(product.discountPercentage)}%
                </Text>
              </View>
            }
          </View>

          {/* Product Title */}
          <View style={styles.titleRow}>
            {product.isMall ?
            <ShopeeBadge type="mall" /> :

            <ShopeeBadge type="preferred" />
            }
            <Text style={styles.titleText}>{product.title}</Text>
          </View>

          {/* Rating, Sold, Location */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <RatingStars rating={product.rating} size={13} showText />
            </View>
            <View style={styles.metaDivider} />
            <Text style={styles.metaText}>
              Đã bán {product.soldCount || 450}
            </Text>
            <View style={styles.metaDivider} />
            <Text style={styles.metaText}>
              Kho: {product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng'}
            </Text>
          </View>
        </View>

        {/* Free Shipping & Shopee Assurance Banner */}
        <View style={styles.assuranceBlock}>
          <View style={styles.assuranceItem}>
            <Ionicons name="car-outline" size={18} color={SHOPEE_COLORS.freeshipGreen} />
            <View style={styles.assuranceTextCol}>
              <Text style={styles.assuranceTitle}>Miễn phí vận chuyển</Text>
              <Text style={styles.assuranceSub}>Miễn phí vận chuyển cho đơn hàng từ $50</Text>
            </View>
          </View>
          <View style={styles.assuranceItem}>
            <Ionicons name="shield-checkmark-outline" size={18} color={SHOPEE_COLORS.primary} />
            <View style={styles.assuranceTextCol}>
              <Text style={styles.assuranceTitle}>Shopee Đảm Bảo</Text>
              <Text style={styles.assuranceSub}>3 ngày trả hàng / Hoàn tiền 100% nếu có lỗi</Text>
            </View>
          </View>
        </View>

        {/* Shop Info Card */}
        <View style={styles.shopCard}>
          <View style={styles.shopAvatar}>
            <Ionicons name="storefront" size={24} color={SHOPEE_COLORS.primary} />
          </View>
          <View style={styles.shopDetails}>
            <Text style={styles.shopName}>{product.brand || 'Shopee Mall Official'}</Text>
            <Text style={styles.shopLocation}>{product.location || 'TP. Hồ Chí Minh'}</Text>
          </View>
          <TouchableOpacity style={styles.viewShopBtn} activeOpacity={0.8}>
            <Text style={styles.viewShopText}>Xem Shop</Text>
          </TouchableOpacity>
        </View>

        {/* Product Specifications */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Danh mục</Text>
            <Text style={styles.specValue}>{product.category}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Thương hiệu</Text>
            <Text style={styles.specValue}>{product.brand || 'OEM'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Bảo hành</Text>
            <Text style={styles.specValue}>{product.warrantyInformation || '12 tháng chính hãng'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Vận chuyển</Text>
            <Text style={styles.specValue}>{product.shippingInformation || 'Giao trong 2-3 ngày'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Chính sách hoàn trả</Text>
            <Text style={styles.specValue}>{product.returnPolicy || 'Đổi trả trong 30 ngày'}</Text>
          </View>
        </View>

        {/* Product Description */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 &&
        <View style={styles.sectionBlock}>
            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
              <Text style={styles.reviewCount}>({product.reviews.length} đánh giá)</Text>
            </View>

            {product.reviews.map((rev, idx) =>
          <View key={idx} style={styles.reviewItem}>
                <View style={styles.reviewUserRow}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {rev.reviewerName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.reviewerName}>{rev.reviewerName}</Text>
                    <RatingStars rating={rev.rating} size={11} />
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(rev.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
          )}
          </View>
        }

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Shopee Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.chatActionBtn}
          onPress={() => Alert.alert('Chat với người bán', 'Tính năng trò chuyện trực tiếp với shop!')}
          activeOpacity={0.7}>
          
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={SHOPEE_COLORS.textSecondary} />
          <Text style={styles.chatActionText}>Chat ngay</Text>
        </TouchableOpacity>

        <View style={styles.bottomBarDivider} />

        <TouchableOpacity
          style={styles.addToCartActionBtn}
          onPress={handleAddToCart}
          activeOpacity={0.8}>
          
          <Ionicons name="cart-outline" size={22} color={SHOPEE_COLORS.primary} />
          <Text style={styles.addToCartActionText}>Thêm vào giỏ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowActionBtn}
          onPress={handleBuyNow}
          activeOpacity={0.8}>
          
          <Text style={styles.buyNowActionText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      <NotificationToast visible={toastVisible} message={toastMessage} />
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 10
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: SHOPEE_COLORS.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  container: {
    flex: 1,
    backgroundColor: SHOPEE_COLORS.background
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: SHOPEE_COLORS.textSecondary
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: SHOPEE_COLORS.danger,
    textAlign: 'center'
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: SHOPEE_COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  imageCarouselContainer: {
    width: width,
    height: width,
    position: 'relative',
    backgroundColor: '#F5F5F5'
  },
  productLargeImage: {
    width: width,
    height: width
  },
  imageIndicatorBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  imageIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  flashSaleBar: {
    backgroundColor: SHOPEE_COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  flashSaleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  flashSaleLabel: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    marginRight: 4
  },
  flashSaleSub: {
    color: '#FFE8E0',
    fontSize: 10,
    fontWeight: '600'
  },
  timeBox: {
    backgroundColor: '#000000',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  colonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 10
  },
  flashSaleRight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  soldBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  sectionBlock: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 8
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8
  },
  currency: {
    fontSize: 16,
    fontWeight: '700',
    color: SHOPEE_COLORS.primary
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: SHOPEE_COLORS.primary,
    marginRight: 8
  },
  originalPrice: {
    fontSize: 14,
    color: SHOPEE_COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginRight: 8
  },
  discountTag: {
    backgroundColor: '#FFE9E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2
  },
  discountTagText: {
    color: SHOPEE_COLORS.primary,
    fontSize: 11,
    fontWeight: '800'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 8
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: SHOPEE_COLORS.text,
    lineHeight: 22
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  ratingBox: {},
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E5E5E5'
  },
  metaText: {
    fontSize: 12,
    color: SHOPEE_COLORS.textSecondary
  },
  assuranceBlock: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 10
  },
  assuranceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  assuranceTextCol: {
    flex: 1
  },
  assuranceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: SHOPEE_COLORS.text
  },
  assuranceSub: {
    fontSize: 11,
    color: SHOPEE_COLORS.textSecondary
  },
  shopCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  shopAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  shopDetails: {
    flex: 1
  },
  shopName: {
    fontSize: 14,
    fontWeight: '700',
    color: SHOPEE_COLORS.text
  },
  shopLocation: {
    fontSize: 11,
    color: SHOPEE_COLORS.textSecondary,
    marginTop: 2
  },
  viewShopBtn: {
    borderWidth: 1,
    borderColor: SHOPEE_COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  viewShopText: {
    color: SHOPEE_COLORS.primary,
    fontSize: 12,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: SHOPEE_COLORS.text,
    marginBottom: 10
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  specLabel: {
    width: 130,
    fontSize: 12,
    color: SHOPEE_COLORS.textSecondary
  },
  specValue: {
    flex: 1,
    fontSize: 12,
    color: SHOPEE_COLORS.text,
    fontWeight: '500'
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4B5563'
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  reviewCount: {
    fontSize: 12,
    color: SHOPEE_COLORS.textMuted,
    marginBottom: 10
  },
  reviewItem: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 10
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  userAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563'
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '600',
    color: SHOPEE_COLORS.text,
    marginBottom: 2
  },
  reviewDate: {
    marginLeft: 'auto',
    fontSize: 10,
    color: SHOPEE_COLORS.textMuted
  },
  reviewComment: {
    fontSize: 12,
    color: SHOPEE_COLORS.text,
    lineHeight: 17
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center'
  },
  chatActionBtn: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatActionText: {
    fontSize: 10,
    color: SHOPEE_COLORS.textSecondary,
    marginTop: 2
  },
  bottomBarDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#EEEEEE'
  },
  addToCartActionBtn: {
    flex: 1,
    backgroundColor: '#FFF2EE',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6
  },
  addToCartActionText: {
    color: SHOPEE_COLORS.primary,
    fontSize: 13,
    fontWeight: '700'
  },
  buyNowActionBtn: {
    flex: 1,
    backgroundColor: SHOPEE_COLORS.primary,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buyNowActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  }
});