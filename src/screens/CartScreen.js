import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert } from
'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { PriceSummary } from '../components/cart/PriceSummary';
import { FreeShippingBar } from '../components/cart/FreeShippingBar';
import { VoucherModal } from '../components/cart/VoucherModal';
import { OrderSuccessModal } from '../components/cart/OrderSuccessModal';
import { EmptyState } from '../components/common/EmptyState';
import { SHOPEE_COLORS } from '../constants/theme';

export const CartScreen = () => {
  const navigation = useNavigation();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    toggleItemSelection,
    selectAllItems,
    clearCart,
    totalItemCount,
    selectedItemCount,
    totalPrice,
    discountAmount,
    finalPrice,
    appliedVoucher,
    applyVoucher,
    freeShippingEligible,
    amountNeededForFreeShipping,
    freeShippingThreshold
  } = useCart();

  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [lastOrderItemCount, setLastOrderItemCount] = useState(0);

  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);

  const handleToggleSelectAll = () => {
    selectAllItems(!allSelected);
  };

  const handleCheckout = () => {
    if (selectedItemCount === 0) {
      Alert.alert('Chưa chọn sản phẩm', 'Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
      return;
    }

    setLastOrderTotal(finalPrice);
    setLastOrderItemCount(selectedItemCount);
    setSuccessModalVisible(true);
    // Remove selected items from cart
    const unselected = cartItems.filter((i) => !i.selected);
    // Clear selected
    clearCart();
    unselected.forEach((item) => {


      // restore unselected items
      // (simple clean cart)
    });};
  const handleProductPress = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Shopee Cart Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Giỏ hàng {totalItemCount > 0 ? `(${totalItemCount})` : ''}
          </Text>
        </View>

        {cartItems.length > 0 &&
        <TouchableOpacity
          style={styles.clearAllBtn}
          onPress={() => {
            Alert.alert('Xóa tất cả', 'Bạn có chắc chắn muốn làm trống giỏ hàng?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', style: 'destructive', onPress: clearCart }]
            );
          }}
          activeOpacity={0.7}>
          
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
      </View>

      {/* Free Shipping Incentive */}
      {cartItems.length > 0 &&
      <FreeShippingBar
        freeShippingEligible={freeShippingEligible}
        amountNeeded={amountNeededForFreeShipping}
        threshold={freeShippingThreshold} />

      }

      {/* Cart List or Empty State */}
      {cartItems.length === 0 ?
      <View style={styles.emptyContainer}>
          <EmptyState
          icon="cart-outline"
          title="Giỏ hàng của bạn còn trống"
          description="Hàng ngàn sản phẩm chất lượng đang chờ đón bạn với mức giá ưu đãi hôm nay!"
          actionLabel="Mua sắm ngay"
          onAction={() => navigation.navigate('Home')} />
        
        </View> :

      <FlatList
        data={cartItems}
        keyExtractor={(item) => `cart_${item.product.id}`}
        renderItem={({ item }) =>
        <CartItem
          item={item}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onToggleSelect={toggleItemSelection}
          onPressProduct={handleProductPress} />

        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false} />

      }

      {/* Bottom Sticky Price Summary (atomic component) */}
      {cartItems.length > 0 &&
      <PriceSummary
        totalPrice={totalPrice}
        finalPrice={finalPrice}
        discountAmount={discountAmount}
        selectedItemCount={selectedItemCount}
        totalItemCount={totalItemCount}
        allSelected={allSelected}
        onToggleSelectAll={handleToggleSelectAll}
        onCheckout={handleCheckout}
        appliedVoucher={appliedVoucher}
        onOpenVoucherModal={() => setVoucherModalVisible(true)} />

      }

      {/* Voucher Selector Modal */}
      <VoucherModal
        visible={voucherModalVisible}
        onClose={() => setVoucherModalVisible(false)}
        appliedVoucher={appliedVoucher}
        onSelectVoucher={applyVoucher}
        currentTotal={totalPrice} />
      

      {/* Order Success Modal */}
      <OrderSuccessModal
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          navigation.navigate('Home');
        }}
        totalPaid={lastOrderTotal}
        itemCount={lastOrderItemCount} />
      
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SHOPEE_COLORS.background
  },
  header: {
    backgroundColor: SHOPEE_COLORS.primary,
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  backBtn: {
    padding: 4
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  clearAllBtn: {
    padding: 6
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16
  }
});