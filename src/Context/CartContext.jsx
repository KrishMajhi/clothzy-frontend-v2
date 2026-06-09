import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
export const CartContext = createContext(null);

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();
  const [orderSummaryConfig, setOrderSummaryConfig] = useState(null);

  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");
    setCartLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v0.0.24/cart/items",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  // =====================
  // CART ACTIONS
  // =====================
  const addToCart = async (item) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v0.0.24/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add item");
      }
      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (cart_itemID) => {
    const token = localStorage.getItem("access_token");
    setCartItems((prev) => prev.filter((item) => item.cart_id !== cart_itemID));
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v0.0.24/cart/${cart_itemID}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to remove product");
    } catch (error) {
      console.error(error);
      await fetchCart();
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    const token = localStorage.getItem("access_token");
    setCartItems((prev) =>
      prev.map((item) =>
        item.cart_id === cartItemId
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item
      )
    );
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v0.0.24/cart/${cartItemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );
      if (!response.ok) throw new Error("Failed to update cart");
    } catch (error) {
      console.error(error);
      await fetchCart();
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v0.0.24/cart/clear",
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to clear cart");
      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const getOrderSummaryConfig = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v0.0.24/cart/summary"
      );
      if (!response.ok) throw new Error("Failed to fetch order config");
      const data = await response.json();
      setOrderSummaryConfig(data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const contextValue = {
    cartItems,
    cartLoading,
    orderSummaryConfig,
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getOrderSummaryConfig,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// =====================
// PURE CALCULATION UTIL
// =====================
export const calculateOrderSummary = ({
  subtotal,
  shippingMethod = "standard",
  config,
}) => {
  if (!config) return null;

  const {
    tax_percentage,
    delivery_charge_threshold,
    base_delivery_charge,
    express_shipping_charge,
    same_day_shipping_charge,
  } = config;

  const tax = subtotal * (tax_percentage / 100);

  // Delivery: free if subtotal meets threshold
  const deliveryCharge =
    subtotal >= delivery_charge_threshold ? 0 : base_delivery_charge;

  // Shipping method: standard is always free; express/same_day add extra
  let shippingMethodCharge = 0;
  if (shippingMethod === "express") shippingMethodCharge = express_shipping_charge;
  if (shippingMethod === "same_day") shippingMethodCharge = same_day_shipping_charge;

  const total = subtotal + tax + deliveryCharge + shippingMethodCharge;

  return {
    tax,
    deliveryCharge,
    shippingMethodCharge,
    total,
  };
};

export default CartContextProvider;
export const useCart = () => useContext(CartContext);