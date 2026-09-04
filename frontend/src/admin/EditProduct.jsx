import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
const { id } = useParams();
const navigate = useNavigate();

const { user, loading: authLoading } = useContext(AuthContext);

const [formData, setFormData] = useState({
name: "",
description: "",
originalPrice: "",
price: "",
category: "",
stock: "",
});

const [currentImage, setCurrentImage] = useState("");
const [image, setImage] = useState(null);

const [loading, setLoading] = useState(true);
const [updating, setUpdating] = useState(false);
const [error, setError] = useState("");

// ==========================================
// CHECK ADMIN + FETCH PRODUCT
// ==========================================

useEffect(() => {
if (authLoading) return;

if (!user) {
  navigate("/admin-login", { replace: true });
  return;
}

if (user.role !== "admin") {
  alert("Access denied. Admin access is required.");
  navigate("/", { replace: true });
  return;
}

if (!user.token) {
  alert("Admin session expired. Please login again.");
  navigate("/admin-login", { replace: true });
  return;
}

const fetchProduct = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/products/${id}`);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Unable to load product."
      );
    }

    setFormData({
      name: data.name || "",
      description: data.description || "",
      originalPrice:
        data.originalPrice !== undefined
          ? data.originalPrice
          : data.price || "",
      price: data.price || "",
      category: data.category || "",
      stock:
        data.stock !== undefined
          ? data.stock
          : "",
    });

    setCurrentImage(data.imageUrl || "");
  } catch (err) {
    console.error("Fetch product error:", err);

    setError(
      err.message || "Failed to load product."
    );
  } finally {
    setLoading(false);
  }
};

fetchProduct();

}, [id, user, authLoading, navigate]);

// ==========================================
// HANDLE INPUT
// ==========================================

const handleChange = (e) => {
const { name, value } = e.target;

setFormData((previous) => ({
  ...previous,
  [name]: value,
}));

};

// ==========================================
// IMAGE CHANGE
// ==========================================

const handleImageChange = (e) => {
const selectedFile = e.target.files?.[0];

if (selectedFile) {
  setImage(selectedFile);
} else {
  setImage(null);
}

};

// ==========================================
// DISCOUNT
// ==========================================

const calculateDiscount = () => {
const original = Number(formData.originalPrice);
const price = Number(formData.price);

if (
  original > 0 &&
  price >= 0 &&
  price < original
) {
  return Math.round(
    ((original - price) / original) * 100
  );
}

return 0;

};

// ==========================================
// UPDATE PRODUCT
// ==========================================

const handleSubmit = async (e) => {
e.preventDefault();

setError("");

// Check admin
if (!user || user.role !== "admin") {
  alert("Admin access is required.");
  navigate("/admin-login");
  return;
}

// Check token
if (!user.token) {
  alert(
    "Admin session expired. Please login again."
  );

  navigate("/admin-login");
  return;
}

// Validate name
if (!formData.name.trim()) {
  setError("Product name is required.");
  return;
}

// Validate description
if (!formData.description.trim()) {
  setError("Product description is required.");
  return;
}

// Validate original price
const originalPrice = Number(
  formData.originalPrice
);

if (
  !formData.originalPrice ||
  originalPrice <= 0
) {
  setError(
    "Original price must be greater than 0."
  );
  return;
}

// Validate selling price
const price = Number(formData.price);

if (!formData.price || price <= 0) {
  setError(
    "Selling price must be greater than 0."
  );
  return;
}

// Validate price relationship
if (price > originalPrice) {
  setError(
    "Selling price cannot be higher than original price."
  );
  return;
}

// Validate category
if (!formData.category.trim()) {
  setError("Category is required.");
  return;
}

// Validate stock
const stock = Number(formData.stock);

if (
  formData.stock === "" ||
  stock < 0
) {
  setError(
    "Stock must be 0 or greater."
  );
  return;
}

const discount = calculateDiscount();

setUpdating(true);

try {
  // ========================================
  // CREATE FORM DATA
  // ========================================

  const data = new FormData();

  data.append(
    "name",
    formData.name.trim()
  );

  data.append(
    "description",
    formData.description.trim()
  );

  data.append(
    "originalPrice",
    originalPrice
  );

  data.append(
    "price",
    price
  );

  data.append(
    "discount",
    discount
  );

  data.append(
    "category",
    formData.category.trim()
  );

  data.append(
    "stock",
    stock
  );

  // Only send image if admin selected
  // a new image
  if (image) {
    data.append("image", image);
  }

  console.log(
    "Updating product:",
    id
  );

  // ========================================
  // SEND REQUEST
  // ========================================

  const res = await fetch(
    `/api/products/${id}`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${user.token}`,
      },

      body: data,
    }
  );

  // ========================================
  // READ RESPONSE
  // ========================================

  let responseData = {};

  try {
    responseData = await res.json();
  } catch (jsonError) {
    console.error(
      "Response JSON error:",
      jsonError
    );
  }

  console.log(
    "Update response:",
    responseData
  );

  // ========================================
  // SUCCESS
  // ========================================

  if (res.ok) {
    alert(
      `Product updated successfully!\n\nDiscount: ${discount}%`
    );

    navigate(
      "/admin/products",
      {
        replace: true,
      }
    );

    return;
  }

  // ========================================
  // AUTH ERROR
  // ========================================

  if (
    res.status === 401 ||
    res.status === 403
  ) {
    alert(
      "Your admin session is invalid or expired. Please login again."
    );

    localStorage.removeItem("userInfo");
    localStorage.removeItem("adminInfo");

    navigate(
      "/admin-login",
      {
        replace: true,
      }
    );

    return;
  }

  // ========================================
  // NOT FOUND
  // ========================================

  if (res.status === 404) {
    setError(
      responseData.message ||
      "Product not found."
    );

    return;
  }

  // ========================================
  // OTHER BACKEND ERROR
  // ========================================

  setError(
    responseData.message ||
    responseData.error ||
    `Update failed. Server returned ${res.status}.`
  );
} catch (err) {
  console.error(
    "Update product error:",
    err
  );

  setError(
    "Cannot connect to the server. Make sure your backend is running."
  );
} finally {
  setUpdating(false);
}

};

