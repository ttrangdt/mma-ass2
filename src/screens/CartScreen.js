import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { PriceSummary } from '../components/cart/PriceSummary';
import { EmptyState } from '../components/common/EmptyState';
import { COLORS } from '../constants/theme';

export const CartScreen = () => {
  const navigation = useNavigation();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemCount,
    totalPrice,
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    Alert.alert(
      'Đặt hàng thành công',
      `Đơn hàng trị giá $${totalPrice.toFixed(2)} đã được tạo thành công!`,
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert('Xóa tất cả', 'Bạn có chắc muốn làm trống giỏ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: clearCart },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            Giỏ hàng {totalItemCount > 0 ? `(${totalItemCount})` : ''}
          </Text>
        </View>

        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        )}
      </View>

      {/* Cart List */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="cart-outline"
            title="Giỏ hàng trống"
            description="Bạn chưa thêm sản phẩm nào vào giỏ hàng."
            actionLabel="Mua sắm ngay"
            onAction={() => navigation.navigate('Home')}
          />
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => `cart_${item.product.id}`}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onPressProduct={(id) => navigation.navigate('ProductDetail', { productId: id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Sticky Price Summary */}
      {cartItems.length > 0 && (
        <PriceSummary
          totalPrice={totalPrice}
          totalItemCount={totalItemCount}
          onCheckout={handleCheckout}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  clearBtn: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
});
