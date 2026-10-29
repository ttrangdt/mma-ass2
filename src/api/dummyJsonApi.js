import AsyncStorage from '@react-native-async-storage/async-storage';


const BASE_URL = 'https://dummyjson.com';
const CACHE_KEY_PREFIX = '@shopee_cache_';
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

const LOCATIONS = [
'TP. Hồ Chí Minh',
'Hà Nội',
'Đà Nẵng',
'Bình Dương',
'Đồng Nai',
'Cần Thơ',
'Hải Phòng'];


// Helper to add Shopee mock fields deterministically based on product ID
export function enrichProductWithShopeeMeta(product) {
  const seed = product.id * 17;
  const soldCount = product.stock > 0 ? seed % 4500 + 120 : seed % 100;
  const location = LOCATIONS[product.id % LOCATIONS.length];
  const isMall = product.id % 3 === 0;
  const isPreferred = !isMall && product.id % 2 === 0;

  return {
    ...product,
    soldCount,
    location,
    isMall,
    isPreferred
  };
}

export const dummyJsonApi = {
  // Fetch paginated products
  async getProducts(limit = 10, skip = 0) {
    const cacheKey = `${CACHE_KEY_PREFIX}products_${limit}_${skip}`;
    try {
      // Check cache first for instant loading
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
      data.products = data.products.map(enrichProductWithShopeeMeta);

      // Save to cache
      await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
      return data;
    } catch (error) {
      // Fallback to cache if network fails
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached).data;
      }
      throw error;
    }
  },

  // Search products
  async searchProducts(query, limit = 10, skip = 0) {
    const cleanQuery = encodeURIComponent(query.trim());
    const res = await fetch(`${BASE_URL}/products/search?q=${cleanQuery}&limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    data.products = data.products.map(enrichProductWithShopeeMeta);
    return data;
  },

  // Get products by category
  async getProductsByCategory(category, limit = 10, skip = 0) {
    const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    data.products = data.products.map(enrichProductWithShopeeMeta);
    return data;
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

      // Map to consistent format
      const formatted = Array.isArray(data) ?
      data.slice(0, 12).map((item) => {
        if (typeof item === 'string') {
          return { slug: item, name: item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ') };
        }
        return { slug: item.slug || item.name, name: item.name || item.slug };
      }) :
      [];

      await AsyncStorage.setItem(cacheKey, JSON.stringify(formatted));
      return formatted;
    } catch (e) {
      return [
      { slug: 'beauty', name: 'Làm đẹp' },
      { slug: 'fragrances', name: 'Nước hoa' },
      { slug: 'furniture', name: 'Nội thất' },
      { slug: 'groceries', name: 'Bách hóa' },
      { slug: 'laptops', name: 'Laptop' },
      { slug: 'smartphones', name: 'Điện thoại' },
      { slug: 'skin-care', name: 'Chăm sóc da' }];

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
      const enriched = enrichProductWithShopeeMeta(data);
      await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: enriched }));
      return enriched;
    } catch (error) {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached).data;
      throw error;
    }
  }
};