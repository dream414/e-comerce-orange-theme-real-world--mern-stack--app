import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useOrder } from "../../context/OrderContext";
import { useCart } from "../../context/CartContext";

import { getProductImageUrl } from "../../services/productService";

const OrderSummary = () => {
  const navigate = useNavigate();

  const {
    createOrder,
    loading: orderLoading,
    error: orderError,
  } = useOrder();

  const { clearCart } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);

  const [placeOrderError, setPlaceOrderError] =
    useState("");

  // =====================================================
  // LOAD CHECKOUT DATA
  // =====================================================

  useEffect(() => {
    const storedCart =
      sessionStorage.getItem("checkoutCart");

    const storedShipping =
      sessionStorage.getItem("shippingInfo");

    const storedBilling =
      sessionStorage.getItem("billingInfo");

    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error(
          "Invalid checkout cart data:",
          error
        );

        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }

    if (storedShipping) {
      try {
        setShippingInfo(
          JSON.parse(storedShipping)
        );
      } catch (error) {
        console.error(
          "Invalid shipping data:",
          error
        );

        setShippingInfo(null);
      }
    }

    if (storedBilling) {
      try {
        setBillingInfo(
          JSON.parse(storedBilling)
        );
      } catch (error) {
        console.error(
          "Invalid billing data:",
          error
        );

        setBillingInfo(null);
      }
    }
  }, []);

  // =====================================================
  // TOTAL AMOUNT
  // =====================================================

  const totalAmount = cartItems.reduce(
    (total, item) => {
      const price = Number(
        item?.product?.price || 0
      );

      const quantity = Number(
        item?.quantity || 0
      );

      return total + price * quantity;
    },
    0
  );

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async () => {
    try {
      setPlaceOrderError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!cartItems.length) {
        setPlaceOrderError(
          "Your cart is empty."
        );
        return;
      }

      if (!shippingInfo || !billingInfo) {
        setPlaceOrderError(
          "Order information is incomplete."
        );
        return;
      }

      const invalidItem = cartItems.find(
        (item) => {
          const productId =
            item?.product?._id;

          const quantity = Number(
            item?.quantity || 0
          );

          return (
            !productId ||
            quantity <= 0
          );
        }
      );

      if (invalidItem) {
        setPlaceOrderError(
          "Some product information is invalid. Please go back to cart and try again."
        );

        return;
      }

      const orderItems = cartItems.map(
        (item) => ({
          product: item.product._id,
          quantity: Number(item.quantity),
          price: Number(item.product.price),
        })
      );

      const orderData = {
        items: orderItems,
        shippingInfo,
        billingInfo,
        totalAmount,
        paymentMethod:
          "Cash on Delivery",
      };

      const data = await createOrder(
        orderData,
        token
      );

      if (!data?.order) {
        throw new Error(
          "Order was not created successfully."
        );
      }

      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify(data.order)
      );

      try {
        await clearCart();
      } catch (clearError) {
        console.warn(
          "Order created, but cart could not be cleared:",
          clearError
        );
      }

      sessionStorage.removeItem(
        "checkoutCart"
      );

      sessionStorage.removeItem(
        "shippingInfo"
      );

      sessionStorage.removeItem(
        "billingInfo"
      );

      navigate(
        "/client/order-confirmation",
        {
          state: {
            order: data.order,
          },
        }
      );
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      setPlaceOrderError(
        error.message ||
          "Failed to place order"
      );
    }
  };

  // =====================================================
  // INCOMPLETE CHECKOUT
  // =====================================================

  if (
    !shippingInfo ||
    !billingInfo ||
    !cartItems.length
  ) {
    return (
      <div className="min-h-screen bg-[#fffaf5] text-slate-900">
        <Header />

        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-orange-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold">
              Order information is incomplete.
            </h1>

            <p className="mt-3 text-slate-600">
              Please complete your checkout information before
              placing the order.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/client/checkout"
                )
              }
              className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Back to Checkout
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Order Summary
          </h1>

          <p className="mt-2 text-slate-600">
            Confirm the product and quantity you want to order.
          </p>
        </div>

        {/* ERROR */}

        {(orderError ||
          placeOrderError) && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
            {placeOrderError ||
              orderError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="space-y-6">

            {/* =================================================
                ORDERED PRODUCTS
            ================================================= */}

            <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold">
                Ordered Product
              </h2>

              <div className="mt-5 space-y-4">

                {cartItems.map(
                  (item, index) => {
                    const product =
                      item?.product;

                    if (!product) {
                      return null;
                    }

                    const quantity =
                      Number(
                        item.quantity || 0
                      );

                    const price =
                      Number(
                        product.price || 0
                      );

                    const itemTotal =
                      price * quantity;

                    return (
                      <div
                        key={
                          product._id ||
                          index
                        }
                        className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:flex-row sm:items-center"
                      >

                        {/* IMAGE */}

                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                          {product.images
                            ?.length > 0 ? (
                            <img
                              src={getProductImageUrl(
                                product.images[0]
                              )}
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-slate-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* PRODUCT NAME + QUANTITY */}

                        <div className="min-w-0 flex-1">

                          {/* PRODUCT NAME */}

                          <h3 className="text-lg font-bold text-slate-900">
                            {product.name}
                          </h3>

                          {/* QUANTITY */}

                          <p className="mt-2 text-sm font-semibold text-orange-600">
                            Quantity: {quantity}
                          </p>

                          {/* CATEGORY + BRAND */}

                          <p className="mt-1 text-sm text-slate-500">
                            {product.category ||
                              "Product"}

                            {product.brand
                              ? ` • ${product.brand}`
                              : ""}
                          </p>

                        </div>

                        {/* ITEM TOTAL */}

                        <div className="shrink-0 sm:text-right">

                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Item Total
                          </p>

                          <p className="mt-1 text-lg font-bold text-orange-600">
                            Rs.{" "}
                            {itemTotal.toFixed(
                              2
                            )}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            </div>

            {/* =================================================
                SHIPPING INFORMATION
            ================================================= */}

            <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold">
                Shipping Information
              </h2>

              <div className="mt-4 grid gap-2 text-sm text-slate-600">

                <p>
                  <strong>Name:</strong>{" "}
                  {shippingInfo.fullName}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {shippingInfo.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {shippingInfo.phone}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {shippingInfo.address}
                </p>

                <p>
                  <strong>City:</strong>{" "}
                  {shippingInfo.city}
                </p>

                <p>
                  <strong>Postal Code:</strong>{" "}
                  {shippingInfo.postalCode}
                </p>

              </div>
            </div>

            {/* =================================================
                BILLING INFORMATION
            ================================================= */}

            <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold">
                Billing Information
              </h2>

              <div className="mt-4 grid gap-2 text-sm text-slate-600">

                <p>
                  <strong>Name:</strong>{" "}
                  {billingInfo.fullName}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {billingInfo.email}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {billingInfo.address}
                </p>

                <p>
                  <strong>City:</strong>{" "}
                  {billingInfo.city}
                </p>

                <p>
                  <strong>Postal Code:</strong>{" "}
                  {billingInfo.postalCode}
                </p>

              </div>
            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="h-fit rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Final Order
            </h2>

            <div className="mt-5 space-y-4">

              {/* PAYMENT */}

              <div className="flex justify-between gap-4">

                <span className="text-slate-600">
                  Payment Method
                </span>

                <span className="text-right font-semibold">
                  Cash on Delivery
                </span>

              </div>

              {/* TOTAL */}

              <div className="border-t border-slate-200 pt-4">

                <div className="flex justify-between gap-4">

                  <span className="text-lg font-bold">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-orange-600">
                    Rs.{" "}
                    {totalAmount.toFixed(
                      2
                    )}
                  </span>

                </div>

              </div>

              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={
                  handlePlaceOrder
                }
                disabled={orderLoading}
                className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {orderLoading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSummary;
