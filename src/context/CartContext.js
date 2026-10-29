import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';





























export const CartContext = createContext(undefined);

const CART_STORAGE_KEY = '@shopee_cart_state_v1';
const FREE_SHIPPING_THRESHOLD = 50; // $50 for Free Shipping

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [appliedVoucher, setAppliedVoucher] = useState({
    code: 'SHOPEE5OFF',
    discountAmount: 5,
    minOrderValue: 20,
    description: 'Giảm $5 cho đơn từ $20'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setCartItems(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error loading cart from storage', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems)).catch((e) =>
      console.error('Error saving cart to storage', e)
      );
    }
  }, [cartItems, isLoaded]);

  // Add item to cart
  const addToCart = (product, quantity = 1, variation) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99)
        };
        return updated;
      }
      return [
      {
        product,
        quantity: Math.min(quantity, product.stock || 99),
        selected: true,
        selectedVariation: variation || 'Tiêu chuẩn'
      },
      ...prev];

    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
    prev.map((item) => {
      if (item.product.id === productId) {
        const maxStock = item.product.stock || 99;
        return {
          ...item,
          quantity: Math.min(quantity, maxStock)
        };
      }
      return item;
    })
    );
  };

  // Toggle selection for checkout
  const toggleItemSelection = (productId) => {
    setCartItems((prev) =>
    prev.map((item) =>
    item.product.id === productId ? { ...item, selected: !item.selected } : item
    )
    );
  };

  // Select all or deselect all
  const selectAllItems = (selected) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, selected })));
  };

  // Clear all
  const clearCart = () => {
    setCartItems([]);
  };

  // Apply voucher
  const applyVoucher = (voucher) => {
    setAppliedVoucher(voucher);
  };

  // Derived values
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const selectedItems = cartItems.filter((item) => item.selected);
  const selectedItemCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const rawTotalPrice = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discount =
  appliedVoucher && rawTotalPrice >= appliedVoucher.minOrderValue ?
  appliedVoucher.discountAmount :
  0;

  const finalPrice = Math.max(0, rawTotalPrice - discount);
  const freeShippingEligible = rawTotalPrice >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - rawTotalPrice);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        selectAllItems,
        clearCart,
        totalItemCount,
        selectedItemCount,
        totalPrice: rawTotalPrice,
        discountAmount: discount,
        finalPrice,
        appliedVoucher,
        applyVoucher,
        freeShippingEligible,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping
      }}>
      
      {children}
    </CartContext.Provider>);

};