import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity } from
'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../hooks/useFavorites';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { SHOPEE_COLORS } from '../constants/theme';


export const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { favorites, favoritesCount } = useFavorites();

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id, title: product.title });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Sản phẩm Yêu thích ({favoritesCount})
        </Text>
      </View>

      {/* Favorites List or Empty State */}
      {favorites.length === 0 ?
      <View style={styles.emptyContainer}>
          <EmptyState
          icon="heart-outline"
          title="Chưa có sản phẩm yêu thích"
          description="Hãy bấm vào biểu tượng trái tim ở góc mỗi sản phẩm để lưu lại những món bạn quan tâm nhé!"
          actionLabel="Khám phá ngay"
          onAction={() => navigation.navigate('Home')} />
        
        </View> :

      <FlatList
        data={favorites}
        keyExtractor={(item) => `fav_${item.id}`}
        renderItem={({ item }) =>
        <ProductCard product={item} onPress={handleProductPress} />
        }
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false} />

      }
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    paddingVertical: 12
  },
  columnWrapper: {
    paddingHorizontal: 8,
    justifyContent: 'space-between'
  }
});