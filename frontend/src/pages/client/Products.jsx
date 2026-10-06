import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import ProductCard from "../../components/products/ProductCard";
import ProductFilter from "../../components/products/ProductFilter";

import { useProducts } from "../../context/ProductContext";

const Products = () => {
  const navigate = useNavigate();

  const { products, loading, error, fetchProducts } =
    useProducts();

  const [searchParams] = useSearchParams();

  // =========================
  // URL SEARCH
  // =========================

  const searchQuery = (
    searchParams.get("search") || ""
  ).trim();

  // =========================
  // URL CATEGORY
  // =========================

  const urlCategory = (
    searchParams.get("category") || ""
  ).trim();

  // =========================
  // FILTER STATES
  // =========================

  const [selectedCategory, setSelectedCategory] =
    useState(urlCategory);

  const [maxPrice, setMaxPrice] = useState(500000);

  const [sortBy, setSortBy] = useState("latest");

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // SYNC CATEGORY FROM URL
  // =========================

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  // =========================
  // CATEGORIES
  // =========================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort();
  }, [products]);

  // =========================
  // FILTER + SORT PRODUCTS
  // =========================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // =========================
    // HEADER SEARCH
    // =========================

    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() || "";

        const category =
          product.category?.toLowerCase() || "";

        const brand =
          product.brand?.toLowerCase() || "";

        return (
          name.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          brand.includes(query)
        );
      });
    }

    // =========================
    // CATEGORY FILTER
    // =========================

    if (selectedCategory) {
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );
    }

    // =========================
    // PRICE FILTER
    // =========================

    result = result.filter(
      (product) =>
        Number(product.price || 0) <= maxPrice
    );

    // =========================
    // SORTING
    // =========================

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sortBy === "name-a-z") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    }

    if (sortBy === "name-z-a") {
      result.sort((a, b) =>
        (b.name || "").localeCompare(a.name || "")
      );
    }

    if (sortBy === "stock") {
      result.sort(
        (a, b) =>
          Number(b.stock || 0) -
          Number(a.stock || 0)
      );
    }

    if (sortBy === "latest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    maxPrice,
    sortBy,
  ]);

  // =========================
  // CLEAR FILTERS
  // =========================

  const handleClearFilters = () => {
    setSelectedCategory("");
    setMaxPrice(500000);
    setSortBy("latest");
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-orange-100/70 blur-3xl" />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(#fb923c 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="mb-8 overflow-hidden rounded-[32px] border border-orange-100 bg-white px-6 py-8 shadow-[0_15px_45px_rgba(249,115,22,0.08)] sm:px-8 sm:py-10">

          <div className="max-w-3xl">

            {/* Back To Dashboard */}

            <div className="mb-5">

              <button
                type="button"
                onClick={() =>
                  navigate("/client/dashboard")
                }
                className="rounded-xl border-2 border-orange-600 bg-white px-4 py-2.5 text-xs font-black text-orange-600 transition hover:bg-orange-600 hover:text-white"
              >
                ← Back to Dashboard
              </button>

            </div>

            {/* Collection Label */}

            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
              Our Collection
            </p>

            {/* Heading */}

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Discover Products
            </h1>

            {/* Description */}

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Explore our latest products, find what you
              need, and choose from different categories,
              prices and options.
            </p>

            {/* Search Result */}

            {searchQuery && (
              <div className="mt-5 inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                Search results for: "{searchQuery}"
              </div>
            )}

            {/* Category Result */}

            {selectedCategory && (
              <div className="mt-3 inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                Category: {selectedCategory}
              </div>
            )}

          </div>

        </section>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="grid gap-7 lg:grid-cols-[280px_1fr]">

          {/* =================================================
              FILTERS
          ================================================= */}

          <div>

            <ProductFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onClearFilters={handleClearFilters}
            />

          </div>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <section>

            {/* =================================================
                TOP BAR
            ================================================= */}

            <div className="mb-6 flex flex-col gap-3 rounded-[24px] border border-orange-100 bg-white p-5 shadow-[0_10px_30px_rgba(249,115,22,0.06)] sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                  Product Collection
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {loading
                    ? "Loading Products..."
                    : `${filteredProducts.length} Products Found`}
                </h2>

              </div>

              {/* Reset Filters */}

              {(selectedCategory ||
                maxPrice < 500000 ||
                sortBy !== "latest") && (

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="self-start rounded-xl bg-orange-50 px-4 py-2 text-xs font-black text-orange-700 transition hover:bg-orange-100 sm:self-auto"
                >
                  Reset Filters
                </button>

              )}

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {[1, 2, 3, 4, 5, 6].map((item) => (

                  <div
                    key={item}
                    className="animate-pulse overflow-hidden rounded-[28px] border border-orange-100 bg-white"
                  >

                    <div className="h-64 bg-orange-50 sm:h-72" />

                    <div className="space-y-4 p-6">

                      <div className="h-4 w-24 rounded-full bg-orange-50" />

                      <div className="h-6 w-3/4 rounded bg-orange-50" />

                      <div className="h-4 w-full rounded bg-orange-50" />

                      <div className="h-10 w-32 rounded-2xl bg-orange-50" />

                    </div>

                  </div>

                ))}

              </div>

            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error && (

              <div className="rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
                  !
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  Unable to Load Products
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-5 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-700"
                >
                  Try Again
                </button>

              </div>

            )}

            {/* =================================================
                PRODUCT GRID
            ================================================= */}

            {!loading &&
              !error &&
              filteredProducts.length > 0 && (

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                  {filteredProducts.map((product) => (

                    <ProductCard
                      key={product._id}
                      product={product}
                    />

                  ))}

                </div>

              )}

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!loading &&
              !error &&
              filteredProducts.length === 0 && (

                <div className="rounded-[28px] border border-orange-100 bg-white p-10 text-center shadow-[0_12px_35px_rgba(249,115,22,0.06)] sm:p-14">

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl">
                    🔎
                  </div>

                  <h3 className="text-2xl font-black text-slate-900">
                    No Products Found
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                    We couldn't find any products matching
                    your current filters or search.
                  </p>

                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-6 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-700"
                  >
                    Clear Filters
                  </button>

                </div>

              )}

          </section>

        </div>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
};

export default Products;