import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useOrder } from "../../context/OrderContext";
import { getProductImageUrl } from "../../services/productService";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const {
    selectedOrder,
    loading,
    error,
    getOrderById,
    updateOrder,
    deleteOrder,
  } = useOrder();

  const [orderStatus, setOrderStatus] = useState("Pending");

  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // =========================
  // LOAD ORDER
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    getOrderById(orderId, token)
      .then((data) => {
        if (data.order) {
          setOrderStatus(
            data.order.orderStatus || "Pending"
          );

          setPaymentMethod(
            data.order.paymentMethod ||
              "Cash on Delivery"
          );
        }
      })
      .catch(() => {});
  }, [orderId, getOrderById, navigate]);

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // =========================
  // UPDATE ORDER
  // =========================
  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await updateOrder(
        orderId,
        {
          orderStatus,
          paymentMethod,
        },
        token
      );

      alert("Order updated successfully.");

      await getOrderById(orderId, token);
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // DELETE ORDER
  // =========================
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await deleteOrder(orderId, token);

      navigate("/admin/orders");
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading && !selectedOrder) {
    return (
      <div className="min-h-screen bg-[#fffaf5]">
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-orange-100 bg-white p-12 text-center shadow-sm">
            <p className="font-bold text-orange-600">
              Loading order details...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =========================
  // ERROR / ORDER NOT FOUND
  // =========================
  if (!selectedOrder || error) {
    return (
      <div className="min-h-screen bg-[#fffaf5]">
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="rounded-[28px] border border-red-200 bg-red-50 p-10 text-center">

            <div className="mb-4 text-5xl">
              ⚠️
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Order Not Found
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error || "Unable to load this order."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin/orders")}
              className="mt-6 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-700"
            >
              ← Back to Orders
            </button>

          </div>

        </main>

        <Footer />
      </div>
    );
  }

  const order = selectedOrder;

  const customerName =
    order.user?.name ||
    order.shippingInfo?.fullName ||
    "Customer unavailable";

  const customerEmail =
    order.user?.email ||
    order.shippingInfo?.email ||
    "Email unavailable";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf5] text-slate-900">

      {/* Background Decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =========================
            HEADER
        ========================= */}
        <section className="mb-6 overflow-hidden rounded-[30px] border border-orange-200 bg-white p-6 shadow-[0_15px_40px_rgba(249,115,22,0.08)] sm:p-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/orders")
                }
                className="mb-4 text-sm font-black text-orange-600 hover:text-orange-700"
              >
                ← Back to Orders
              </button>

              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                Order Details
              </p>

              <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                {customerName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {customerEmail}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Placed on {formatDate(order.createdAt)}
              </p>

            </div>

            <div
              className={`w-fit rounded-full border px-5 py-2.5 text-sm font-black ${
                order.orderStatus === "Delivered"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : order.orderStatus === "Shipped"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : order.orderStatus === "Processing"
                  ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                  : order.orderStatus === "Cancelled"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-orange-200 bg-orange-50 text-orange-700"
              }`}
            >
              {order.orderStatus}
            </div>

          </div>

        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">

          {/* =========================
              LEFT CONTENT
          ========================= */}
          <div className="space-y-6">

            {/* =========================
                CUSTOMER INFORMATION
            ========================= */}
            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.07)] sm:p-6">

              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                Customer
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Customer Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoBox
                  label="Name"
                  value={customerName}
                />

                <InfoBox
                  label="Email"
                  value={customerEmail}
                />

              </div>

            </section>

            {/* =========================
                ORDERED PRODUCTS
            ========================= */}
            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.07)] sm:p-6">

              <div className="mb-6">

                <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                  Products
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Ordered Products
                </h2>

              </div>

              <div className="space-y-6">

                {order.items?.map((item) => {

                  const product = item.product;

                  const productImage =
                    product?.images?.length > 0
                      ? getProductImageUrl(
                          product.images[0]
                        )
                      : null;

                  const productName =
                    product?.name ||
                    "Product unavailable";

                  const itemPrice =
                    Number(item.price || 0);

                  const quantity =
                    Number(item.quantity || 0);

                  const subtotal =
                    itemPrice * quantity;

                  return (
                    <article
                      key={item._id}
                      className="overflow-hidden rounded-[26px] border border-orange-100 bg-orange-50/30"
                    >

                      {/* Product Image */}
                      <div className="relative h-64 w-full overflow-hidden bg-orange-50 sm:h-72">

                        {productImage ? (
                          <img
                            src={productImage}
                            alt={productName}
                            className="h-full w-full object-contain transition duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-orange-50">

                            <div className="text-center">

                              <div className="mb-2 text-5xl">
                                📦
                              </div>

                              <p className="text-sm font-semibold text-slate-500">
                                No Image Available
                              </p>

                            </div>

                          </div>
                        )}

                      </div>

                      {/* Product Data */}
                      <div className="p-5 sm:p-6">

                        <div className="mb-3 flex flex-wrap items-center gap-2">

                          {product?.category && (
                            <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-orange-700">
                              {product.category}
                            </span>
                          )}

                          {product?.brand && (
                            <span className="text-xs font-semibold text-slate-400">
                              {product.brand}
                            </span>
                          )}

                        </div>

                        {/* Product Name */}
                        <h3 className="text-xl font-black text-slate-900">
                          {productName}
                        </h3>

                        {/* Product Details */}
                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                          <div className="rounded-2xl border border-orange-100 bg-white p-4">

                            <p className="text-xs font-semibold text-slate-400">
                              Price
                            </p>

                            <p className="mt-1 text-lg font-black text-orange-600">
                              Rs.{" "}
                              {itemPrice.toLocaleString()}
                            </p>

                          </div>

                          <div className="rounded-2xl border border-orange-100 bg-white p-4">

                            <p className="text-xs font-semibold text-slate-400">
                              Quantity
                            </p>

                            <p className="mt-1 text-lg font-black text-slate-900">
                              {quantity}
                            </p>

                          </div>

                          <div className="rounded-2xl border border-orange-100 bg-white p-4">

                            <p className="text-xs font-semibold text-slate-400">
                              Subtotal
                            </p>

                            <p className="mt-1 text-lg font-black text-orange-600">
                              Rs.{" "}
                              {subtotal.toLocaleString()}
                            </p>

                          </div>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>

            </section>

            {/* =========================
                SHIPPING INFORMATION
            ========================= */}
            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.07)] sm:p-6">

              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                Delivery
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Shipping Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoBox
                  label="Full Name"
                  value={order.shippingInfo?.fullName}
                />

                <InfoBox
                  label="Email"
                  value={order.shippingInfo?.email}
                />

                <InfoBox
                  label="Phone"
                  value={order.shippingInfo?.phone}
                />

                <InfoBox
                  label="City"
                  value={order.shippingInfo?.city}
                />

                <InfoBox
                  label="Postal Code"
                  value={order.shippingInfo?.postalCode}
                />

                <InfoBox
                  label="Address"
                  value={order.shippingInfo?.address}
                  fullWidth
                />

              </div>

            </section>

            {/* =========================
                BILLING INFORMATION
            ========================= */}
            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.07)] sm:p-6">

              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                Billing
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Billing Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoBox
                  label="Full Name"
                  value={order.billingInfo?.fullName}
                />

                <InfoBox
                  label="Email"
                  value={order.billingInfo?.email}
                />

                <InfoBox
                  label="City"
                  value={order.billingInfo?.city}
                />

                <InfoBox
                  label="Postal Code"
                  value={order.billingInfo?.postalCode}
                />

                <InfoBox
                  label="Address"
                  value={order.billingInfo?.address}
                  fullWidth
                />

              </div>

            </section>

          </div>

          {/* =========================
              RIGHT SIDEBAR
          ========================= */}
          <aside className="space-y-6">

            {/* Order Summary */}
            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.07)] sm:p-6">

              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                Summary
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between gap-4">

                  <span className="text-sm text-slate-500">
                    Products
                  </span>

                  <span className="font-black text-slate-900">
                    {order.items?.length || 0}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4">

                  <span className="text-sm text-slate-500">
                    Payment
                  </span>

                  <span className="text-right text-sm font-bold text-slate-700">
                    {order.paymentMethod}
                  </span>

                </div>

                <div className="border-t border-orange-100 pt-4">

                  <div className="flex items-center justify-between gap-4">

                    <span className="font-black text-slate-900">
                      Total
                    </span>

                    <span className="text-2xl font-black text-orange-600">
                      Rs.{" "}
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* Manage Order */}
            <section className="rounded-[28px] border border-orange-200 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.07)] sm:p-6">

              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                Admin Action
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                Manage Order
              </h2>

              {/* Status */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-black text-slate-700">
                  Order Status
                </label>

                <select
                  value={orderStatus}
                  onChange={(e) =>
                    setOrderStatus(e.target.value)
                  }
                  className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

              </div>

              {/* Payment */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-black text-slate-700">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                  className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="Cash on Delivery">
                    Cash on Delivery
                  </option>

                  <option value="Online Payment">
                    Online Payment
                  </option>
                </select>

              </div>

              {/* Update */}
              <button
                type="button"
                onClick={handleUpdate}
                disabled={updating}
                className="mt-5 w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {updating
                  ? "Updating..."
                  : "Update Order"}
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="mt-3 w-full rounded-2xl border-2 border-red-500 bg-white px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Order"}
              </button>

            </section>

          </aside>

        </div>

      </main>

      <Footer />
    </div>
  );
};

// =========================
// INFO BOX
// =========================
const InfoBox = ({
  label,
  value,
  fullWidth = false,
}) => {
  return (
    <div
      className={`rounded-2xl border border-orange-100 bg-orange-50/40 p-4 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-xs font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-slate-700">
        {value || "N/A"}
      </p>
    </div>
  );
};

export default OrderDetails;