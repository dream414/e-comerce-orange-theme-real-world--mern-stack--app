import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrder } from "../../context/OrderContext";

import { getProductImageUrl } from "../../services/productService";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ClientDashboard = () => {
  const { user } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  const {
    myOrders,
    loading: ordersLoading,
    error: ordersError,
    getMyOrders,
  } = useOrder();

  const navigate = useNavigate();

  // =========================
  // LOAD CLIENT ORDERS
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    getMyOrders(token).catch(() => {});
  }, []);

  const availableProducts = products.filter(
    (product) =>
      product.isAvailable !== false &&
      Number(product.stock) > 0
  );

  const categories = [
    ["👕", "Fashion"],
    ["📱", "Electronics"],
    ["💻", "Computers"],
    ["🏠", "Home"],
    ["💄", "Beauty"],
    ["🎁", "Accessories"],
  ];

  const handleCategoryClick = (category) => {
    navigate(
      `/products?category=${encodeURIComponent(category)}`
    );
  };

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "border-green-200 bg-green-50 text-green-700";

      case "Shipped":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Processing":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "Cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-orange-200 bg-orange-50 text-orange-700";
    }
  };

  // =========================
  // RECENT 5 ORDERS
  // =========================
  const recentOrders = myOrders.slice(0, 5);

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* =====================================================
          ORANGE & WHITE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden bg-white">

        {/* Top Left */}
        <div className="absolute -left-52 -top-52 h-[520px] w-[520px] rounded-full border-[70px] border-orange-600/10 bg-white" />

        <div className="absolute -left-40 -top-40 h-[390px] w-[390px] rounded-full border-[24px] border-orange-600 bg-white" />

        {/* Top Right */}
        <div className="absolute -right-48 -top-44 h-[500px] w-[500px] rounded-full border-[70px] border-orange-600/10 bg-white" />

        <div className="absolute -right-36 -top-32 h-[370px] w-[370px] rounded-full border-[24px] border-orange-600 bg-white" />

        {/* Bottom Left */}
        <div className="absolute -bottom-56 -left-52 h-[540px] w-[540px] rounded-full border-[70px] border-orange-600/10 bg-white" />

        <div className="absolute -bottom-40 -left-36 h-[400px] w-[400px] rounded-full border-[24px] border-orange-600 bg-white" />

        {/* Bottom Right */}
        <div className="absolute -bottom-52 -right-48 h-[520px] w-[520px] rounded-full border-[70px] border-orange-600/10 bg-white" />

        <div className="absolute -bottom-36 -right-32 h-[370px] w-[370px] rounded-full border-[24px] border-orange-600 bg-white" />

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10">

        {/* ===================================================
            HEADER
        =================================================== */}

        <Header />

        {/* ===================================================
            DASHBOARD CONTENT
        =================================================== */}

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* =================================================
              WELCOME HERO
          ================================================= */}

          <section className="relative mb-6 overflow-hidden rounded-[30px] border border-orange-600 bg-white/95 p-6 shadow-[0_20px_55px_rgba(249,115,22,0.10)] sm:p-8">

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-600 opacity-90" />

            <div className="absolute -bottom-24 -left-20 h-40 w-40 rounded-full bg-orange-600 opacity-90" />

            <div className="relative grid items-center gap-7 lg:grid-cols-[1fr_auto]">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5">

                  <span className="text-xs">
                    👋
                  </span>

                  <span className="text-[10px] font-black tracking-[0.15em] text-orange-600">
                    WELCOME BACK
                  </span>

                </div>

                <h2 className="max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">

                  Hello,{" "}

                  <span className="text-orange-600">
                    {user?.name}
                  </span>

                  !

                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">

                  Discover products, manage your shopping cart, track your
                  orders and enjoy a simple e-commerce experience.

                </p>

                <div className="mt-5 flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="rounded-xl bg-orange-600 px-5 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-700"
                  >
                    🛍️ Browse Products
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/client/orders")}
                    className="rounded-xl border-2 border-orange-600 bg-white px-5 py-3 text-xs font-black text-orange-600 transition hover:bg-orange-600 hover:text-white"
                  >
                    📦 My Orders
                  </button>

                </div>

              </div>

              <div className="hidden lg:flex">

                <div className="flex h-40 w-40 items-center justify-center rounded-full border-[5px] border-orange-600 bg-orange-50 shadow-[0_20px_45px_rgba(249,115,22,0.12)]">

                  <div className="text-7xl">
                    🛍️
                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              PRODUCT SUMMARY
          ================================================= */}

          <section className="mb-6">

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Total Products */}

              <div className="rounded-2xl border-2 border-orange-600 bg-white p-5 shadow-[0_10px_30px_rgba(249,115,22,0.07)]">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-black tracking-[0.16em] text-orange-600">
                      STORE
                    </p>

                    <h3 className="mt-1 text-sm font-black text-slate-800">
                      Available Products
                    </h3>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-xl text-white">
                    🛍️
                  </div>

                </div>

                <p className="mt-4 text-3xl font-black text-slate-950">
                  {productsLoading
                    ? "..."
                    : availableProducts.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Products currently available for shopping
                </p>

              </div>

              {/* Categories */}

              <div className="rounded-2xl border-2 border-orange-600 bg-white p-5 shadow-[0_10px_30px_rgba(249,115,22,0.07)]">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-black tracking-[0.16em] text-orange-600">
                      EXPLORE
                    </p>

                    <h3 className="mt-1 text-sm font-black text-slate-800">
                      Categories
                    </h3>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-xl text-white">
                    🗂️
                  </div>

                </div>

                <p className="mt-4 text-3xl font-black text-slate-950">
                  {categories.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Store categories available to explore
                </p>

              </div>

              {/* Shopping */}

              <div className="rounded-2xl border-2 border-orange-600 bg-white p-5 shadow-[0_10px_30px_rgba(249,115,22,0.07)]">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-black tracking-[0.16em] text-orange-600">
                      SHOPPING
                    </p>

                    <h3 className="mt-1 text-sm font-black text-slate-800">
                      Start Shopping
                    </h3>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-xl text-white">
                    🛒
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="mt-4 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-orange-700"
                >
                  Explore Store →
                </button>

              </div>

            </div>

          </section>

          {/* =================================================
              QUICK SHOPPING ACTIONS
          ================================================= */}

          <section className="mb-6">

            <div className="mb-4 flex items-end justify-between">

              <div>

                <p className="text-[10px] font-black tracking-[0.18em] text-orange-600">
                  SHOPPING SPACE
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  What would you like to do?
                </h2>

              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Products */}

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="group rounded-2xl border-2 border-orange-600 bg-white p-5 text-left shadow-[0_10px_30px_rgba(249,115,22,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(249,115,22,0.14)]"
              >

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-xl text-white">
                  🛍️
                </div>

                <h3 className="font-black text-slate-900">
                  Browse Products
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Explore products available in the store.
                </p>

              </button>

              {/* Cart */}

              <button
                type="button"
                onClick={() => navigate("/client/cart")}
                className="group rounded-2xl border-2 border-orange-600 bg-white p-5 text-left shadow-[0_10px_30px_rgba(249,115,22,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(249,115,22,0.14)]"
              >

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-xl text-white">
                  🛒
                </div>

                <h3 className="font-black text-slate-900">
                  Shopping Cart
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Review products before placing your order.
                </p>

              </button>

              {/* Orders */}

              <button
                type="button"
                onClick={() => navigate("/client/orders")}
                className="group rounded-2xl border-2 border-orange-600 bg-white p-5 text-left shadow-[0_10px_30px_rgba(249,115,22,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(249,115,22,0.14)]"
              >

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-xl text-white">
                  📦
                </div>

                <h3 className="font-black text-slate-900">
                  My Orders
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Track and review your previous orders.
                </p>

              </button>

              {/* Wishlist */}

              <button
                type="button"
                onClick={() => navigate("/client/wishlist")}
                className="group rounded-2xl border-2 border-orange-600 bg-white p-5 text-left shadow-[0_10px_30px_rgba(249,115,22,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(249,115,22,0.14)]"
              >

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-xl text-white">
                  ❤️
                </div>

                <h3 className="font-black text-slate-900">
                  Wishlist
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Save products you may want to buy later.
                </p>

              </button>

            </div>

          </section>

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <section className="mb-6 rounded-[28px] border border-orange-200 bg-white/95 p-5 shadow-[0_15px_40px_rgba(249,115,22,0.07)] sm:p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black tracking-[0.18em] text-orange-600">
                  EXPLORE
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Shop by Category
                </h2>

              </div>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="text-xs font-black text-orange-600 hover:text-orange-700"
              >
                View All →
              </button>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">

              {categories.map(([icon, title]) => (

                <button
                  key={title}
                  type="button"
                  onClick={() => handleCategoryClick(title)}
                  className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 transition hover:-translate-y-1 hover:border-orange-400 hover:bg-orange-50"
                >

                  <div className="text-3xl">
                    {icon}
                  </div>

                  <p className="mt-2 text-xs font-black text-slate-800">
                    {title}
                  </p>

                </button>

              ))}

            </div>

          </section>

          {/* =================================================
              LOWER CONTENT
          ================================================= */}

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">

            {/* =================================================
                RECENT ORDERS
            ================================================= */}

            <section className="rounded-[28px] border border-orange-200 bg-white/95 p-5 shadow-[0_15px_40px_rgba(249,115,22,0.07)] sm:p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-black tracking-[0.18em] text-orange-600">
                    ORDER ACTIVITY
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    Recent Orders
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() => navigate("/client/orders")}
                  className="text-xs font-black text-orange-600 hover:text-orange-700"
                >
                  View All
                </button>

              </div>

              {/* Loading */}

              {ordersLoading && (
                <div className="rounded-2xl border border-orange-100 bg-orange-50/40 px-5 py-10 text-center">

                  <p className="text-sm font-bold text-orange-600">
                    Loading your orders...
                  </p>

                </div>
              )}

              {/* Error */}

              {!ordersLoading && ordersError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center">

                  <div className="text-3xl">
                    ⚠️
                  </div>

                  <p className="mt-3 text-sm font-bold text-red-600">
                    {ordersError}
                  </p>

                </div>
              )}

              {/* No Orders */}

              {!ordersLoading &&
                !ordersError &&
                recentOrders.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 px-5 py-8 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
                      📦
                    </div>

                    <h3 className="mt-4 text-sm font-black text-slate-800">
                      No orders yet
                    </h3>

                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                      Your recent orders will appear here once you start shopping.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/products")}
                      className="mt-4 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-black text-white transition hover:bg-orange-700"
                    >
                      Start Shopping
                    </button>

                  </div>
                )}

              {/* Recent Orders List */}

              {!ordersLoading &&
                !ordersError &&
                recentOrders.length > 0 && (
                  <div className="space-y-3">

                    {recentOrders.map((order) => {

                      const firstProduct =
                        order.items?.[0]?.product;

                      const productImage =
                        firstProduct?.images &&
                        firstProduct.images.length > 0
                          ? getProductImageUrl(
                              firstProduct.images[0]
                            )
                          : null;

                      const productName =
                        firstProduct?.name ||
                        "Product unavailable";

                      const totalQuantity =
                        order.items?.reduce(
                          (total, item) =>
                            total +
                            Number(item.quantity || 0),
                          0
                        ) || 0;

                      return (
                        <button
                          key={order._id}
                          type="button"
                          onClick={() =>
                            navigate(
                              `/client/orders/${order._id}`
                            )
                          }
                          className="w-full rounded-2xl border border-orange-100 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/40"
                        >

                          <div className="flex items-center gap-3">

                            {/* Product Image */}

                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-orange-50">

                              {productImage ? (
                                <img
                                  src={productImage}
                                  alt={productName}
                                  className="h-full w-full object-contain transition duration-300 hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-2xl">
                                  📦
                                </div>
                              )}

                            </div>

                            {/* Order Information */}

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                <h3 className="truncate text-sm font-black text-slate-900">
                                  {productName}
                                </h3>

                                <span
                                  className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-black ${getStatusStyle(
                                    order.orderStatus
                                  )}`}
                                >
                                  {order.orderStatus}
                                </span>

                              </div>

                              <p className="mt-1 truncate text-[11px] text-slate-400">
                                Order #{order._id}
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">

                                <span className="text-xs text-slate-500">

                                  Qty:{" "}

                                  <strong className="text-slate-700">
                                    {totalQuantity}
                                  </strong>

                                </span>

                                <span className="text-xs text-slate-500">
                                  {formatDate(order.createdAt)}
                                </span>

                              </div>

                            </div>

                            {/* Total */}

                            <div className="hidden text-right sm:block">

                              <p className="text-[10px] font-semibold text-slate-400">
                                Total
                              </p>

                              <p className="mt-1 text-sm font-black text-orange-600">

                                Rs.{" "}

                                {Number(
                                  order.totalAmount || 0
                                ).toLocaleString()}

                              </p>

                            </div>

                          </div>

                          {/* Mobile Total */}

                          <div className="mt-3 flex items-center justify-between border-t border-orange-50 pt-3 sm:hidden">

                            <span className="text-[10px] font-semibold text-slate-400">
                              Total
                            </span>

                            <span className="text-sm font-black text-orange-600">

                              Rs.{" "}

                              {Number(
                                order.totalAmount || 0
                              ).toLocaleString()}

                            </span>

                          </div>

                        </button>
                      );
                    })}

                    {/* View All */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/client/orders")
                      }
                      className="w-full rounded-2xl border-2 border-orange-600 bg-white px-5 py-3 text-xs font-black text-orange-600 transition hover:bg-orange-600 hover:text-white"
                    >
                      View All Orders →
                    </button>

                  </div>
                )}

            </section>

            {/* =================================================
                ACCOUNT
            ================================================= */}

            <section className="rounded-[28px] border border-orange-200 bg-white/95 p-5 shadow-[0_15px_40px_rgba(249,115,22,0.07)] sm:p-6">

              <div className="mb-5">

                <p className="text-[10px] font-black tracking-[0.18em] text-orange-600">
                  ACCOUNT
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  My Account
                </h2>

              </div>

              {/* User */}

              <div className="mb-5 flex items-center gap-3 rounded-2xl bg-orange-50 p-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-lg font-black text-white">

                  {user?.name?.charAt(0)?.toUpperCase() || "U"}

                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-black text-slate-900">
                    {user?.name}
                  </p>

                  <p className="truncate text-[11px] text-slate-500">
                    {user?.email}
                  </p>

                </div>

              </div>

              {/* Account Details */}

              <div className="space-y-3">

                <div className="flex items-center justify-between rounded-xl border border-orange-100 p-3">

                  <span className="text-xs font-medium text-slate-500">
                    Account Type
                  </span>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black capitalize text-orange-700">
                    {user?.role}
                  </span>

                </div>

                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-orange-100 p-3 text-left opacity-70"
                >

                  <span className="text-xs font-bold text-slate-700">
                    👤 Profile Settings
                  </span>

                  <span className="text-[10px] font-bold text-orange-600">
                    Coming Soon
                  </span>

                </button>

                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-orange-100 p-3 text-left opacity-70"
                >

                  <span className="text-xs font-bold text-slate-700">
                    🔒 Security
                  </span>

                  <span className="text-[10px] font-bold text-orange-600">
                    Coming Soon
                  </span>

                </button>

              </div>

            </section>

          </div>

        </main>

        <Footer />

      </div>

    </div>
  );
};

export default ClientDashboard;