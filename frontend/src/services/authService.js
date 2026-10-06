const API_URL = "http://localhost:5000/api/auth";

// =========================
// REGISTER
// =========================
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

// =========================
// LOGIN
// =========================
export const loginUser = async (loginData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// =========================
// LOGOUT
// =========================
export const logoutUser = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  });

  const data = await response.json();

  // Frontend session remove
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  if (!response.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
};