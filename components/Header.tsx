import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, shadows } from "../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCart } from "../utils/cartContext";

export default function Header({ title, showSearch, onSearchPress }: any) {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.header}>
      <Text style={styles.txt}>{title}</Text>
      <View style={styles.iconContainer}>
        {showSearch && (
          <TouchableOpacity 
            style={styles.searchIcon}
            onPress={onSearchPress}
          >
            <Ionicons name="search-outline" size={28} color={colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.cartIcon}
          onPress={() => router.push("/screens/CartScreen")}
        >
          <Ionicons name="cart-outline" size={28} color={colors.text} />
          {itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFF5EB",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txt: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  searchIcon: {
    padding: spacing.xs,
  },
  cartIcon: {
    padding: spacing.xs,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});