// ==========================================
// AUTH LOADING
// ==========================================

if (authLoading) {
return (
<div style={loadingPageStyle}>
Checking admin access...
</div>
);
}

// ==========================================
// PRODUCT LOADING
// ==========================================

if (loading) {
return (
<div style={loadingPageStyle}>
Loading product...
</div>
);
}

// ==========================================
// ACCESS CHECK
// ==========================================

if (!user || user.role !== "admin") {
return null;
}

// ==========================================
// UI
// ==========================================

return (
<div style={pageStyle}>
<div style={cardStyle}>

    {/* HEADER */}

    <div style={{ marginBottom: "25px" }}>
      <h2 style={titleStyle}>
        Edit Product
      </h2>

      <p style={subtitleStyle}>
        Update product details as administrator.
      </p>
    </div>

    {/* ERROR */}

    {error && (
      <div style={errorStyle}>
        ❌ {error}
      </div>
    )}

    {/* FORM */}

    <form
      onSubmit={handleSubmit}
      style={formStyle}
    >

      {/* NAME */}

      <div>
        <label style={labelStyle}>
          Product Name
        </label>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* DESCRIPTION */}

      <div>
        <label style={labelStyle}>
          Description
        </label>

        <textarea
          name="description"
          placeholder="Product Description"
          required
          rows="4"
          value={formData.description}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* ORIGINAL PRICE */}

      <div>
        <label style={labelStyle}>
          Original Price
        </label>

        <input
          type="number"
          name="originalPrice"
          placeholder="Example: 2999"
          min="1"
          required
          value={formData.originalPrice}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* SELLING PRICE */}

      <div>
        <label style={labelStyle}>
          Selling Price
        </label>

        <input
          type="number"
          name="price"
          placeholder="Example: 1999"
          min="1"
          required
          value={formData.price}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* DISCOUNT */}

      <div
        style={{
          padding: "14px",
          borderRadius: "8px",
          background:
            calculateDiscount() > 0
              ? "rgba(34,197,94,0.12)"
              : "rgba(255,255,255,0.04)",
          border:
            calculateDiscount() > 0
              ? "1px solid #22c55e"
              : "1px solid #27272a",
          color:
            calculateDiscount() > 0
              ? "#22c55e"
              : "#a1a1aa",
        }}
      >
        {calculateDiscount() > 0
          ? `🔥 ${calculateDiscount()}% OFF`
          : "No discount"}
      </div>

      {/* CATEGORY */}

      <div>
        <label style={labelStyle}>
          Category
        </label>

        <input
          type="text"
          name="category"
          placeholder="Example: Electronics"
          required
          value={formData.category}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* STOCK */}

      <div>
        <label style={labelStyle}>
          Stock Quantity
        </label>

        <input
          type="number"
          name="stock"
          placeholder="Example: 50"
          min="0"
          required
          value={formData.stock}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* CURRENT IMAGE */}

      {currentImage && (
        <div>
          <label style={labelStyle}>
            Current Product Image
          </label>

          <img
            src={currentImage}
            alt={formData.name}
            style={{
              width: "180px",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
              border:
                "1px solid #3f3f46",
              display: "block",
              marginBottom: "12px",
            }}
            onError={(e) => {
              e.currentTarget.style.display =
                "none";
            }}
          />
        </div>
      )}

      {/* NEW IMAGE */}

      <div
        style={{
          padding: "15px",
          border:
            "1px dashed #f97316",
          borderRadius: "8px",
        }}
      >
        <label style={labelStyle}>
          Replace Image (Optional)
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            color: "#fff",
            width: "100%",
          }}
        />

        {image && (
          <p
            style={{
              color: "#22c55e",
              fontSize: "13px",
              marginBottom: 0,
              marginTop: "10px",
            }}
          >
            ✓ New image selected:{" "}
            {image.name}
          </p>
        )}
      </div>

      {/* UPDATE BUTTON */}

      <button
        type="submit"
        disabled={updating}
        className="btn"
        style={{
          marginTop: "10px",
          cursor: updating
            ? "not-allowed"
            : "pointer",
          opacity: updating ? 0.7 : 1,
        }}
      >
        {updating
          ? "Updating Product..."
          : "Update Product"}
      </button>

      {/* CANCEL */}

      <button
        type="button"
        disabled={updating}
        onClick={() =>
          navigate("/admin/products")
        }
        style={{
          padding: "12px",
          background: "transparent",
          border:
            "1px solid #3f3f46",
          borderRadius: "7px",
          color: "#a1a1aa",
          cursor: updating
            ? "not-allowed"
            : "pointer",
        }}
      >
        ← Back to Products
      </button>

    </form>
  </div>
