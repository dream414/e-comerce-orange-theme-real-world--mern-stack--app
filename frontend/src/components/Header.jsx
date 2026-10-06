import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Bell,
  Package,
  Plus,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const {
    adminNotifications,
    getAdminNotifications,
  } = useOrder();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [wishlistCount, setWishlistCount] =
    useState(0);

  const isAdmin = user?.role === "admin";
  const isClient = user?.role === "client";

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : "/client/dashboard";

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        if (!isClient) {
          setWishlistCount(0);
          return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
          setWishlistCount(0);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/wishlist",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        setWishlistCount(
          data.wishlist?.items?.length || 0
        );
      } catch (error) {
        console.error(
          "Failed to fetch wishlist count:",
          error
        );
      }
    };

    fetchWishlistCount();
  }, [isClient]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    if (
      location.pathname ===
      "/admin/notifications"
    ) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const fetchNotifications = async () => {
      try {
        await getAdminNotifications(token);
      } catch (error) {
        console.error(
          "Failed to fetch admin notifications:",
          error
        );
      }
    };

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [
    isAdmin,
    location.pathname,
    getAdminNotifications,
  ]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        trimmedSearch
      )}`
    );

    setMobileMenu(false);
  };

  const handleBrowseProducts = () => {
    navigate("/products");
    setMobileMenu(false);
  };

  const handleNotifications = () => {
    navigate("/admin/notifications");
    setMobileMenu(false);
  };

  const orderNotificationCount =
    adminNotifications.length;

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={dashboardPath}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-600 bg-white shadow-sm">
            <img
              src="/logocart.png"
              alt="E-Commerce Logo"
              className="h-9 w-9 object-contain"
            />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-extrabold tracking-tight text-orange-600">
              E-COMMERCE
            </h1>

            <p className="text-xs font-medium text-gray-500">
              Shopping Platform
            </p>
          </div>
        </Link>

        {isClient && (
          <form
            onSubmit={handleSearch}
            className="mx-6 hidden max-w-xl flex-1 md:block"
          >
            <div className="flex items-center rounded-full border border-orange-200 bg-[#fffaf5] px-4 py-2.5 transition focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-100">
              <Search className="mr-3 h-5 w-5 text-orange-600" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
          </form>
        )}

        {isAdmin && (
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() =>
                navigate("/admin/products")
              }
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              <Package className="h-4 w-4" />
              Manage Products
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/products/add")
              }
              className="flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>

            <button
              type="button"
              onClick={handleNotifications}
              className="relative rounded-full p-3 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />

              {orderNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-black text-white shadow-sm">
                  {orderNotificationCount > 99
                    ? "99+"
                    : orderNotificationCount}
                </span>
              )}
            </button>
          </div>
        )}

        {isClient && (
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={handleBrowseProducts}
              className="rounded-full px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
            >
              Browse Products
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/client/wishlist")
              }
              className="relative rounded-full p-3 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
              title="Wishlist"
            >
              ❤️

              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-black text-white shadow-sm">
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/client/cart")
              }
              className="relative rounded-full p-3 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-black text-white shadow-sm">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </button>
          </div>
        )}

        <div className="ml-2 hidden items-center gap-3 border-l border-gray-200 pl-4 md:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <div className="hidden lg:block">
            <p className="max-w-[120px] truncate text-sm font-bold text-gray-800">
              {user?.name || "User"}
            </p>

            <p className="text-xs font-medium capitalize text-orange-600">
              {user?.role || "client"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="ml-2 hidden rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-orange-700 md:block"
        >
          Logout
        </button>

        <button
          type="button"
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          className="rounded-lg p-2 text-orange-600 hover:bg-orange-50 md:hidden"
        >
          {mobileMenu ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileMenu && (
        <div className="border-t border-orange-100 bg-white px-4 py-5 shadow-lg md:hidden">
          {isClient && (
            <form
              onSubmit={handleSearch}
              className="mb-4 flex items-center rounded-xl border border-orange-200 bg-[#fffaf5] px-4 py-3"
            >
              <Search className="mr-3 h-5 w-5 text-orange-600" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </form>
          )}

          <div className="grid grid-cols-2 gap-3">
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/admin/products");
                    setMobileMenu(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600"
                >
                  <Package className="h-4 w-4" />
                  Products
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate(
                      "/admin/products/add"
                    );
                    setMobileMenu(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>

                <button
                  type="button"
                  onClick={handleNotifications}
                  className="flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600"
                >
                  <Bell className="h-4 w-4" />
                  Notifications

                  {orderNotificationCount >
                    0 && (
                    <span className="rounded-full bg-orange-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                      {orderNotificationCount >
                      99
                        ? "99+"
                        : orderNotificationCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {isClient && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/products");
                    setMobileMenu(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600"
                >
                  <Package className="h-4 w-4" />
                  Products
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate(
                      "/client/wishlist"
                    );
                    setMobileMenu(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist

                  {wishlistCount > 0 && (
                    <span className="rounded-full bg-orange-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                      {wishlistCount > 99
                        ? "99+"
                        : wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/client/cart");
                    setMobileMenu(false);
                  }}
                  className="relative flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart

                  {cartCount > 0 && (
                    <span className="rounded-full bg-orange-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                      {cartCount > 99
                        ? "99+"
                        : cartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            <div className="col-span-2 flex items-center gap-3 rounded-xl border border-orange-100 bg-[#fffaf5] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-800">
                  {user?.name || "User"}
                </p>

                <p className="text-xs font-medium capitalize text-orange-600">
                  {user?.role || "client"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="col-span-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-orange-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;