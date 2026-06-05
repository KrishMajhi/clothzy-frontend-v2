import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
export const CartContext = createContext(null);

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();
  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");

    setCartLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v0.0.24/cart/items",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();

      setCartItems(data);
      console.log(cartItems);
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
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);

        throw new Error(errorData.detail || "Failed to add item");
      }

      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // const removeFromCart = async (cart_itemID) => {
  //   const token = localStorage.getItem("access_token");
  //   try {
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/v0.0.24/cart/${cart_itemID}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to remove product");
  //     }
  //     await fetchCart();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const removeFromCart = async (cart_itemID) => {
    const token = localStorage.getItem("access_token");

    // Remove instantly from state (animation already played in CartList)
    setCartItems((prev) => prev.filter((item) => item.cart_id !== cart_itemID));

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v0.0.24/cart/${cart_itemID}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to remove product");

      // ✅ No fetchCart() — item already gone from UI
    } catch (error) {
      console.error(error);
      await fetchCart(); // rollback — item reappears if server rejected it
    }
  };
  // const updateCartItem = async (cartItemId, quantity) => {
  //   const token = localStorage.getItem("access_token");

  //   try {
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/v0.0.24/cart/${cartItemId}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           quantity,
  //         }),
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to update cart");
  //     }

  //     await fetchCart();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const updateCartItem = async (cartItemId, quantity) => {
  //   const token = localStorage.getItem("access_token");

  //   // ✅ Update UI instantly — don't wait for server
  //   setCartItems((prev) =>
  //     prev.map((item) =>
  //       item.cart_id === cartItemId
  //         ? { ...item, quantity, subtotal: item.price * quantity }
  //         : item,
  //     ),
  //   );

  //   try {
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/v0.0.24/cart/${cartItemId}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ quantity }),
  //       },
  //     );

  //     if (!response.ok) throw new Error("Failed to update cart");

  //     // Optional: sync with server truth after success
  //     await fetchCart();
  //   } catch (error) {
  //     console.error(error);
  //     // ✅ Rollback on failure — re-fetch real state
  //     await fetchCart();
  //   }
  // };
  const updateCartItem = async (cartItemId, quantity) => {
    const token = localStorage.getItem("access_token");

    // Update UI instantly
    setCartItems((prev) =>
      prev.map((item) =>
        item.cart_id === cartItemId
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item,
      ),
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
        },
      );

      if (!response.ok) throw new Error("Failed to update cart");

      // ✅ No fetchCart() here — optimistic update is already correct
    } catch (error) {
      console.error(error);
      await fetchCart(); // only rollback on actual failure
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v0.0.24/cart/clear",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };
  const contextValue = {
    cartItems,
    cartLoading,

    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;

export const useCart = () => useContext(CartContext);
