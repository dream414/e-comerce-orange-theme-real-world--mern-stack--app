import { useEffect, useState } from "react";
import { Star, Send, X } from "lucide-react";

import { useReview } from "../../context/ReviewContext";

const ReviewForm = ({
  productId,
  existingReview = null,
  onCancelEdit,
}) => {
  const {
    addReview,
    updateReview,
    loading,
    error,
    message,
    clearReviewMessages,
  } = useReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const [isEditing, setIsEditing] = useState(false);

  // New review submit hone ke baad
  // existingReview ki wajah se form dobara populate na ho
  const [reviewSubmitted, setReviewSubmitted] =
    useState(false);

  // =========================
  // SYNC EDIT MODE
  // =========================
  useEffect(() => {
    if (reviewSubmitted) {
      return;
    }

    if (existingReview) {
      setRating(
        Number(existingReview.rating || 0)
      );

      setComment(
        existingReview.comment || ""
      );

      setIsEditing(true);
    } else {
      setRating(0);
      setComment("");
      setHoverRating(0);
      setIsEditing(false);
    }
  }, [existingReview, reviewSubmitted]);

  // =========================
  // SUBMIT REVIEW
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    clearReviewMessages();

    if (!productId) {
      return;
    }

    if (rating < 1 || rating > 5) {
      return;
    }

    if (!comment.trim()) {
      return;
    }

    try {
      // =========================
      // UPDATE EXISTING REVIEW
      // =========================
      if (
        isEditing &&
        existingReview?._id
      ) {
        await updateReview(
          existingReview._id,
          {
            rating,
            comment: comment.trim(),
          }
        );

        setRating(rating);
        setComment(comment.trim());
        setHoverRating(0);

        return;
      }

      // =========================
      // ADD NEW REVIEW
      // =========================
      await addReview({
        productId,
        rating,
        comment: comment.trim(),
      });

      // New review ke baad form completely clear
      setReviewSubmitted(true);

      setRating(0);
      setComment("");
      setHoverRating(0);
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Review submit failed:",
        error
      );
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    if (loading) {
      return;
    }

    setReviewSubmitted(false);

    setRating(0);
    setComment("");
    setHoverRating(0);
    setIsEditing(false);

    clearReviewMessages();

    // Parent ProductDetails mein editingReview null hoga
    onCancelEdit?.();
  };

  return (
    <div className="rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      {/* Heading */}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-800">
          {isEditing
            ? "Edit Your Review"
            : "Write a Review"}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Share your experience with this product.
        </p>
      </div>

      {/* Rating */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Your Rating
        </label>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(
            (star) => {
              const active =
                star <=
                (hoverRating || rating);

              return (
                <button
                  key={star}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setRating(star)
                  }
                  onMouseEnter={() =>
                    setHoverRating(star)
                  }
                  onMouseLeave={() =>
                    setHoverRating(0)
                  }
                  className="rounded-lg p-1 transition hover:bg-orange-50 disabled:cursor-not-allowed"
                >
                  <Star
                    size={28}
                    className={
                      active
                        ? "fill-orange-500 text-orange-500"
                        : "text-gray-300"
                    }
                  />
                </button>
              );
            }
          )}

          <span className="ml-2 text-sm font-medium text-gray-600">
            {rating > 0
              ? `${rating} / 5`
              : "Select rating"}
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-5">
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Your Review
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
          placeholder="Write your experience about this product..."
          rows={5}
          maxLength={1000}
          disabled={loading}
          className="w-full resize-none rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <div className="mt-1 text-right text-xs text-gray-400">
          {comment.length}/1000
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="mb-4 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600">
          {message}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            loading ||
            !productId ||
            rating < 1 ||
            !comment.trim()
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />

          {loading
            ? "Saving..."
            : isEditing
            ? "Update Review"
            : "Submit Review"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-5 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;