import { Stack } from "expo-router";
import { CartProvider } from "../utils/cartContext";
import { WishlistProvider } from "../utils/wishlistContext";

export default function Layout() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="screens/LoginScreen" />
          <Stack.Screen name="screens/RegisterScreen" />
          <Stack.Screen name="screens/HomeScreen" />
          <Stack.Screen name="screens/ProductDetailsScreen" />
          <Stack.Screen name="screens/ProductsDescription" />
          <Stack.Screen name="screens/CartScreen" />
          <Stack.Screen name="screens/CheckoutScreen" />
          <Stack.Screen name="screens/OrdersScreen" />
        </Stack>
      </WishlistProvider>
    </CartProvider>
  );
}
