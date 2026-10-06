const express = require("express");

const router = express.Router();

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getAdminNotifications,
  markAdminNotificationsAsRead,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

// =========================
// CLIENT ROUTES
// =========================

// Create Order
router.post("/", protect, createOrder);

// Read My Orders
router.get("/my-orders", protect, getMyOrders);

// =========================
// ADMIN NOTIFICATION ROUTES
// =========================

// Get unread/new order notifications
router.get(
  "/admin/notifications",
  protect,
  adminOnly,
  getAdminNotifications
);

// Mark all admin order notifications as read
router.patch(
  "/admin/notifications/read",
  protect,
  adminOnly,
  markAdminNotificationsAsRead
);

// =========================
// ADMIN ROUTES
// =========================

// Read All Orders
router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);

// =========================
// SINGLE ORDER
// =========================

// Read Single Order
router.get(
  "/:id",
  protect,
  getOrderById
);

// Update Order
router.put(
  "/:id",
  protect,
  adminOnly,
  updateOrder
);

// Delete Order
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteOrder
);

module.exports = router;