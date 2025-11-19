import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from "../utils/theme";

export default function Input({ label, value, onChangeText, secure, placeholder }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        style={styles.input}
        placeholder={placeholder || label}
        placeholderTextColor={colors.textLight}
        autoCapitalize={secure ? "none" : "sentences"}
        autoCorrect={false}
        keyboardType={label?.toLowerCase().includes("email") ? "email-address" : "default"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    marginBottom: spacing.xs,
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
  },
});
