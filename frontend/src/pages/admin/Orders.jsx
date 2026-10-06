import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useOrder } from "../../context/OrderContext";
import { getProductImageUrl } from "../../services/productService";

const Orders = () => {
  const navigate = useNavigate();

  const {
    orders,
    loading,
    error,
    getAllOrders,
    deleteOrder,
  } = useOrder();

  // =========================
  // LOAD ALL ORDERS
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    getAllOrders(token).catch(() => {});
  }, [getAllOrders, navigate]);

  // =========================
  // FORMAT DATE
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
        return "bg-green-50 text-green-700 border-green-200";

      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-orange-50 text-orange-700 border-orange-200";
    }
  };

  // =========================
  // DELETE ORDER
  // =========================
  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await deleteOrder(orderId, token);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">

      {/* =========================
          PREMIUM BACKGROUND
          ========================= */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden bg-white">

        {/* Soft top-left glow */}
        <div className="absolute -left-48 -top-48 h-[520px] w-[520px] rounded-full bg-orange-600/[0.035] blur-3xl" />

        {/* Top-left outer ring */}
        <div className="absolute -left-44 -top-44 h-[500px] w-[500px] rounded-full border-[90px] border-orange-600/[0.06] bg-white" />

        {/* Top-left inner ring */}
        <div className="absolute -left-32 -top-32 h-[350px] w-[350px] rounded-full border-[28px] border-orange-600/[0.16] bg-white" />

        {/* Top-right abstract ring */}
        <div className="absolute -right-56 -top-40 h-[540px] w-[540px] rounded-full border-[75px] border-orange-600/[0.05] bg-white" />

        <div className="absolute -right-40 -top-24 h-[380px] w-[380px] rounded-full border-[24px] border-orange-600/[0.13] bg-white" />

        {/* Middle-right subtle circle */}
        <div className="absolute right-[8%] top-[34%] h-32 w-32 rounded-full border-[14px] border-orange-600/[0.07]" />

        {/* Middle-left subtle circle */}
        <div className="absolute left-[5%] top-[48%] h-24 w-24 rounded-full border-[10px] border-orange-600/[0.06]" />

        {/* Bottom-left layered shape */}
        <div className="absolute -bottom-60 -left-48 h-[540px] w-[540px] rounded-full border-[85px] border-orange-600/[0.05] bg-white" />

        <div className="absolute -bottom-40 -left-32 h-[390px] w-[390px] rounded-full border-[26px] border-orange-600/[0.14] bg-white" />

        {/* Bottom-right layered shape */}
        <div className="absolute -bottom-56 -right-48 h-[520px] w-[520px] rounded-full border-[80px] border-orange-600/[0.055] bg-white" />

        <div className="absolute -bottom-36 -right-28 h-[360px] w-[360px] rounded-full border-[25px] border-orange-600/[0.14] bg-white" />

        {/* Small decorative dots */}
        <div className="absolute left-[18%] top-[22%] h-2 w-2 rounded-full bg-orange-600/20" />
        <div className="absolute left-[21%] top-[24%] h-1.5 w-1.5 rounded-full bg-orange-600/15" />

        <div className="absolute right-[18%] top-[27%] h-2 w-2 rounded-full bg-orange-600/20" />
        <div className="absolute right-[21%] top-[29%] h-1.5 w-1.5 rounded-full bg-orange-600/15" />

        <div className="absolute bottom-[20%] left-[25%] h-2 w-2 rounded-full bg-orange-600/15" />
        <div className="absolute bottom-[23%] right-[26%] h-2 w-2 rounded-full bg-orange-600/15" />

      </div>

      <div className="relative z-10">

        <Header />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* PAGE HEADER */}
          <section className="mb-6 overflow-hidden rounded-[30px] border border-orange-200 bg-white p-6 shadow-[0_15px_40px_rgba(249,115,22,0.08)] sm:p-8">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                  Admin Panel
                </p>

                <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                  Orders
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Manage all customer orders, customers, products and
                  order status from one place.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="rounded-2xl border-2 border-orange-600 bg-white px-5 py-3 text-sm font-black text-orange-700 transition hover:bg-orange-50"
              >
                ← Back to Dashboard
              </button>

            </div>
          </section>

          {/* LOADING */}
          {loading && (
            <div className="rounded-[28px] border border-orange-100 bg-white p-10 text-center shadow-sm">
              <p className="font-bold text-orange-600">
                Loading orders...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center">
              <p className="font-bold text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* NO ORDERS */}
          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="rounded-[28px] border border-orange-100 bg-white p-12 text-center shadow-[0_12px_35px_rgba(249,115,22,0.06)]">

                <div className="mb-4 text-5xl">
                  📦
                </div>

                <h2 className="text-2xl font-black text-slate-900">
                  No Orders Found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  There are currently no customer orders.
                </p>

              </div>
            )}

          {/* ALL ORDERS */}
          {!loading &&
            !error &&
            orders.length > 0 && (
              <div className="space-y-5">

                {orders.map((order) => {

                  const firstProduct =
                    order.items?.[0]?.product;

                  const firstProductImage =
                    firstProduct?.images?.length > 0
                      ? getProductImageUrl(
                          firstProduct.images[0]
                        )
                      : null;

                  const firstProductName =
                    firstProduct?.name ||
                    "Product unavailable";

                  const customerName =
                    order.user?.name ||
                    order.shippingInfo?.fullName ||
                    "Customer unavailable";

                  const customerEmail =
                    order.user?.email ||
                    order.shippingInfo?.email ||
                    "Email unavailable";

                  const totalProducts =
                    order.items?.length || 0;

                  const totalQuantity =
                    order.items?.reduce(
                      (total, item) =>
                        total +
                        Number(item.quantity || 0),
                      0
                    ) || 0;

                  return (
                    <article
                      key={order._id}
                      className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_12px_35px_rgba(249,115,22,0.07)] transition hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(249,115,22,0.12)]"
                    >

                      <div className="p-5 sm:p-6">

                        {/* Order Top */}
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                          <div>

                            <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-600">
                              Customer Order
                            </p>

                            <h2 className="mt-1 text-xl font-black text-slate-900">
                              {customerName}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                              {customerEmail}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(order.createdAt)}
                            </p>

                          </div>

                          <span
                            className={`w-fit rounded-full border px-4 py-2 text-xs font-black ${getStatusStyle(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>

                        </div>

                        {/* Product + Customer */}
                        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">

                          {/* Product Image */}
                          <div className="h-28 w-full overflow-hidden rounded-2xl bg-orange-50 lg:h-28 lg:w-28">

                            {firstProductImage ? (
                              <img
                                src={firstProductImage}
                                alt={firstProductName}
                                className="h-full w-full object-contain transition duration-500 hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="text-3xl">
                                  📦
                                </span>
                              </div>
                            )}

                          </div>

                          {/* Product Information */}
                          <div className="min-w-0">

                            <p className="text-xs font-black uppercase tracking-[0.12em] text-orange-600">
                              Product
                            </p>

                            <h3 className="mt-1 text-lg font-black text-slate-900">
                              {firstProductName}
                            </h3>

                            {firstProduct?.category && (
                              <p className="mt-1 text-xs font-semibold text-slate-400">
                                {firstProduct.category}
                              </p>
                            )}

                            {firstProduct?.brand && (
                              <p className="mt-1 text-xs font-semibold text-slate-400">
                                Brand: {firstProduct.brand}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">

                              <span>
                                Products:{" "}
                                <strong className="text-slate-900">
                                  {totalProducts}
                                </strong>
                              </span>

                              <span>
                                Quantity:{" "}
                                <strong className="text-slate-900">
                                  {totalQuantity}
                                </strong>
                              </span>

                            </div>

                          </div>

                          {/* Total */}
                          <div className="lg:text-right">

                            <p className="text-xs font-semibold text-slate-400">
                              Total Amount
                            </p>

                            <p className="mt-1 text-2xl font-black text-orange-600">
                              Rs.{" "}
                              {Number(
                                order.totalAmount || 0
                              ).toLocaleString()}
                            </p>

                          </div>

                        </div>

                        {/* Customer Information */}
                        <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50/40 p-4">

                          <p className="text-xs font-black uppercase tracking-[0.12em] text-orange-600">
                            Customer
                          </p>

                          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-6">

                            <p className="text-sm font-bold text-slate-800">
                              {customerName}
                            </p>

                            <p className="text-sm text-slate-500">
                              {customerEmail}
                            </p>

                          </div>

                        </div>

                        {/* All Products */}
                        {order.items?.length > 1 && (
                          <div className="mt-5">

                            <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-orange-600">
                              All Products
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {order.items.map((item) => {

                                const product =
                                  item.product;

                                const image =
                                  product?.images?.length > 0
                                    ? getProductImageUrl(
                                        product.images[0]
                                      )
                                    : null;

                                return (
                                  <div
                                    key={item._id}
                                    className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50/50 px-3 py-2"
                                  >

                                    <div className="h-10 w-10 overflow-hidden rounded-xl bg-orange-50">

                                      {image ? (
                                        <img
                                          src={image}
                                          alt={
                                            product?.name ||
                                            "Product"
                                          }
                                          className="h-full w-full object-contain"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-sm">
                                          📦
                                        </div>
                                      )}

                                    </div>

                                    <div className="max-w-[180px]">

                                      <p className="truncate text-xs font-black text-slate-700">
                                        {product?.name ||
                                          "Product unavailable"}
                                      </p>

                                      <p className="text-[11px] text-slate-400">
                                        Qty: {item.quantity}
                                      </p>

                                    </div>

                                  </div>
                                );
                              })}

                            </div>

                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-6 flex flex-col gap-3 border-t border-orange-50 pt-5 sm:flex-row">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/orders/${order._id}`
                              )
                            }
                            className="flex-1 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 active:scale-95"
                          >
                            View Order Details
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(order._id)
                            }
                            className="rounded-2xl border-2 border-red-500 bg-white px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50 active:scale-95"
                          >
                            Delete Order
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>
            )}

        </main>

        <Footer />

      </div>
    </div>
  );
};

export default Orders;