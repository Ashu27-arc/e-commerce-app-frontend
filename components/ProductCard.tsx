import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, shadows } from "../utils/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ProductCard({ item, onPress, onAddToCart, onAddToWishlist }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.img} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                onAddToWishlist?.(item);
              }}
            >
              <Ionicons name="heart-outline" size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                onAddToCart?.(item);
              }}
            >
              <Ionicons name="cart-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
    overflow: "hidden",
    ...shadows.medium,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  img: {
    height: 150,
    width: "100%",
    backgroundColor: colors.lightGray,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    flexShrink: 1,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.xs,
    flexShrink: 0,
  },
  iconButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.lightGray,
  },
});
