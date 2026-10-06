import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

const BillingInformation = () => {
  const navigate = useNavigate();

  const [sameAsShipping, setSameAsShipping] = useState(false);

  const [shippingInfo, setShippingInfo] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    const storedShipping =
      sessionStorage.getItem("shippingInfo");

    if (storedShipping) {
      setShippingInfo(JSON.parse(storedShipping));
    }
  }, []);

  const handleSameAsShipping = (checked) => {
    setSameAsShipping(checked);

    if (checked && shippingInfo) {
      setFormData({
        fullName: shippingInfo.fullName,
        email: shippingInfo.email,
        address: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
      });
    }

    if (!checked) {
      setFormData({
        fullName: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    sessionStorage.setItem(
      "billingInfo",
      JSON.stringify(formData)
    );

    navigate("/client/order-summary");
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold">
            Billing Information
          </h1>

          <p className="mt-2 text-slate-600">
            Enter your billing information.
          </p>

          <label className="mt-6 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) =>
                handleSameAsShipping(e.target.checked)
              }
              className="h-5 w-5 accent-orange-500"
            />

            <span className="font-medium">
              Same as Shipping Information
            </span>
          </label>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-5 sm:grid-cols-2"
          >
            <div>
              <label className="mb-2 block font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block font-medium">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="4"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Postal Code
              </label>

              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Continue to Order Summary
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BillingInformation;