import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductImageUrl } from "../../services/productService";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const hasDiscount =
    product.discount && Number(product.discount) > 0;

  const originalPrice = Number(product.price || 0);

  const discountedPrice = hasDiscount
    ? originalPrice -
      (originalPrice * Number(product.discount)) / 100
    : originalPrice;

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (Number(product.stock) <= 0) {
      alert("This product is out of stock.");
      return;
    }

    try {
      setCartLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product to cart"
        );
      }

      alert("Product added to cart successfully.");
    } catch (error) {
      alert(error.message);
    } finally {
      setCartLoading(false);
    }
  };

  // =========================
  // ADD TO WISHLIST
  // =========================
  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/wishlist/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product to wishlist"
        );
      }

      alert("Product added to wishlist successfully.");
    } catch (error) {
      alert(error.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================
  // VIEW PRODUCT
  // =========================
  const handleViewProduct = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <article className="group overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_12px_35px_rgba(249,115,22,0.08)] transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(249,115,22,0.15)]">

      {/* Product Image */}
      <button
        type="button"
        onClick={handleViewProduct}
        className="relative block h-64 w-full overflow-hidden bg-orange-50 text-left sm:h-72"
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={getProductImageUrl(product.images[0])}
            alt={product.name}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-orange-50">
            <div className="text-center">
              <div className="mb-2 text-4xl">
                📦
              </div>

              <p className="text-sm font-semibold text-slate-500">
                No Image Available
              </p>
            </div>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute left-4 top-4 rounded-full bg-orange-600 px-3 py-1.5 text-xs font-black text-white shadow-lg">
            {product.discount}% OFF
          </span>
        )}

        {/* Stock Badge */}
        {Number(product.stock) === 0 && (
          <span className="absolute right-4 top-4 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-black text-white">
            Out of Stock
          </span>
        )}

        {Number(product.stock) > 0 &&
          Number(product.stock) <= 5 && (
            <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-black text-orange-700 shadow">
              Only {product.stock} left
            </span>
          )}
      </button>

      {/* Product Information */}
      <div className="p-5 sm:p-6">

        {/* Category + Brand */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-orange-700">
            {product.category}
          </span>

          {product.brand && (
            <span className="truncate text-xs font-semibold text-slate-400">
              {product.brand}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="line-clamp-2 min-h-[52px] text-lg font-black text-slate-900 transition group-hover:text-orange-600">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-orange-500">
              ★
            </span>

            <span className="text-sm font-bold text-slate-700">
              {Number(product.ratings || 0).toFixed(1)}
            </span>
          </div>

          <span className="text-xs text-slate-400">
            Product Rating
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 border-t border-orange-50 pt-5">

          {hasDiscount && (
            <p className="text-sm font-semibold text-slate-400 line-through">
              Rs. {originalPrice.toLocaleString()}
            </p>
          )}

          <p className="text-2xl font-black text-orange-600">
            Rs. {discountedPrice.toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

          {/* Add To Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              cartLoading ||
              Number(product.stock) <= 0
            }
            className="rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {cartLoading
              ? "Adding..."
              : Number(product.stock) <= 0
              ? "Out of Stock"
              : "🛒 Add to Cart"}
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className="rounded-2xl border-2 border-orange-600 bg-white px-4 py-3 text-sm font-black text-orange-700 transition hover:bg-orange-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {wishlistLoading
              ? "Adding..."
              : "♡ Wishlist"}
          </button>

        </div>

        {/* View Product */}
        <button
          type="button"
          onClick={handleViewProduct}
          className="mt-3 w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-3 text-sm font-black text-orange-700 transition hover:bg-orange-100"
        >
          View Product
        </button>

      </div>
    </article>
  );
};

export default ProductCard;