# Assignment 2: E-Commerce Product App with Pagination and Cart State (Shopee Clone)

Dự án ứng dụng E-Commerce Mobile hoàn chỉnh được xây dựng trên nền tảng **React Native / Expo (TypeScript)** với phong cách thiết kế chuyên nghiệp, mô phỏng chuẩn xác giao diện và trải nghiệm người dùng của **Shopee**.

---

## 📱 Điểm Nổi Bật & Các Tính Năng Đạt Chuẩn

### 1. Màn Hình & Trải Nghiệm Chuẩn Shopee
* **`ProductListScreen` (Trang chủ / Danh sách sản phẩm):**
  * Tích hợp thanh tìm kiếm Shopee Header màu cam đặc trưng (`#EE4D2D`), huy hiệu số lượng giỏ hàng thời gian thực, nút tìm kiếm hình ảnh và trợ lý AI.
  * Carousel banner khuyến mãi tự động chuyển slide (`BannerSlider`).
  * Thanh phân loại danh mục sản phẩm cuộn ngang (`CategoryBar`).
  * Bộ lọc & sắp xếp đa năng (`SortFilterBar`): Phổ biến, Đánh giá cao, Bán chạy, Sắp xếp theo Giá tăng/giảm.
  * Phân trang vô hạn mượt mà bằng `FlatList` với `onEndReached` và `ActivityIndicator`.
  * Hỗ trợ kéo xuống để làm mới (`RefreshControl`).
  * Trạng thái tải (`Loading`), rỗng (`EmptyState`) và lỗi (`ErrorState`) rõ ràng.
* **`ProductDetailScreen` (Chi tiết sản phẩm):**
  * Carousel bộ sưu tập hình ảnh kèm chỉ báo số trang (`1/N`).
  * Đồng hồ đếm ngược Flash Sale rực lửa ("KẾT THÚC TRONG 02:45:18").
  * Huy hiệu **Shopee Mall** / **Yêu thích**, giá bán, giá gốc gạch ngang, % giảm giá, đánh giá sao, số lượng đã bán và tồn kho.
  * Cam kết **Shopee Đảm Bảo** và Miễn phí vận chuyển.
  * Thông tin gian hàng chính hãng (`Storefront`).
  * Chi tiết thông số kỹ thuật (Bảo hành, Vận chuyển, Chính sách đổi trả).
  * Mô tả sản phẩm và danh sách bình luận / đánh giá từ khách hàng thực tế.
  * Thanh thao tác cố định dưới cùng: "Chat ngay", "Thêm vào giỏ", "Mua ngay".
* **`CartScreen` (Giỏ hàng Shopee):**
  * Phân nhóm theo cửa hàng, hiển thị danh sách `CartItem`.
  * Bộ tăng giảm số lượng (`- / +`) với hiệu ứng phản hồi và kiểm tra giới hạn tồn kho.
  * Chọn / bỏ chọn từng sản phẩm hoặc toàn bộ giỏ hàng (`Select All`).
  * Thanh tiến trình Miễn phí vận chuyển ("Mua thêm $X để được Freeship").
  * Áp dụng mã giảm giá Shopee Voucher (`VoucherModal`).
  * Tóm tắt thanh toán thời gian thực (`PriceSummary`) và nút "Mua Hàng (N)".
  * Modal đặt hàng thành công (`OrderSuccessModal`).
* **`FavoritesScreen` (Danh mục Yêu thích / Wishlist):**
  * Lưu trữ danh sách sản phẩm yêu thích độc lập với AsyncStorage.

---

### 2. Các Tính Năng Bonus Nâng Cao
1. **Lưu trữ Caching dữ liệu (Local Storage & Memory):**
   * Tự động cache danh sách sản phẩm, danh mục và chi tiết sản phẩm qua `@react-native-async-storage/async-storage` với cơ chế kiểm tra thời gian hết hạn (TTL).
2. **Quản lý Yêu thích / Wishlist qua Custom Hook:**
   * Triển khai `useFavorites` đồng bộ dữ liệu vào bộ nhớ máy, đánh dấu trực tiếp trên thẻ sản phẩm và màn hình chi tiết.
