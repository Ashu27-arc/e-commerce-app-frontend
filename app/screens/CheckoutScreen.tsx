import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { api } from "../../utils/api";
import { router } from "expo-router";
import { colors, spacing, borderRadius, shadows } from "../../utils/theme";

export default function CheckoutScreen() {
  const checkout = async () => {
    await api.placeOrder({
      userId: "123",
      items: [{ id: "1", qty: 1 }],
      total: 999,
    });

    router.push("/screens/OrdersScreen");
  };

  return (
    <View style={styles.container}>
      <Header title="Checkout" />
      <View style={styles.content}>
        <Text style={styles.title}>Checkout Summary</Text>
        
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹999</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping</Text>
            <Text style={styles.value}>₹0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹999</Text>
          </View>
        </View>

        <Button title="Place Order" onPress={checkout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    color: colors.textLight,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.secondary,
  },
});
