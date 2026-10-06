import {
  Pencil,
  Trash2,
  Star,
  User,
} from "lucide-react";

import { useReview } from "../../context/ReviewContext";
import { useAuth } from "../../context/AuthContext";

const ReviewList = ({
  productId,
  onEditReview,
}) => {
  const {
    reviews,
    loading,
    deleteReview,
  } = useReview();

  const { user, isAdmin } = useAuth();

  const productReviews = Array.isArray(reviews)
    ? reviews
    : [];

  const currentUserId = user?._id || user?.id;

  const handleDelete = async (reviewId) => {
    if (!reviewId || loading) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteReview(reviewId);
    } catch (error) {
      console.error(
        "Failed to delete review:",
        error
      );
    }
  };

  if (
    loading &&
    productReviews.length === 0
  ) {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>

        <p className="text-gray-500">
          Loading reviews...
        </p>
      </div>
    );
  }

  if (productReviews.length === 0) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <Star
            className="text-orange-500"
            size={25}
          />
        </div>

        <h3 className="mb-2 text-lg font-bold text-gray-800">
          No Reviews Yet
        </h3>

        <p className="text-gray-500">
          Be the first customer to review this
          product.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {productReviews.map((review) => {
        const userName =
          review?.user?.name ||
          review?.user?.email ||
          "Customer";

        const rating = Number(
          review?.rating || 0
        );

        const reviewDate =
          review?.createdAt
            ? new Date(
                review.createdAt
              ).toLocaleDateString()
            : "";

        const reviewUserId =
          review?.user?._id ||
          review?.user?.id ||
          review?.user;

        const isOwnReview =
          currentUserId &&
          reviewUserId &&
          String(currentUserId) ===
            String(reviewUserId);

        const canEdit =
          !isAdmin && isOwnReview;

        const canDelete =
          isAdmin || isOwnReview;

        return (
          <div
            key={review._id}
            className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <User
                    size={20}
                    className="text-orange-600"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-gray-800">
                    {userName}
                  </h4>

                  {reviewDate && (
                    <p className="mt-1 text-sm text-gray-400">
                      {reviewDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={17}
                      className={
                        star <= rating
                          ? "fill-orange-500 text-orange-500"
                          : "text-gray-300"
                      }
                    />
                  )
                )}

                <span className="ml-1 text-sm font-semibold text-gray-600">
                  {rating}/5
                </span>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
              {review?.comment ||
                "No comment provided."}
            </p>

            {(canEdit || canDelete) && (
              <div className="mt-5 flex flex-wrap gap-3 border-t border-orange-50 pt-4">
                {canEdit && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      onEditReview?.(review)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-500 px-4 py-2 font-semibold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                )}

                {canDelete && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleDelete(review._id)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />

                    {loading
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
