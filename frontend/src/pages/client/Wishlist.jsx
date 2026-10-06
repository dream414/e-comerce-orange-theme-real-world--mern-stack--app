import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getProductImageUrl } from "../../services/productService";

const Wishlist = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/wishlist";

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH WISHLIST
  // =====================================================

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch wishlist"
        );
      }

      setWishlist(
        data.wishlist || {
          items: [],
        }
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const removeFromWishlist = async (productId) => {
    try {
      setError("");
      setMessage("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove product"
        );
      }

      setWishlist(
        data.wishlist || {
          items: [],
        }
      );

      setMessage("Product removed from wishlist.");
    } catch (error) {
      setError(error.message);
    }
  };

  // =====================================================
  // CLEAR WISHLIST
  // =====================================================

  const clearWishlist = async () => {
    try {
      setError("");
      setMessage("");

      const token = getToken();

      const response = await fetch(`${API_URL}/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to clear wishlist"
        );
      }

      setWishlist(
        data.wishlist || {
          items: [],
        }
      );

      setMessage("Wishlist cleared successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  // =====================================================
  // ADD PRODUCT TO CART
  // =====================================================

  const addToCart = async (productId) => {
    try {
      setError("");
      setMessage("");

      const token = getToken();

      const response = await fetch(
        "http://localhost:5000/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product to cart"
        );
      }

      setMessage("Product added to cart successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  // =====================================================
  // PAGE ACTIONS
  // =====================================================

  const handleBackToDashboard = () => {
    navigate("/client/dashboard");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {
    fetchWishlist();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf5] text-slate-900">

        <Header />

        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">

          <div className="text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-3xl">
              ❤️
            </div>

            <p className="text-sm font-black text-slate-700">
              Loading your wishlist...
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

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

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

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="relative mb-6 overflow-hidden rounded-[30px] border border-orange-600 bg-white/95 p-6 shadow-[0_20px_55px_rgba(249,115,22,0.10)] sm:p-8">

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-600 opacity-90" />

            <div className="absolute -bottom-24 -left-20 h-40 w-40 rounded-full bg-orange-600 opacity-90" />

            <div className="relative flex flex-col gap-5">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5">

                    <span className="text-xs">
                      ❤️
                    </span>

                    <span className="text-[10px] font-black tracking-[0.15em] text-orange-600">
                      MY WISHLIST
                    </span>

                  </div>

                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Wishlist
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Save your favorite products here and
                    decide what you would like to purchase later.
                  </p>

                </div>

                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-orange-600 bg-orange-50 shadow-[0_15px_35px_rgba(249,115,22,0.12)]">

                  <span className="text-4xl">
                    ❤️
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

          {/* =================================================
              MESSAGES
          ================================================= */}

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

          {/* =================================================
              EMPTY WISHLIST
          ================================================= */}

          {wishlist.items.length === 0 ? (

            <section className="rounded-[28px] border border-orange-200 bg-white/95 p-8 text-center shadow-[0_15px_40px_rgba(249,115,22,0.07)] sm:p-12">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
                ❤️
              </div>

              <p className="mt-5 text-[10px] font-black tracking-[0.18em] text-orange-600">
                SAVED PRODUCTS
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Your wishlist is empty
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Save products that you love and come back
                to them whenever you are ready.
              </p>

              <button
                type="button"
                onClick={() =>
                  (window.location.href = "/products")
                }
                className="mt-6 rounded-xl bg-orange-600 px-6 py-3 text-xs font-black text-white shadow-[0_10px_25px_rgba(249,115,22,0.20)] transition hover:-translate-y-0.5 hover:bg-orange-700"
              >
                🛍️ Explore Products
              </button>

            </section>

          ) : (

            <section>

              {/* =================================================
                  WISHLIST HEADER
              ================================================= */}

              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <p className="text-[10px] font-black tracking-[0.18em] text-orange-600">
                    SAVED PRODUCTS
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    Your Favorites
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={clearWishlist}
                  className="w-full rounded-xl border-2 border-orange-600 bg-white px-5 py-2.5 text-xs font-black text-orange-600 transition hover:bg-orange-600 hover:text-white sm:w-auto"
                >
                  Clear Wishlist
                </button>

              </div>

              {/* =================================================
                  PRODUCTS GRID
              ================================================= */}

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {wishlist.items.map((item) => {

                  const product = item.product;

                  return (
                    <article
                      key={product._id}
                      className="group overflow-hidden rounded-[24px] border border-orange-200 bg-white/95 shadow-[0_12px_35px_rgba(249,115,22,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(249,115,22,0.14)]"
                    >

                      {/* PRODUCT IMAGE */}

                      <div className="relative h-56 overflow-hidden bg-orange-50">

                        {product.images?.length > 0 ? (
                          <img
                            src={getProductImageUrl(
                              product.images[0]
                            )}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (

                          <div className="flex h-full w-full items-center justify-center text-5xl">
                            🛍️
                          </div>

                        )}

                        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg shadow">
                          ❤️
                        </div>

                      </div>

                      {/* PRODUCT INFO */}

                      <div className="p-5">

                        <p className="text-[10px] font-black tracking-[0.14em] text-orange-600">
                          {product.category || "PRODUCT"}
                        </p>

                        <h3 className="mt-1 line-clamp-2 min-h-[48px] text-lg font-black text-slate-950">
                          {product.name}
                        </h3>

                        <p className="mt-3 text-xl font-black text-orange-600">
                          Rs.{" "}
                          {Number(product.price).toFixed(2)}
                        </p>

                        {/* STOCK */}

                        <div className="mt-3">

                          {Number(product.stock) > 0 ? (

                            <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-black text-green-700">
                              ✓ In Stock
                            </span>

                          ) : (

                            <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-black text-red-600">
                              Out of Stock
                            </span>

                          )}

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-5 space-y-2">

                          <button
                            type="button"
                            onClick={() =>
                              addToCart(product._id)
                            }
                            disabled={
                              Number(product.stock) <= 0
                            }
                            className="w-full rounded-xl bg-orange-600 px-4 py-3 text-xs font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            🛒 Add to Cart
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromWishlist(
                                product._id
                              )
                            }
                            className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100"
                          >
                            🗑️ Remove
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>

            </section>
          )}

        </main>

        <Footer />

      </div>

    </div>
  );
};

export default Wishlist;