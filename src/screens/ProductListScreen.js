import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../hooks/useProducts';
import { dummyJsonApi } from '../api/dummyJsonApi';
import { ProductCard } from '../components/product/ProductCard';
import { Header } from '../components/common/Header';
import { CategoryBar } from '../components/product/CategoryBar';
import { SortFilterBar } from '../components/product/SortFilterBar';
import { EmptyState } from '../components/common/EmptyState';
import { NotificationToast } from '../components/common/NotificationToast';
import { VisualSearchModal } from '../components/image/VisualSearchModal';
import { COLORS } from '../constants/theme';

export const ProductListScreen = () => {
  const navigation = useNavigation();
  const {
    products,
    loading,
    loadingMore,
    refreshing,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    total,
    loadMore,
    onRefresh,
    hasMore,
  } = useProducts();

  const [categories, setCategories] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('Đã thêm vào giỏ hàng!');
  const [visualSearchVisible, setVisualSearchVisible] = useState(false);

  useEffect(() => {
    dummyJsonApi
      .getCategories()
      .then((data) => setCategories(data))
      .catch((e) => console.warn('Failed categories', e));
  }, []);

  const showToast = (msg) => {
    if (msg) setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id, title: product.title });
  };

  const handleVisualSearch = (keyword) => {
    setSearchQuery(keyword);
    showToast(`Tìm kiếm "${keyword}"`);
  };

  const renderHeader = () => (
    <View>
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />
      <SortFilterBar
        currentSort={sortOption}
        onSortChange={setSortOption}
        totalResults={total}
      />
      {searchQuery ? (
        <View style={styles.searchNotice}>
          <Text style={styles.searchNoticeText}>
            Kết quả cho: <Text style={styles.searchHighlight}>"{searchQuery}"</Text> ({total} sản phẩm)
          </Text>
        </View>
      ) : null}
    </View>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.footerText}>Đang tải thêm...</Text>
        </View>
      );
    }
    if (!hasMore && products.length > 0) {
      return (
        <View style={styles.footerEnded}>
          <Text style={styles.footerEndedText}>Đã xem hết sản phẩm</Text>
        </View>
      );
    }
    return <View style={{ height: 16 }} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Clean Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCameraPress={() => setVisualSearchVisible(true)}
        onCartPress={() => navigation.navigate('Cart')}
        placeholder="Tìm kiếm sản phẩm..."
      />

      {/* Product List */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải danh sách sản phẩm...</Text>
        </View>
      ) : error ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Không thể tải sản phẩm"
          description={error}
          actionLabel="Thử lại"
          onAction={onRefresh}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => `prod_${item.id}`}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onAddedToCartToast={() => showToast('Đã thêm sản phẩm vào giỏ hàng!')}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Không tìm thấy sản phẩm"
              description={`Không có kết quả nào với "${searchQuery}". Hãy thử từ khóa khác.`}
              actionLabel="Xóa tìm kiếm"
              onAction={() => setSearchQuery('')}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Visual Search Modal */}
      <VisualSearchModal
        visible={visualSearchVisible}
        onClose={() => setVisualSearchVisible(false)}
        onSearchByKeyword={handleVisualSearch}
      />

      <NotificationToast visible={toastVisible} message={toastMessage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  searchNotice: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchNoticeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  searchHighlight: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  footerLoader: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerEnded: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  footerEndedText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
