const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// =========================
// ADD PRODUCT TO WISHLIST
// =========================
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Find user's wishlist
    let wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    // Create wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [
          {
            product: productId,
          },
        ],
      });

      await wishlist.populate("items.product");

      return res.status(201).json({
        message: "Product added to wishlist",
        wishlist,
      });
    }

    // Check if product already exists
    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "Product already exists in wishlist",
      });
    }

    // Add product
    wishlist.items.push({
      product: productId,
    });

    await wishlist.save();
    await wishlist.populate("items.product");

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};


// =========================
// GET USER WISHLIST
// =========================
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!wishlist) {
      return res.status(200).json({
        message: "Wishlist is empty",
        wishlist: {
          items: [],
        },
      });
    }

    res.status(200).json({
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wishlist",
      error: error.message,
    });
  }
};


// =========================
// REMOVE PRODUCT FROM WISHLIST
// =========================
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    const itemExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Product not found in wishlist",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("items.product");

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
};


// =========================
// CLEAR WISHLIST
// =========================
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      return res.status(200).json({
        message: "Wishlist is already empty",
      });
    }

    wishlist.items = [];

    await wishlist.save();

    res.status(200).json({
      message: "Wishlist cleared successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear wishlist",
      error: error.message,
    });
  }
};


module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
};