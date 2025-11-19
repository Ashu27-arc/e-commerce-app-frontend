import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { api } from "../../utils/api";
import { router } from "expo-router";
import { colors, spacing } from "../../utils/theme";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginUser = async () => {
        if (!email.trim() || !password.trim()) {
            alert("Please fill in all fields");
            return;
        }
        
        try {
            const res = await api.login({ email, password });
            if (res.error) {
                alert(res.error);
            } else {
                router.replace("/screens/HomeScreen");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Login to your account</Text>

                <View style={styles.form}>
                    <Input label="Email" value={email} onChangeText={setEmail} />
                    <Input
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secure
                    />
                    <Button title="Login" onPress={loginUser} />
                </View>

                <TouchableOpacity
                    onPress={() => router.push("/screens/RegisterScreen")}
                    style={styles.linkContainer}
                >
                    <Text style={styles.linkText}>
                        Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
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
