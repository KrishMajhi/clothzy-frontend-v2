import { createContext, useContext, useEffect, useState } from "react";

import { API_BASE_URL } from "../config/api";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // GET WISHLIST
  // ==========================

  const fetchWishlist = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/v0.0.24/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();

      setWishlistItems(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // ADD TO WISHLIST
  // ==========================

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem("access_token");

    const optimisticItem = {
      product_id: productId,
      optimistic: true,
    };

    setWishlistItems((prev) => [...prev, optimisticItem]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v0.0.24/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add");
      }

      await fetchWishlist();
    } catch (error) {
      console.log(error);

      setWishlistItems((prev) =>
        prev.filter((item) => item.product_id !== productId),
      );
    }
  };
  // ==========================
  // REMOVE FROM WISHLIST
  // ==========================
const removeFromWishlist = async (productId) => {
  const token = localStorage.getItem("access_token");

  const previousItems = wishlistItems;

  setWishlistItems((prev) =>
    prev.filter(
      (item) => item.product_id !== productId
    )
  );

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v0.0.24/wishlist/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove");
    }
  } catch (error) {
    console.log(error);

    setWishlistItems(previousItems);
  }
};

  // ==========================
  // CHECK ITEM EXISTS
  // ==========================

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,

        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
