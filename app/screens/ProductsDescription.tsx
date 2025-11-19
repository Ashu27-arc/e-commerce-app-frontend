import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, borderRadius } from '../../utils/theme'
import { router, useLocalSearchParams } from 'expo-router'
import { useCart } from '../../utils/cartContext'
import { useWishlist } from '../../utils/wishlistContext'

interface ProductDescriptionProps {
  product?: {
    _id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    image: string
    images?: string[]
    rating?: number
    reviewCount?: number
    colors?: string[]
  }
}

const ProductsDescription = ({ product }: ProductDescriptionProps) => {
  const params = useLocalSearchParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)
  
  // Parse product data from params
  const productFromParams = params.productData ? JSON.parse(params.productData as string) : null

  // Default product data for electronics/accessories
  const defaultProduct = {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life. Crystal clear sound quality with deep bass and comfortable over-ear design. Perfect for music lovers and professionals.',
    price: 2999,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
    ],
    rating: 4.0,
    reviewCount: 12,
    colors: ['#2D5F3F', '#000000', '#5B4FFF', '#4FB3FF']
  }

  const displayProduct = productFromParams || product || defaultProduct
  const isWishlisted = isInWishlist(displayProduct._id)
  
  const handleAddToCart = () => {
    addToCart(displayProduct)
    router.push('/screens/CartScreen')
  }
  
  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(displayProduct._id)
    } else {
      addToWishlist(displayProduct)
    }
  }
  const images = displayProduct.images || [displayProduct.image]
  const availableColors = displayProduct.colors || ['#2D5F3F', '#000000', '#5B4FFF', '#4FB3FF']

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={star <= rating ? '#FFB800' : '#D1D5DB'}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product detail</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleToggleWishlist}>
          <Ionicons 
            name={isWishlisted ? "heart" : "heart-outline"} 
            size={24} 
            color={isWishlisted ? "#FF6B6B" : "#000"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image Carousel */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: images[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {images.map((_: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
              >
                <View
                  style={[
                    styles.indicator,
                    selectedImageIndex === index && styles.indicatorActive
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          {/* Product Name and Price */}
          <View style={styles.nameAndPriceContainer}>
            <Text style={styles.productName}>{displayProduct.name}</Text>
            <View style={styles.priceContainer}>
              {displayProduct.originalPrice && (
                <Text style={styles.originalPrice}>₹{displayProduct.originalPrice}</Text>
              )}
              <Text style={styles.price}>₹{displayProduct.price}</Text>
            </View>
          </View>

          {/* Rating */}
          <TouchableOpacity 
            style={styles.ratingContainer}
            onPress={() => router.push('/screens/ReviewScreen')}
          >
            {renderStars(displayProduct.rating || 4)}
            <Text style={styles.ratingText}>
              {displayProduct.rating?.toFixed(1)} ({displayProduct.reviewCount} reviews)
            </Text>
          </TouchableOpacity>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text
              style={styles.description}
              numberOfLines={showFullDescription ? undefined : 3}
            >
              {displayProduct.description}
            </Text>
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.moreText}>
                {showFullDescription ? 'less' : 'more'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Colors */}
          <View style={styles.colorsSection}>
            <Text style={styles.sectionTitle}>Colors</Text>
            <View style={styles.colorsContainer}>
              {availableColors.map((color: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedColor(index)}
                  style={[
                    styles.colorButton,
                    selectedColor === index && styles.colorButtonSelected
                  ]}
                >
                  <View style={[styles.colorCircle, { backgroundColor: color }]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color="#FFF" />
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: '#F9FAFB',
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  imageIndicators: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  indicatorActive: {
    backgroundColor: '#000',
  },
  infoSection: {
    padding: spacing.lg,
  },
  nameAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  descriptionContainer: {
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  moreText: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  colorsSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: spacing.md,
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#D97706',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  addToCartButton: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 999,
    gap: spacing.sm,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default ProductsDescription