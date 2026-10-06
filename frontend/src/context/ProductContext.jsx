import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET ALL PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);

      return data;
    } catch (error) {
      setError(
        error.message || "Failed to load products"
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET SINGLE PRODUCT
  // =========================
  const fetchProductById = async (id) => {
    try {
      setError("");

      if (!id) {
        throw new Error("Product ID is required");
      }

      const product = await getProductById(id);

      return product;
    } catch (error) {
      setError(
        error.message || "Failed to load product"
      );

      throw error;
    }
  };

  // =========================
  // GET PRODUCT FROM STATE
  // =========================
  const getProductFromState = (id) => {
    if (!id) {
      return null;
    }

    return (
      products.find(
        (product) => product._id === id
      ) || null
    );
  };

  // =========================
  // ADD PRODUCT
  // =========================
  const createProduct = async (productData) => {
    try {
      setError("");

      const newProduct = await addProduct(productData);

      setProducts((previousProducts) => [
        newProduct,
        ...previousProducts,
      ]);

      return newProduct;
    } catch (error) {
      setError(
        error.message || "Failed to add product"
      );

      throw error;
    }
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const editProduct = async (id, productData) => {
    try {
      setError("");

      if (!id) {
        throw new Error("Product ID is required");
      }

      const updatedProduct = await updateProduct(
        id,
        productData
      );

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product._id === id
            ? updatedProduct
            : product
        )
      );

      return updatedProduct;
    } catch (error) {
      setError(
        error.message || "Failed to update product"
      );

      throw error;
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const removeProduct = async (id) => {
    try {
      setError("");

      if (!id) {
        throw new Error("Product ID is required");
      }

      await deleteProduct(id);

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== id
        )
      );
    } catch (error) {
      setError(
        error.message || "Failed to delete product"
      );

      throw error;
    }
  };

  // =========================
  // CLEAR ERROR
  // =========================
  const clearProductError = () => {
    setError("");
  };

  // =========================
  // LOAD PRODUCTS
  // =========================
  useEffect(() => {
    fetchProducts().catch(() => {
      // Error is already stored in state.
    });
  }, []);

  return (
    <ProductContext.Provider
      value={{
        // Product data
        products,

        // Loading & error states
        loading,
        error,

        // Fetch functions
        fetchProducts,
        fetchProductById,
        getProductFromState,

        // CRUD functions
        createProduct,
        editProduct,
        removeProduct,

        // Error helper
        clearProductError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// =========================
// CUSTOM HOOK
// =========================
export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductProvider"
    );
  }

  return context;
};