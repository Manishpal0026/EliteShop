const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  getDeals,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// ==========================================
// AUTH + UPLOAD MIDDLEWARE
// ==========================================

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const upload =
  require("../middleware/uploadMiddleware");

// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get("/", getProducts);

// ==========================================
// GET DEAL PRODUCTS
// IMPORTANT: Must come before /:id
// ==========================================

router.get("/deals", getDeals);

// ==========================================
// CREATE PRODUCT
// ==========================================

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createProduct
);

// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateProduct
);

// ==========================================
// DELETE PRODUCT
// ==========================================

router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

// ==========================================
// GET SINGLE PRODUCT
// IMPORTANT: Keep this after /deals
// ==========================================

router.get("/:id", getProductById);

module.exports = router;