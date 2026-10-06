const API_URL = "http://localhost:5000/api/products";

const BACKEND_URL = "http://localhost:5000";

// ==============================
// GET TOKEN
// ==============================

const getToken = () => {
  return localStorage.getItem("token");
};

// ==============================
// GET AUTHORIZATION HEADER
// ==============================

const getAuthHeaders = () => {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// ==============================
// PRODUCT IMAGE URL
// ==============================

export const getProductImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  // Agar already complete URL hai
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${BACKEND_URL}${imagePath}`;
};

// ==============================
// GET ALL PRODUCTS
// ==============================

export const getProducts = async () => {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch products"
    );
  }

  return data.products;
};

// ==============================
// GET SINGLE PRODUCT
// ==============================

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch product"
    );
  }

  return data.product;
};

// ==============================
// ADD PRODUCT
// ==============================

export const addProduct = async (formData) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      ...getAuthHeaders(),
    },

    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add product"
    );
  }

  return data.product;
};

// ==============================
// UPDATE PRODUCT
// ==============================

export const updateProduct = async (id, formData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      ...getAuthHeaders(),
    },

    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update product"
    );
  }

  return data.product;
};

// ==============================
// DELETE PRODUCT
// ==============================

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      ...getAuthHeaders(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete product"
    );
  }

  return data;
};