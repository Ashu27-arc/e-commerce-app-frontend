import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { api } from "../../utils/api";
import { router } from "expo-router";
import { colors, spacing, borderRadius, shadows } from "../../utils/theme";
import { useCart } from "../../utils/cartContext";

export default function CheckoutScreen() {
  const { cart, getCartTotal, clearCart } = useCart();
  
  const subtotal = getCartTotal();
  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;

  const checkout = async () => {
    try {
      const orderItems = cart.map(item => ({
        id: item._id,
        qty: item.quantity,
      }));

      await api.placeOrder({
        userId: "123",
        items: orderItems,
        total: total,
      });

      clearCart();
      router.replace("/screens/OrdersScreen");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Checkout" 
        centerTitle={true}
        showBack={true}
        onBackPress={() => router.push("/screens/CartScreen")}
        showCart={false}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Steps */}
        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCompleted]}>
              <Text style={styles.stepCheckmark}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Shipping</Text>
          </View>
          
          <View style={styles.stepLine} />
          
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCompleted]}>
              <Text style={styles.stepCheckmark}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Payment</Text>
          </View>
          
          <View style={styles.stepLine} />
          
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Review</Text>
          </View>
        </View>

        {/* Confirm Order Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confirm and submit your order</Text>
          <Text style={styles.sectionSubtitle}>
            By submitting the order, you agree to our Terms of Use and Privacy Policy.
          </Text>
        </View>

        {/* Payment Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Payment</Text>
            <TouchableOpacity>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentInfo}>
            <View style={styles.cardLogos}>
              <View style={styles.cardLogo1} />
              <View style={styles.cardLogo2} />
            </View>
            <Text style={styles.cardNumber}>•••• •••• •••• 1234</Text>
            <Text style={styles.cardExpiry}>1/24</Text>
          </View>
        </View>

        {/* Shipping Address Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Shipping address</Text>
            <TouchableOpacity>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressInfo}>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Name</Text>
              <Text style={styles.addressValue}>Maria Le</Text>
            </View>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Street</Text>
              <Text style={styles.addressValue}>Sesame St. 18</Text>
            </View>
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Order summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button title="Submit order" onPress={checkout} />
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
  },
  stepItem: {
    alignItems: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  stepCompleted: {
    backgroundColor: "#FF8C42",
  },
  stepActive: {
    backgroundColor: "#000",
  },
  stepCheckmark: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  stepNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
    marginBottom: 20,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  editButton: {
    fontSize: 16,
    color: "#FF8C42",
    fontWeight: "600",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardLogos: {
    flexDirection: "row",
    marginRight: 8,
  },
  cardLogo1: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EB001B",
    marginRight: -8,
  },
  cardLogo2: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF9800",
  },
  cardNumber: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  cardExpiry: {
    fontSize: 16,
    color: colors.text,
  },
  addressInfo: {
    gap: spacing.sm,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressLabel: {
    fontSize: 16,
    color: colors.textLight,
  },
  addressValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },
  summarySection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
});
