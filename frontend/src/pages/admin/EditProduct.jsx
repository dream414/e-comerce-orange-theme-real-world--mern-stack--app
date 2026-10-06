import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useProducts } from "../../context/ProductContext";
import { getProductImageUrl } from "../../services/productService";

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
// EDIT PRODUCT
// ========================================

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchProductById,
    editProduct,
  } = useProducts();

  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);

  // Existing images already stored on server
  const [existingImages, setExistingImages] = useState([]);

  // New images selected from desktop
  const [newImages, setNewImages] = useState([]);

  // Preview URLs for new images
  const [newImagePreviews, setNewImagePreviews] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // LOAD PRODUCT
  // ========================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const product = await fetchProductById(id);

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          category: product.category || "",
          stock: product.stock ?? "",
          brand: product.brand || "",
          discount: product.discount ?? "",
        });

        setExistingImages(product.images || []);
      } catch (error) {
        setError(
          error.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  // ========================================
  // CLEAN NEW IMAGE PREVIEWS
  // ========================================

  useEffect(() => {
    const previews = newImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setNewImagePreviews(previews);

    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [newImages]);

  // ========================================
  // FORM CHANGE
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
  // REMOVE EXISTING IMAGE
  // ========================================

  const handleRemoveExistingImage = (index) => {
    setExistingImages((previous) =>
      previous.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );

    setError("");
    setSuccess("");
  };

  // ========================================
  // ADD NEW IMAGES
  // ========================================

  const handleNewImages = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    setError("");
    setSuccess("");

    const totalImages =
      existingImages.length +
      newImages.length +
      files.length;

    if (totalImages > 10) {
      setError(
        "A product can have a maximum of 10 images."
      );

      event.target.value = "";
      return;
    }

    // Validate type
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

    // Validate size
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

    setNewImages((previous) => [
      ...previous,
      ...files,
    ]);

    event.target.value = "";
  };

  // ========================================
  // REMOVE NEW IMAGE
  // ========================================

  const handleRemoveNewImage = (index) => {
    setNewImages((previous) =>
      previous.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );

    setError("");
  };

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

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
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

    if (
      existingImages.length === 0 &&
      newImages.length === 0
    ) {
      return "Please keep or upload at least one product image.";
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
  // SUBMIT UPDATE
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
      setSaving(true);

      // ====================================
      // FORM DATA
      // ====================================

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);

      formData.append(
        "brand",
        form.brand.trim()
      );

      formData.append(
        "discount",
        form.discount || "0"
      );

      // ====================================
      // EXISTING IMAGES TO KEEP
      // ====================================

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      // ====================================
      // NEW DESKTOP IMAGES
      // ====================================

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      // ====================================
      // UPDATE BACKEND
      // ====================================

      await editProduct(id, formData);

      setSuccess(
        "Product updated successfully."
      );

      // Go to management page
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      setError(
        error.message ||
          "Failed to update product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING UI
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf5] text-slate-900">
        <Header />

        <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-orange-100 bg-white px-8 py-10 text-center shadow-[0_15px_45px_rgba(249,115,22,0.08)]">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

            <p className="text-sm font-bold text-slate-600">
              Loading product...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      {/* BACKGROUND */}

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

      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* PAGE HEADER */}

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
            Admin Panel
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Edit Product
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Update product information, remove old images,
            or upload new images from your desktop.
          </p>
        </div>

        {/* MESSAGES */}

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

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* ==================================
              LEFT
          =================================== */}

          <div className="space-y-8">
            {/* BASIC INFORMATION */}

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
                    placeholder="Write a detailed description..."
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

                {/* PRICE STOCK DISCOUNT */}

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

            {/* =================================
                EXISTING IMAGES
            ================================== */}

            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_15px_45px_rgba(249,115,22,0.08)] sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                  Current Media
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Existing Images
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Remove any image you no longer want to
                  keep.
                </p>
              </div>

              {existingImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {existingImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-slate-50"
                    >
                      <img
                        src={getProductImageUrl(image)}
                        alt={`Existing product ${index + 1}`}
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
                          handleRemoveExistingImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sm font-black text-red-600 shadow-md transition hover:bg-red-50"
                        aria-label="Remove existing image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 px-5 py-8 text-center">
                  <p className="text-sm font-bold text-orange-700">
                    No existing images.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Upload new images below.
                  </p>
                </div>
              )}
            </section>

            {/* =================================
                NEW IMAGES
            ================================== */}

            <section className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_15px_45px_rgba(249,115,22,0.08)] sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                  New Media
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Upload New Images
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add new product images from your desktop.
                  Maximum total images: 10.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleNewImages}
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
                  Choose More Images
                </span>

                <span className="mt-2 text-sm text-slate-500">
                  Select images from your desktop
                </span>

                <span className="mt-3 text-xs font-bold uppercase tracking-wider text-orange-600">
                  JPG • PNG • WEBP • Max 5MB
                </span>
              </button>

              {/* NEW PREVIEWS */}

              {newImagePreviews.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="text-sm font-black text-slate-900">
                      New Images
                    </p>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                      {existingImages.length +
                        newImages.length}
                      /10
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {newImagePreviews.map(
                      (preview, index) => (
                        <div
                          key={`${preview.file.name}-${index}`}
                          className="relative overflow-hidden rounded-2xl border border-orange-100 bg-slate-50"
                        >
                          <img
                            src={preview.url}
                            alt={`New product preview ${
                              index + 1
                            }`}
                            className="aspect-square w-full object-cover"
                          />

                          <span className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                            New
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveNewImage(
                                index
                              )
                            }
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sm font-black text-red-600 shadow-md transition hover:bg-red-50"
                            aria-label="Remove new image"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ==================================
              RIGHT SIDE
          =================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_15px_45px_rgba(249,115,22,0.08)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                Update Product
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Save Changes
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Your changes will be saved to the product
                and the updated images will be stored on the
                server.
              </p>

              {/* SUMMARY */}

              <div className="mt-6 space-y-3 rounded-2xl bg-orange-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-500">
                    Current images
                  </span>

                  <span className="font-black text-slate-900">
                    {existingImages.length}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-500">
                    New images
                  </span>

                  <span className="font-black text-slate-900">
                    {newImages.length}
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
                  disabled={saving}
                  className="w-full rounded-2xl bg-orange-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving Changes..."
                    : "💾 Save Changes"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    navigate("/admin/products")
                  }
                  className="w-full rounded-2xl border border-orange-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default EditProduct;