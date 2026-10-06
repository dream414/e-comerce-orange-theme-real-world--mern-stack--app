const express = require("express");

const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==============================
// ADMIN: ADD PRODUCT
// ==============================
// Desktop se multiple images upload
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 10),
  addProduct
);

// ==============================
// CLIENT + ADMIN: GET ALL PRODUCTS
// ==============================
router.get("/", getAllProducts);

// ==============================
// CLIENT + ADMIN: GET SINGLE PRODUCT
// ==============================
router.get("/:id", getSingleProduct);

// ==============================
// ADMIN: UPDATE PRODUCT
// ==============================
// Existing images + new Desktop images
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  updateProduct
);

// ==============================
// ADMIN: DELETE PRODUCT
// ==============================
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = router;