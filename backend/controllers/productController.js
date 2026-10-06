const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// ==============================
// IMAGE PATH HELPER
// ==============================

const getImageUrl = (filename) => {
  return `/uploads/products/${filename}`;
};

// ==============================
// DELETE IMAGE FILE FROM SERVER
// ==============================

const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;

  const filename = path.basename(imageUrl);

  const filePath = path.join(
    __dirname,
    "../uploads/products",
    filename
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ==============================
// ADD PRODUCT
// ==============================

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      brand,
      discount,
    } = req.body;

    const images = req.files
      ? req.files.map((file) => getImageUrl(file.filename))
      : [];

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      stock,
      brand,
      discount,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        const filePath = path.join(
          __dirname,
          "../uploads/products",
          file.filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
};

// ==============================
// GET ALL PRODUCTS
// ==============================

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
};

// ==============================
// GET SINGLE PRODUCT
// ==============================

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
};

// ==============================
// UPDATE PRODUCT
// ==============================

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      brand,
      discount,
      existingImages,
    } = req.body;

    // ==========================
    // BASIC PRODUCT DATA
    // ==========================

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.stock = stock;
    product.brand = brand;
    product.discount = discount;

    // ==========================
    // IMAGE UPDATE
    // ==========================

    if (
      existingImages !== undefined ||
      (req.files && req.files.length > 0)
    ) {
      let imagesToKeep = [];

      if (existingImages) {
        try {
          imagesToKeep = JSON.parse(existingImages);

          if (!Array.isArray(imagesToKeep)) {
            imagesToKeep = [];
          }
        } catch (error) {
          imagesToKeep = [];
        }
      }

      const removedImages = product.images.filter(
        (oldImage) => !imagesToKeep.includes(oldImage)
      );

      removedImages.forEach((image) => {
        deleteImageFile(image);
      });

      const newImages = req.files
        ? req.files.map((file) => getImageUrl(file.filename))
        : [];

      product.images = [
        ...imagesToKeep,
        ...newImages,
      ];
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        const filePath = path.join(
          __dirname,
          "../uploads/products",
          file.filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ==============================
// DELETE PRODUCT
// ==============================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        deleteImageFile(image);
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// ==============================
// EXPORTS
// ==============================

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};