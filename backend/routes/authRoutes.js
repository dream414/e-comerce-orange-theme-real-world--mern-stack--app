const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getAllClients,
  getClientCount,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// REGISTER
// =========================
router.post("/register", registerUser);

// =========================
// LOGIN
// =========================
router.post("/login", loginUser);

// =========================
// LOGOUT
// =========================
router.post("/logout", logoutUser);

// =========================
// ADMIN - GET ALL CLIENTS
// =========================
router.get(
  "/admin/clients",
  protect,
  adminOnly,
  getAllClients
);

// =========================
// ADMIN - GET CLIENT COUNT
// =========================
router.get(
  "/admin/clients/count",
  protect,
  adminOnly,
  getClientCount
);

module.exports = router;