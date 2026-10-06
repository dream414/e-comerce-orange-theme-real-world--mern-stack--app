const Order = require("../models/Order");
const Product = require("../models/Product");

// =========================
// CREATE ORDER - CLIENT
// =========================
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingInfo,
      billingInfo,
      totalAmount,
      paymentMethod,
    } = req.body;

    if (
      !items ||
      items.length === 0 ||
      !shippingInfo ||
      !billingInfo ||
      totalAmount === undefined
    ) {
      return res.status(400).json({
        message: "Required order information is missing",
      });
    }

    // =========================
    // CHECK PRODUCT STOCK
    // =========================

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
        });
      }

      // Check available stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available stock: ${product.stock}`,
        });
      }
    }

    // =========================
    // REDUCE PRODUCT STOCK
    // =========================

    for (const item of items) {
      const product = await Product.findById(item.product);

      // Reduce stock according to ordered quantity
      product.stock = product.stock - item.quantity;

      // If stock becomes 0
      if (product.stock === 0) {
        product.isAvailable = false;
      } else {
        product.isAvailable = true;
      }

      await product.save();
    }

    // =========================
    // CREATE ORDER
    // =========================

    const createdOrder = await Order.create({
      user: req.user.id,
      items,
      shippingInfo,
      billingInfo,
      totalAmount,
      paymentMethod:
        paymentMethod || "Cash on Delivery",

      // New order should appear
      // in admin notifications
      isAdminNotificationRead: false,
    });

    // =========================
    // FETCH CREATED ORDER
    // WITH COMPLETE PRODUCT DATA
    // =========================

    const order = await Order.findById(
      createdOrder._id
    )
      .populate("user", "name email")
      .populate("items.product");

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// =========================
// GET MY ORDERS - CLIENT
// =========================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// =========================
// GET ALL ORDERS - ADMIN
// =========================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

// =========================
// GET ADMIN ORDER NOTIFICATIONS
// =========================
const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Order.find({
      isAdminNotificationRead: false,
    })
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message:
        "Admin order notifications fetched successfully",
      notifications,
      count: notifications.length,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch admin order notifications",
      error: error.message,
    });
  }
};

// =========================
// MARK ADMIN NOTIFICATIONS AS READ
// =========================
const markAdminNotificationsAsRead = async (
  req,
  res
) => {
  try {
    await Order.updateMany(
      {
        isAdminNotificationRead: false,
      },
      {
        $set: {
          isAdminNotificationRead: true,
        },
      }
    );

    res.status(200).json({
      message:
        "Admin order notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to mark admin notifications as read",
      error: error.message,
    });
  }
};

// =========================
// GET SINGLE ORDER
// CLIENT + ADMIN
// =========================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // CLIENT CAN ONLY VIEW OWN ORDER
    if (
      req.user.role === "client" &&
      order.user._id.toString() !==
        req.user.id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to view this order",
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// =========================
// UPDATE ORDER - ADMIN
// =========================
const updateOrder = async (req, res) => {
  try {
    const {
      orderStatus,
      paymentMethod,
    } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (orderStatus !== undefined) {
      order.orderStatus = orderStatus;
    }

    if (paymentMethod !== undefined) {
      order.paymentMethod = paymentMethod;
    }

    const updatedOrder = await order.save();

    // RETURN UPDATED ORDER WITH COMPLETE DATA
    const populatedOrder = await Order.findById(
      updatedOrder._id
    )
      .populate("user", "name email")
      .populate("items.product");

    res.status(200).json({
      message: "Order updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// =========================
// DELETE ORDER - ADMIN
// =========================
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

// =========================
// EXPORTS
// =========================
module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getAdminNotifications,
  markAdminNotificationsAsRead,
  getOrderById,
  updateOrder,
  deleteOrder,
};