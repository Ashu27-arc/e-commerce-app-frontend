import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { api } from "../../utils/api";
import { router } from "expo-router";
import { colors, spacing } from "../../utils/theme";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    await api.register({ name, email, password });
    router.push("/screens/LoginScreen");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.form}>
          <Input label="Name" value={name} onChangeText={setName} />
          <Input label="Email" value={email} onChangeText={setEmail} />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secure
          />
          <Button title="Register" onPress={registerUser} />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/screens/LoginScreen")}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: spacing.xl,
  },
  form: {
    marginTop: spacing.md,
  },
  linkContainer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: colors.textLight,
  },
  linkBold: {
    color: colors.primary,
    fontWeight: "700",
  },
});
