import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Star,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import ReviewForm from "../../components/products/ReviewForm";
import ReviewList from "../../components/products/ReviewList";

import { useProducts } from "../../context/ProductContext";
import { useReview } from "../../context/ReviewContext";

import { getProductImageUrl } from "../../services/productService";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchProductById } = useProducts();

  const {
    reviews,
    fetchReviews,
    fetchMyReview,
  } = useReview();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Selected product image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Sirf Edit button click hone par review yahan set hoga
  const [editingReview, setEditingReview] = useState(null);

  // =========================
  // FETCH PRODUCT
  // =========================
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const data = await fetchProductById(id);

        if (!isMounted) return;

        setProduct(
          data?.product || data || null
        );
      } catch (error) {
        if (!isMounted) return;

        console.error(
          "Failed to fetch product:",
          error
        );

        setProduct(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, fetchProductById]);

  // =========================
  // RESET SELECTED IMAGE
  // =========================
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?._id]);

  // =========================
  // FETCH REVIEWS
  // =========================
  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      if (!id) return;

      try {
        await fetchReviews(id);

        if (!isMounted) return;

        await fetchMyReview(id);
      } catch (error) {
        if (!isMounted) return;

        console.error(
          "Failed to fetch reviews:",
          error
        );
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [id, fetchReviews, fetchMyReview]);

  // =========================
  // REFRESH REVIEWS
  // =========================
  const handleRefreshReviews = async () => {
    if (!id || refreshLoading) return;

    try {
      setRefreshLoading(true);

      await fetchReviews(id);
      await fetchMyReview(id);

      // Refresh ke baad edit mode band
      setEditingReview(null);
    } catch (error) {
      console.error(
        "Failed to refresh reviews:",
        error
      );
    } finally {
      setRefreshLoading(false);
    }
  };

  // =========================
  // EDIT REVIEW
  // =========================
  const handleEditReview = (review) => {
    setEditingReview(review);

    setTimeout(() => {
      document
        .getElementById("review-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <>
        <Header />

        <div className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-600 font-medium">
              Loading product...
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================
  if (!product) {
    return (
      <>
        <Header />

        <div className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8 text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Product Not Found
            </h2>

            <p className="text-gray-500 mb-6">
              The product you are looking for does not
              exist.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <ArrowLeft size={18} />
              Back to Products
            </Link>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // PRODUCT IMAGE GALLERY
  // =========================
  const productImages = Array.isArray(
    product?.images
  )
    ? product.images
    : [];

  const selectedImage =
    productImages.length > 0
      ? getProductImageUrl(
          productImages[selectedImageIndex]
        )
      : null;

  // =========================
  // PRODUCT RATING
  // =========================
  const averageRating = Number(
    product?.ratings || 0
  );

  return (
    <div className="min-h-screen bg-[#fffaf5] relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-600 rounded-full opacity-10"></div>

      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-orange-600 rounded-full opacity-10"></div>

      <div className="absolute bottom-0 -left-24 w-80 h-80 bg-orange-600 rounded-full opacity-10"></div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* =========================
            PRODUCT DETAILS
        ========================= */}
        <div className="bg-white/90 backdrop-blur-sm border border-orange-100 rounded-3xl shadow-xl p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* =========================
                PRODUCT IMAGE GALLERY
            ========================= */}
            <div className="space-y-4">

              {/* Main Image */}
              <div className="bg-orange-50 rounded-3xl min-h-[320px] sm:min-h-[420px] flex items-center justify-center p-6 border border-orange-100">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-[300px] sm:h-[400px] object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mb-2 text-4xl">
                      📦
                    </div>

                    <p className="text-sm font-semibold text-slate-500">
                      No Image Available
                    </p>
                  </div>
                )}
              </div>

              {/* All Product Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="rounded-2xl border border-orange-100 bg-white/80 p-3">
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {productImages.map(
                      (image, index) => {
                        const imageUrl =
                          getProductImageUrl(
                            image
                          );

                        const isSelected =
                          selectedImageIndex ===
                          index;

                        return (
                          <button
                            key={`${imageUrl}-${index}`}
                            type="button"
                            onClick={() =>
                              setSelectedImageIndex(
                                index
                              )
                            }
                            className={`h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-orange-50 p-2 transition ${
                              isSelected
                                ? "border-orange-500 ring-2 ring-orange-200"
                                : "border-orange-100 hover:border-orange-300"
                            }`}
                          >
                            <img
                              src={imageUrl}
                              alt={`${product.name} ${
                                index + 1
                              }`}
                              className="h-full w-full object-contain"
                            />
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center">

              {/* Category */}
              <div className="mb-3">
                <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category ||
                    "Product"}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={20}
                        className={
                          star <=
                          Math.round(
                            averageRating
                          )
                            ? "fill-orange-500 text-orange-500"
                            : "text-gray-300"
                        }
                      />
                    )
                  )}
                </div>

                <span className="text-gray-600 font-medium">
                  {averageRating.toFixed(1)}
                </span>

                <span className="text-gray-400">
                  ({reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-orange-600 mb-5">
                Rs.{" "}
                {Number(
                  product.price || 0
                ).toLocaleString()}
              </p>

              {/* Brand */}
              {product.brand && (
                <p className="text-gray-600 mb-3">
                  <span className="font-semibold text-gray-800">
                    Brand:
                  </span>{" "}
                  {product.brand}
                </p>
              )}

              {/* Description */}
              <p className="text-gray-600 leading-7 mb-6">
                {product.description ||
                  "No product description available."}
              </p>

              {/* Stock */}
              <div className="mb-6">
                <span className="font-semibold text-gray-800">
                  Stock:
                </span>{" "}

                {Number(product.stock || 0) >
                0 ? (
                  <span className="text-green-600 font-semibold">
                    {product.stock} available
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/client/cart")
                  }
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  Go to Cart
                </button>

                <Link
                  to="/products"
                  className="flex-1 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 py-3 rounded-xl font-semibold text-center transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            CUSTOMER REVIEWS
        ========================= */}
        <section className="mt-10">
          <div className="bg-white/90 backdrop-blur-sm border border-orange-100 rounded-3xl shadow-xl p-5 sm:p-8">

            {/* Review Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Customer Reviews
                </h2>

                <p className="text-gray-500 mt-1">
                  Share your experience with this
                  product.
                </p>
              </div>

              {/* Refresh Reviews */}
              <button
                type="button"
                onClick={
                  handleRefreshReviews
                }
                disabled={refreshLoading}
                className="inline-flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2.5 rounded-xl font-semibold transition disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshLoading
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshLoading
                  ? "Refreshing..."
                  : "Refresh Reviews"}
              </button>
            </div>

            {/* Review Form */}
            <div
              id="review-form"
              className="mb-8"
            >
              <ReviewForm
                productId={id}
                existingReview={
                  editingReview
                }
                onCancelEdit={
                  handleCancelEdit
                }
              />
            </div>

            {/* Review List */}
            <ReviewList
              productId={id}
              onEditReview={
                handleEditReview
              }
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
