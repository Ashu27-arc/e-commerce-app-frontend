import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, shadows } from "../utils/theme";

export default function ProductCard({ item, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.img} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
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
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
  },
});
