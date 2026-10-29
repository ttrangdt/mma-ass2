import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { ProductListScreen } from '../screens/ProductListScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SHOPEE_COLORS } from '../constants/theme';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';














const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { totalItemCount } = useCart();
  const { favoritesCount } = useFavorites();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: SHOPEE_COLORS.primary,
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEEEEE',
          height: 56,
          paddingBottom: 6,
          paddingTop: 6
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600'
        }
      }}>
      
      <Tab.Screen
        name="Home"
        component={ProductListScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, focused }) =>
          <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />

        }} />
      
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Yêu thích',
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: SHOPEE_COLORS.primary,
            fontSize: 9,
            minWidth: 16,
            height: 16
          },
          tabBarIcon: ({ color, focused }) =>
          <Ionicons name={focused ? 'heart' : 'heart-outline'} size={22} color={color} />

        }} />
      
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Giỏ hàng',
          tabBarBadge: totalItemCount > 0 ? totalItemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: SHOPEE_COLORS.primary,
            fontSize: 9,
            minWidth: 16,
            height: 16
          },
          tabBarIcon: ({ color, focused }) =>
          <Ionicons name={focused ? 'cart' : 'cart-outline'} size={23} color={color} />

        }} />
      
    </Tab.Navigator>);

};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}>
        
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>);

};