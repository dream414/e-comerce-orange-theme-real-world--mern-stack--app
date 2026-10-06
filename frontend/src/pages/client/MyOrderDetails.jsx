import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useOrder } from "../../context/OrderContext";
import { getProductImageUrl } from "../../services/productService";

const MyOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedOrder,
    getOrderById,
    loading,
    error,
  } = useOrder();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && id) {
      getOrderById(id, token).catch(() => {});
    }
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Processing":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf5]">
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-12 text-center">
          Loading order details...
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !selectedOrder) {
    return (
      <div className="min-h-screen bg-[#fffaf5]">
        <Header />

        <main className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            {error || "Order not found."}

            <button
              onClick={() =>
                navigate("/client/orders")
              }
              className="mx-auto mt-5 block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white"
            >
              Back to My Orders
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const order = selectedOrder;

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Order Details
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Order ID: {order._id}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>

        <div className="space-y-6">
          {/* Products */}
          <div className="rounded-3xl border border-orange-200 bg-white p-6">
            <h2 className="text-xl font-bold">
              Ordered Products
            </h2>

            <div className="mt-5 space-y-4">
              {order.items?.map((item) => {
                const product = item.product;

                return (
                  <div
                    key={item._id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-orange-50">
                      {product?.images?.length > 0 ? (
                        <img
                          src={getProductImageUrl(
                            product.images[0]
                          )}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold">
                        {product?.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Category:{" "}
                        {product?.category || "N/A"}
                      </p>

                      <p className="text-sm text-slate-500">
                        Brand:{" "}
                        {product?.brand || "N/A"}
                      </p>

                      <p className="mt-2 text-sm">
                        Price: ${item.price}
                      </p>

                      <p className="text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="text-lg font-bold text-orange-600">
                      $
                      {(
                        item.price * item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping + Billing */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-orange-200 bg-white p-6">
              <h2 className="text-xl font-bold">
                Shipping Information
              </h2>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <strong>Name:</strong>{" "}
                  {order.shippingInfo?.fullName}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {order.shippingInfo?.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {order.shippingInfo?.phone}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.shippingInfo?.address}
                </p>

                <p>
                  <strong>City:</strong>{" "}
                  {order.shippingInfo?.city}
                </p>

                <p>
                  <strong>Postal Code:</strong>{" "}
                  {order.shippingInfo?.postalCode}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-orange-200 bg-white p-6">
              <h2 className="text-xl font-bold">
                Billing Information
              </h2>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <strong>Name:</strong>{" "}
                  {order.billingInfo?.fullName}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {order.billingInfo?.email}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.billingInfo?.address}
                </p>

                <p>
                  <strong>City:</strong>{" "}
                  {order.billingInfo?.city}
                </p>

                <p>
                  <strong>Postal Code:</strong>{" "}
                  {order.billingInfo?.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Final Information */}
          <div className="rounded-3xl border border-orange-200 bg-white p-6">
            <h2 className="text-xl font-bold">
              Order Information
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-sm text-slate-500">
                  Payment Method
                </p>

                <p className="mt-1 font-bold">
                  {order.paymentMethod}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-sm text-slate-500">
                  Status
                </p>

                <p className="mt-1 font-bold">
                  {order.orderStatus}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-sm text-slate-500">
                  Order Date
                </p>

                <p className="mt-1 font-bold">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-sm text-slate-500">
                  Total Amount
                </p>

                <p className="mt-1 text-xl font-bold text-orange-600">
                  ${order.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/client/orders")
              }
              className="mt-6 rounded-xl border border-orange-300 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Back to My Orders
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrderDetails;