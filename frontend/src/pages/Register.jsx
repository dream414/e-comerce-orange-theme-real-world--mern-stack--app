import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fffaf5] text-slate-900">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-44 -top-44 h-[470px] w-[470px] rounded-full bg-orange-600" />

        <div className="absolute -right-40 -top-36 h-[420px] w-[420px] rounded-full bg-orange-600" />

        <div className="absolute -bottom-48 -left-40 h-[480px] w-[480px] rounded-full bg-orange-600" />

        <div className="absolute -bottom-44 -right-40 h-[450px] w-[450px] rounded-full bg-orange-600" />

        <div
          className="
            absolute inset-0
            opacity-35
            bg-[radial-gradient(circle,rgba(245,70,6,0.93)_1.3px,transparent_1.3px)]
            [background-size:28px_28px]
          "
        />

        <div className="absolute inset-0 bg-white/20" />

      </div>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">

        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">


          {/* =================================================
              LEFT — E-COMMERCE INTRODUCTION
          ================================================= */}

          <div className="hidden lg:block">

            <div className="relative max-w-xl">

              {/* Decorative Circle */}

              <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full border-4 border-orange-600 bg-orange-600/20" />


              {/* LOGO */}

              <div className="relative mb-7 flex items-center">

                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[4px] border-orange-600 bg-white p-4 shadow-[0_20px_55px_rgba(249,115,22,0.18)]">

                  <div className="absolute inset-2 rounded-full border-2 border-orange-500" />

                  <img
                    src="/logocart.png"
                    alt="E-commerce Logo"
                    className="relative z-10 h-full w-full object-contain"
                  />

                </div>

              </div>


              {/* BADGE */}

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-orange-600 bg-orange-600/10 px-4 py-2">

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-black text-white">
                  🛒
                </span>

                <span className="text-[10px] font-black tracking-[0.16em] text-orange-600">
                  E-COMMERCE PLATFORM
                </span>

              </div>


              {/* TITLE */}

              <h1 className="max-w-xl text-5xl font-black leading-[1.04] tracking-[-0.04em] text-slate-950 xl:text-6xl">

                Create your

                <br />

                <span className="text-orange-600">
                  shopping account.
                </span>

              </h1>


              {/* INTRODUCTION */}

              <p className="mt-6 max-w-lg text-[15px] leading-7 text-slate-600">

                Join our e-commerce platform and create your account to
                experience a simple, secure and organized shopping journey.

              </p>


              {/* FEATURES */}

              <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">

                {/* Feature 1 */}

                <div className="rounded-2xl border-2 border-orange-600 bg-white/90 p-4 shadow-[0_10px_30px_rgba(249,115,22,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-lg text-white">
                    🛍️
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    Easy Shopping
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Explore products and manage your shopping experience.
                  </p>

                </div>


                {/* Feature 2 */}

                <div className="rounded-2xl border-2 border-orange-600 bg-white/90 p-4 shadow-[0_10px_30px_rgba(249,115,22,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-lg text-white">
                    🔐
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    Secure Account
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Your account is protected with secure authentication.
                  </p>

                </div>


                {/* Feature 3 */}

                <div className="rounded-2xl border-2 border-orange-600 bg-white/90 p-4 shadow-[0_10px_30px_rgba(249,115,22,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-lg text-white">
                    ⚡
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    Fast Experience
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    A clean and smooth experience from account to checkout.
                  </p>

                </div>


                {/* Feature 4 */}

                <div className="rounded-2xl border-2 border-orange-600 bg-white/90 p-4 shadow-[0_10px_30px_rgba(249,115,22,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-lg text-white">
                    📦
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    Order Ready
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Build your account for a complete e-commerce journey.
                  </p>

                </div>

              </div>


              {/* BOTTOM INFO */}

              <div className="mt-6 flex items-center gap-3">

                <div className="h-2 w-2 rounded-full bg-orange-600" />

                <div className="h-1.5 w-14 rounded-full bg-orange-600" />

                <div className="h-1.5 w-20 rounded-full bg-orange-600" />

                <p className="ml-1 text-[10px] font-bold tracking-wide text-slate-400">
                  SHOP • MANAGE • ENJOY
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT — REGISTER FORM
          ================================================= */}

          <div className="w-full max-w-[470px] justify-self-center lg:justify-self-end">

            <div className="relative overflow-hidden rounded-[34px] border border-orange-600 bg-white/95 shadow-[0_30px_80px_rgba(249,115,22,0.15)] backdrop-blur-xl">

              {/* Top Orange Line */}

              <div className="h-2 w-full bg-orange-600" />


              {/* Decorative Circles */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-orange-600" />

              <div className="pointer-events-none absolute -left-16 bottom-[-60px] h-36 w-36 rounded-full bg-orange-600" />


              {/* =================================================
                  FIXED HEIGHT + SCROLL FORM AREA
              ================================================= */}

              <div className="relative h-[690px] overflow-y-auto p-6 sm:p-8">

                {/* Custom scrollbar */}

                <div className="relative">


                  {/* MOBILE LOGO */}

                  <div className="mb-6 flex items-center justify-center lg:hidden">

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-orange-600 bg-white p-3 shadow-[0_18px_40px_rgba(249,115,22,0.16)]">

                      <div className="absolute inset-2 rounded-full border-2 border-orange-600" />

                      <img
                        src="/logocart.png"
                        alt="E-commerce Logo"
                        className="relative z-10 h-full w-full object-contain"
                      />

                    </div>

                  </div>


                  {/* HEADER */}

                  <div className="text-center">

                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 ring-8 ring-orange-500/[0.05]">

                      <span className="text-lg">
                        🛒
                      </span>

                    </div>

                    <p className="text-[10px] font-black tracking-[0.22em] text-orange-600">
                      E-COMMERCE ACCOUNT
                    </p>

                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                      Create Account
                    </h2>

                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                      Set up your account and start your e-commerce journey.
                    </p>

                  </div>


                  {/* ERROR */}

                  {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                      {error}
                    </div>
                  )}


                  {/* FORM */}

                  <form
                    onSubmit={handleSubmit}
                    className="mt-7"
                  >

                    {/* NAME */}

                    <div className="mb-5">

                      <label
                        htmlFor="name"
                        className="mb-2 block text-xs font-black text-slate-800"
                      >
                        Full Name
                      </label>

                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="h-12 w-full rounded-xl border border-orange-600 bg-orange-500/[0.03] px-4 text-sm font-medium text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-orange-500/35 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      />

                    </div>


                    {/* EMAIL */}

                    <div className="mb-5">

                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-black text-slate-800"
                      >
                        Email Address
                      </label>

                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="h-12 w-full rounded-xl border border-orange-600 bg-orange-500/[0.03] px-4 text-sm font-medium text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-orange-500/35 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      />

                    </div>


                    {/* PASSWORD */}

                    <div className="mb-5">

                      <label
                        htmlFor="password"
                        className="mb-2 block text-xs font-black text-slate-800"
                      >
                        Password
                      </label>

                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a secure password"
                        required
                        className="h-12 w-full rounded-xl border border-orange-600 bg-orange-500/[0.03] px-4 text-sm font-medium text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-orange-500/35 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="mb-5">

                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-xs font-black text-slate-800"
                      >
                        Confirm Password
                      </label>

                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        className="h-12 w-full rounded-xl border border-orange-600 bg-orange-500/[0.03] px-4 text-sm font-medium text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-orange-500/35 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      />

                    </div>


                    {/* ACCOUNT TYPE */}

                    <div className="mb-6">

                      <label
                        htmlFor="role"
                        className="mb-2 block text-xs font-black text-slate-800"
                      >
                        Account Type
                      </label>

                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-orange-600 bg-orange-500/[0.03] px-4 text-sm font-medium text-slate-900 outline-none transition duration-200 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      >

                        <option value="client">
                          Client
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                      </select>

                    </div>


                    {/* ACCOUNT INFORMATION CARD */}

                    <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50/70 p-4">

                      <div className="flex gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-sm text-white">
                          ℹ
                        </div>

                        <div>

                          <p className="text-xs font-black text-slate-800">
                            Your e-commerce account
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            Your account will allow you to access the
                            platform and continue your shopping experience.
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* CREATE ACCOUNT */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative h-12 w-full overflow-hidden rounded-xl bg-orange-600 text-sm font-black text-white shadow-[0_12px_28px_rgba(249,115,22,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(249,115,22,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      <span className="relative z-10">
                        {loading
                          ? "Creating Account..."
                          : "Create Account"}
                      </span>

                      <span className="absolute inset-0 -translate-x-full bg-white opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:opacity-20" />

                    </button>


                    {/* DIVIDER */}

                    <div className="my-6 flex items-center gap-3">

                      <div className="h-px flex-1 bg-orange-600" />

                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 text-[8px] font-black text-orange-500">
                        OR
                      </span>

                      <div className="h-px flex-1 bg-orange-600" />

                    </div>


                    {/* LOGIN */}

                    <div className="text-center">

                      <p className="mb-3 text-xs text-slate-500">
                        Already have an account?
                      </p>

                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="h-12 w-full rounded-xl border-2 border-orange-600 bg-white text-sm font-black text-orange-500 shadow-[0_10px_24px_rgba(249,115,22,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:text-white hover:shadow-[0_14px_30px_rgba(249,115,22,0.25)] active:scale-[0.98]"
                      >
                        Sign In
                      </button>

                    </div>


                    {/* SECURITY */}

                    <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400">

                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/10 text-[9px] text-orange-500">
                        🔒
                      </span>

                      <span>
                        Secure account authentication
                      </span>

                    </div>

                  </form>

                </div>

              </div>

            </div>

            <p className="mt-3 text-center text-[10px] font-medium text-slate-400">
              Build your account • Explore products • Enjoy shopping
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;