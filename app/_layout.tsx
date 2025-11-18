import { Stack } from "expo-router";
import { CartProvider } from "../utils/cartContext";

export default function Layout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="screens/LoginScreen" />
        <Stack.Screen name="screens/RegisterScreen" />
        <Stack.Screen name="screens/HomeScreen" />
        <Stack.Screen name="screens/ProductDetailsScreen" />
        <Stack.Screen name="screens/CartScreen" />
        <Stack.Screen name="screens/CheckoutScreen" />
        <Stack.Screen name="screens/OrdersScreen" />
      </Stack>
    </CartProvider>
  );
}
