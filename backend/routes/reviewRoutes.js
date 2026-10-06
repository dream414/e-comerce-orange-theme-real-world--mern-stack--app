const express = require("express");

const {
  addReview,
  getProductReviews,
  getMyReview,
  updateReview,
  deleteReview,
  getAllReviews,
  adminDeleteReview,
} = require("../controllers/reviewController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// CLIENT ROUTES
// ===============================

router.get("/product/:productId", getProductReviews);

router.get(
  "/my/:productId",
  protect,
  getMyReview
);

router.post(
  "/",
  protect,
  addReview
);

router.put(
  "/:id",
  protect,
  updateReview
);

router.delete(
  "/:id",
  protect,
  deleteReview
);

// ===============================
// ADMIN ROUTES
// ===============================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllReviews
);

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  adminDeleteReview
);

module.exports = router;