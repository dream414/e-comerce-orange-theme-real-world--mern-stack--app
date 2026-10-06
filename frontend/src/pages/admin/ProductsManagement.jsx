import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useProducts } from "../../context/ProductContext";
import { getProductImageUrl } from "../../services/productService";

// ========================================
// CATEGORIES
// ========================================

const categories = [
  "All",
  "Fashion",
  "Electronics",
  "Computers",
  "Home",
  "Beauty",
  "Accessories",
];

// ========================================
// PRODUCTS MANAGEMENT
// ========================================

const ProductsManagement = () => {
  const navigate = useNavigate();

  const {
    products,
    loading,
    error,
    removeProduct,
    fetchProducts,
  } = useProducts();

  // ========================================
  // LOCAL STATES
  // ========================================

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // ========================================
  // STOCK STATUS
  // ========================================

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-50 text-red-700 border-red-200",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low Stock",
        className:
          "bg-amber-50 text-amber-700 border-amber-200",
      };
    }

    return {
      label: "In Stock",
      className:
        "bg-green-50 text-green-700 border-green-200",
    };
  };

  // ========================================
  // DELETE CONFIRMATION
  // ========================================

  const handleDeleteClick = (id) => {
    setDeleteError("");
    setDeleteId(id);
  };

  // ========================================
  // CANCEL DELETE
  // ========================================

  const handleCancelDelete = () => {
    if (deleting) return;

    setDeleteId(null);
    setDeleteError("");
  };

  // ========================================
  // DELETE PRODUCT
  // ========================================

  const handleConfirmDelete = async () => {
    if (!deleteId) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      await removeProduct(deleteId);

      setDeleteId(null);
    } catch (error) {
      setDeleteError(
        error.message || "Failed to delete product."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = async () => {
    try {
      await fetchProducts();
    } catch (error) {
      // ProductContext handles the error
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900">

        {/* MATCHING BACKGROUND */}
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

        <div className="relative z-10">
          <Header />

          <main className="mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">

            <div className="rounded-[28px] border border-orange-100 bg-white px-8 py-10 text-center shadow-[0_15px_45px_rgba(249,115,22,0.08)]">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

              <p className="text-sm font-bold text-slate-600">
                Loading products...
              </p>

            </div>

          </main>

          <Footer />
        </div>
      </div>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* =====================================
          MATCHING BACKGROUND DESIGN
      ====================================== */}

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

      {/* CONTENT */}
      <div className="relative z-10">

        <Header />

        {/* =====================================
            MAIN
        ====================================== */}

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

          {/* ===================================
              PAGE HEADER
          ==================================== */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-3 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                Admin Panel
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Products Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your store products, inventory,
                images, prices and product information from
                one place.
              </p>

            </div>

            {/* HEADER ACTIONS */}

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

              {/* BACK TO DASHBOARD */}

              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="w-full rounded-2xl border border-orange-200 bg-white px-5 py-3.5 text-sm font-black text-orange-700 shadow-sm transition hover:bg-orange-50 sm:w-auto"
              >
                ← Back to Dashboard
              </button>

              {/* ADD PRODUCT */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products/add")
                }
                className="w-full rounded-2xl bg-orange-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 sm:w-auto"
              >
                ➕ Add Product
              </button>

            </div>
          </div>

          {/* ===================================
              ERROR
          ==================================== */}

          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm font-semibold text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                className="rounded-xl bg-white px-4 py-2 text-xs font-black text-red-700 shadow-sm transition hover:bg-red-100"
              >
                Try Again
              </button>

            </div>
          )}

          {/* ===================================
              SUMMARY CARDS
          ==================================== */}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.06)]">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Total Products
              </p>

              <p className="mt-2 text-3xl font-black text-slate-950">
                {products.length}
              </p>
            </div>

            <div className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.06)]">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                In Stock
              </p>

              <p className="mt-2 text-3xl font-black text-green-600">
                {
                  products.filter(
                    (product) => Number(product.stock) > 5
                  ).length
                }
              </p>
            </div>

            <div className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.06)]">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Low Stock
              </p>

              <p className="mt-2 text-3xl font-black text-amber-600">
                {
                  products.filter(
                    (product) =>
                      Number(product.stock) > 0 &&
                      Number(product.stock) <= 5
                  ).length
                }
              </p>
            </div>

            <div className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-[0_12px_35px_rgba(249,115,22,0.06)]">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Out of Stock
              </p>

              <p className="mt-2 text-3xl font-black text-red-600">
                {
                  products.filter(
                    (product) =>
                      Number(product.stock) === 0
                  ).length
                }
              </p>
            </div>

          </div>

          {/* ===================================
              SEARCH + FILTER
          ==================================== */}

          <section className="mb-8 rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_15px_45px_rgba(249,115,22,0.08)] sm:p-6">

            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">

              {/* SEARCH */}

              <div className="relative">

                <label
                  htmlFor="product-management-search"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                >
                  Search Products
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔎
                  </span>

                  <input
                    id="product-management-search"
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search by product name, brand or category..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />

                </div>
              </div>

              {/* CATEGORY */}

              <div className="lg:min-w-[230px]">

                <label
                  htmlFor="product-category-filter"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                >
                  Category
                </label>

                <select
                  id="product-category-filter"
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* FILTER RESULT */}

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm font-semibold text-slate-500">
                Showing{" "}
                <span className="font-black text-slate-900">
                  {filteredProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-black text-slate-900">
                  {products.length}
                </span>{" "}
                products
              </p>

              {(searchTerm ||
                selectedCategory !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="text-left text-sm font-black text-orange-600 transition hover:text-orange-700 sm:text-right"
                >
                  Clear Filters
                </button>
              )}

            </div>
          </section>

          {/* ===================================
              PRODUCTS
          ==================================== */}

          {filteredProducts.length === 0 ? (

            <section className="rounded-[28px] border border-orange-100 bg-white px-6 py-16 text-center shadow-[0_15px_45px_rgba(249,115,22,0.08)]">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                📦
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                {products.length === 0
                  ? "No Products Yet"
                  : "No Products Found"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {products.length === 0
                  ? "Start building your store by adding your first product."
                  : "Try changing your search term or category filter."}
              </p>

              {products.length === 0 ? (

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/products/add")
                  }
                  className="mt-6 rounded-2xl bg-orange-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
                >
                  ➕ Add First Product
                </button>

              ) : (

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-6 rounded-2xl border border-orange-200 bg-white px-5 py-3.5 text-sm font-black text-orange-700 transition hover:bg-orange-50"
                >
                  Clear Filters
                </button>

              )}

            </section>

          ) : (

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {filteredProducts.map((product) => {

                const stockStatus = getStockStatus(
                  Number(product.stock)
                );

                const image =
                  product.images &&
                  product.images.length > 0
                    ? getProductImageUrl(
                        product.images[0]
                      )
                    : "";

                return (

                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_15px_45px_rgba(249,115,22,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(249,115,22,0.12)]"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

                      {image ? (

                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center">

                          <div className="text-center">

                            <div className="text-3xl">
                              📷
                            </div>

                            <p className="mt-2 text-xs font-bold text-slate-400">
                              No Image
                            </p>

                          </div>

                        </div>

                      )}

                      {/* CATEGORY */}

                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-orange-700 shadow-sm">
                        {product.category}
                      </span>

                      {/* DISCOUNT */}

                      {Number(product.discount) > 0 && (
                        <span className="absolute right-3 top-3 rounded-full bg-orange-600 px-3 py-1.5 text-[10px] font-black text-white shadow-sm">
                          -{product.discount}%
                        </span>
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h2 className="truncate text-lg font-black text-slate-950">
                            {product.name}
                          </h2>

                          {product.brand && (
                            <p className="mt-1 truncate text-xs font-bold uppercase tracking-wider text-slate-400">
                              {product.brand}
                            </p>
                          )}

                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black ${stockStatus.className}`}
                        >
                          {stockStatus.label}
                        </span>

                      </div>

                      {/* PRICE */}

                      <div className="mt-5 flex items-end justify-between gap-3">

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Price
                          </p>

                          <p className="mt-1 text-xl font-black text-orange-600">
                            Rs.{" "}
                            {Number(
                              product.price || 0
                            ).toLocaleString()}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Stock
                          </p>

                          <p className="mt-1 text-sm font-black text-slate-900">
                            {product.stock}
                          </p>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/products/edit/${product._id}`
                            )
                          }
                          className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-3 text-sm font-black text-orange-700 transition hover:bg-orange-100"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteClick(
                              product._id
                            )
                          }
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-black text-red-600 transition hover:bg-red-100"
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  </article>

                );
              })}

            </section>

          )}

        </main>

        {/* =====================================
            DELETE MODAL
        ====================================== */}

        {deleteId && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-[28px] border border-orange-100 bg-white p-6 shadow-2xl sm:p-7">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
                🗑️
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Delete Product?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                This action will permanently delete the
                product and its uploaded images from the
                server. This cannot be undone.
              </p>

              {deleteError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {deleteError}
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={handleCancelDelete}
                  disabled={deleting}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="rounded-2xl bg-red-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting
                    ? "Deleting..."
                    : "Yes, Delete"}
                </button>

              </div>

            </div>

          </div>

        )}

        <Footer />

      </div>
    </div>
  );
};

export default ProductsManagement;