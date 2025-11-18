import { router } from "expo-router";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../../components/Button";
import CartItem from "../../components/CartItem";
import Header from "../../components/Header";
import { useCart } from "../../utils/cartContext";
import { colors, spacing, borderRadius } from "../../utils/theme";

export default function CartScreen() {
  const { cart, removeFromCart, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Cart" />
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
      <Header title="Cart" />
      
      <FlatList
        data={cart}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View>
            <CartItem item={item} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeFromCart(item._id)}
            >
              <Text style={styles.removeTxt}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>₹{getCartTotal()}</Text>
        </View>
        <Button
          title="Proceed to Checkout"
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
  removeBtn: {
    alignSelf: "flex-end",
    marginTop: -spacing.sm,
    marginRight: spacing.md,
    marginBottom: spacing.md,
  },
  removeTxt: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "600",
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
    color: colors.text,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.secondary,
  },
});
