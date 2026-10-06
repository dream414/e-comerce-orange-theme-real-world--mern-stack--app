import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useCart } from "../../context/CartContext";
import { getProductImageUrl } from "../../services/productService";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    loading,
    error,
  } = useCart();

  // ========================================
  // TOTAL AMOUNT
  // ========================================

  const totalAmount = cartItems.reduce(
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
  // STOCK VALIDATION
  // ========================================

  const hasStockIssue = cartItems.some((item) => {
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
  // CONTINUE TO SHIPPING
  // ========================================

  const handleContinue = () => {
    if (cartItems.length === 0) {
      return;
    }

    if (hasStockIssue) {
      return;
    }

    sessionStorage.setItem(
      "checkoutCart",
      JSON.stringify(cartItems)
    );

    navigate("/client/shipping-information");
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">

      {/* ========================================
          HEADER
      ======================================== */}

      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="mb-8">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5">

            <span className="text-xs">
              🛒
            </span>

            <span className="text-[10px] font-black tracking-[0.15em] text-orange-600">
              CHECKOUT
            </span>

          </div>

          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review your selected products and confirm
            their availability before continuing with
            your order.
          </p>

        </div>

        {/* ========================================
            LOADING
        ======================================== */}

        {loading && cartItems.length === 0 && (
          <div className="rounded-[28px] border border-orange-200 bg-white p-8 text-center shadow-[0_15px_40px_rgba(249,115,22,0.07)]">

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
        )}

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* ========================================
            EMPTY CART
        ======================================== */}

        {!loading &&
          !error &&
          cartItems.length === 0 && (

            <div className="rounded-[28px] border border-orange-200 bg-white p-10 text-center shadow-[0_15px_40px_rgba(249,115,22,0.07)]">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
                🛒
              </div>

              <p className="mt-5 text-[10px] font-black tracking-[0.18em] text-orange-600">
                CHECKOUT
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Add some products to your cart before
                continuing to checkout.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="mt-6 rounded-xl bg-orange-600 px-6 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(249,115,22,0.18)] transition hover:bg-orange-700"
              >
                🛍️ Continue Shopping
              </button>

            </div>
          )}

        {/* ========================================
            CHECKOUT CONTENT
        ======================================== */}

        {cartItems.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

            {/* ========================================
                PRODUCTS
            ======================================== */}

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-black tracking-[0.18em] text-orange-600">
                    SELECTED PRODUCTS
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    Review Your Cart
                  </h2>

                </div>

                <span className="rounded-full bg-orange-100 px-3 py-1.5 text-[10px] font-black text-orange-700">
                  {cartItems.length}{" "}
                  {cartItems.length === 1
                    ? "ITEM"
                    : "ITEMS"}
                </span>

              </div>

              {/* ========================================
                  PRODUCT LIST
              ======================================== */}

              {cartItems.map((item) => {

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

                const outOfStock =
                  availableStock <= 0;

                const stockExceeded =
                  currentQuantity >
                  availableStock;

                return (
                  <div
                    key={product._id}
                    className="rounded-[28px] border border-orange-200 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.07)]"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                      {/* IMAGE */}

                      <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 sm:w-28">

                        {product.images?.length > 0 ? (
                          <img
                            src={getProductImageUrl(
                              product.images[0]
                            )}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            No Image
                          </div>
                        )}

                      </div>

                      {/* PRODUCT INFO */}

                      <div className="flex-1">

                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-600">
                          {product.category ||
                            "PRODUCT"}
                        </p>

                        <h2 className="mt-1 text-lg font-black text-slate-950">
                          {product.name}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {product.category}

                          {product.brand
                            ? ` • ${product.brand}`
                            : ""}
                        </p>

                        <p className="mt-2 font-black text-orange-600">
                          Rs.{" "}
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          Quantity:{" "}
                          {currentQuantity}
                        </p>

                        {/* STOCK STATUS */}

                        <div className="mt-3">

                          {outOfStock ? (

                            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">

                              <p className="text-xs font-black text-red-700">
                                ⚠️ Out of Stock
                              </p>

                              <p className="mt-0.5 text-[11px] font-semibold text-red-600">
                                This product is no
                                longer available.
                              </p>

                            </div>

                          ) : stockExceeded ? (

                            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">

                              <p className="text-xs font-black text-red-700">
                                ⚠️ Quantity exceeds
                                available stock
                              </p>

                              <p className="mt-0.5 text-[11px] font-semibold text-red-600">
                                Requested:{" "}
                                {currentQuantity}
                                {" | "}
                                Available:{" "}
                                {availableStock}
                              </p>

                            </div>

                          ) : availableStock <= 5 ? (

                            <div className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2">

                              <p className="text-xs font-black text-orange-700">
                                Only{" "}
                                {availableStock}{" "}
                                {availableStock ===
                                1
                                  ? "item"
                                  : "items"}{" "}
                                left in stock
                              </p>

                            </div>

                          ) : (

                            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2">

                              <p className="text-xs font-black text-green-700">
                                ✓{" "}
                                {availableStock}{" "}
                                items available
                              </p>

                            </div>

                          )}

                        </div>

                      </div>

                      {/* ITEM TOTAL */}

                      <div className="sm:text-right">

                        <p className="text-[10px] font-black tracking-[0.14em] text-slate-400">
                          ITEM TOTAL
                        </p>

                        <p className="mt-1 text-lg font-black text-slate-900">
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

                  </div>
                );
              })}

            </div>

            {/* ========================================
                SUMMARY
            ======================================== */}

            <div className="h-fit rounded-[28px] border-2 border-orange-600 bg-white p-6 shadow-[0_15px_40px_rgba(249,115,22,0.10)] lg:sticky lg:top-6">

              <div className="rounded-2xl bg-orange-600 p-5 text-white">

                <p className="text-[10px] font-black tracking-[0.18em] text-orange-100">
                  CHECKOUT SUMMARY
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Order Summary
                </h2>

              </div>

              {/* STOCK WARNING */}

              {hasStockIssue && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">

                  <p className="text-xs font-black text-red-700">
                    ⚠️ Stock issue detected
                  </p>

                  <p className="mt-1 text-[11px] leading-5 font-semibold text-red-600">
                    Please return to your cart and
                    update the quantity before
                    continuing.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/client/cart")
                    }
                    className="mt-3 rounded-xl border border-red-200 bg-white px-4 py-2 text-[10px] font-black text-red-600 transition hover:bg-red-100"
                  >
                    Return to Cart
                  </button>

                </div>
              )}

              {/* SUMMARY DETAILS */}

              <div className="mt-5 space-y-4">

                <div className="flex justify-between border-b border-slate-200 pb-4">

                  <span className="text-sm font-semibold text-slate-600">
                    Items
                  </span>

                  <span className="text-sm font-black">
                    {cartItems.length}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-sm font-semibold text-slate-600">
                    Total
                  </span>

                  <span className="text-xl font-black text-orange-600">
                    Rs.{" "}
                    {totalAmount.toFixed(2)}
                  </span>

                </div>

              </div>

              {/* CONTINUE */}

              <button
                type="button"
                onClick={handleContinue}
                disabled={
                  cartItems.length === 0 ||
                  hasStockIssue
                }
                className="mt-6 w-full rounded-xl bg-orange-600 px-5 py-3.5 text-xs font-black text-white shadow-[0_10px_25px_rgba(249,115,22,0.18)] transition hover:-translate-y-0.5 hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {hasStockIssue
                  ? "⚠️ Fix Stock Issue First"
                  : "Continue to Shipping →"}
              </button>

              <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
                Your stock availability will also be
                verified again when the order is placed.
              </p>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Checkout;