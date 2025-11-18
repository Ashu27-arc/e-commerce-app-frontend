import { View, Text, Image, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, shadows } from "../utils/theme";

export default function CartItem({ item }: any) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.img} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalPrice}>₹{item.price * item.quantity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.lightGray,
  },
  info: {
    marginLeft: spacing.md,
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  quantity: {
    fontSize: 14,
    color: colors.textLight,
  },
  totalContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: spacing.sm,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
  },
});
