import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  addReview as addReviewAPI,
  getProductReviews,
  getMyReview,
  updateReview as updateReviewAPI,
  deleteReview as deleteReviewAPI,
} from "../services/reviewService";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // Get Product Reviews
  // =========================
  const fetchReviews = useCallback(async (productId) => {
    if (!productId) {
      return null;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getProductReviews(productId);

      setReviews(data?.reviews || []);

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to load reviews";

      setError(errorMessage);
      setReviews([]);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // Get My Review
  // =========================
  const fetchMyReview = useCallback(async (productId) => {
    if (!productId) {
      return null;
    }

    try {
      setError("");

      const data = await getMyReview(productId);

      setMyReview(data?.review || null);

      return data;
    } catch (error) {
      // User logged in nahi hai
      // ya is product par review exist nahi karta
      setMyReview(null);

      return null;
    }
  }, []);

  // =========================
  // Add Review
  // =========================
  const addReview = useCallback(async (reviewData) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await addReviewAPI(reviewData);

      if (data?.review) {
        setReviews((prevReviews) => [
          data.review,
          ...prevReviews.filter(
            (review) => review._id !== data.review._id
          ),
        ]);

        setMyReview(data.review);
      }

      setMessage(
        data?.message || "Review added successfully"
      );

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add review";

      setError(errorMessage);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // Update Review
  // =========================
  const updateReview = useCallback(
    async (reviewId, reviewData) => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const data = await updateReviewAPI(
          reviewId,
          reviewData
        );

        if (data?.review) {
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review._id === reviewId
                ? data.review
                : review
            )
          );

          setMyReview(data.review);
        }

        setMessage(
          data?.message ||
            "Review updated successfully"
        );

        return data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to update review";

        setError(errorMessage);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // Delete Review
  // =========================
  const deleteReview = useCallback(async (reviewId) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await deleteReviewAPI(reviewId);

      setReviews((prevReviews) =>
        prevReviews.filter(
          (review) => review._id !== reviewId
        )
      );

      setMyReview(null);

      setMessage(
        data?.message ||
          "Review deleted successfully"
      );

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete review";

      setError(errorMessage);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // Clear Messages
  // =========================
  const clearReviewMessages = useCallback(() => {
    setError("");
    setMessage("");
  }, []);

  // =========================
  // Memoized Context Value
  // =========================
  const contextValue = useMemo(
    () => ({
      reviews,
      myReview,
      loading,
      error,
      message,

      fetchReviews,
      fetchMyReview,

      addReview,
      updateReview,
      deleteReview,

      clearReviewMessages,
    }),
    [
      reviews,
      myReview,
      loading,
      error,
      message,

      fetchReviews,
      fetchMyReview,

      addReview,
      updateReview,
      deleteReview,

      clearReviewMessages,
    ]
  );

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);

  if (!context) {
    throw new Error(
      "useReview must be used inside ReviewProvider"
    );
  }

  return context;
};