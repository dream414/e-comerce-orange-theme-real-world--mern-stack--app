import { useEffect, useState } from "react";
import { Star, Trash2, MessageSquare } from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import {
  getAllReviews,
  adminDeleteReview,
} from "../../services/reviewService";

import { getProductImageUrl } from "../../services/productService";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllReviews();

      setReviews(data.reviews || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await adminDeleteReview(reviewId);

      setReviews((prevReviews) =>
        prevReviews.filter(
          (review) => review._id !== reviewId
        )
      );

      setMessage("Review deleted successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={17}
            className={
              star <= rating
                ? "fill-orange-500 text-orange-500"
                : "text-slate-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-800 relative overflow-hidden">
      {/* Decorative Shapes */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-orange-600/10" />
      <div className="absolute top-40 -right-24 w-72 h-72 rounded-full bg-orange-600/10" />
      <div className="absolute bottom-20 -left-24 w-72 h-72 rounded-full bg-orange-600/10" />
      <div className="absolute -bottom-20 right-10 w-64 h-64 rounded-full bg-orange-600/10" />

      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg">
                <MessageSquare size={22} />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Reviews Management
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  View and manage customer product reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              {error}
            </div>
          )}

          {/* Summary */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-6 shadow-lg">
              <p className="text-sm text-slate-500 mb-2">
                Total Reviews
              </p>

              <p className="text-3xl font-bold text-orange-600">
                {reviews.length}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-6 shadow-lg">
              <p className="text-sm text-slate-500 mb-2">
                Average Rating
              </p>

              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-orange-600">
                  {reviews.length > 0
                    ? (
                        reviews.reduce(
                          (total, review) =>
                            total +
                            Number(review.rating || 0),
                          0
                        ) / reviews.length
                      ).toFixed(1)
                    : "0.0"}
                </p>

                <Star
                  size={25}
                  className="fill-orange-500 text-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Reviews */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-10 text-center shadow-lg">
              <p className="text-slate-500">
                Loading reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-10 text-center shadow-lg">
              <MessageSquare
                size={45}
                className="mx-auto text-orange-300 mb-4"
              />

              <h2 className="text-xl font-semibold text-slate-800">
                No Reviews Yet
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Customer reviews will appear here when clients
                submit reviews.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => {
                const product = review.product;
                const user = review.user;

                return (
                  <div
                    key={review._id}
                    className="bg-white/85 backdrop-blur-sm border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-lg"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Product */}
                      <div className="lg:w-1/4">
                        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                          <div className="h-40 bg-white rounded-2xl flex items-center justify-center overflow-hidden mb-4">
                            {product?.images?.[0] ? (
                              <img
                                src={getProductImageUrl(
                                  product.images[0]
                                )}
                                alt={product?.name || "Product"}
                                className="w-full h-full object-contain p-4"
                              />
                            ) : (
                              <span className="text-sm text-slate-400">
                                No Image
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-slate-800">
                            {product?.name || "Unknown Product"}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            {product?.category || "No Category"}
                          </p>

                          {product?.brand && (
                            <p className="text-sm text-slate-500">
                              Brand: {product.brand}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Review */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user?.name || "Unknown User"}
                            </p>

                            {user?.email && (
                              <p className="text-sm text-slate-500 mt-1">
                                {user.email}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              handleDelete(review._id)
                            }
                            className="self-start inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                          >
                            <Trash2 size={17} />
                            Delete
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          {renderStars(review.rating)}

                          <span className="text-sm font-semibold text-slate-700">
                            {Number(review.rating).toFixed(1)} / 5
                          </span>

                          <span className="text-sm text-slate-400">
                            {review.createdAt
                              ? new Date(
                                  review.createdAt
                                ).toLocaleDateString()
                              : ""}
                          </span>
                        </div>

                        <div className="mt-5 rounded-2xl bg-orange-50/70 border border-orange-100 p-5">
                          <p className="text-sm leading-7 text-slate-700">
                            {review.comment}
                          </p>
                        </div>
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
    </div>
  );
};

export default AdminReviews;