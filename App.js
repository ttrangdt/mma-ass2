import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from './src/context/CartContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <FavoritesProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </FavoritesProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}
