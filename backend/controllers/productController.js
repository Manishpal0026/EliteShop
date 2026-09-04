const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// ==========================================
// GET ALL PRODUCTS
// ==========================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get product by ID error:", error);

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ==========================================
// CREATE PRODUCT
// ==========================================

const createProduct = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE PRODUCT REQUEST");
    console.log("=================================");

    console.log("Body:", req.body);
    console.log("File:", req.file);

    // ========================================
    // GET FORM DATA
    // ========================================

    const {
      name,
      description,
      originalPrice,
      price,
      category,
      stock,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!name || !description || !category) {
      return res.status(400).json({
        message:
          "Name, description and category are required.",
      });
    }

    if (
      originalPrice === undefined ||
      originalPrice === ""
    ) {
      return res.status(400).json({
        message: "Original price is required.",
      });
    }

    if (
      price === undefined ||
      price === ""
    ) {
      return res.status(400).json({
        message: "Selling price is required.",
      });
    }

    if (
      stock === undefined ||
      stock === ""
    ) {
      return res.status(400).json({
        message: "Stock quantity is required.",
      });
    }

    // ========================================
    // CONVERT NUMBERS
    // ========================================

    const originalPriceNumber =
      Number(originalPrice);

    const priceNumber =
      Number(price);

    const stockNumber =
      Number(stock);

    // ========================================
    // NUMBER VALIDATION
    // ========================================

    if (
      Number.isNaN(originalPriceNumber) ||
      originalPriceNumber <= 0
    ) {
      return res.status(400).json({
        message:
          "Original price must be a valid number greater than 0.",
      });
    }

    if (
      Number.isNaN(priceNumber) ||
      priceNumber <= 0
    ) {
      return res.status(400).json({
        message:
          "Selling price must be a valid number greater than 0.",
      });
    }

    if (priceNumber > originalPriceNumber) {
      return res.status(400).json({
        message:
          "Selling price cannot be higher than original price.",
      });
    }

    if (
      Number.isNaN(stockNumber) ||
      stockNumber < 0
    ) {
      return res.status(400).json({
        message:
          "Stock must be a valid number greater than or equal to 0.",
      });
    }

    // ========================================
    // CALCULATE DISCOUNT
    // ========================================

    let discount = 0;

    if (priceNumber < originalPriceNumber) {
      discount = Math.round(
        ((originalPriceNumber - priceNumber) /
          originalPriceNumber) *
          100
      );
    }

    console.log("Calculated discount:", discount);

    // ========================================
    // IMAGE URL
    // ========================================

    let imageUrl =
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";

    // ========================================
    // CLOUDINARY IMAGE UPLOAD
    // ========================================

    if (req.file) {
      console.log(
        "Uploading image to Cloudinary..."
      );

      try {
        const result =
          await cloudinary.uploader.upload(
            req.file.path,
            {
              folder: "shopnest/products",
            }
          );

        imageUrl = result.secure_url;

        console.log(
          "Cloudinary upload successful:"
        );

        console.log(imageUrl);

        // Remove temporary uploaded file
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (fileError) {
          console.warn(
            "Could not delete temporary file:",
            fileError.message
          );
        }
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary upload failed:",
          cloudinaryError.message
        );

        // Remove temporary file even if upload fails
        try {
          if (
            req.file.path &&
            fs.existsSync(req.file.path)
          ) {
            fs.unlinkSync(req.file.path);
          }
        } catch (fileError) {
          console.warn(
            "Could not delete temporary file:",
            fileError.message
          );
        }

        return res.status(500).json({
          message:
            "Image upload failed. Please check your Cloudinary configuration.",
          error: cloudinaryError.message,
        });
      }
    }

    // ========================================
    // CREATE PRODUCT
    // ========================================

    const product = new Product({
      name: name.trim(),

      description: description.trim(),

      originalPrice:
        originalPriceNumber,

      price:
        priceNumber,

      discount,

      category: category.trim(),

      stock: stockNumber,

      imageUrl,

      ratings: 0,

      numReviews: 0,
    });

    // ========================================
    // SAVE PRODUCT
    // ========================================

    const createdProduct =
      await product.save();

    console.log(
      "Product created successfully:"
    );

    console.log(createdProduct);

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      message:
        "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "CREATE PRODUCT ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      message:
        "Error creating product",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      originalPrice,
      price,
      category,
      stock,
    } = req.body;

    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ========================================
    // UPDATE BASIC DATA
    // ========================================

    if (name !== undefined && name !== "") {
      product.name = name.trim();
    }

    if (
      description !== undefined &&
      description !== ""
    ) {
      product.description =
        description.trim();
    }

    if (
      category !== undefined &&
      category !== ""
    ) {
      product.category =
        category.trim();
    }

    if (
      stock !== undefined &&
      stock !== ""
    ) {
      const stockNumber = Number(stock);

      if (
        Number.isNaN(stockNumber) ||
        stockNumber < 0
      ) {
        return res.status(400).json({
          message: "Invalid stock quantity.",
        });
      }

      product.stock = stockNumber;
    }

    // ========================================
    // UPDATE ORIGINAL PRICE
    // ========================================

    if (
      originalPrice !== undefined &&
      originalPrice !== ""
    ) {
      const original =
        Number(originalPrice);

      if (
        Number.isNaN(original) ||
        original <= 0
      ) {
        return res.status(400).json({
          message:
            "Invalid original price.",
        });
      }

      product.originalPrice = original;
    }

    // ========================================
    // UPDATE SELLING PRICE
    // ========================================

    if (
      price !== undefined &&
      price !== ""
    ) {
      const selling =
        Number(price);

      if (
        Number.isNaN(selling) ||
        selling <= 0
      ) {
        return res.status(400).json({
          message:
            "Invalid selling price.",
        });
      }

      product.price = selling;
    }

    // ========================================
    // VALIDATE PRICES
    // ========================================

    if (
      product.price >
      product.originalPrice
    ) {
      return res.status(400).json({
        message:
          "Selling price cannot be higher than original price.",
      });
    }

    // ========================================
    // RECALCULATE DISCOUNT
    // ========================================

    if (
      product.originalPrice > 0 &&
      product.price <
        product.originalPrice
    ) {
      product.discount =
        Math.round(
          ((product.originalPrice -
            product.price) /
            product.originalPrice) *
            100
        );
    } else {
      product.discount = 0;
    }

    // ========================================
    // UPDATE IMAGE
    // ========================================

    if (req.file) {
      try {
        const result =
          await cloudinary.uploader.upload(
            req.file.path,
            {
              folder: "shopnest/products",
            }
          );

        product.imageUrl =
          result.secure_url;

        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (fileError) {
          console.warn(
            "Could not delete temporary file:",
            fileError.message
          );
        }
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary update failed:",
          cloudinaryError.message
        );

        return res.status(500).json({
          message:
            "Image upload failed.",
          error:
            cloudinaryError.message,
        });
      }
    }

    // ========================================
    // SAVE
    // ========================================

    const updatedProduct =
      await product.save();

    return res.status(200).json({
      message:
        "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    return res.status(500).json({
      message:
        "Error updating product",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================

const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return res.status(500).json({
      message:
        "Error deleting product",
      error: error.message,
    });
  }
};

// ==========================================
// GET DEALS
// ==========================================

const getDeals = async (req, res) => {
  try {
    const products =
      await Product.find({
        discount: {
          $gt: 0,
        },

        stock: {
          $gt: 0,
        },
      })
        .sort({
          discount: -1,
        })
        .limit(50);

    return res.status(200).json(products);
  } catch (error) {
    console.error(
      "Get deals error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch deals",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDeals,
};