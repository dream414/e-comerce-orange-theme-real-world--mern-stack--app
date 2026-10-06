import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useCart } from "../../context/CartContext";
import { getProductImageUrl } from "../../services/productService";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    message,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleBackToDashboard = () => {
    navigate("/client/dashboard");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // ========================================
  // CHECK STOCK VALIDATION
  // ========================================

  const hasStockIssue = cart.items.some((item) => {
    const product = item.product;

    if (!product) {
      return true;
    }

    const availableStock = Number(
      product.stock || 0
    );

    const cartQuantity = Number(
      item.quantity || 0
    );

    return (
      availableStock <= 0 ||
      cartQuantity > availableStock
    );
  });

  // ========================================
  // CHECKOUT
  // ========================================

  const handleCheckout = () => {
    if (!cart.items.length) {
      return;
    }

    if (hasStockIssue) {
      return;
    }

    navigate("/client/checkout");
  };

  // ========================================
  // CART TOTAL
  // ========================================

  const cartTotal = cart.items.reduce(
    (total, item) => {
      return (
        total +
        Number(item.product?.price || 0) *
          Number(item.quantity || 0)
      );
    },
    0
  );

  // ========================================
  // LOADING
  // ========================================

  if (loading && cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffaf5] text-slate-900">

        <Header />

        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">

          <div className="text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-3xl">
              🛒
            </div>

            <p className="text-sm font-black text-slate-700">
              Loading your cart...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please wait a moment.
            </p>

          </div>

        </main>

        <Footer />

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">

      {/* ========================================
          BACKGROUND
      ======================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-orange-600 opacity-90" />

        <div className="absolute -right-40 -top-36 h-[380px] w-[380px] rounded-full bg-orange-600 opacity-90" />

        <div className="absolute -bottom-48 -left-40 h-[420px] w-[420px] rounded-full bg-orange-600 opacity-90" />

        <div className="absolute -bottom-44 -right-40 h-[400px] w-[400px] rounded-full bg-orange-600 opacity-90" />

        <div
          className="
            absolute inset-0
            opacity-25
            bg-[radial-gradient(circle,rgba(245,70,6,0.93)_1.3px,transparent_1.3px)]
            [background-size:28px_28px]
          "
        />

        <div className="absolute inset-0 bg-white/50" />

      </div>

      <div className="relative z-10">

        <Header />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* ========================================
              PAGE HEADER
          ======================================== */}

          <section className="relative mb-6 overflow-hidden rounded-[30px] border border-orange-600 bg-white/95 p-6 shadow-[0_20px_55px_rgba(249,115,22,0.10)] sm:p-8">

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-600 opacity-90" />

            <div className="absolute -bottom-24 -left-20 h-40 w-40 rounded-full bg-orange-600 opacity-90" />

            <div className="relative flex flex-col gap-5">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5">

                    <span className="text-xs">
                      🛒
                    </span>

                    <span className="text-[10px] font-black tracking-[0.15em] text-orange-600">
                      SHOPPING CART
                    </span>

                  </div>

                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    My Cart
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Review your selected products, update quantities
                    and prepare your cart for checkout.
                  </p>

                </div>

                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-orange-600 bg-orange-50 shadow-[0_15px_35px_rgba(249,115,22,0.12)]">

                  <span className="text-4xl">
                    🛒
                  </span>

                </div>

              </div>

              {/* PAGE ACTIONS */}

              <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

                <button
                  type="button"
                  onClick={handleBackToDashboard}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-orange-600 bg-white px-5 py-3 text-xs font-black text-orange-600 transition hover:bg-orange-600 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(249,115,22,0.20)] transition hover:-translate-y-0.5 hover:bg-orange-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>

              </div>

            </div>

          </section>

          {/* ========================================
              MESSAGES
          ======================================== */}

          {message && (
            <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
              ✅ {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* ========================================
              EMPTY CART
          ======================================== */}

          {cart.items.length === 0 ? (

            <section className="rounded-[28px] border border-orange-200 bg-white/95 p-8 text-center shadow-[0_15px_40px_rgba(249,115,22,0.07)] sm:p-12">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
                🛒
              </div>

              <p className="mt-5 text-[10px] font-black tracking-[0.18em] text-orange-600">
                YOUR CART
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You have not added any products yet.
                Explore our store and add something you like.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="mt-6 rounded-xl bg-orange-600 px-6 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(249,115,22,0.20)] transition hover:-translate-y-0.5 hover:bg-orange-700"
              >
                🛍️ Browse Products
              </button>

            </section>

          ) : (

            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">

              {/* ========================================
                  CART ITEMS
              ======================================== */}

              <section className="space-y-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-black tracking-[0.18em] text-orange-600">
                      CART ITEMS
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-950">
                      Selected Products
                    </h2>

                  </div>

                  <span className="rounded-full bg-orange-100 px-3 py-1.5 text-[10px] font-black text-orange-700">
                    {cart.items.length}{" "}
                    {cart.items.length === 1
                      ? "ITEM"
                      : "ITEMS"}
                  </span>

                </div>

                {/* ========================================
                    PRODUCT ITEMS
                ======================================== */}

                {cart.items.map((item) => {

                  const product = item.product;

                  if (!product) {
                    return null;
                  }

                  const availableStock = Number(
                    product.stock || 0
                  );

                  const currentQuantity = Number(
                    item.quantity || 0
                  );

                  const stockExceeded =
                    currentQuantity >
                    availableStock;

                  const outOfStock =
                    availableStock <= 0;

                  const isMaxQuantity =
                    currentQuantity >=
                    availableStock;

                  return (
                    <article
                      key={product._id}
                      className="overflow-hidden rounded-[24px] border border-orange-200 bg-white/95 p-4 shadow-[0_12px_35px_rgba(249,115,22,0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(249,115,22,0.11)] sm:p-5"
                    >

                      <div className="flex flex-col gap-5 sm:flex-row">

                        {/* ========================================
                            IMAGE
                        ======================================== */}

                        <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 sm:h-32 sm:w-32">

                          {product.images?.length > 0 ? (
                            <img
                              src={getProductImageUrl(
                                product.images[0]
                              )}
                              alt={product.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-4xl">
                              🛍️
                            </div>
                          )}

                        </div>

                        {/* ========================================
                            DETAILS
                        ======================================== */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                              <p className="text-[10px] font-black tracking-[0.14em] text-orange-600">
                                {product.category ||
                                  "PRODUCT"}
                              </p>

                              <h3 className="mt-1 text-lg font-black text-slate-950">
                                {product.name}
                              </h3>

                              {product.brand && (
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                  Brand:{" "}
                                  {product.brand}
                                </p>
                              )}

                            </div>

                            <p className="text-lg font-black text-orange-600">
                              Rs.{" "}
                              {Number(
                                product.price
                              ).toFixed(2)}
                            </p>

                          </div>

                          {/* ========================================
                              STOCK INFORMATION
                          ======================================== */}

                          <div className="mt-4">

                            {outOfStock ? (

                              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">

                                <p className="text-xs font-black text-red-700">
                                  ⚠️ Out of Stock
                                </p>

                                <p className="mt-0.5 text-[11px] font-semibold text-red-600">
                                  This product is currently
                                  unavailable.
                                </p>

                              </div>

                            ) : stockExceeded ? (

                              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">

                                <p className="text-xs font-black text-red-700">
                                  ⚠️ Quantity exceeds
                                  available stock
                                </p>

                                <p className="mt-0.5 text-[11px] font-semibold text-red-600">
                                  Only {availableStock}{" "}
                                  {availableStock === 1
                                    ? "item"
                                    : "items"}{" "}
                                  currently available.
                                </p>

                              </div>

                            ) : availableStock <= 5 ? (

                              <div className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2">

                                <p className="text-xs font-black text-orange-700">
                                  Only {availableStock}{" "}
                                  {availableStock === 1
                                    ? "item"
                                    : "items"}{" "}
                                  left in stock
                                </p>

                              </div>

                            ) : (

                              <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2">

                                <p className="text-xs font-black text-green-700">
                                  ✓ {availableStock}{" "}
                                  items available
                                </p>

                              </div>

                            )}

                          </div>

                          {/* ========================================
                              QUANTITY
                          ======================================== */}

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                            <div>

                              <p className="mb-2 text-[10px] font-black tracking-[0.14em] text-slate-400">
                                QUANTITY
                              </p>

                              <div className="flex items-center rounded-xl border border-orange-200 bg-orange-50/50">

                                {/* MINUS */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      product._id,
                                      currentQuantity -
                                        1
                                    )
                                  }
                                  disabled={
                                    currentQuantity <=
                                      1 ||
                                    loading
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-l-xl text-lg font-black text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  −
                                </button>

                                {/* CURRENT QUANTITY */}

                                <span className="flex h-9 min-w-10 items-center justify-center border-x border-orange-200 bg-white px-2 text-sm font-black text-slate-900">
                                  {currentQuantity}
                                </span>

                                {/* PLUS */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      product._id,
                                      currentQuantity +
                                        1
                                    )
                                  }
                                  disabled={
                                    loading ||
                                    outOfStock ||
                                    isMaxQuantity
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-r-xl text-lg font-black text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  +
                                </button>

                              </div>

                              {!outOfStock && (
                                <p className="mt-2 text-[10px] font-semibold text-slate-400">
                                  Maximum:{" "}
                                  {availableStock}
                                </p>
                              )}

                            </div>

                            {/* ITEM TOTAL */}

                            <div className="text-right">

                              <p className="text-[10px] font-black tracking-[0.14em] text-slate-400">
                                ITEM TOTAL
                              </p>

                              <p className="mt-1 text-base font-black text-slate-950">
                                Rs.{" "}
                                {(
                                  Number(
                                    product.price
                                  ) *
                                  currentQuantity
                                ).toFixed(2)}
                              </p>

                            </div>

                          </div>

                          {/* ========================================
                              REMOVE
                          ======================================== */}

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                product._id
                              )
                            }
                            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[10px] font-black text-red-600 transition hover:bg-red-100"
                          >
                            🗑️ Remove
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </section>

              {/* ========================================
                  SUMMARY
              ======================================== */}

              <aside className="h-fit lg:sticky lg:top-6">

                <div className="overflow-hidden rounded-[28px] border-2 border-orange-600 bg-white shadow-[0_15px_40px_rgba(249,115,22,0.10)]">

                  <div className="bg-orange-600 p-5 text-white">

                    <p className="text-[10px] font-black tracking-[0.18em] text-orange-100">
                      CART SUMMARY
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      Order Summary
                    </h2>

                  </div>

                  <div className="p-5">

                    {/* STOCK WARNING */}

                    {hasStockIssue && (
                      <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">

                        <p className="text-xs font-black text-red-700">
                          ⚠️ Stock issue detected
                        </p>

                        <p className="mt-1 text-[11px] leading-5 font-semibold text-red-600">
                          Please update the quantity of
                          the affected product before
                          continuing to checkout.
                        </p>

                      </div>
                    )}

                    <div className="space-y-4">

                      {/* ITEMS */}

                      <div className="flex items-center justify-between">

                        <span className="text-xs font-bold text-slate-500">
                          Items
                        </span>

                        <span className="text-sm font-black text-slate-900">
                          {cart.items.length}
                        </span>

                      </div>

                      {/* SUBTOTAL */}

                      <div className="flex items-center justify-between">

                        <span className="text-xs font-bold text-slate-500">
                          Subtotal
                        </span>

                        <span className="text-sm font-black text-slate-900">
                          Rs.{" "}
                          {cartTotal.toFixed(2)}
                        </span>

                      </div>

                      {/* DELIVERY */}

                      <div className="flex items-center justify-between">

                        <span className="text-xs font-bold text-slate-500">
                          Delivery
                        </span>

                        <span className="text-right text-xs font-black text-orange-600">
                          Calculated at checkout
                        </span>

                      </div>

                    </div>

                    <div className="my-5 border-t border-orange-100" />

                    {/* TOTAL */}

                    <div className="flex items-end justify-between gap-3">

                      <div>

                        <p className="text-[10px] font-black tracking-[0.14em] text-slate-400">
                          TOTAL
                        </p>

                        <p className="mt-1 text-2xl font-black text-slate-950">
                          Rs.{" "}
                          {cartTotal.toFixed(2)}
                        </p>

                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black ${
                          hasStockIssue
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {hasStockIssue
                          ? "CHECK STOCK"
                          : "READY"}
                      </span>

                    </div>

                    {/* CHECKOUT */}

                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={hasStockIssue}
                      className="mt-6 w-full rounded-xl bg-orange-600 px-5 py-3.5 text-xs font-black text-white shadow-[0_10px_25px_rgba(249,115,22,0.18)] transition hover:-translate-y-0.5 hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    >
                      {hasStockIssue
                        ? "⚠️ Fix Stock Issue"
                        : "📦 Proceed to Checkout"}
                    </button>

                    {/* CLEAR CART */}

                    <button
                      type="button"
                      onClick={clearCart}
                      className="mt-3 w-full rounded-xl border-2 border-orange-600 bg-white px-5 py-3 text-xs font-black text-orange-600 transition hover:bg-orange-600 hover:text-white"
                    >
                      Clear Cart
                    </button>

                  </div>

                </div>

                {/* ========================================
                    NEXT STEP
                ======================================== */}

                <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/70 p-4">

                  <p className="text-[10px] font-black tracking-[0.14em] text-orange-600">
                    NEXT STEP
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Continue to checkout to provide your
                    shipping and billing information before
                    placing your order.
                  </p>

                </div>

              </aside>

            </div>
          )}

        </main>

        <Footer />

      </div>
    </div>
  );
};

export default Cart;