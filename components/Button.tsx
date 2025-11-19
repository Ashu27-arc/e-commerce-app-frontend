import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, shadows } from "../utils/theme";

export default function Button({ title, onPress, backgroundColor, disabled }: any) {
  return (
    <TouchableOpacity 
      style={[
        styles.btn, 
        backgroundColor && { backgroundColor },
        disabled && styles.btnDisabled
      ]} 
      onPress={onPress} 
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
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
  btnDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  text: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: colors.white,
  },
  textDisabled: {
    color: colors.lightGray,
  },
});
