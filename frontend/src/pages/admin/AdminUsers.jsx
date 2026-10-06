import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FETCH ALL CLIENTS
  // =========================
  const fetchClients = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/admin/clients",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch clients"
        );
      }

      setClients(data.clients || []);
    } catch (error) {
      setError(
        error.message || "Something went wrong while fetching users"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================
  // LOAD CLIENTS
  // =========================
  useEffect(() => {
    fetchClients();
  }, []);

  // =========================
  // SEARCH CLIENTS
  // =========================
  const filteredClients = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return clients;
    }

    return clients.filter((client) => {
      const name = client.name?.toLowerCase() || "";
      const email = client.email?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        email.includes(searchValue)
      );
    });
  }, [clients, search]);

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // USER INITIAL
  // =========================
  const getInitial = (name) => {
    if (!name) {
      return "U";
    }

    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">

      {/* =========================
          USER / ACCOUNT BACKGROUND
          ========================= */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden bg-white">

        {/* Soft overall orange glow */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/[0.025] blur-3xl" />

        {/* =========================
            TOP LEFT USER PROFILE RINGS
            ========================= */}
        <div className="absolute -left-48 -top-48 h-[520px] w-[520px] rounded-full border-[85px] border-orange-600/[0.045] bg-white" />

        <div className="absolute -left-36 -top-36 h-[390px] w-[390px] rounded-full border-[25px] border-orange-600/[0.12] bg-white" />

        <div className="absolute -left-24 -top-24 h-[270px] w-[270px] rounded-full border-[12px] border-orange-600/[0.07] bg-white" />

        {/* =========================
            TOP RIGHT ACCOUNT RINGS
            ========================= */}
        <div className="absolute -right-52 -top-40 h-[520px] w-[520px] rounded-full border-[80px] border-orange-600/[0.045] bg-white" />

        <div className="absolute -right-36 -top-24 h-[380px] w-[380px] rounded-full border-[25px] border-orange-600/[0.12] bg-white" />

        {/* =========================
            USER CONNECTION DOTS
            ========================= */}
        <div className="absolute right-[12%] top-[22%] hidden sm:block">
          <div className="grid grid-cols-5 gap-2 opacity-30">
            {Array.from({ length: 25 }).map((_, index) => (
              <span
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-orange-500"
              />
            ))}
          </div>
        </div>

        <div className="absolute left-[9%] top-[34%] hidden md:block">
          <div className="grid grid-cols-4 gap-2 opacity-20">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-orange-500"
              />
            ))}
          </div>
        </div>

        {/* =========================
            SMALL USER AVATAR STYLE CIRCLES
            ========================= */}
        <div className="absolute left-[7%] top-[52%] h-20 w-20 rounded-full border-[10px] border-orange-600/[0.055]" />

        <div className="absolute left-[10%] top-[55%] h-10 w-10 rounded-full border-[6px] border-orange-600/[0.08]" />

        <div className="absolute right-[8%] top-[48%] h-24 w-24 rounded-full border-[12px] border-orange-600/[0.05]" />

        <div className="absolute right-[11%] top-[51%] h-12 w-12 rounded-full border-[6px] border-orange-600/[0.08]" />

        {/* =========================
            BOTTOM LEFT USER GROUP STYLE
            ========================= */}
        <div className="absolute -bottom-56 -left-48 h-[540px] w-[540px] rounded-full border-[85px] border-orange-600/[0.045] bg-white" />

        <div className="absolute -bottom-40 -left-32 h-[390px] w-[390px] rounded-full border-[25px] border-orange-600/[0.12] bg-white" />

        {/* =========================
            BOTTOM RIGHT ACCOUNT RINGS
            ========================= */}
        <div className="absolute -bottom-56 -right-48 h-[520px] w-[520px] rounded-full border-[80px] border-orange-600/[0.045] bg-white" />

        <div className="absolute -bottom-36 -right-28 h-[370px] w-[370px] rounded-full border-[25px] border-orange-600/[0.12] bg-white" />

        {/* =========================
            SMALL CONNECTION POINTS
            ========================= */}
        <div className="absolute bottom-[24%] left-[28%] h-2 w-2 rounded-full bg-orange-600/15" />

        <div className="absolute bottom-[27%] left-[31%] h-1.5 w-1.5 rounded-full bg-orange-600/10" />

        <div className="absolute bottom-[22%] right-[30%] h-2 w-2 rounded-full bg-orange-600/15" />

        <div className="absolute bottom-[25%] right-[33%] h-1.5 w-1.5 rounded-full bg-orange-600/10" />

      </div>

      <div className="relative z-10">

        <Header />

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* =========================
              TOP SECTION
          ========================= */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-600 transition mb-4"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200">
                  <Users size={24} />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Manage Users
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    View and manage registered clients
                  </p>
                </div>
              </div>
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchClients(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-orange-100 text-slate-700 font-semibold shadow-sm hover:border-orange-300 hover:text-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh Users"}
            </button>
          </div>

          {/* =========================
              SUMMARY CARD
          ========================= */}
          <div className="mb-7">
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Clients
                  </p>

                  <h2 className="text-3xl font-bold text-slate-900 mt-1">
                    {loading ? "..." : clients.length}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Registered client accounts
                  </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Users size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              SEARCH
          ========================= */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 mb-7">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
          </div>

          {/* =========================
              ERROR
          ========================= */}
          {error && (
            <div className="mb-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* =========================
              LOADING
          ========================= */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200" />

                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-44" />
                    </div>
                  </div>

                  <div className="h-3 bg-slate-200 rounded w-28 mt-6" />
                  <div className="h-3 bg-slate-200 rounded w-36 mt-3" />
                </div>
              ))}
            </div>
          ) : filteredClients.length === 0 ? (
            /* =========================
                EMPTY STATE
            ========================= */
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm py-16 px-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-5">
                <Users size={30} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {search
                  ? "No users found"
                  : "No clients registered yet"}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                {search
                  ? "Try searching with a different name or email."
                  : "Registered client accounts will appear here."}
              </p>
            </div>
          ) : (
            /* =========================
                CLIENT LIST
            ========================= */
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Client Accounts
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Showing {filteredClients.length} of{" "}
                    {clients.length} users
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredClients.map((client) => (
                  <div
                    key={client._id}
                    className="bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-md hover:border-orange-200 transition p-6"
                  >
                    {/* User Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                        {getInitial(client.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">
                          {client.name || "Unknown User"}
                        </h3>

                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                          <Mail size={14} />
                          <span className="truncate">
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <ShieldCheck
                            size={17}
                            className="text-orange-500"
                          />
                          <span>Role</span>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold capitalize">
                          {client.role || "client"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <CalendarDays
                            size={17}
                            className="text-orange-500"
                          />
                          <span>Joined</span>
                        </div>

                        <span className="text-sm font-medium text-slate-700">
                          {formatDate(client.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <Footer />

      </div>
    </div>
  );
};

export default AdminUsers;