import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  ArrowLeft,
  Package,
  User,
  Mail,
  Calendar,
  Eye,
  MapPin,
  Phone,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useOrder } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";

import { getProductImageUrl } from "../../services/productService";

const AdminNotifications = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    getAdminNotifications,
    markAdminNotificationsAsRead,
  } = useOrder();

  // =====================================================
  // LOCAL NOTIFICATION SNAPSHOT
  // =====================================================
  // Important:
  // Header ki polling ya OrderContext ki state change hone
  // se notification page ka data disappear nahi hoga.
  const [visibleNotifications, setVisibleNotifications] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD ADMIN NOTIFICATIONS
  // =========================
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        setLoading(true);
        setError("");

        const data =
          await getAdminNotifications(token);

        // API se jo notifications mili hain
        // unka local snapshot bana do.
        setVisibleNotifications(
          data.notifications || []
        );
      } catch (error) {
        setError(
          error.message ||
            "Failed to load admin notifications"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      loadNotifications();
    }
  }, [
    user,
    navigate,
    getAdminNotifications,
  ]);

  // =====================================================
  // MARK NOTIFICATIONS AS READ BEFORE LEAVING
  // =====================================================
  // IMPORTANT:
  // Yahan cleanup use nahi kiya gaya.
  //
  // React StrictMode development mein cleanup dobara
  // run kar sakta tha jis ki wajah se notification
  // automatically read ho rahi thi.
  //
  // Ab explicit navigation par mark as read hoga.
  const markNotificationsAsReadAndNavigate = async (
    path
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (
        token &&
        user?.role === "admin" &&
        visibleNotifications.length > 0
      ) {
        await markAdminNotificationsAsRead(
          token
        );
      }
    } catch (error) {
      console.error(
        "Failed to mark admin notifications as read:",
        error
      );
    } finally {
      navigate(path);
    }
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // =========================
  // FORMAT DATE + TIME
  // =========================
  const formatDateTime = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString(
      "en-PK",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
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
  // VIEW ORDER
  // =========================
  const handleViewOrder = async (orderId) => {
    await markNotificationsAsReadAndNavigate(
      `/admin/orders/${orderId}`
    );
  };

  // =========================
  // BACK TO DASHBOARD
  // =========================
  const handleBackToDashboard = async () => {
    await markNotificationsAsReadAndNavigate(
      "/admin/dashboard"
    );
  };

  // =========================
  // VIEW ALL ORDERS
  // =========================
  const handleViewAllOrders = async () => {
    await markNotificationsAsReadAndNavigate(
      "/admin/orders"
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf5] text-slate-900">

      {/* =========================
          BACKGROUND DECORATION
      ========================= */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <section className="mb-6 overflow-hidden rounded-[30px] border border-orange-200 bg-white p-6 shadow-[0_15px_40px_rgba(249,115,22,0.08)] sm:p-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <button
                type="button"
                onClick={handleBackToDashboard}
                className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-600 transition hover:text-orange-700"
              >
                <ArrowLeft className="h-4 w-4" />

                Back to Dashboard
              </button>

              <div className="flex items-center gap-4">

                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">

                  <Bell className="h-7 w-7" />

                  {visibleNotifications.length >
                    0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-600 px-1 text-xs font-black text-white shadow-md">
                      {visibleNotifications.length >
                      99
                        ? "99+"
                        : visibleNotifications.length}
                    </span>
                  )}

                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                    Admin Panel
                  </p>

                  <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
                    Order Notifications
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    View newly placed customer orders
                    and their ordered products.
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/60 px-6 py-4">

              <p className="text-xs font-black uppercase tracking-[0.12em] text-orange-600">
                New Orders
              </p>

              <p className="mt-1 text-3xl font-black text-slate-900">
                {visibleNotifications.length}
              </p>

            </div>

          </div>

        </section>

        {/* =========================
            LOADING
        ========================= */}
        {loading && (
          <div className="rounded-[28px] border border-orange-100 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

            <p className="font-bold text-orange-600">
              Loading order notifications...
            </p>

          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}
        {!loading && error && (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center">

            <p className="font-bold text-red-600">
              {error}
            </p>

          </div>
        )}

        {/* =========================
            NO NOTIFICATIONS
        ========================= */}
        {!loading &&
          !error &&
          visibleNotifications.length ===
            0 && (
            <div className="rounded-[28px] border border-orange-100 bg-white p-12 text-center shadow-[0_12px_35px_rgba(249,115,22,0.06)]">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">

                <Bell className="h-9 w-9 text-orange-500" />

              </div>

              <h2 className="text-2xl font-black text-slate-900">
                No New Order Notifications
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no unread customer
                orders.
              </p>

              <button
                type="button"
                onClick={handleViewAllOrders}
                className="mt-6 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
              >
                View All Orders
              </button>

            </div>
          )}

        {/* =========================
            NOTIFICATIONS
        ========================= */}
        {!loading &&
          !error &&
          visibleNotifications.length >
            0 && (
            <div className="space-y-6">

              {visibleNotifications.map(
                (order, index) => {

                  const customerName =
                    order.user?.name ||
                    order.shippingInfo
                      ?.fullName ||
                    "Customer unavailable";

                  const customerEmail =
                    order.user?.email ||
                    order.shippingInfo
                      ?.email ||
                    "Email unavailable";

                  const customerPhone =
                    order.shippingInfo?.phone ||
                    "Phone unavailable";

                  const totalProducts =
                    order.items?.length || 0;

                  const totalQuantity =
                    order.items?.reduce(
                      (total, item) =>
                        total +
                        Number(
                          item.quantity || 0
                        ),
                      0
                    ) || 0;

                  return (
                    <article
                      key={order._id}
                      className="overflow-hidden rounded-[30px] border border-orange-100 bg-white shadow-[0_12px_35px_rgba(249,115,22,0.07)] transition hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(249,115,22,0.12)]"
                    >

                      {/* =========================
                          ORDER HEADER
                      ========================= */}
                      <div className="border-b border-orange-100 bg-[#fffaf5] p-5 sm:p-6">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                          <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-lg font-black text-white shadow-lg shadow-orange-600/20">
                              {index + 1}
                            </div>

                            <div>

                              <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-600">
                                New Customer Order
                              </p>

                              <h2 className="mt-1 break-all text-lg font-black text-slate-900 sm:text-xl">
                                Order #{order._id}
                              </h2>

                              <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                <Calendar className="h-3.5 w-3.5" />

                                {formatDateTime(
                                  order.createdAt
                                )}
                              </p>

                            </div>

                          </div>

                          <span
                            className={`w-fit rounded-full border px-4 py-2 text-xs font-black ${getStatusStyle(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus ||
                              "Pending"}
                          </span>

                        </div>

                      </div>

                      {/* =========================
                          CUSTOMER + ORDER SUMMARY
                      ========================= */}
                      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">

                        {/* CUSTOMER */}
                        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5">

                          <div className="mb-4 flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                              <User className="h-4 w-4" />
                            </div>

                            <h3 className="text-sm font-black text-slate-900">
                              Customer Information
                            </h3>

                          </div>

                          <div className="space-y-3">

                            <div>
                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                                Name
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-800">
                                {customerName}
                              </p>
                            </div>

                            <div>

                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                                Email
                              </p>

                              <p className="mt-1 flex items-center gap-2 break-all text-sm font-semibold text-slate-700">

                                <Mail className="h-4 w-4 shrink-0 text-orange-500" />

                                {customerEmail}

                              </p>

                            </div>

                            <div>

                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                                Phone
                              </p>

                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700">

                                <Phone className="h-4 w-4 text-orange-500" />

                                {customerPhone}

                              </p>

                            </div>

                          </div>

                        </div>

                        {/* ORDER SUMMARY */}
                        <div className="rounded-2xl border border-orange-100 bg-white p-5">

                          <div className="mb-4 flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                              <Package className="h-4 w-4" />
                            </div>

                            <h3 className="text-sm font-black text-slate-900">
                              Order Summary
                            </h3>

                          </div>

                          <div className="grid grid-cols-2 gap-5">

                            <div>

                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                                Products
                              </p>

                              <p className="mt-1 text-lg font-black text-slate-900">
                                {totalProducts}
                              </p>

                            </div>

                            <div>

                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                                Quantity
                              </p>

                              <p className="mt-1 text-lg font-black text-slate-900">
                                {totalQuantity}
                              </p>

                            </div>

                            <div>

                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                                Payment
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-800">
                                {order.paymentMethod ||
                                  "Cash on Delivery"}
                              </p>

                            </div>

                            <div>

                              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                                Total Amount
                              </p>

                              <p className="mt-1 text-lg font-black text-orange-600">
                                Rs.{" "}
                                {Number(
                                  order.totalAmount ||
                                    0
                                ).toLocaleString()}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* =========================
                          ORDERED PRODUCTS
                      ========================= */}
                      <div className="border-t border-orange-100 p-5 sm:p-6">

                        <div className="mb-5 flex items-center justify-between">

                          <div>

                            <p className="text-xs font-black uppercase tracking-[0.12em] text-orange-600">
                              Products
                            </p>

                            <h3 className="mt-1 text-xl font-black text-slate-900">
                              Ordered Products
                            </h3>

                          </div>

                          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
                            {totalQuantity} Items
                          </span>

                        </div>

                        <div className="space-y-4">

                          {order.items?.length >
                          0 ? (
                            order.items.map(
                              (item, itemIndex) => {

                                const product =
                                  item.product;

                                const productImage =
                                  product
                                    ?.images
                                    ?.length > 0
                                    ? getProductImageUrl(
                                        product
                                          .images[0]
                                      )
                                    : null;

                                const productName =
                                  product?.name ||
                                  "Product unavailable";

                                return (
                                  <div
                                    key={
                                      item._id ||
                                      `${order._id}-${itemIndex}`
                                    }
                                    className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 sm:flex-row sm:items-center"
                                  >

                                    {/* PRODUCT IMAGE */}
                                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-white sm:h-24 sm:w-24">

                                      {productImage ? (
                                        <img
                                          src={
                                            productImage
                                          }
                                          alt={
                                            productName
                                          }
                                          className="h-full w-full object-contain p-2 transition duration-500 hover:scale-105"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center">

                                          <Package className="h-10 w-10 text-orange-300" />

                                        </div>
                                      )}

                                    </div>

                                    {/* PRODUCT DETAILS */}
                                    <div className="min-w-0 flex-1">

                                      <p className="text-xs font-black uppercase tracking-[0.1em] text-orange-600">
                                        Product
                                      </p>

                                      <h4 className="mt-1 text-lg font-black text-slate-900">
                                        {productName}
                                      </h4>

                                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-slate-400">

                                        {product?.category && (
                                          <span>
                                            Category:{" "}
                                            <strong className="text-slate-600">
                                              {
                                                product.category
                                              }
                                            </strong>
                                          </span>
                                        )}

                                        {product?.brand && (
                                          <span>
                                            Brand:{" "}
                                            <strong className="text-slate-600">
                                              {
                                                product.brand
                                              }
                                            </strong>
                                          </span>
                                        )}

                                      </div>

                                      <div className="mt-3 flex flex-wrap gap-3">

                                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700">
                                          Qty:{" "}
                                          {
                                            item.quantity
                                          }
                                        </span>

                                        <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-black text-orange-700">
                                          Rs.{" "}
                                          {Number(
                                            item.price ||
                                              0
                                          ).toLocaleString()}
                                        </span>

                                      </div>

                                    </div>

                                    {/* ITEM TOTAL */}
                                    <div className="shrink-0 sm:text-right">

                                      <p className="text-xs font-semibold text-slate-400">
                                        Item Total
                                      </p>

                                      <p className="mt-1 text-xl font-black text-orange-600">
                                        Rs.{" "}
                                        {(
                                          Number(
                                            item.price ||
                                              0
                                          ) *
                                          Number(
                                            item.quantity ||
                                              0
                                          )
                                        ).toLocaleString()}
                                      </p>

                                    </div>

                                  </div>
                                );
                              }
                            )
                          ) : (
                            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6 text-center">

                              <p className="text-sm font-bold text-slate-500">
                                No products found in
                                this order.
                              </p>

                            </div>
                          )}

                        </div>

                      </div>

                      {/* =========================
                          SHIPPING INFORMATION
                      ========================= */}
                      <div className="border-t border-orange-100 p-5 sm:p-6">

                        <div className="mb-4 flex items-center gap-2">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <MapPin className="h-4 w-4" />
                          </div>

                          <h3 className="text-sm font-black text-slate-900">
                            Shipping Information
                          </h3>

                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                          <div>
                            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                              Full Name
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {order.shippingInfo
                                ?.fullName ||
                                "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                              City
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {order.shippingInfo
                                ?.city || "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                              Postal Code
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {order.shippingInfo
                                ?.postalCode ||
                                "N/A"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                              Address
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {order.shippingInfo
                                ?.address ||
                                "N/A"}
                            </p>
                          </div>

                        </div>

                      </div>

                      {/* =========================
                          FOOTER ACTIONS
                      ========================= */}
                      <div className="flex flex-col gap-3 border-t border-orange-100 bg-[#fffaf5] p-5 sm:flex-row sm:justify-end">

                        <button
                          type="button"
                          onClick={() =>
                            handleViewOrder(
                              order._id
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 active:scale-95"
                        >
                          <Eye className="h-4 w-4" />

                          View Order Details
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

      </main>

      <Footer />
    </div>
  );
};

export default AdminNotifications;
