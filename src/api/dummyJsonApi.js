import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://dummyjson.com';
const CACHE_KEY_PREFIX = '@ecommerce_cache_';
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

export const dummyJsonApi = {
  // Fetch paginated products
  async getProducts(limit = 10, skip = 0) {
    const cacheKey = `${CACHE_KEY_PREFIX}products_${limit}_${skip}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          return parsed.data;
        }
      }

      const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
      return data;
    } catch (error) {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached).data;
      throw error;
    }
  },

  // Search products
  async searchProducts(query, limit = 10, skip = 0) {
    const cleanQuery = encodeURIComponent(query.trim());
    const res = await fetch(`${BASE_URL}/products/search?q=${cleanQuery}&limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  },

  // Get products by category
  async getProductsByCategory(category, limit = 10, skip = 0) {
    const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  },

  // Get categories
  async getCategories() {
    const cacheKey = `${CACHE_KEY_PREFIX}categories`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);

      const res = await fetch(`${BASE_URL}/products/categories`);
      if (!res.ok) throw new Error(`Failed to fetch categories`);
      const data = await res.json();

      const formatted = Array.isArray(data)
        ? data.slice(0, 10).map((item) => {
            if (typeof item === 'string') {
              return { slug: item, name: item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ') };
            }
            return { slug: item.slug || item.name, name: item.name || item.slug };
          })
        : [];

      await AsyncStorage.setItem(cacheKey, JSON.stringify(formatted));
      return formatted;
    } catch (e) {
      return [
        { slug: 'beauty', name: 'Beauty' },
        { slug: 'fragrances', name: 'Fragrances' },
        { slug: 'furniture', name: 'Furniture' },
        { slug: 'groceries', name: 'Groceries' },
        { slug: 'laptops', name: 'Laptops' },
        { slug: 'smartphones', name: 'Smartphones' },
      ];
    }
  },

  // Get single product detail
  async getProductById(id) {
    const cacheKey = `${CACHE_KEY_PREFIX}product_${id}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          return parsed.data;
        }
      }

      const res = await fetch(`${BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
      return data;
    } catch (error) {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached).data;
      throw error;
    }
  },
};
