const express = require("express");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Add product to cart
router.post("/add", protect, addToCart);

// Get logged-in user's cart
router.get("/", protect, getCart);

// Update product quantity
router.put("/update/:productId", protect, updateCartQuantity);

// Remove product from cart
router.delete("/remove/:productId", protect, removeFromCart);

// Clear entire cart
router.delete("/clear", protect, clearCart);


module.exports = router;