</div>

);
};

// ==========================================
// STYLES
// ==========================================

const pageStyle = {
minHeight: "70vh",
padding: "40px 20px",
background: "#09090b",
};

const cardStyle = {
maxWidth: "650px",
margin: "0 auto",
background: "#18181b",
padding: "40px",
borderRadius: "12px",
border:
"1px solid rgba(255,255,255,0.05)",
boxShadow:
"0 15px 40px rgba(0,0,0,0.25)",
};

const titleStyle = {
color: "#f97316",
margin: 0,
marginBottom: "8px",
};

const subtitleStyle = {
color: "#a1a1aa",
margin: 0,
};

const formStyle = {
display: "flex",
flexDirection: "column",
gap: "16px",
};

const labelStyle = {
display: "block",
marginBottom: "7px",
color: "#a1a1aa",
fontSize: "14px",
fontWeight: "500",
};

const inputStyle = {
width: "100%",
boxSizing: "border-box",
padding: "12px",
background: "#09090b",
border: "1px solid #27272a",
borderRadius: "6px",
color: "#fff",
fontSize: "15px",
outline: "none",
};

const errorStyle = {
padding: "12px",
marginBottom: "20px",
background: "rgba(239,68,68,0.1)",
border: "1px solid #ef4444",
borderRadius: "7px",
color: "#f87171",
fontSize: "14px",
};

const loadingPageStyle = {
minHeight: "70vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "#09090b",
color: "#f97316",
fontSize: "18px",
fontWeight: "600",
};

export default EditProduct;