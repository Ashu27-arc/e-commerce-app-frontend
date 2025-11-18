import { useEffect, useState, useRef } from "react";
import { View, FlatList, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Dimensions, Alert, Modal } from "react-native";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import { api } from "../../utils/api";
import { router } from "expo-router";
import { colors, spacing, borderRadius } from "../../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../utils/cartContext";
import ProductsInfo, { type FilterOptions } from "./ProductsInfo";

interface Product {
    _id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
}

const categories = [
    { name: "Phones", icon: "phone-portrait-outline" },
    { name: "Laptops", icon: "laptop-outline" },
    { name: "Tablets", icon: "tablet-portrait-outline" },
    { name: "Headphones", icon: "headset-outline" },
    { name: "Watches", icon: "watch-outline" },
    { name: "Accessories", icon: "bag-handle-outline" },
];

const banners = [
    { id: 1, title: "Latest Electronics!", subtitle: "Up to 30% off on smartphones and laptops", color: "#FFE4CC" },
    { id: 2, title: "New Accessories!", subtitle: "Check out our latest tech accessories collection", color: "#E4F0FF" },
    { id: 3, title: "Summer Sale!", subtitle: "Huge discounts on all electronics", color: "#FFE4E4" },
];

const { width } = Dimensions.get("window");

export default function HomeScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeBanner, setActiveBanner] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({ priceRange: [0, 200] });
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        console.log("Fetching products...");
        setLoading(true);
        api.getProducts()
            .then((data) => {
                console.log("Products received:", data);
                console.log("Is array?", Array.isArray(data));
                console.log("Data length:", data?.length);
                
                if (Array.isArray(data)) {
                    setProducts(data);
                    setFilteredProducts(data);
                    console.log("Products set successfully:", data.length);
                } else {
                    console.error("Data is not an array:", data);
                    Alert.alert("Error", "Invalid data format received from server");
                }
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                console.error("Error details:", error.message);
                Alert.alert(
                    "Connection Error", 
                    `Failed to load products: ${error.message}\n\nMake sure the backend is running on http://192.168.1.14:6000`
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, products, filters]);

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
            <Header title="Electro Store" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color={colors.text} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search products"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity onPress={() => setShowFilters(true)}>
                            <Ionicons name="options-outline" size={20} color={colors.text} />
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
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={48} color="#CCC" />
                            <Text style={styles.emptyText}>No products found</Text>
                            <Text style={styles.emptySubtext}>
                                {products.length === 0 
                                    ? "Check your backend connection" 
                                    : "Try adjusting your filters"}
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredProducts.slice(0, 6)}
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
        borderRadius: 25,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
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
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.lightGray,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    categoryName: {
        fontSize: 14,
        color: colors.text,
        textAlign: "center",
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
