import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Header from "../../components/Header";
import { api } from "../../utils/api";
import { colors, spacing, borderRadius, shadows } from "../../utils/theme";

interface Order {
  total: number;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.getOrders("123").then(setOrders);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Your Orders" />

      <ScrollView style={styles.content}>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        ) : (
          orders.map((o, i) => (
            <View key={i} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{i + 1}</Text>
                <Text style={styles.orderStatus}>Completed</Text>
              </View>
              <Text style={styles.orderTotal}>Total: ₹{o.total}</Text>
            </View>
          ))
        )}
      </ScrollView>
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
    padding: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  orderStatus: {
    fontSize: 14,
    color: colors.success,
    fontWeight: "600",
  },
  orderTotal: {
    fontSize: 16,
    color: colors.textLight,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textLight,
  },
});
