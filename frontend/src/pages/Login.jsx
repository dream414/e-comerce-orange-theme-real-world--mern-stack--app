import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    setLoading(true);

    try {
      const data = await login(formData);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fffaf5] text-slate-900">

      {/* =====================================================
          BACKGROUND DECORATION
          4 DARK-ORANGE SHAPES + TAILWIND DOT PATTERN
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Large Dark Orange Top Left */}

        <div className="absolute -left-44 -top-44 h-[470px] w-[470px] rounded-full bg-orange-600" />

        {/* Dark Orange Top Right */}

        <div className="absolute -right-40 -top-36 h-[420px] w-[420px] rounded-full bg-orange-600" />

        {/* Dark Orange Bottom Left */}

        <div className="absolute -bottom-48 -left-40 h-[480px] w-[480px] rounded-full bg-orange-600" />

        {/* Dark Orange Bottom Right */}

        <div className="absolute -bottom-44 -right-40 h-[450px] w-[450px] rounded-full bg-orange-600" />


        {/* =================================================
            SUBTLE DOT PATTERN
            TAILWIND ONLY — NO INLINE STYLE
        ================================================= */}

        <div
          className="
            absolute inset-0
            opacity-35
            bg-[radial-gradient(circle,rgba(245,70,6,0.93)_1.3px,transparent_1.3px)]
            [background-size:28px_28px]
          "
        />


        {/* Soft central fade so dots don't overpower the form */}

        <div className="absolute inset-0 bg-white/20" />

      </div>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">


          {/* =================================================
              LEFT BRAND SECTION
          ================================================= */}

          <div className="hidden lg:block">

            <div className="relative max-w-xl">

              {/* Logo Decoration */}

              <div className="absolute -left-9 -top-7 h-28 w-28 rounded-full border-4 border-orange-600 bg-orange-600/30" />


              {/* LOGO ONLY */}

              <div className="relative mb-10 flex items-center">

                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[4px] border-orange-600 bg-white p-4 shadow-[0_20px_55px_rgba(249,115,22,0.18)]">

                  <div className="absolute inset-2 rounded-full border-2 border-orange-500" />

                  <img
                    src="/logocart.png"
                    alt="Logo"
                    className="relative z-10 h-full w-full object-contain"
                  />

                </div>

              </div>


              {/* BADGE */}

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-orange-600 bg-orange-600/20 px-4 py-2">

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                  ✓
                </span>

                <span className="text-[11px] font-black tracking-[0.14em] text-orange-600">
                  SECURE SHOPPING EXPERIENCE
                </span>

              </div>


              {/* HEADING */}

              <h1 className="max-w-xl text-5xl font-black leading-[1.03] tracking-[-0.04em] text-slate-950 xl:text-6xl">

                Welcome back to

                <br />

                <span className="text-orange-600">
                  your shopping
                </span>

                <br />

                <span className="text-orange-600">
                  space.
                </span>

              </h1>


              {/* DESCRIPTION */}

              <p className="mt-6 max-w-lg text-[15px] leading-7 text-slate-600">

                Sign in to manage your account, continue shopping and enjoy a
                smooth, secure e-commerce experience.

              </p>


              {/* ACCENT */}

              <div className="my-8 flex items-center gap-3">

                <div className="h-2 w-2 rounded-full bg-orange-600" />

                <div className="h-1.5 w-14 rounded-full bg-orange-600" />

                <div className="h-1.5 w-20 rounded-full bg-orange-600" />

                <div className="h-2 w-2 rounded-full bg-orange-600" />

              </div>


              {/* FEATURES */}

              <div className="flex flex-wrap gap-3">

                {/* Secure */}

                <div className="flex items-center gap-2.5 rounded-2xl border-2 border-orange-600 bg-white/90 px-4 py-3 shadow-[0_8px_25px_rgba(249,115,22,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1">

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-sm font-black text-white">
                    ✓
                  </span>

                  <div>

                    <p className="text-xs font-black text-slate-800">
                      Secure
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Account access
                    </p>

                  </div>

                </div>


                {/* Fast */}

                <div className="flex items-center gap-2.5 rounded-2xl border-2 border-orange-600 bg-white/90 px-4 py-3 shadow-[0_8px_25px_rgba(249,115,22,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1">

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-sm font-black text-white">
                    ϟ
                  </span>

                  <div>

                    <p className="text-xs font-black text-slate-800">
                      Fast
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Easy experience
                    </p>

                  </div>

                </div>


                {/* Reliable */}

                <div className="flex items-center gap-2.5 rounded-2xl border-2 border-orange-600 bg-white/90 px-4 py-3 shadow-[0_8px_25px_rgba(249,115,22,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1">

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-sm font-black text-white">
                    ◆
                  </span>

                  <div>

                    <p className="text-xs font-black text-slate-800">
                      Reliable
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Shopping platform
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div className="w-full max-w-[460px] justify-self-center lg:justify-self-end">

            <div className="relative overflow-hidden rounded-[34px] border border-orange-600 bg-white/95 shadow-[0_30px_80px_rgba(249,115,22,0.15)] backdrop-blur-xl">


              {/* TOP ORANGE BAR */}

              <div className="h-2 w-full bg-orange-600" />


              {/* CARD DECORATION */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-orange-600" />

              <div className="pointer-events-none absolute -left-16 bottom-[-60px] h-36 w-36 rounded-full bg-orange-600" />


              <div className="relative p-6 sm:p-9">


                {/* MOBILE LOGO */}

                <div className="mb-7 flex items-center justify-center lg:hidden">

                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[4px] border-orange-600 bg-white p-3 shadow-[0_18px_40px_rgba(249,115,22,0.16)]">

                    <div className="absolute inset-2 rounded-full border-2 border-orange-600" />

                    <img
                      src="/logocart.png"
                      alt="Logo"
                      className="relative z-10 h-full w-full object-contain"
                    />

                  </div>

                </div>


                {/* HEADING */}

                <div className="text-center">

                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 ring-8 ring-orange-500/[0.05]">

                    <span className="h-3.5 w-3.5 rounded-full bg-orange-500" />

                  </div>

                  <p className="text-[10px] font-black tracking-[0.22em] text-orange-600">
                    WELCOME BACK
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    Sign In
                  </h2>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    Access your account and continue your shopping journey.
                  </p>

                </div>


                {/* ERROR */}

                {error && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                    {error}
                  </div>
                )}


                {/* FORM */}

                <form onSubmit={handleSubmit} className="mt-7">


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

                  <div className="mb-6">

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
                      placeholder="Enter your password"
                      required
                      className="h-12 w-full rounded-xl border border-orange-600 bg-orange-500/[0.03] px-4 text-sm font-medium text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-orange-500/35 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                    />

                  </div>


                  {/* SIGN IN BUTTON */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative h-12 w-full overflow-hidden rounded-xl bg-orange-600 text-sm font-black text-white shadow-[0_12px_28px_rgba(249,115,22,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(249,115,22,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <span className="relative z-10">
                      {loading ? "Signing In..." : "Sign In"}
                    </span>

                    <span className="absolute inset-0 -translate-x-full bg-white opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:opacity-20" />

                  </button>

                </form>


                {/* DIVIDER */}

                <div className="my-6 flex items-center gap-3">

                  <div className="h-px flex-1 bg-orange-600" />

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 text-[8px] font-black text-orange-500">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-orange-600" />

                </div>


                {/* CREATE ACCOUNT */}

                <div className="text-center">

                  <p className="mb-3 text-xs text-slate-500">
                    Don't have an account?
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="group relative h-12 w-full overflow-hidden rounded-xl border-2 border-orange-600 bg-white text-sm font-black text-orange-500 shadow-[0_10px_24px_rgba(249,115,22,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:text-white hover:shadow-[0_14px_30px_rgba(249,115,22,0.25)] active:scale-[0.98]"
                  >
                    Create New Account
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

              </div>

            </div>


            {/* BOTTOM TEXT */}

            <p className="mt-4 text-center text-[10px] font-medium text-slate-400">
              Safe & simple access to your e-commerce account
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;