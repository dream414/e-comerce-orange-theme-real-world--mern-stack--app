const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =========================
// REGISTER USER
// =========================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check existing email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Check whether an admin already exists
    const adminExists = await User.findOne({
      role: "admin",
    });

    let finalRole = "client";

    // First admin
    if (!adminExists && role === "admin") {
      finalRole = "admin";
    }

    // Admin already exists
    if (adminExists && role === "admin") {
      return res.status(403).json({
        message:
          "Admin already exists. You can only register as a client.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// =========================
// LOGIN USER
// =========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

// =========================
// LOGOUT USER
// =========================
const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
};

// =========================
// GET ALL CLIENTS - ADMIN
// =========================
const getAllClients = async (req, res) => {
  try {
    const clients = await User.find({
      role: "client",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Clients fetched successfully",
      clients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

// =========================
// GET CLIENT COUNT - ADMIN
// =========================
const getClientCount = async (req, res) => {
  try {
    const count = await User.countDocuments({
      role: "client",
    });

    res.status(200).json({
      message: "Client count fetched successfully",
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch client count",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllClients,
  getClientCount,
};