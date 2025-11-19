import { router } from "expo-router";
import { View, Text, StyleSheet, SectionList } from "react-native";
import Button from "../../components/Button";
import CartItem from "../../components/CartItem";
import Header from "../../components/Header";
import { useCart } from "../../utils/cartContext";
import { colors, spacing, borderRadius } from "../../utils/theme";

export default function CartScreen() {
  const cartContext = useCart();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = cartContext;

  // Group cart items by category (Electronics and Accessories)
  const groupedCart = cart.reduce((acc: any, item: any) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const sections = Object.keys(groupedCart).map((category) => ({
    title: category,
    data: groupedCart[category],
  }));

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <Header 
          title="Cart" 
          centerTitle={true}
          showBack={true}
          onBackPress={() => router.push("/screens/ProductsDescription")}
          showCart={false}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some products to get started</Text>
          <Button
            title="Continue Shopping"
            onPress={() => router.push("/screens/HomeScreen")}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Cart" 
        centerTitle={true}
        showBack={true}
        onBackPress={() => router.push("/screens/ProductDetailsScreen")}
        showCart={false}
      />
      
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>
              {title === "Electronics" ? "📱 Electronics" : "🎧 Accessories"}
            </Text>
            <View style={styles.categoryLine} />
          </View>
        )}
        renderItem={({ item }) => (
          <CartItem 
            item={item}
            onIncrement={() => updateQuantity(item._id, item.quantity + 1)}
            onDecrement={() => updateQuantity(item._id, item.quantity - 1)}
            onRemove={() => removeFromCart(item._id)}
          />
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalAmount}>${getCartTotal()}</Text>
        </View>
        <Button
          title="Proceed to checkout"
          onPress={() => router.push("/screens/CheckoutScreen")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  categoryHeader: {
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  categoryLine: {
    height: 3,
    backgroundColor: colors.primary,
    width: 60,
    borderRadius: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  footer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
