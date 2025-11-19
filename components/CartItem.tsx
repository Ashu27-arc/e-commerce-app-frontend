import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, borderRadius, shadows } from "../utils/theme";

interface CartItemProps {
  item: any;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
}

export default function CartItem({ item, onIncrement, onDecrement, onRemove }: CartItemProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.img} />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Size: {item.size || "2"}</Text>
          <Text style={styles.detailText}>Color: {item.color || "Green"}</Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.leftSection}>
            <Text style={styles.qtyLabel}>Qty:</Text>
            <View style={styles.quantityControls}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <View style={styles.arrowButtons}>
                <TouchableOpacity 
                  style={styles.arrowBtn} 
                  onPress={onIncrement}
                >
                  <Text style={styles.arrowText}>▲</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.arrowBtn} 
                  onPress={onDecrement}
                  disabled={item.quantity <= 1}
                >
                  <Text style={styles.arrowText}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={onRemove}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.price}>${item.price * item.quantity}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    padding: spacing.md,
    ...shadows.small,
  },
  img: {
    width: 100,
    height: 100,
    backgroundColor: colors.lightGray,
    resizeMode: "contain",
    borderRadius: borderRadius.sm,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  qtyLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    minWidth: 30,
    textAlign: "center",
  },
  arrowButtons: {
    marginLeft: spacing.xs,
  },
  arrowBtn: {
    width: 20,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 10,
    color: colors.text,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
  deleteText: {
    fontSize: 18,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF8C42",
  },
});
