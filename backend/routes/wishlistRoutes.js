const express = require("express");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Add product to wishlist
router.post("/add", protect, addToWishlist);

// Get logged-in user's wishlist
router.get("/", protect, getWishlist);

// Remove product from wishlist
router.delete("/remove/:productId", protect, removeFromWishlist);

// Clear entire wishlist
router.delete("/clear", protect, clearWishlist);


module.exports = router;