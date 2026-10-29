import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity } from
'react-native';
import { SHOPEE_COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 24;

const BANNERS = [
{
  id: 1,
  title: 'SIÊU SALE 11.11 - VOUCHER 1 TRIỆU',
  subtitle: 'Freeship đơn từ 0Đ • Giảm giá đến 50%',
  image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
  tag: 'HOT DEAL'
},
{
  id: 2,
  title: 'HÀNG HIỆU SHOPEE MALL',
  subtitle: 'Chính hãng 100% • Miễn phí trả hàng 15 ngày',
  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
  tag: 'OFFICIAL'
},
{
  id: 3,
  title: 'CÔNG NGHỆ & ĐIỆN TỬ GIÁ SỐC',
  subtitle: 'Flash Sale mỗi ngày • Thu cũ đổi mới',
  image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
  tag: 'TECH SALE'
}];


export const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % BANNERS.length;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * BANNER_WIDTH,
        animated: true
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
    if (slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContent}>
        
        {BANNERS.map((banner) =>
        <TouchableOpacity
          key={banner.id}
          style={styles.bannerItem}
          activeOpacity={0.9}>
          
            <Image
            source={{ uri: banner.image }}
            style={styles.bannerImage}
            resizeMode="cover" />
          
            <View style={styles.bannerOverlay}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{banner.tag}</Text>
              </View>
              <Text style={styles.title} numberOfLines={1}>
                {banner.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {banner.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.paginationDots}>
        {BANNERS.map((_, i) =>
        <View
          key={i}
          style={[
          styles.dot,
          activeIndex === i ? styles.activeDot : styles.inactiveDot]
          } />

        )}
      </View>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center'
  },
  scrollContent: {
    paddingHorizontal: 12
  },
  bannerItem: {
    width: BANNER_WIDTH,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E293B'
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.65
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    justifyContent: 'flex-end'
  },
  tag: {
    backgroundColor: SHOPEE_COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 4
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2
  },
  subtitle: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '500'
  },
  paginationDots: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6
  },
  dot: {
    height: 4,
    borderRadius: 2
  },
  activeDot: {
    width: 16,
    backgroundColor: SHOPEE_COLORS.primary
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#D1D5DB'
  }
});