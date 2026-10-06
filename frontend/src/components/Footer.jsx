import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-12 bg-orange-600 text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white">
                <img
                  src="/logocart.png"
                  alt="E-Commerce Logo"
                  className="h-9 w-9 object-contain"
                />
              </div>

              <div>
                <h2 className="text-lg font-extrabold">
                  E-COMMERCE
                </h2>

                <p className="text-xs text-orange-100">
                  Shopping Platform
                </p>
              </div>

            </div>

            <p className="max-w-sm text-sm leading-6 text-orange-50">
              Your simple and reliable e-commerce platform for
              discovering products and enjoying a smooth shopping
              experience.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex gap-3">

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-full bg-white/10 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-orange-600"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-full bg-white/10 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-orange-600"
              >
                <FaInstagram className="h-4 w-4" />
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="rounded-full bg-white/10 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-orange-600"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>

              {/* Twitter */}
              <a
                href="#"
                aria-label="Twitter"
                className="rounded-full bg-white/10 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-orange-600"
              >
                <FaTwitter className="h-4 w-4" />
              </a>

            </div>
          </div>

          {/* Shopping */}
          <div>
            <h3 className="mb-5 text-base font-bold">
              Shopping
            </h3>

            <ul className="space-y-3 text-sm text-orange-50">

              <li>
                <Link
                  to="/client/dashboard"
                  className="transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/client/products"
                  className="transition hover:text-white"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/client/cart"
                  className="transition hover:text-white"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/client/orders"
                  className="transition hover:text-white"
                >
                  My Orders
                </Link>
              </li>

            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-5 text-base font-bold">
              Account
            </h3>

            <ul className="space-y-3 text-sm text-orange-50">

              <li>
                <Link
                  to="/client/wishlist"
                  className="transition hover:text-white"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/client/dashboard"
                  className="transition hover:text-white"
                >
                  My Account
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="transition hover:text-white"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition hover:text-white"
                >
                  Create Account
                </Link>
              </li>

            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-5 text-base font-bold">
              Support
            </h3>

            <ul className="space-y-3 text-sm text-orange-50">

              <li>Customer Support</li>
              <li>Shipping Information</li>
              <li>Return Policy</li>
              <li>Privacy Policy</li>

            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-orange-500 bg-orange-700">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-orange-100 sm:px-6 md:flex-row lg:px-8">

          <p>
            © {new Date().getFullYear()} E-Commerce Platform.
            All rights reserved.
          </p>

          <p>
            Built with MERN Stack
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;