
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, FlatList, Modal, ScrollView, TextInput } from "react-native";
import Header from "../../components/Header";
import { api } from "../../utils/api";
import { useCart } from "../../utils/cartContext";
import { useWishlist } from "../../utils/wishlistContext";
import { colors, spacing, borderRadius, shadows } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import ProductsInfo, { FilterOptions } from "./ProductsInfo";

const categories = [
  { id: "all", label: "All" },
  { id: "smartphones", label: "Smartphones" },
  { id: "laptops", label: "Laptops" },
  { id: "headphones", label: "Headphones" },
  { id: "smartwatches", label: "Smartwatches" },
  { id: "accessories", label: "Accessories" },
];

const sortOptions = [
  { id: "relevance", label: "Relevance" },
  { id: "popularity", label: "Popularity" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
];

export default function ProductDetailsScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("relevance");
  const [tempSort, setTempSort] = useState("relevance");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions | null>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (sortModalVisible) {
      setTempSort(selectedSort);
    }
  }, [sortModalVisible]);

  const sortProducts = (products: any[]) => {
    const sorted = [...products];
    switch (selectedSort) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "popularity":
        return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      case "relevance":
      default:
        return sorted;
    }
  };

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => {
      const productCategory = p.category?.toLowerCase().trim();
      const selectedCat = selectedCategory.toLowerCase().trim();
      return productCategory === selectedCat || productCategory?.includes(selectedCat);
    });

  // Apply search filter
  const searchFilteredProducts = searchQuery.trim() === ""
    ? filteredProducts
    : filteredProducts.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Apply additional filters from ProductsInfo
  const filterByAdvancedFilters = (products: any[]) => {
    // If no filters applied, return all products
    if (!appliedFilters) {
      return products;
    }

    return products.filter(product => {
      // Price filter
      if (appliedFilters.priceRange) {
        const [min, max] = appliedFilters.priceRange;
        if (product.price < min || product.price > max) {
          return false;
        }
      }

      // Color filter (if product has color property)
      if (appliedFilters.color && product.color) {
        if (product.color.toLowerCase() !== appliedFilters.color.toLowerCase()) {
          return false;
        }
      }

      // Rating filter (if product has rating property)
      if (appliedFilters.rating && product.rating) {
        if (product.rating < appliedFilters.rating) {
          return false;
        }
      }

      return true;
    });
  };

  const advancedFilteredProducts = filterByAdvancedFilters(searchFilteredProducts);
  const sortedProducts = sortProducts(advancedFilteredProducts);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    Alert.alert("Success", "Product added to cart!", [
      { text: "Continue Shopping", style: "cancel" },
      { text: "View Cart", onPress: () => router.push("/screens/CartScreen") },
    ]);
  };

  const handleToggleWishlist = (product: any) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  if (products.length === 0) return null;

  return (
    <View style={styles.container}>
      {!showSearchBar ? (
        <Header
          title="All Products"
          centerTitle={true}
          showBack={true}
          onBackPress={() => router.push("/screens/HomeScreen")}
          showCart={false}
          showSearch={true}
          onSearchPress={() => setShowSearchBar(true)}
        />
      ) : (
        <View style={styles.searchHeader}>
          <TouchableOpacity
            onPress={() => {
              setShowSearchBar(false);
              setSearchQuery("");
            }}
            style={styles.searchBackButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            placeholderTextColor={colors.gray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={24} color={colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Category Filter Pills */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          disableIntervalMomentum={true}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryPill,
                selectedCategory === item.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.categoryTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Filter and Sort Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterIcon}>☰</Text>
          <Text style={styles.filterText}>All filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={styles.sortText}>Sort by</Text>
          <Text style={styles.sortIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <TouchableOpacity onPress={() => router.push(`/screens/ProductDetailsScreen?id=${item._id}`)}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
                <TouchableOpacity
                  style={styles.wishlistButton}
                  onPress={() => handleToggleWishlist(item)}
                >
                  <Ionicons
                    name={isInWishlist(item._id) ? "heart" : "heart-outline"}
                    size={18}
                    color={isInWishlist(item._id) ? "#FF6B6B" : "#666"}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceContainer}>
                  {item.originalPrice && (
                    <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                  )}
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>
                <TouchableOpacity
                  style={styles.cartIconButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Ionicons name="cart-outline" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.sortModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sort by</Text>
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            >
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    tempSort === option.id && styles.sortOptionActive
                  ]}
                  onPress={() => setTempSort(option.id)}
                  activeOpacity={1}
                >
                  <Text style={[
                    styles.sortOptionText,
                    tempSort === option.id && styles.sortOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                  <View style={styles.radioOuter}>
                    {tempSort === option.id && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.showResultsButton}
              onPress={() => {
                setSelectedSort(tempSort);
                setSortModalVisible(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.showResultsText}>
                Show {sortedProducts.length} result{sortedProducts.length !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <ProductsInfo
          onClose={() => setFilterModalVisible(false)}
          onApplyFilters={(filters) => {
            setAppliedFilters(filters);
            setFilterModalVisible(false);
          }}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categoryContainer: {
    backgroundColor: "#FFF5EB",
    paddingVertical: spacing.md,
  },
  categoryList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: colors.white,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  filterIcon: {
    fontSize: 18,
    color: colors.text,
  },
  filterText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  sortText: {
    fontSize: 16,
    color: colors.text,
  },
  sortIcon: {
    fontSize: 12,
    color: colors.text,
  },
  productList: {
    padding: spacing.md,
  },
  productCard: {
    flex: 1,
    margin: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 180,
    backgroundColor: colors.lightGray,
  },
  wishlistButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 999,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productInfo: {
    padding: spacing.md,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
    minHeight: 40,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.gray,
    textDecorationLine: "line-through",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  cartIconButton: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sortModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  sortOptionActive: {
    // backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  sortOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  sortOptionTextActive: {
    fontWeight: "600",
    color: "#000",
  },
  showResultsButton: {
    backgroundColor: "#F99245",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  showResultsText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#F99245",
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F99245",
  },
  searchHeader: {
    backgroundColor: "#FFF5EB",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  searchBackButton: {
    padding: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
  },
  clearButton: {
    padding: spacing.xs,
  },
});
