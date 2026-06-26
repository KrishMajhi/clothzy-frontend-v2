import { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../config/api";

export const OrderContext = createContext(null);

const OrderContextProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Please login");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const createOrder = async (orderData) => {
    setOrderLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v0.0.24/orders/createOrder`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(orderData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create order");
      }

      const data = await response.json();

      return data;
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrderLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v0.0.24/orders/allOrders`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);

      return data;
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v0.0.24/orders/recent`,
        {
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recent orders");
      }

      const data = await response.json();

      setRecentOrders(data);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrderById = async (orderId) => {
    setOrderLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v0.0.24/orders/${orderId}`,
        {
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();

      setSelectedOrder(data);

      return data;
    } finally {
      setOrderLoading(false);
    }
  };
  const downloadInvoice = async (orderId) => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${API_BASE_URL}/api/v0.0.24/orders/${orderId}/invoice`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `invoice-${orderId}.pdf`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);
  };

  const contextValue = {
    orders,
    recentOrders,
    selectedOrder,
    orderLoading,

    createOrder,
    fetchOrders,
    fetchRecentOrders,
    fetchOrderById,
    downloadInvoice,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrders = () => useContext(OrderContext);
