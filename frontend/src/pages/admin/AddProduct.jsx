import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useProducts } from "../../context/ProductContext";

// ========================================
// INITIAL FORM
// ========================================

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  brand: "",
  discount: "",
};

const categories = [
  "Fashion",
  "Electronics",
  "Computers",
  "Home",
  "Beauty",
  "Accessories",
];

// ========================================
// ADD PRODUCT
// ========================================

const AddProduct = () => {
  const navigate = useNavigate();
  const { createProduct } = useProducts();

  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // FORM INPUT CHANGE
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ========================================
  // IMAGE SELECT
  // ========================================

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    setError("");
    setSuccess("");

    // Maximum 10 images
    if (selectedImages.length + files.length > 10) {
      setError("You can upload a maximum of 10 images.");
      event.target.value = "";
      return;
    }

    // Validate images
    const invalidFile = files.find(
      (file) =>
        ![
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ].includes(file.type)
    );

    if (invalidFile) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
      event.target.value = "";
      return;
    }

    // Validate file size
    const oversizedFile = files.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFile) {
      setError(
        "Each image must be smaller than 5MB."
      );
      event.target.value = "";
      return;
    }

    setSelectedImages((previous) => [
      ...previous,
      ...files,
    ]);

    event.target.value = "";
  };

  // ========================================
  // REMOVE SELECTED IMAGE
  // ========================================

  const handleRemoveImage = (index) => {
    setSelectedImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );

    setError("");
  };

  // ========================================
  // CREATE IMAGE PREVIEWS
  // ========================================

  useEffect(() => {
    const newPreviews = selectedImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [selectedImages]);

  // ========================================
  // VALIDATION
  // ========================================

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Product name is required.";
    }

    if (!form.description.trim()) {
      return "Product description is required.";
    }

    if (!form.price || Number(form.price) < 0) {
      return "Please enter a valid product price.";
    }

    if (!form.category) {
      return "Please select a product category.";
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      return "Please enter a valid stock quantity.";
    }

    if (selectedImages.length === 0) {
      return "Please upload at least one product image.";
    }

    if (form.discount !== "") {
      const discount = Number(form.discount);

      if (discount < 0 || discount > 100) {
        return "Discount must be between 0 and 100.";
      }
    }

    return "";
  };

  // ========================================
  // SUBMIT PRODUCT
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // ====================================
      // FORM DATA
      // ====================================

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      formData.append("brand", form.brand.trim());
      formData.append(
        "discount",
        form.discount || "0"
      );

      // ====================================
      // PRODUCT IMAGES
      // ====================================

      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      // ====================================
      // SEND TO BACKEND
      // ====================================

      await createProduct(formData);

      setSuccess("Product added successfully.");

      setForm(initialForm);
      setSelectedImages([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Navigate after short delay
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      setError(
        error.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      {/* =====================================
          BACKGROUND DECORATION
      ====================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />

        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-orange-200/50 blur-3xl" />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(#f97316 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* =====================================
          HEADER
      ====================================== */}

      <Header />

      {/* =====================================
          MAIN
      ====================================== */}

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* ===================================
            PAGE HEADER
        ==================================== */}

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
            Admin Panel
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Add New Product
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Add product information, upload actual product
            images from your desktop, and make the product
            available in your store.
          </p>
        </div>

        {/* ===================================
            MESSAGES
        ==================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            {success}
          </div>
        )}

        {/* ===================================
            FORM
        ==================================== */}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* =================================
              LEFT SIDE
          ================================== */}

          <div className="space-y-8">
            {/* PRODUCT INFORMATION */}

            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_15px_45px_rgba(249,115,22,0.08)] sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                  Product Information
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Basic Details
                </h2>
              </div>

              <div className="space-y-5">
                {/* NAME */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Product Name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Description *
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Write a detailed description of the product..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                {/* CATEGORY + BRAND */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      Category *
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    >
                      <option value="">
                        Select category
                      </option>

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

                  <div>
                    <label
                      htmlFor="brand"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      Brand
                    </label>

                    <input
                      id="brand"
                      name="brand"
                      type="text"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="Enter brand name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>

                {/* PRICE + STOCK + DISCOUNT */}

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      Price *
                    </label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="stock"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      Stock *
                    </label>

                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="discount"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      Discount %
                    </label>

                    <input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={form.discount}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* IMAGE UPLOAD */}

            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_15px_45px_rgba(249,115,22,0.08)] sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                  Product Media
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Product Images
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Upload up to 10 JPG, JPEG, PNG or WEBP
                  images. Each image can be up to 5MB.
                </p>
              </div>

              {/* FILE INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/60 px-5 py-10 text-center transition hover:border-orange-400 hover:bg-orange-50"
              >
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  📷
                </span>

                <span className="text-base font-black text-slate-900">
                  Choose Product Images
                </span>

                <span className="mt-2 text-sm text-slate-500">
                  Select images from your desktop
                </span>

                <span className="mt-3 text-xs font-bold uppercase tracking-wider text-orange-600">
                  JPG • PNG • WEBP • Max 5MB
                </span>
              </button>

              {/* PREVIEWS */}

              {previews.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="text-sm font-black text-slate-900">
                      Selected Images
                    </p>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                      {previews.length}/10
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {previews.map((preview, index) => (
                      <div
                        key={`${preview.file.name}-${index}`}
                        className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-slate-50"
                      >
                        <img
                          src={preview.url}
                          alt={`Product preview ${index + 1}`}
                          className="aspect-square w-full object-cover"
                        />

                        {index === 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-orange-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                            Main
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveImage(index)
                          }
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sm font-black text-red-600 shadow-md transition hover:bg-red-50"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* =================================
              RIGHT SIDE
          ================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_15px_45px_rgba(249,115,22,0.08)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                Publish Product
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Ready to Add?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Check your product information and images
                before adding it to the store.
              </p>

              {/* SUMMARY */}

              <div className="mt-6 space-y-3 rounded-2xl bg-orange-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-500">
                    Images
                  </span>

                  <span className="font-black text-slate-900">
                    {selectedImages.length}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-500">
                    Stock
                  </span>

                  <span className="font-black text-slate-900">
                    {form.stock || "0"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-500">
                    Discount
                  </span>

                  <span className="font-black text-slate-900">
                    {form.discount || "0"}%
                  </span>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-orange-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Adding Product..."
                    : "➕ Add Product"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => navigate("/admin")}
                  className="w-full rounded-2xl border border-orange-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          </aside>
        </form>
      </main>

      {/* =====================================
          FOOTER
      ====================================== */}

      <Footer />
    </div>
  );
};

export default AddProduct;