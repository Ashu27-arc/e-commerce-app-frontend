import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Slider from '@react-native-community/slider'
import { Ionicons } from '@expo/vector-icons'

export interface FilterOptions {
  color?: string
  priceRange: [number, number]
  rating?: number
}

interface ProductsInfoProps {
  onClose?: () => void
  onApplyFilters?: (filters: FilterOptions) => void
}

const ProductsInfo = ({ onClose, onApplyFilters }: ProductsInfoProps) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>('Green')
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 100])
  const [selectedRating, setSelectedRating] = useState<number | undefined>(5)

  const colors = [
    { name: 'Green', color: '#2D5F3F' },
    { name: 'Black', color: '#000000' },
    { name: 'Yellow', color: '#F5C518' }
  ]

  const handleReset = () => {
    setSelectedColor(undefined)
    setPriceRange([0, 200])
    setSelectedRating(undefined)
  }

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        color: selectedColor,
        priceRange,
        rating: selectedRating
      })
    }
    onClose?.()
  }

  const renderStars = (count: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name="star"
            size={20}
            color={star <= count ? '#FF8C00' : '#E0E0E0'}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Color */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Color</Text>
            <Ionicons name="chevron-up" size={20} color="#000" />
          </View>
          <View style={styles.colorContainer}>
            {colors.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.colorButton,
                  selectedColor === item.name && styles.colorButtonSelected
                ]}
                onPress={() => setSelectedColor(item.name)}
              >
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.colorText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Range */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Price range</Text>
            <View style={styles.priceRangeHeader}>
              <Text style={styles.priceRangeText}>₹{priceRange[0]}-{priceRange[1]}</Text>
              <Ionicons name="chevron-up" size={20} color="#000" />
            </View>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={200}
              value={priceRange[1]}
              onValueChange={(value) => setPriceRange([priceRange[0], Math.round(value)])}
              minimumTrackTintColor="#FF8C00"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#FF8C00"
            />
            <View style={styles.priceLabels}>
              <Text style={styles.priceLabel}>₹{priceRange[0]}</Text>
              <Text style={styles.priceLabel}>₹{priceRange[1]}</Text>
            </View>
          </View>
        </View>

        {/* Material */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Material</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Style */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Style</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer rating</Text>
          {[5, 4, 3, 2, 1].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={styles.ratingRow}
              onPress={() => setSelectedRating(rating)}
            >
              <View style={styles.ratingContent}>
                {renderStars(rating)}
                <Text style={styles.ratingText}>& up</Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedRating === rating && styles.radioButtonSelected
              ]}>
                {selectedRating === rating && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Show Results Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.showResultsButton} onPress={handleApplyFilters}>
          <Text style={styles.showResultsText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resetText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  viewAll: {
    fontSize: 14,
    color: '#666',
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  colorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  colorButtonSelected: {
    borderColor: '#FF8C00',
    borderWidth: 2,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  colorText: {
    fontSize: 14,
    color: '#000',
  },
  priceRangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceRangeText: {
    fontSize: 14,
    color: '#666',
  },
  sliderContainer: {
    marginTop: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FF8C00',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF8C00',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  showResultsButton: {
    backgroundColor: '#D97706',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  showResultsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default ProductsInfo
export { ProductsInfo }