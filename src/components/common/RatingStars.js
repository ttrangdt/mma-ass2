import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHOPEE_COLORS } from '../../constants/theme';








export const RatingStars = ({
  rating,
  size = 10,
  showText = false,
  reviewsCount
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => {
          if (i <= fullStars) {
            return <Ionicons key={i} name="star" size={size} color={SHOPEE_COLORS.starYellow} />;
          }
          if (i === fullStars + 1 && hasHalfStar) {
            return (
              <Ionicons key={i} name="star-half" size={size} color={SHOPEE_COLORS.starYellow} />);

          }
          return (
            <Ionicons
              key={i}
              name="star-outline"
              size={size}
              color={SHOPEE_COLORS.borderDark} />);


        })}
      </View>
      {showText &&
      <Text style={styles.ratingText}>
          {rating.toFixed(1)} {reviewsCount ? `(${reviewsCount})` : ''}
        </Text>
      }
    </View>);

};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: 4
  },
  ratingText: {
    fontSize: 11,
    color: SHOPEE_COLORS.textSecondary,
    fontWeight: '500'
  }
});