3. **Tìm kiếm bằng hình ảnh (Visual Search - Image Picker):**
   * Tích hợp `expo-image-picker` cho phép chụp ảnh thực tế hoặc chọn ảnh từ thư viện để AI nhận diện và tự động tìm sản phẩm tương tự.
4. **Trợ lý mua sắm Shopee AI (Gemini AI Shopping Assistant):**
   * Cung cấp chatbot thông minh tư vấn gợi ý quà tặng, so sánh phân khúc sản phẩm, giải đáp chính sách miễn phí vận chuyển 24/7.

---

### 3. Cấu Trúc Kiến Trúc (Atomic Components & Custom Hooks)

```
src/
├── api/
│   └── dummyJsonApi.ts        # Tương tác API DummyJSON, xử lý phân trang & caching
├── constants/
│   └── theme.ts               # Màu sắc Shopee (#EE4D2D, #D0011B, v.v.)
├── types/
│   └── product.ts             # Định nghĩa Type TypeScript cho Product, Cart, Review
├── context/
│   ├── CartContext.tsx        # Quản lý State giỏ hàng toàn cục với Context API
│   └── FavoritesContext.tsx   # Quản lý State danh sách yêu thích
├── hooks/
│   ├── useCart.ts             # Custom hook quản lý logic giỏ hàng
│   ├── useFavorites.ts        # Custom hook yêu thích
│   └── useProducts.ts         # Custom hook fetch dữ liệu, phân trang & tìm kiếm
├── components/
│   ├── common/
│   │   ├── HeaderShopee.tsx   # Header chuẩn phong cách Shopee
│   │   ├── ShopeeBadge.tsx    # Huy hiệu Mall, Yêu thích, Giảm giá
│   │   ├── RatingStars.tsx    # Hiển thị số sao đánh giá
│   │   ├── EmptyState.tsx     # Giao diện khi danh sách rỗng
│   │   └── NotificationToast.tsx # Thông báo nổi "Đã thêm vào giỏ"
│   ├── product/
│   │   ├── ProductCard.tsx    # Thẻ sản phẩm chuẩn lưới 2 cột
│   │   ├── CategoryBar.tsx    # Danh mục cuộn ngang
│   │   ├── BannerSlider.tsx   # Banner carousel khuyến mãi
│   │   └── SortFilterBar.tsx  # Thanh lọc & sắp xếp tab
│   ├── cart/
│   │   ├── CartItem.tsx       # Từng dòng sản phẩm trong giỏ (Atomic component)
│   │   ├── PriceSummary.tsx   # Thanh tóm tắt giá & nút mua (Atomic component)
│   │   ├── FreeShippingBar.tsx# Thanh đo điều kiện Freeship
│   │   └── VoucherModal.tsx   # Bảng chọn voucher giảm giá
│   ├── image/
│   │   └── VisualSearchModal.tsx # Tính năng tìm kiếm bằng hình ảnh
│   └── ai/
│       └── ShopeeAiModal.tsx  # Trợ lý ảo AI mua sắm Shopee
├── screens/
│   ├── ProductListScreen.tsx  # Màn hình chính phân trang vô hạn
│   ├── ProductDetailScreen.tsx# Màn hình chi tiết sản phẩm
│   ├── CartScreen.tsx         # Màn hình giỏ hàng
│   └── FavoritesScreen.tsx    # Màn hình yêu thích
└── navigation/
    └── AppNavigator.tsx       # Cấu hình Stack & Bottom Tab Navigation
```

---

### 4. Hướng Dẫn Chạy Ứng Dụng

Cài đặt phụ thuộc và khởi động ứng dụng:

```bash
# Kiểm tra định dạng TypeScript
npx tsc --noEmit

# Kiểm tra tương thích cấu hình Expo
npx expo-doctor

# Khởi chạy dự án Expo Dev Server
npx expo start
```

* Nhấn `w` để mở xem trên nền tảng Web.
* Nhấn `a` để mở trên thiết bị giả lập Android.
* Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại thật (iOS / Android).

