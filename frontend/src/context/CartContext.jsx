import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

const API_URL = "http://localhost:5000/api/cart";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  // =====================================================
  // FETCH CART
  // =====================================================

  const fetchCart = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setCart({ items: [] });
      return;
    }

    if (user?.role !== "client") {
      setCart({ items: [] });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch cart"
        );
      }

      setCart(data.cart || { items: [] });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [getToken, user?.role]);

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity < 1) {
        return;
      }

      try {
        setError("");
        setMessage("");

        const token = getToken();

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          `${API_URL}/update/${productId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              quantity,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to update quantity"
          );
        }

        setCart(data.cart || { items: [] });

        setMessage("Cart updated successfully.");

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [getToken]
  );

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        setError("");
        setMessage("");

        const token = getToken();

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          `${API_URL}/remove/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to remove product"
          );
        }

        setCart(data.cart || { items: [] });

        setMessage("Product removed from cart.");

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [getToken]
  );

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = useCallback(async () => {
    try {
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(`${API_URL}/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to clear cart"
        );
      }

      setCart(data.cart || { items: [] });

      setMessage("Cart cleared successfully.");

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [getToken]);

  // =====================================================
  // CLEAR LOCAL CART
  // =====================================================

  const clearCartState = useCallback(() => {
    setCart({
      items: [],
    });

    setError("");
    setMessage("");
  }, []);

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const clearCartError = useCallback(() => {
    setError("");
  }, []);

  // =====================================================
  // CLEAR MESSAGE
  // =====================================================

  const clearCartMessage = useCallback(() => {
    setMessage("");
  }, []);

  // =====================================================
  // LOAD CART WHEN CLIENT LOGS IN
  // =====================================================

  useEffect(() => {
    if (user?.role === "client") {
      fetchCart();
    } else {
      setCart({
        items: [],
      });
      setError("");
      setMessage("");
    }
  }, [user?.role, fetchCart]);

  // =====================================================
  // CART ITEM COUNT
  // =====================================================

  const cartCount = cart.items.reduce(
    (total, item) => {
      return total + Number(item.quantity || 0);
    },
    0
  );

  // =====================================================
  // CART TOTAL
  // =====================================================

  const cartTotal = cart.items.reduce(
    (total, item) => {
      return (
        total +
        Number(item.product?.price || 0) *
          Number(item.quantity || 0)
      );
    },
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart.items,
        cartCount,
        cartTotal,

        loading,
        error,
        message,

        fetchCart,
        updateQuantity,
        removeFromCart,
        clearCart,

        clearCartState,
        clearCartError,
        clearCartMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};