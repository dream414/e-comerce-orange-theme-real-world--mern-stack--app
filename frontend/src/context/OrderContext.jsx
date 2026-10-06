import {
  createContext,
  useContext,
  useCallback,
  useState,
} from "react";

import {
  createOrder as createOrderAPI,
  getMyOrders as getMyOrdersAPI,
  getAllOrders as getAllOrdersAPI,
  getAdminNotifications as getAdminNotificationsAPI,
  markAdminNotificationsAsRead as markAdminNotificationsAsReadAPI,
  getOrderById as getOrderByIdAPI,
  updateOrder as updateOrderAPI,
  deleteOrder as deleteOrderAPI,
} from "../services/orderService";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [
    adminNotifications,
    setAdminNotifications,
  ] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // CREATE ORDER
  // =========================
  const createOrder = useCallback(
    async (orderData, token) => {
      try {
        setLoading(true);
        setError("");

        const data = await createOrderAPI(
          orderData,
          token
        );

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // GET MY ORDERS
  // =========================
  const getMyOrders = useCallback(
    async (token) => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrdersAPI(token);

        setMyOrders(data.orders || []);

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // GET ALL ORDERS
  // =========================
  const getAllOrders = useCallback(
    async (token) => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllOrdersAPI(token);

        setOrders(data.orders || []);

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // GET ADMIN NOTIFICATIONS
  // =========================
  const getAdminNotifications =
    useCallback(async (token) => {
      try {
        setError("");

        const data =
          await getAdminNotificationsAPI(token);

        setAdminNotifications(
          data.notifications || []
        );

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    }, []);

  // =========================
  // MARK ADMIN NOTIFICATIONS READ
  // =========================
  const markAdminNotificationsAsRead =
    useCallback(async (token) => {
      try {
        setError("");

        /*
         * IMPORTANT:
         *
         * Yahan pehle:
         *
         * setAdminNotifications([]);
         *
         * tha.
         *
         * Isko remove kar diya hai.
         *
         * API database mein notifications ko read
         * mark karegi, lekin frontend state ko
         * automatically clear nahi karegi.
         *
         * Is se notification page ka local snapshot
         * bhi safe rahega.
         */

        const data =
          await markAdminNotificationsAsReadAPI(
            token
          );

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    }, []);

  // =========================
  // GET SINGLE ORDER
  // =========================
  const getOrderById = useCallback(
    async (orderId, token) => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderByIdAPI(
          orderId,
          token
        );

        setSelectedOrder(data.order || null);

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // UPDATE ORDER
  // =========================
  const updateOrder = useCallback(
    async (orderId, orderData, token) => {
      try {
        setLoading(true);
        setError("");

        const data = await updateOrderAPI(
          orderId,
          orderData,
          token
        );

        setSelectedOrder(data.order || null);

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? data.order
              : order
          )
        );

        setMyOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? data.order
              : order
          )
        );

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // DELETE ORDER
  // =========================
  const deleteOrder = useCallback(
    async (orderId, token) => {
      try {
        setLoading(true);
        setError("");

        const data = await deleteOrderAPI(
          orderId,
          token
        );

        setOrders((prevOrders) =>
          prevOrders.filter(
            (order) => order._id !== orderId
          )
        );

        setMyOrders((prevOrders) =>
          prevOrders.filter(
            (order) => order._id !== orderId
          )
        );

        setSelectedOrder((prevOrder) =>
          prevOrder?._id === orderId
            ? null
            : prevOrder
        );

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // CLEAR ERROR
  // =========================
  const clearOrderError = useCallback(() => {
    setError("");
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        myOrders,
        selectedOrder,

        adminNotifications,

        loading,
        error,

        createOrder,
        getMyOrders,
        getAllOrders,

        getAdminNotifications,
        markAdminNotificationsAsRead,

        getOrderById,
        updateOrder,
        deleteOrder,

        clearOrderError,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  return useContext(OrderContext);
};
