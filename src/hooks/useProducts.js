import { useState, useEffect, useCallback, useRef } from 'react';

import { dummyJsonApi } from '../api/dummyJsonApi';



const PAGE_SIZE = 10;

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);

  const isFetchingRef = useRef(false);

  // Fetch initial or refreshed data
  const loadInitialProducts = useCallback(async (query, category) => {
    try {
      setLoading(true);
      setError(null);
      isFetchingRef.current = true;

      let response;
      if (query.trim().length > 0) {
        response = await dummyJsonApi.searchProducts(query, PAGE_SIZE, 0);
      } else if (category !== 'all') {
        response = await dummyJsonApi.getProductsByCategory(category, PAGE_SIZE, 0);
      } else {
        response = await dummyJsonApi.getProducts(PAGE_SIZE, 0);
      }

      setProducts(response.products);
      setTotal(response.total);
      setSkip(PAGE_SIZE);
    } catch (err) {
      setError(err?.message || 'Không thể tải danh sách sản phẩm. Vui lòng thử lại!');
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Effect when searchQuery or selectedCategory changes
  useEffect(() => {
    const handler = setTimeout(() => {
      loadInitialProducts(searchQuery, selectedCategory);
    }, searchQuery ? 400 : 0); // Debounce search

    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategory, loadInitialProducts]);

  // Load more for pagination / infinite scroll
  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || loadingMore || loading) return;
    if (products.length >= total) return; // All loaded

    try {
      setLoadingMore(true);
      isFetchingRef.current = true;

      let response;
      if (searchQuery.trim().length > 0) {
        response = await dummyJsonApi.searchProducts(searchQuery, PAGE_SIZE, skip);
      } else if (selectedCategory !== 'all') {
        response = await dummyJsonApi.getProductsByCategory(selectedCategory, PAGE_SIZE, skip);
      } else {
        response = await dummyJsonApi.getProducts(PAGE_SIZE, skip);
      }

      setProducts((prev) => {
        // Prevent duplicate items
        const existingIds = new Set(prev.map((p) => p.id));
        const newUnique = response.products.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newUnique];
      });
      setSkip((prev) => prev + PAGE_SIZE);
    } catch (err) {
      console.warn('Failed to load more products', err);
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [loadingMore, loading, products.length, total, searchQuery, selectedCategory, skip]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadInitialProducts(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, loadInitialProducts]);

  // Apply in-memory client sort for instant Shopee tab switching
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'sold':
        return (b.soldCount || 0) - (a.soldCount || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0; // Default order
    }
  });

  return {
    products: sortedProducts,
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
    hasMore: products.length < total
  };
};