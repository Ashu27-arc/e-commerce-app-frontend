import { useEffect, useState, useRef } from "react";
import { View, FlatList, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Dimensions, Alert, Modal } from "react-native";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import { router } from "expo-router";
import { colors, spacing, borderRadius } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../utils/cartContext";
import ProductsInfo, { type FilterOptions } from "./ProductsInfo";
import { api } from "../../utils/api";

interface Product {
    _id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
}

// Mock electronics and accessories products data
const mockProducts: Product[] = [
    { _id: "1", name: "Wireless Headphones", price: 199, category: "Audio", image: "https://via.placeholder.com/150" },
    { _id: "2", name: "Smart Watch", price: 299, category: "Wearables", image: "https://via.placeholder.com/150" },
    { _id: "3", name: "Laptop Stand", price: 49, category: "Accessories", image: "https://via.placeholder.com/150" },
    { _id: "4", name: "Mechanical Keyboard", price: 129, category: "Accessories", image: "https://via.placeholder.com/150" },
    { _id: "5", name: "Portable Charger", price: 39, category: "Accessories", image: "https://via.placeholder.com/150" },
    { _id: "6", name: "Bluetooth Speaker", price: 89, category: "Audio", image: "https://via.placeholder.com/150" },
];

const categories = [
    { name: "Audio", icon: "headset-outline" },
    { name: "Wearables", icon: "watch-outline" },
    { name: "Accessories", icon: "phone-portrait-outline" },
    { name: "Cameras", icon: "camera-outline" },
    { name: "Gaming", icon: "game-controller-outline" },
    { name: "More...", icon: "ellipsis-horizontal" },
];

const banners = [
    { id: 1, title: "Audio Deals!", subtitle: "Up to 40% off on premium headphones and speakers", color: "#FFE4CC" },
    { id: 2, title: "New Arrivals!", subtitle: "Check out the latest tech gadgets and accessories", color: "#E4F0FF" },
    { id: 3, title: "Tech Sale!", subtitle: "Huge discounts on all electronics and accessories", color: "#FFE4E4" },
];

const { width } = Dimensions.get("window");

export default function HomeScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeBanner, setActiveBanner] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({ priceRange: [0, 2000] });
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, products, filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            Alert.alert("Error", "Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBanner((prev) => {
                const nextIndex = (prev + 1) % banners.length;
                scrollViewRef.current?.scrollTo({
                    x: nextIndex * (width - 40),
                    animated: true,
                });
                return nextIndex;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const filterProducts = () => {
        let filtered = products;

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply price filter
        if (filters.priceRange) {
            filtered = filtered.filter(p =>
                p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
            );
        }

        setFilteredProducts(filtered);
    };

    const handleApplyFilters = (newFilters: FilterOptions) => {
        setFilters(newFilters);
    };

    const handleCategoryPress = (categoryName: string) => {
        if (categoryName === "More...") {
            // Handle showing all categories
            return;
        }
        // Filter by category or navigate to category screen
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        Alert.alert("Success", `${product.name} added to cart!`);
    };

    const handleAddToWishlist = (product: Product) => {
        // Implement wishlist functionality here
        Alert.alert("Wishlist", `${product.name} added to wishlist!`);
    };

    return (
        <View style={styles.container}>
            <Header title="Tech Store" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={24} color={colors.text} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search products"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity>
                            <Ionicons name="camera-outline" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Categories Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View all</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.categoriesGrid}>
                        {categories.map((cat, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.categoryItem}
                                onPress={() => handleCategoryPress(cat.name)}
                            >
                                <View style={styles.categoryIcon}>
                                    <Ionicons name={cat.icon as any} size={24} color={colors.text} />
                                </View>
                                <Text style={styles.categoryName}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Banner Carousel */}
                <View style={styles.bannerContainer}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
                            setActiveBanner(index);
                        }}
                    >
                        {banners.map((banner) => (
                            <View
                                key={banner.id}
                                style={[styles.banner, { backgroundColor: banner.color }]}
                            >
                                <Text style={styles.bannerTitle}>{banner.title}</Text>
                                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                                <TouchableOpacity style={styles.bannerButton}>
                                    <Text style={styles.bannerButtonText}>See more →</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.pagination}>
                        {banners.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    activeBanner === index && styles.paginationDotActive
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Newly Added Products */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Newly added products</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View all</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading products...</Text>
                        </View>
                    ) : filteredProducts.length === 0 ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>No products available</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredProducts.slice(0, 3)}
                            keyExtractor={item => item._id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.productsHorizontal}
                            renderItem={({ item }) => (
                                <View style={styles.productCardWrapper}>
                                    <ProductCard
                                        item={item}
                                        onPress={() =>
                                            router.push(`/screens/ProductDetailsScreen?id=${item._id}`)
                                        }
                                        onAddToCart={handleAddToCart}
                                        onAddToWishlist={handleAddToWishlist}
                                    />
                                </View>
                            )}
                        />
                    )}
                </View>
            </ScrollView>

            {/* Filter Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowFilters(false)}
            >
                <ProductsInfo
                    onClose={() => setShowFilters(false)}
                    onApplyFilters={handleApplyFilters}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF5EB",
    },
    searchContainer: {
        padding: spacing.md,
        backgroundColor: "#FFF5EB",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: 30,
        paddingHorizontal: spacing.lg,
        paddingVertical: 12,
        gap: spacing.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    section: {
        backgroundColor: colors.white,
        marginTop: spacing.md,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        marginHorizontal: spacing.md,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },
    viewAllText: {
        fontSize: 14,
        color: "#666",
    },
    categoriesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: spacing.md,
    },
    categoryItem: {
        width: "33.33%",
        alignItems: "center",
        marginBottom: spacing.lg,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    categoryName: {
        fontSize: 15,
        color: colors.text,
        textAlign: "center",
        fontWeight: "500",
    },
    bannerContainer: {
        marginTop: spacing.md,
        marginHorizontal: spacing.md,
    },
    banner: {
        width: width - 40,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginRight: spacing.md,
    },
    bannerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#D97706",
        marginBottom: spacing.sm,
    },
    bannerSubtitle: {
        fontSize: 14,
        color: colors.text,
        marginBottom: spacing.md,
        lineHeight: 20,
    },
    bannerButton: {
        alignSelf: "flex-start",
    },
    bannerButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: spacing.md,
        gap: spacing.xs,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#CCC",
    },
    paginationDotActive: {
        backgroundColor: "#D97706",
    },
    productsHorizontal: {
        paddingHorizontal: spacing.md,
    },
    productCardWrapper: {
        width: 160,
        marginRight: spacing.md,
    },
    loadingContainer: {
        padding: spacing.xl,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        marginTop: spacing.sm,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
});
