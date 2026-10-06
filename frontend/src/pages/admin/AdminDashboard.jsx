import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Package,
  ShoppingBag,
  FolderOpen,
  Plus,
  ArrowRight,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  Boxes,
  Star,
  MessageSquare,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useOrder } from "../../context/OrderContext";

import { getAllReviews } from "../../services/reviewService";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { products, loading } = useProducts();
  const { orders, getAllOrders } = useOrder();

  const navigate = useNavigate();

  const [clientCount, setClientCount] = useState(0);
  const [clientCountLoading, setClientCountLoading] =
    useState(true);

  const [reviewCount, setReviewCount] = useState(0);
  const [reviewCountLoading, setReviewCountLoading] =
    useState(true);

  // FETCH ORDERS
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    getAllOrders(token).catch((error) => {
      console.error("Failed to fetch orders:", error);
    });
  }, [getAllOrders]);

  // FETCH CLIENT COUNT
  useEffect(() => {
    const fetchClientCount = async () => {
      try {
        setClientCountLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setClientCount(0);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/auth/admin/clients/count",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch client count"
          );
        }

        setClientCount(data.count || 0);
      } catch (error) {
        console.error(
          "Failed to fetch client count:",
          error
        );

        setClientCount(0);
      } finally {
        setClientCountLoading(false);
      }
    };

    fetchClientCount();
  }, []);

  // FETCH REVIEW COUNT
  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        setReviewCountLoading(true);

        const data = await getAllReviews();

        setReviewCount(data.totalReviews || 0);
      } catch (error) {
        console.error(
          "Failed to fetch review count:",
          error
        );

        setReviewCount(0);
      } finally {
        setReviewCountLoading(false);
      }
    };

    fetchReviewCount();
  }, []);

  // PRODUCT STATS
  const totalProducts = products.length;

  const totalCategories = useMemo(() => {
    return new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ).size;
  }, [products]);

  // TOTAL ACTUAL STOCK QUANTITY
  const totalStockQuantity = useMemo(() => {
    return products.reduce((total, product) => {
      return total + Number(product.stock || 0);
    }, 0);
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter(
      (product) => Number(product.stock) === 0
    ).length;
  }, [products]);

  // ORDER STATS
  const totalOrders = orders.length;

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ORDER STATUS STYLE
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock3,
          className:
            "bg-yellow-50 text-yellow-700 border-yellow-200",
        };

      case "Processing":
        return {
          icon: Package,
          className:
            "bg-blue-50 text-blue-700 border-blue-200",
        };

      case "Shipped":
        return {
          icon: Truck,
          className:
            "bg-purple-50 text-purple-700 border-purple-200",
        };

      case "Delivered":
        return {
          icon: CheckCircle2,
          className:
            "bg-green-50 text-green-700 border-green-200",
        };

      case "Cancelled":
        return {
          icon: XCircle,
          className:
            "bg-red-50 text-red-700 border-red-200",
        };

      default:
        return {
          icon: Clock3,
          className:
            "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* BACKGROUND DESIGN - ORANGE 600 + WHITE */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden bg-white">

        {/* TOP LEFT */}
        <div className="absolute -left-52 -top-52 h-[520px] w-[520px] rounded-full border-[70px] border-orange-600/10 bg-white" />

        <div className="absolute -left-40 -top-40 h-[390px] w-[390px] rounded-full border-[24px] border-orange-600 bg-white" />

        {/* TOP RIGHT */}
        <div className="absolute -right-48 -top-44 h-[500px] w-[500px] rounded-full border-[70px] border-orange-600/10 bg-white" />

        <div className="absolute -right-36 -top-32 h-[370px] w-[370px] rounded-full border-[24px] border-orange-600 bg-white" />

        {/* BOTTOM LEFT */}
        <div className="absolute -bottom-56 -left-52 h-[540px] w-[540px] rounded-full border-[70px] border-orange-600/10 bg-white" />

        <div className="absolute -bottom-40 -left-36 h-[400px] w-[400px] rounded-full border-[24px] border-orange-600 bg-white" />

        {/* BOTTOM RIGHT */}
        <div className="absolute -bottom-52 -right-48 h-[520px] w-[520px] rounded-full border-[70px] border-orange-600/10 bg-white" />

        <div className="absolute -bottom-36 -right-32 h-[370px] w-[370px] rounded-full border-[24px] border-orange-600 bg-white" />

      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10">

        <Header />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* WELCOME */}
          <section className="relative overflow-hidden rounded-[30px] bg-orange-600 p-7 text-white shadow-[0_20px_50px_rgba(249,115,22,0.20)] sm:p-10">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
                  Admin Dashboard
                </p>

                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  Welcome, {user?.name || "Admin"}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-orange-50">
                  Manage your products, orders, clients and
                  overall e-commerce platform from one place.
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/products/add")
                  }
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-orange-600 shadow-lg transition hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/orders")
                  }
                  className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Manage Orders
                </button>

              </div>
            </div>
          </section>

          {/* STORE OVERVIEW */}
          <section className="mt-8">

            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-950">
                Store Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quick overview of your e-commerce platform.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

              {/* PRODUCTS */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                className="group rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <Package className="h-6 w-6" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600" />

                </div>

                <p className="mt-5 text-sm font-semibold text-slate-500">
                  Products
                </p>

                <p className="mt-1 text-3xl font-black text-slate-950">
                  {loading ? "..." : totalProducts}
                </p>
              </button>

              {/* ORDERS */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/orders")
                }
                className="group rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <ShoppingBag className="h-6 w-6" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600" />

                </div>

                <p className="mt-5 text-sm font-semibold text-slate-500">
                  Orders
                </p>

                <p className="mt-1 text-3xl font-black text-slate-950">
                  {totalOrders}
                </p>
              </button>

              {/* USERS */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/users")
                }
                className="group rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <Users className="h-6 w-6" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600" />

                </div>

                <p className="mt-5 text-sm font-semibold text-slate-500">
                  Users
                </p>

                <p className="mt-1 text-3xl font-black text-slate-950">
                  {clientCountLoading
                    ? "..."
                    : clientCount}
                </p>
              </button>

              {/* CATEGORIES */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                className="group rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <FolderOpen className="h-6 w-6" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600" />

                </div>

                <p className="mt-5 text-sm font-semibold text-slate-500">
                  Categories
                </p>

                <p className="mt-1 text-3xl font-black text-slate-950">
                  {loading ? "..." : totalCategories}
                </p>
              </button>

              {/* REVIEWS */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/reviews")
                }
                className="group rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <MessageSquare className="h-6 w-6" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-600" />

                </div>

                <p className="mt-5 text-sm font-semibold text-slate-500">
                  Reviews
                </p>

                <p className="mt-1 text-3xl font-black text-slate-950">
                  {reviewCountLoading
                    ? "..."
                    : reviewCount}
                </p>
              </button>

            </div>
          </section>

          {/* PRODUCT STATUS */}
          <section className="mt-8">

            <div className="mb-5">

              <h2 className="text-xl font-black text-slate-950">
                Product Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monitor your current product stock.
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* IN STOCK */}
              <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <Boxes className="h-6 w-6" />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      Total Stock
                    </p>

                    <p className="text-2xl font-black text-slate-950">
                      {loading
                        ? "..."
                        : totalStockQuantity}
                    </p>

                  </div>

                </div>

              </div>

              {/* OUT OF STOCK */}
              <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <XCircle className="h-6 w-6" />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      Out of Stock
                    </p>

                    <p className="text-2xl font-black text-slate-950">
                      {loading
                        ? "..."
                        : outOfStockProducts}
                    </p>

                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* ADMIN TOOLS */}
          <section className="mt-8">

            <div className="mb-5">

              <h2 className="text-xl font-black text-slate-950">
                Admin Tools
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly access your management sections.
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              {/* PRODUCTS */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >

                <div>

                  <p className="text-sm font-black text-slate-900">
                    Products
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage products
                  </p>

                </div>

                <Package className="h-5 w-5 text-orange-600" />

              </button>

              {/* CATEGORIES */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >

                <div>

                  <p className="text-sm font-black text-slate-900">
                    Categories
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage categories
                  </p>

                </div>

                <FolderOpen className="h-5 w-5 text-orange-600" />

              </button>

              {/* ORDERS */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/orders")
                }
                className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >

                <div>

                  <p className="text-sm font-black text-slate-900">
                    Orders
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage orders
                  </p>

                </div>

                <ShoppingBag className="h-5 w-5 text-orange-600" />

              </button>

              {/* USERS */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/users")
                }
                className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >

                <div>

                  <p className="text-sm font-black text-slate-900">
                    Users
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    View registered clients
                  </p>

                </div>

                <Users className="h-5 w-5 text-orange-600" />

              </button>

              {/* REVIEWS */}
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/reviews")
                }
                className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >

                <div>

                  <p className="text-sm font-black text-slate-900">
                    Reviews
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage customer reviews
                  </p>

                </div>

                <Star className="h-5 w-5 text-orange-600" />

              </button>

            </div>
          </section>

          {/* RECENT ORDERS */}
          <section className="mt-8">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-black text-slate-950">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest orders placed by clients.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/orders")
                }
                className="flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>

            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">

              {recentOrders.length === 0 ? (

                <div className="p-8 text-center">

                  <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />

                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    No orders yet
                  </p>

                </div>

              ) : (

                <div className="divide-y divide-orange-50">

                  {recentOrders.map((order) => {

                    const statusStyle =
                      getStatusStyle(
                        order.orderStatus
                      );

                    const StatusIcon =
                      statusStyle.icon;

                    const customerName =
                      order.user?.name ||
                      order.shippingInfo?.fullName ||
                      "Unknown Client";

                    return (

                      <button
                        key={order._id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order._id}`
                          )
                        }
                        className="flex w-full flex-col gap-4 p-5 text-left transition hover:bg-orange-50/50 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="flex items-center gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <ShoppingBag className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-black text-slate-900">
                              {customerName}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Order ID: {order._id}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(order.createdAt)}
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center gap-4">

                          <div className="text-right">

                            <p className="text-sm font-black text-slate-900">
                              Rs.{" "}
                              {Number(
                                order.totalAmount || 0
                              ).toLocaleString()}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {order.items?.length || 0}{" "}
                              product
                              {order.items?.length === 1
                                ? ""
                                : "s"}
                            </p>

                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />

                            {order.orderStatus ||
                              "Pending"}
                          </span>

                        </div>

                      </button>

                    );
                  })}

                </div>

              )}

            </div>
          </section>

          {/* ADMIN ACCOUNT */}
          <section className="mt-8">

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-xl font-black text-white">

                    {user?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "A"}

                  </div>

                  <div>

                    <p className="text-lg font-black text-slate-950">
                      {user?.name || "Admin"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {user?.email || "Admin Account"}
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-black capitalize text-orange-600">
                  {user?.role || "admin"}
                </span>

              </div>

            </div>
          </section>

        </main>

        <Footer />

      </div>
    </div>
  );
};

export default AdminDashboard;