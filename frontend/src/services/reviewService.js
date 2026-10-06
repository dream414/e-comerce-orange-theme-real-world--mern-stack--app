import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ===============================
// CLIENT
// ===============================

export const addReview = async (reviewData) => {
  const response = await axios.post(
    API_URL,
    reviewData,
    getAuthConfig()
  );

  return response.data;
};

export const getProductReviews = async (productId) => {
  const response = await axios.get(
    `${API_URL}/product/${productId}`
  );

  return response.data;
};

export const getMyReview = async (productId) => {
  const response = await axios.get(
    `${API_URL}/my/${productId}`,
    getAuthConfig()
  );

  return response.data;
};

export const updateReview = async (
  reviewId,
  reviewData
) => {
  const response = await axios.put(
    `${API_URL}/${reviewId}`,
    reviewData,
    getAuthConfig()
  );

  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axios.delete(
    `${API_URL}/${reviewId}`,
    getAuthConfig()
  );

  return response.data;
};

// ===============================
// ADMIN
// ===============================

export const getAllReviews = async () => {
  const response = await axios.get(
    `${API_URL}/admin/all`,
    getAuthConfig()
  );

  return response.data;
};

export const adminDeleteReview = async (reviewId) => {
  const response = await axios.delete(
    `${API_URL}/admin/${reviewId}`,
    getAuthConfig()
  );

  return response.data;
};