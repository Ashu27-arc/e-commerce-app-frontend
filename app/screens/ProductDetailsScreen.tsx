import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Alert } from "react-native";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { api } from "../../utils/api";
import { useCart } from "../../utils/cartContext";
import { colors, spacing, borderRadius } from "../../utils/theme";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.getProduct(id as string).then(setProduct);
  }, []);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      Alert.alert("Success", "Product added to cart!", [
        { text: "Continue Shopping", style: "cancel" },
        { text: "View Cart", onPress: () => router.push("/screens/CartScreen") },
      ]);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      router.push("/screens/CheckoutScreen");
    }
  };

  if (!product) return null;

  return (
    <View style={styles.container}>
      <Header title="Product Details" />
      <ScrollView style={styles.scrollView}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
        />
        <Button
          title="Buy Now"
          onPress={handleBuyNow}
        />
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: colors.lightGray,
  },
  content: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -spacing.lg,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.lg,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
});
