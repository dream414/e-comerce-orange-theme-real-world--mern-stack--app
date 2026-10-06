import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import ProductsManagement from "./pages/admin/ProductsManagement";
import Orders from "./pages/admin/Orders";
import OrderDetails from "./pages/admin/OrderDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminReviews from "./pages/admin/AdminReviews";

import ClientDashboard from "./pages/client/ClientDashboard";
import Products from "./pages/client/Products";
import ProductDetails from "./pages/client/ProductDetails";
import Cart from "./pages/client/Cart";
import Wishlist from "./pages/client/Wishlist";

import Checkout from "./pages/client/Checkout";
import ShippingInformation from "./pages/client/ShippingInformation";
import BillingInformation from "./pages/client/BillingInformation";
import OrderSummary from "./pages/client/OrderSummary";
import OrderConfirmation from "./pages/client/OrderConfirmation";
import MyOrders from "./pages/client/MyOrders";
import MyOrderDetails from "./pages/client/MyOrderDetails";

import ProtectedRoute from "./components/ProtectedRoute";

import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { CartProvider } from "./context/CartContext";
import { ReviewProvider } from "./context/ReviewContext";

const App = () => {
  return (
    <BrowserRouter>
      <ProductProvider>
        <OrderProvider>
          <CartProvider>
            <ReviewProvider>
              <Routes>

                {/* =========================
                    AUTH
                ========================= */}

                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />

                <Route
                  path="/register"
                  element={<Register />}
                />

                <Route
                  path="/login"
                  element={<Login />}
                />

                {/* =========================
                    ADMIN
                ========================= */}

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute role="admin">
                      <ProductsManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/products/add"
                  element={
                    <ProtectedRoute role="admin">
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/products/edit/:id"
                  element={
                    <ProtectedRoute role="admin">
                      <EditProduct />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute role="admin">
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/orders/:id"
                  element={
                    <ProtectedRoute role="admin">
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />

                {/* ADMIN ORDER NOTIFICATIONS */}
                <Route
                  path="/admin/notifications"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminNotifications />
                    </ProtectedRoute>
                  }
                />

                {/* ADMIN REVIEWS */}
                <Route
                  path="/admin/reviews"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminReviews />
                    </ProtectedRoute>
                  }
                />

                {/* =========================
                    CLIENT
                ========================= */}

                <Route
                  path="/client/dashboard"
                  element={
                    <ProtectedRoute role="client">
                      <ClientDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/products"
                  element={
                    <ProtectedRoute role="client">
                      <Products />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/products/:id"
                  element={
                    <ProtectedRoute role="client">
                      <ProductDetails />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/client/cart"
                  element={
                    <ProtectedRoute role="client">
                      <Cart />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/client/wishlist"
                  element={
                    <ProtectedRoute role="client">
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                {/* =========================
                    CHECKOUT
                ========================= */}

                <Route
                  path="/client/checkout"
                  element={
                    <ProtectedRoute role="client">
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/client/shipping-information"
                  element={
                    <ProtectedRoute role="client">
                      <ShippingInformation />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/client/billing-information"
                  element={
                    <ProtectedRoute role="client">
                      <BillingInformation />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/client/order-summary"
                  element={
                    <ProtectedRoute role="client">
                      <OrderSummary />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/client/order-confirmation"
                  element={
                    <ProtectedRoute role="client">
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />

                {/* =========================
                    CLIENT ORDERS
                ========================= */}

                <Route
                  path="/client/orders"
                  element={
                    <ProtectedRoute role="client">
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/client/orders/:id"
                  element={
                    <ProtectedRoute role="client">
                      <MyOrderDetails />
                    </ProtectedRoute>
                  }
                />

                {/* =========================
                    FALLBACK
                ========================= */}

                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />

              </Routes>
            </ReviewProvider>
          </CartProvider>
        </OrderProvider>
      </ProductProvider>
    </BrowserRouter>
  );
};

export default App;