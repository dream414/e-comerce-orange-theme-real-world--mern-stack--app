const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();

const app = express();

// =========================
// DATABASE CONNECTION
// =========================

connectDB();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

// =========================
// STATIC UPLOADED FILES
// =========================

app.use(
  "/uploads",
  express.static("uploads")
);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "E-commerce Backend is Running",
  });
});

// =========================
// AUTHENTICATION ROUTES
// =========================

app.use(
  "/api/auth",
  authRoutes
);

// =========================
// PRODUCT ROUTES
// =========================

app.use(
  "/api/products",
  productRoutes
);

// =========================
// CART ROUTES
// =========================

app.use(
  "/api/cart",
  cartRoutes
);

// =========================
// WISHLIST ROUTES
// =========================

app.use(
  "/api/wishlist",
  wishlistRoutes
);

// =========================
// ORDER ROUTES
// =========================

app.use(
  "/api/orders",
  orderRoutes
);

// =========================
// REVIEW & RATING ROUTES
// =========================

app.use(
  "/api/reviews",
  reviewRoutes
);

// =========================
// SERVER
// =========================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});