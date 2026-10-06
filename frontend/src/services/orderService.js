const API_URL = "http://localhost:5000/api/orders";

// =========================
// CREATE ORDER - CLIENT
// =========================
export const createOrder = async (
  orderData,
  token
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create order"
    );
  }

  return data;
};

// =========================
// GET MY ORDERS - CLIENT
// =========================
export const getMyOrders = async (token) => {
  const response = await fetch(
    `${API_URL}/my-orders`,
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
      data.message || "Failed to fetch your orders"
    );
  }

  return data;
};

// =========================
// GET ALL ORDERS - ADMIN
// =========================
export const getAllOrders = async (token) => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch all orders"
    );
  }

  return data;
};

// =========================
// GET ADMIN ORDER NOTIFICATIONS
// =========================
export const getAdminNotifications = async (
  token
) => {
  const response = await fetch(
    `${API_URL}/admin/notifications`,
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
      data.message ||
        "Failed to fetch admin notifications"
    );
  }

  return data;
};

// =========================
// MARK ADMIN NOTIFICATIONS AS READ
// =========================
export const markAdminNotificationsAsRead = async (
  token
) => {
  const response = await fetch(
    `${API_URL}/admin/notifications/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to mark notifications as read"
    );
  }

  return data;
};

// =========================
// GET SINGLE ORDER
// CLIENT / ADMIN
// =========================
export const getOrderById = async (
  orderId,
  token
) => {
  const response = await fetch(
    `${API_URL}/${orderId}`,
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
      data.message || "Failed to fetch order"
    );
  }

  return data;
};

// =========================
// UPDATE ORDER - ADMIN
// =========================
export const updateOrder = async (
  orderId,
  orderData,
  token
) => {
  const response = await fetch(
    `${API_URL}/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update order"
    );
  }

  return data;
};

// =========================
// DELETE ORDER - ADMIN
// =========================
export const deleteOrder = async (
  orderId,
  token
) => {
  const response = await fetch(
    `${API_URL}/${orderId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete order"
    );
  }

  return data;
};