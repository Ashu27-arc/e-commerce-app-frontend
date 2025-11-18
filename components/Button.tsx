import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, shadows } from "../utils/theme";

export default function Button({ title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    marginTop: spacing.md,
    ...shadows.small,
  },
  text: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: colors.white,
  },
});
