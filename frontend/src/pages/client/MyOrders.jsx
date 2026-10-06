import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useOrder } from "../../context/OrderContext";
import { getProductImageUrl } from "../../services/productService";

const MyOrders = () => {
  const navigate = useNavigate();

  const {
    myOrders,
    getMyOrders,
    loading,
    error,
  } = useOrder();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getMyOrders(token).catch(() => {});
    }
  }, []);

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleBackToDashboard = () => {
    navigate("/client/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              My Orders
            </h1>

            <p className="mt-2 text-slate-600">
              View and track all your orders.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBackToDashboard}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-orange-600 bg-white px-5 py-3 text-xs font-black text-orange-600 transition hover:bg-orange-600 hover:text-white sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

        </div>

        {loading && (
          <div className="rounded-3xl border border-orange-200 bg-white p-8 text-center">
            Loading your orders...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          myOrders.length === 0 && (
            <div className="rounded-3xl border border-orange-200 bg-white p-10 text-center">
              <h2 className="text-2xl font-bold">
                No Orders Yet
              </h2>

              <p className="mt-2 text-slate-500">
                You have not placed any order yet.
              </p>

              <button
                onClick={() => navigate("/products")}
                className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white"
              >
                Start Shopping
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          myOrders.length > 0 && (
            <div className="space-y-5">
              {myOrders.map((order) => {
                const firstProduct =
                  order.items?.[0]?.product;

                const totalQuantity =
                  order.items?.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  ) || 0;

                return (
                  <div
                    key={order._id}
                    className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex gap-4">

                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-orange-50">
                          {firstProduct?.images?.length >
                          0 ? (
                            <img
                              src={getProductImageUrl(
                                firstProduct.images[0]
                              )}
                              alt={firstProduct.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-slate-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div>
                          <h2 className="text-lg font-bold">
                            {firstProduct?.name ||
                              "Product"}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {order.items?.length || 0}{" "}
                            product(s) •{" "}
                            {totalQuantity} item(s)
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Order ID: {order._id}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                      </div>

                      <div className="flex flex-col gap-3 lg:items-end">

                        <span
                          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                        <p className="text-xl font-bold text-orange-600">
                          $
                          {order.totalAmount?.toFixed(
                            2
                          )}
                        </p>

                        <button
                          onClick={() =>
                            navigate(
                              `/client/orders/${order._id}`
                            )
                          }
                          className="rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600"
                        >
                          View Details
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;