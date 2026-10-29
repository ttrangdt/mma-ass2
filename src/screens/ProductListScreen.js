import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView } from
'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../hooks/useProducts';
import { dummyJsonApi } from '../api/dummyJsonApi';

import { ProductCard } from '../components/product/ProductCard';
import { HeaderShopee } from '../components/common/HeaderShopee';
import { BannerSlider } from '../components/product/BannerSlider';
import { CategoryBar } from '../components/product/CategoryBar';
import { SortFilterBar } from '../components/product/SortFilterBar';
import { EmptyState } from '../components/common/EmptyState';
import { NotificationToast } from '../components/common/NotificationToast';
import { VisualSearchModal } from '../components/image/VisualSearchModal';
import { ShopeeAiModal } from '../components/ai/ShopeeAiModal';
import { SHOPEE_COLORS } from '../constants/theme';

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
    hasMore
  } = useProducts();

  const [categories, setCategories] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('Đã thêm vào Giỏ hàng!');
  const [visualSearchVisible, setVisualSearchVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // Load categories
  useEffect(() => {
    dummyJsonApi.
    getCategories().
    then((data) => setCategories(data)).
    catch((e) => console.warn('Failed categories', e));
  }, []);

  const showToast = (msg) => {
    if (msg) setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id, title: product.title });
  };

  const handleVisualSearch = (keyword) => {
    setSearchQuery(keyword);
    showToast(`Đang tìm sản phẩm liên quan "${keyword}"...`);
  };

  const renderHeader = () =>
  <View style={styles.listHeader}>
      {!searchQuery &&
    <>
          <BannerSlider />
          <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)} />
      
        </>
    }

      {/* Shopee Flash Sale bar indicator if not searching */}
      {!searchQuery && selectedCategory === 'all' &&
    <View style={styles.flashSaleHeader}>
          <View style={styles.flashSaleLeft}>
            <Text style={styles.flashSaleLogo}>GỢI Ý HÔM NAY</Text>
            <View style={styles.dailyDiscoverTag}>
              <Text style={styles.dailyDiscoverTagText}>Deal Siêu Hot</Text>
            </View>
          </View>
          <Text style={styles.totalFoundText}>{total} sản phẩm</Text>
        </View>
    }

      {/* Search results banner */}
      {searchQuery ?
    <View style={styles.searchSummaryBar}>
          <Text style={styles.searchSummaryText}>
            Kết quả tìm kiếm cho: <Text style={styles.searchHighlight}>"{searchQuery}"</Text> ({total} sản phẩm)
          </Text>
        </View> :
    null}

      <SortFilterBar
      currentSort={sortOption}
      onSortChange={setSortOption}
      totalResults={total} />
    
    </View>;


  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={SHOPEE_COLORS.primary} />
          <Text style={styles.footerText}>Đang tải thêm sản phẩm...</Text>
        </View>);

    }

    if (!hasMore && products.length > 0) {
      return (
        <View style={styles.footerEnded}>
          <View style={styles.dividerLine} />
          <Text style={styles.footerEndedText}>Bạn đã xem hết sản phẩm</Text>
          <View style={styles.dividerLine} />
        </View>);

    }

    return <View style={{ height: 24 }} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Shopee Header with Search, Visual Search, AI Bot, and Cart */}
      <HeaderShopee
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCameraPress={() => setVisualSearchVisible(true)}
        onCartPress={() => navigation.navigate('Cart')}
        onAiPress={() => setAiModalVisible(true)}
        placeholder="Tìm kiếm trên Shopee..." />
      

      {/* Main Product Feed with FlatList */}
      {loading && !refreshing ?
      <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={SHOPEE_COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải sản phẩm Shopee...</Text>
        </View> :
      error ?
      <EmptyState
        icon="alert-circle-outline"
        title="Không thể tải sản phẩm"
        description={error}
        actionLabel="Tải lại trang"
        onAction={onRefresh} /> :


      <FlatList
        data={products}
        keyExtractor={(item) => `prod_${item.id}`}
        renderItem={({ item }) =>
        <ProductCard
          product={item}
          onPress={handleProductPress}
          onAddedToCartToast={() => showToast('Đã thêm sản phẩm vào giỏ hàng!')} />

        }
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
        <EmptyState
          icon="search-outline"
          title="Không tìm thấy sản phẩm"
          description={`Không có kết quả nào phù hợp với từ khóa "${searchQuery}". Hãy thử tìm kiếm từ khóa khác!`}
          actionLabel="Xóa bộ lọc tìm kiếm"
          onAction={() => setSearchQuery('')} />

        }
        // Pagination requirements:
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[SHOPEE_COLORS.primary]}
          tintColor={SHOPEE_COLORS.primary} />

        }
        showsVerticalScrollIndicator={false} />

      }

      {/* Floating Visual Search Modal */}
      <VisualSearchModal
        visible={visualSearchVisible}
        onClose={() => setVisualSearchVisible(false)}
        onSearchByKeyword={handleVisualSearch} />
      

      {/* Floating Gemini AI Shopping Assistant Modal */}
      <ShopeeAiModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onSearchProduct={(q) => {
          setSearchQuery(q);
          setAiModalVisible(false);
        }} />
      

      {/* Toast Notification */}
      <NotificationToast visible={toastVisible} message={toastMessage} />
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SHOPEE_COLORS.background
  },
  listContent: {
    paddingBottom: 24
  },
  listHeader: {
    marginBottom: 8
  },
  columnWrapper: {
    paddingHorizontal: 8,
    justifyContent: 'space-between'
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SHOPEE_COLORS.background,
    padding: 24
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: SHOPEE_COLORS.textSecondary
  },
  flashSaleHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  flashSaleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  flashSaleLogo: {
    fontSize: 14,
    fontWeight: '800',
    color: SHOPEE_COLORS.primary,
    letterSpacing: 0.5
  },
  dailyDiscoverTag: {
    backgroundColor: '#FFE8E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3
  },
  dailyDiscoverTagText: {
    color: SHOPEE_COLORS.primary,
    fontSize: 10,
    fontWeight: '700'
  },
  totalFoundText: {
    fontSize: 11,
    color: SHOPEE_COLORS.textMuted
  },
  searchSummaryBar: {
    backgroundColor: '#FFF8F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE7DF'
  },
  searchSummaryText: {
    fontSize: 12,
    color: SHOPEE_COLORS.textSecondary
  },
  searchHighlight: {
    color: SHOPEE_COLORS.primary,
    fontWeight: '700'
  },
  footerLoader: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  footerText: {
    fontSize: 12,
    color: SHOPEE_COLORS.textSecondary
  },
  footerEnded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 12
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0'
  },
  footerEndedText: {
    fontSize: 12,
    color: SHOPEE_COLORS.textMuted
  }
});