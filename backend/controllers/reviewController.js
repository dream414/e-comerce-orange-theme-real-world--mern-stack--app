const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");

// ===============================
// UPDATE PRODUCT AVERAGE RATING
// ===============================
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      ratings: 0,
    });

    return;
  }

  const totalRating = reviews.reduce(
    (total, review) => total + review.rating,
    0
  );

  const averageRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    ratings: Number(averageRating.toFixed(1)),
  });
};

// ===============================
// ADD REVIEW
// ===============================
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Valid product ID is required",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({
        message: "Comment must be at least 3 characters",
      });
    }

    if (comment.trim().length > 1000) {
      return res.status(400).json({
        message: "Comment cannot exceed 1000 characters",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment: comment.trim(),
    });

    await updateProductRating(productId);

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("product", "name category brand price images");

    res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Add Review Error:", error);

    res.status(500).json({
      message: "Failed to add review",
      error: error.message,
    });
  }
};

// ===============================
// GET PRODUCT REVIEWS
// ===============================
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name email")
      .populate("product", "name category brand price images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get Product Reviews Error:", error);

    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// ===============================
// GET MY REVIEW
// ===============================
const getMyReview = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const review = await Review.findOne({
      user: req.user.id,
      product: productId,
    }).populate("user", "name email");

    res.status(200).json({
      review: review || null,
    });
  } catch (error) {
    console.error("Get My Review Error:", error);

    res.status(500).json({
      message: "Failed to fetch your review",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE MY REVIEW
// ===============================
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({
        message: "Comment must be at least 3 characters",
      });
    }

    if (comment.trim().length > 1000) {
      return res.status(400).json({
        message: "Comment cannot exceed 1000 characters",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You can only update your own review",
      });
    }

    review.rating = rating;
    review.comment = comment.trim();

    await review.save();

    await updateProductRating(review.product);

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("product", "name category brand price images");

    res.status(200).json({
      message: "Review updated successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    res.status(500).json({
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// ===============================
// DELETE MY REVIEW
// ===============================
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own review",
      });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(id);

    await updateProductRating(productId);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// ===============================
// ADMIN - GET ALL REVIEWS
// ===============================
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name category brand price images ratings")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get All Reviews Error:", error);

    res.status(500).json({
      message: "Failed to fetch all reviews",
      error: error.message,
    });
  }
};

// ===============================
// ADMIN - DELETE REVIEW
// ===============================
const adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(id);

    await updateProductRating(productId);

    res.status(200).json({
      message: "Review deleted successfully by admin",
    });
  } catch (error) {
    console.error("Admin Delete Review Error:", error);

    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  getMyReview,
  updateReview,
  deleteReview,
  getAllReviews,
  adminDeleteReview,
};