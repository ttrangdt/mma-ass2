import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext(undefined);

const CART_STORAGE_KEY = '@ecommerce_cart_state';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
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
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99),
        };
        return updated;
      }
      return [
        {
          product,
          quantity: Math.min(quantity, product.stock || 99),
        },
        ...prev,
      ];
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
          return {
            ...item,
            quantity: Math.min(quantity, item.product.stock || 99),
          };
        }
        return item;
      })
    );
  };

  // Clear all
  const clearCart = () => {
    setCartItems([]);
  };

  // Derived values
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
