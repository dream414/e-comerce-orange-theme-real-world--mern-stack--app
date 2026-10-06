import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useOrder } from "../../context/OrderContext";
import { getProductImageUrl } from "../../services/productService";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    getOrderById,
    loading: orderLoading,
  } = useOrder();

  const [order, setOrder] = useState(
    location.state?.order || null
  );

  // =====================================================
  // LOAD ORDER
  // =====================================================

  useEffect(() => {
    const loadOrder = async () => {
      let currentOrder =
        location.state?.order || null;

      // -----------------------------------------------
      // First: sessionStorage fallback
      // -----------------------------------------------

      if (!currentOrder) {
        const storedOrder =
          sessionStorage.getItem("lastOrder");

        if (storedOrder) {
          try {
            currentOrder = JSON.parse(storedOrder);
          } catch (error) {
            console.error(
              "Invalid last order data:",
              error
            );
          }
        }
      }

      // -----------------------------------------------
      // Set currently available order
      // -----------------------------------------------

      if (currentOrder) {
        setOrder(currentOrder);
      }

      // -----------------------------------------------
      // Check whether product data is populated
      // -----------------------------------------------

      const firstProduct =
        currentOrder?.items?.[0]?.product;

      const productIsPopulated =
        firstProduct &&
        typeof firstProduct === "object" &&
        firstProduct.name;

      // -----------------------------------------------
      // If product is not populated,
      // fetch complete order again
      // -----------------------------------------------

      if (
        currentOrder?._id &&
        !productIsPopulated
      ) {
        try {
          const token =
            localStorage.getItem("token");

          if (!token) return;

          const data = await getOrderById(
            currentOrder._id,
            token
          );

          if (data?.order) {
            setOrder(data.order);

            sessionStorage.setItem(
              "lastOrder",
              JSON.stringify(data.order)
            );
          }
        } catch (error) {
          console.error(
            "Failed to reload complete order:",
            error
          );
        }
      }
    };

    loadOrder();
  }, [
    location.state,
    getOrderById,
  ]);

  // =====================================================
  // CUSTOMER NAME
  // =====================================================

  const customerName =
    order?.user?.name ||
    order?.shippingInfo?.fullName ||
    order?.billingInfo?.fullName ||
    "Customer";

  // =====================================================
  // CUSTOMER EMAIL
  // =====================================================

  const customerEmail =
    order?.user?.email ||
    order?.shippingInfo?.email ||
    order?.billingInfo?.email ||
    "";

  // =====================================================
  // ORDER ITEMS
  // =====================================================

  const orderItems = order?.items || [];

  // =====================================================
  // CONTINUE SHOPPING
  // =====================================================

  const handleContinueShopping = () => {
    sessionStorage.removeItem("checkoutCart");
    sessionStorage.removeItem("shippingInfo");
    sessionStorage.removeItem("billingInfo");
    sessionStorage.removeItem("lastOrder");

    navigate("/products");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (orderLoading && !order) {
    return (
      <div className="min-h-screen bg-[#fffaf5] text-slate-900">
        <Header />

        <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 py-12">

          <div className="w-full rounded-3xl border border-orange-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
              ⏳
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Loading Order...
            </h1>

            <p className="mt-2 text-slate-500">
              Please wait while we load your order details.
            </p>

          </div>

        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">

      <Header />

      <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 py-12">

        <div className="w-full rounded-3xl border border-orange-200 bg-white p-8 text-center shadow-sm sm:p-12">

          {/* =================================================
              SUCCESS ICON
          ================================================= */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
            ✓
          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <h1 className="mt-6 text-3xl font-bold">
            Order Placed Successfully!
          </h1>

          {/* =================================================
              CUSTOMER MESSAGE
          ================================================= */}

          <p className="mx-auto mt-3 max-w-xl text-slate-600">

            Thank you,{" "}

            <span className="font-semibold text-slate-900">
              {customerName}
            </span>

            . Your order has been successfully created.

          </p>

          {/* =================================================
              ORDER INFORMATION
          ================================================= */}

          {order && (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-orange-50 p-5 text-left">

              {/* CUSTOMER NAME */}

              <div className="flex justify-between gap-4">

                <span className="text-slate-600">
                  Customer Name
                </span>

                <span className="text-right font-semibold">
                  {customerName}
                </span>

              </div>

              {/* CUSTOMER EMAIL */}

              {customerEmail && (
                <div className="mt-3 flex justify-between gap-4">

                  <span className="text-slate-600">
                    Email
                  </span>

                  <span className="break-all text-right font-semibold">
                    {customerEmail}
                  </span>

                </div>
              )}

              {/* ORDER ID */}

              <div className="mt-3 flex justify-between gap-4">

                <span className="text-slate-600">
                  Order ID
                </span>

                <span className="break-all text-right font-semibold">
                  {order._id}
                </span>

              </div>

              {/* STATUS */}

              <div className="mt-3 flex justify-between gap-4">

                <span className="text-slate-600">
                  Status
                </span>

                <span className="font-semibold text-orange-600">
                  {order.orderStatus}
                </span>

              </div>

              {/* TOTAL */}

              <div className="mt-3 flex justify-between gap-4">

                <span className="text-slate-600">
                  Total
                </span>

                <span className="font-bold">
                  Rs.{" "}
                  {Number(
                    order.totalAmount || 0
                  ).toFixed(2)}
                </span>

              </div>

            </div>
          )}

          {/* =================================================
              ORDERED PRODUCTS
          ================================================= */}

          {orderItems.length > 0 && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-orange-200 bg-white p-5 text-left">

              <h2 className="text-lg font-bold">
                Ordered Products
              </h2>

              <div className="mt-4 space-y-4">

                {orderItems.map((item, index) => {

                  const product = item.product;

                  const productImage =
                    product?.images?.length > 0
                      ? getProductImageUrl(
                          product.images[0]
                        )
                      : null;

                  const productName =
                    product?.name ||
                    "Product";

                  const productCategory =
                    product?.category || "";

                  const productBrand =
                    product?.brand || "";

                  const quantity =
                    Number(item.quantity || 0);

                  const price =
                    Number(item.price || 0);

                  return (
                    <div
                      key={
                        item._id ||
                        index
                      }
                      className="flex flex-col gap-4 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center"
                    >

                      {/* =================================================
                          PRODUCT IMAGE
                      ================================================= */}

                      <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-orange-50 sm:h-20 sm:w-20">

                        {productImage ? (
                          <img
                            src={productImage}
                            alt={productName}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            No Image
                          </div>
                        )}

                      </div>

                      {/* =================================================
                          PRODUCT INFO
                      ================================================= */}

                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-slate-900">
                          {productName}
                        </h3>

                        {(productCategory ||
                          productBrand) && (
                          <p className="mt-1 text-sm text-slate-500">

                            {productCategory}

                            {productBrand
                              ? ` • ${productBrand}`
                              : ""}

                          </p>
                        )}

                        <p className="mt-1 text-sm text-slate-600">
                          Quantity: {quantity}
                        </p>

                      </div>

                      {/* =================================================
                          PRODUCT PRICE
                      ================================================= */}

                      <div className="shrink-0 text-left sm:text-right">

                        <p className="font-semibold text-orange-600">
                          Rs.{" "}
                          {price.toFixed(2)}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Subtotal: Rs.{" "}
                          {(price * quantity).toFixed(2)}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>
          )}

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

            {/* VIEW ORDER */}

            {order && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/client/orders/${order._id}`
                  )
                }
                className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                View Order
              </button>
            )}

            {/* MY ORDERS */}

            <button
              type="button"
              onClick={() =>
                navigate("/client/orders")
              }
              className="rounded-xl border border-orange-300 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              My Orders
            </button>

            {/* CONTINUE SHOPPING */}

            <button
              type="button"
              onClick={handleContinueShopping}
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-slate-50"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
};

export default OrderConfirmation;