import React, {
  useState,
  useContext,
  useEffect
} from 'react';

import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const AddProduct = () => {

  const {
    user,
    loading: authLoading
  } = useContext(AuthContext);

  const navigate = useNavigate();


  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    price: '',
    category: '',
    stock: ''
  });


  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);


  // ==========================================
  // GET USER ROLE
  // ==========================================

  const userRole =
    user?.role ||
    user?.user?.role;


  // ==========================================
  // CHECK ADMIN ACCESS
  // ==========================================

  useEffect(() => {

    if (authLoading) {
      return;
    }


    // No logged-in user
    if (!user) {

      console.log(
        'AddProduct: No logged-in user'
      );

      navigate('/admin-login', {
        replace: true
      });

      return;
    }


    // User is not admin
    if (userRole !== 'admin') {

      console.log(
        'AddProduct: Access denied. Role:',
        userRole
      );

      alert(
        'Access denied. Admin access is required.'
      );

      navigate('/', {
        replace: true
      });

    }

  }, [
    user,
    userRole,
    authLoading,
    navigate
  ]);


  // ==========================================
  // LOADING
  // ==========================================

  if (authLoading) {

    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#09090b',
          color: '#f97316',
          fontSize: '18px',
          fontWeight: '600'
        }}
      >
        Checking admin access...
      </div>
    );

  }


  // ==========================================
  // DON'T SHOW TO NON-ADMIN
  // ==========================================

  if (!user || userRole !== 'admin') {
    return null;
  }


  // ==========================================
  // GET TOKEN
  // ==========================================

  const token =
    user?.token ||
    user?.user?.token;


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // ==========================================
  // HANDLE IMAGE
  // ==========================================

  const handleImageChange = (e) => {

    const selectedFile =
      e.target.files?.[0];


    if (!selectedFile) {

      setImage(null);

      return;
    }


    // Check image type
    if (
      !selectedFile.type.startsWith('image/')
    ) {

      alert(
        'Please select a valid image file.'
      );

      e.target.value = '';

      setImage(null);

      return;
    }


    // 5 MB limit
    if (
      selectedFile.size > 5 * 1024 * 1024
    ) {

      alert(
        'Image size must be less than 5 MB.'
      );

      e.target.value = '';

      setImage(null);

      return;
    }


    setImage(selectedFile);

  };


  // ==========================================
  // CALCULATE DISCOUNT
  // ==========================================

  const calculateDiscount = () => {

    const original =
      Number(formData.originalPrice);

    const selling =
      Number(formData.price);


    if (
      original > 0 &&
      selling > 0 &&
      selling < original
    ) {

      return Math.round(
        ((original - selling) / original) * 100
      );

    }


    return 0;
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // ========================================
    // ADMIN CHECK
    // ========================================

    if (!user || userRole !== 'admin') {

      alert(
        'Admin access is required.'
      );

      navigate('/admin-login');

      return;
    }


    // ========================================
    // TOKEN CHECK
    // ========================================

    if (!token) {

      console.error(
        'AddProduct: Token missing.',
        user
      );

      alert(
        'Admin session expired. Please login again.'
      );

      navigate('/admin-login');

      return;
    }


    // ========================================
    // IMAGE CHECK
    // ========================================

    if (!image) {

      alert(
        'Please select a product image.'
      );

      return;
    }


    // ========================================
    // REQUIRED FIELD CHECKS
    // ========================================

    if (!formData.name.trim()) {

      alert(
        'Please enter product name.'
      );

      return;
    }


    if (!formData.description.trim()) {

      alert(
        'Please enter product description.'
      );

      return;
    }


    if (!formData.category.trim()) {

      alert(
        'Please enter product category.'
      );

      return;
    }


    if (
      formData.stock === '' ||
      formData.stock === null
    ) {

      alert(
        'Please enter stock quantity.'
      );

      return;
    }


    // ========================================
    // NUMERIC VALUES
    // ========================================

    const originalPrice =
      Number(formData.originalPrice);

    const price =
      Number(formData.price);

    const stock =
      Number(formData.stock);


    // ========================================
    // PRICE VALIDATION
    // ========================================

    if (
      !Number.isFinite(originalPrice) ||
      originalPrice <= 0
    ) {

      alert(
        'Original price must be greater than 0.'
      );

      return;
    }


    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {

      alert(
        'Selling price must be greater than 0.'
      );

      return;
    }


    if (price > originalPrice) {

      alert(
        'Selling price cannot be higher than original price.'
      );

      return;
    }


    // ========================================
    // STOCK VALIDATION
    // ========================================

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {

      alert(
        'Stock cannot be negative.'
      );

      return;
    }


    // ========================================
    // DISCOUNT
    // ========================================

    const discount =
      calculateDiscount();


    // ========================================
    // START LOADING
    // ========================================

    setLoading(true);


    // ========================================
    // CREATE FORM DATA
    // ========================================

    const data = new FormData();


    data.append(
      'name',
      formData.name.trim()
    );


    data.append(
      'description',
      formData.description.trim()
    );


    data.append(
      'originalPrice',
      String(originalPrice)
    );


    data.append(
      'price',
      String(price)
    );


    data.append(
      'discount',
      String(discount)
    );


    data.append(
      'category',
      formData.category.trim()
    );


    data.append(
      'stock',
      String(stock)
    );


    data.append(
      'image',
      image
    );


    // ========================================
    // DEBUG FORM DATA
    // ========================================

    console.log(
      '======================================'
    );

    console.log(
      'CREATING PRODUCT'
    );

    console.log(
      '======================================'
    );

    console.log(
      'Name:',
      formData.name
    );

    console.log(
      'Category:',
      formData.category
    );

    console.log(
      'Original Price:',
      originalPrice
    );

    console.log(
      'Selling Price:',
      price
    );

    console.log(
      'Discount:',
      discount
    );

    console.log(
      'Stock:',
      stock
    );

    console.log(
      'Image:',
      image
    );

    console.log(
      'Token exists:',
      !!token
    );


    // ========================================
    // SEND REQUEST
    // ========================================

    try {

      const res = await fetch(
        '/api/products',
        {
          method: 'POST',

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: data
        }
      );


      // ======================================
      // READ RESPONSE
      // ======================================

      const responseText =
        await res.text();


      console.log(
        'Product API status:',
        res.status
      );

      console.log(
        'Product API response:',
        responseText
      );


      let responseData = {};

      try {

        responseData =
          responseText
            ? JSON.parse(responseText)
            : {};

      } catch (error) {

        console.error(
          'Response was not JSON:',
          responseText
        );

      }


      // ======================================
      // SUCCESS
      // ======================================

      if (res.ok) {

        console.log(
          'PRODUCT CREATED SUCCESSFULLY:',
          responseData
        );


        alert(
          `Product created successfully!\n\nDiscount: ${discount}%`
        );


        // Clear form

        setFormData({
          name: '',
          description: '',
          originalPrice: '',
          price: '',
          category: '',
          stock: ''
        });


        setImage(null);


        // Reset file input if present
        const fileInput =
          document.getElementById(
            'product-image'
          );

        if (fileInput) {
          fileInput.value = '';
        }


        // Go to admin products
        navigate(
          '/admin/products'
        );


        return;
      }


      // ======================================
      // UNAUTHORIZED
      // ======================================

      if (
        res.status === 401 ||
        res.status === 403
      ) {

        console.error(
          'Authentication/authorization error:',
          responseData
        );


        localStorage.removeItem(
          'userInfo'
        );

        localStorage.removeItem(
          'adminInfo'
        );


        alert(
          responseData.message ||
          'Your admin session is invalid or expired. Please login again.'
        );


        navigate(
          '/admin-login',
          {
            replace: true
          }
        );


        return;
      }


      // ======================================
      // SERVER ERROR
      // ======================================

      const serverMessage =
        responseData.message ||
        responseData.error ||
        responseData.errors ||
        responseText;


      console.error(
        'PRODUCT CREATION FAILED:',
        serverMessage
      );


      alert(
        `Error creating product.\n\nServer response: ${
          serverMessage ||
          'Unknown server error'
        }`
      );

    }

    catch (error) {

      console.error(
        'Create product network error:',
        error
      );


      alert(
        'Cannot connect to the server. Please make sure your backend is running.'
      );

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // CURRENT DISCOUNT
  // ==========================================

  const currentDiscount =
    calculateDiscount();


  // ==========================================
  // UI
  // ==========================================

  return (

    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        background: '#18181b',
        padding: '40px',
        borderRadius: '12px',
        border:
          '1px solid rgba(255,255,255,0.05)',
        boxShadow:
          '0 15px 40px rgba(0,0,0,0.25)'
      }}
    >

      {/* TITLE */}

      <div
        style={{
          marginBottom: '25px'
        }}
      >

        <h2
          style={{
            color: '#f97316',
            marginBottom: '8px'
          }}
        >
          Add New Product
        </h2>


        <p
          style={{
            color: '#a1a1aa',
            margin: 0
          }}
        >
          Logged in as admin:{' '}
          {user?.name ||
            user?.user?.name ||
            user?.email ||
            'Administrator'}
        </p>

      </div>


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}
      >

        {/* PRODUCT NAME */}

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
        />


        {/* DESCRIPTION */}

        <textarea
          name="description"
          placeholder="Description"
          required
          rows="4"
          value={formData.description}
          onChange={handleChange}
          style={inputStyle}
        />


        {/* ORIGINAL PRICE */}

        <div>

          <label style={labelStyle}>
            Original Price
          </label>

          <input
            type="number"
            name="originalPrice"
            placeholder="Example: 2999"
            required
            min="1"
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
            placeholder="Example: 1499"
            required
            min="1"
            value={formData.price}
            onChange={handleChange}
            style={inputStyle}
          />

        </div>


        {/* DISCOUNT */}

        <div
          style={{
            padding: '15px',
            borderRadius: '8px',
            background:
              currentDiscount > 0
                ? 'rgba(34,197,94,0.12)'
                : 'rgba(255,255,255,0.04)',
            border:
              currentDiscount > 0
                ? '1px solid #22c55e'
                : '1px solid #27272a',
            color:
              currentDiscount > 0
                ? '#22c55e'
                : '#a1a1aa'
          }}
        >

          {currentDiscount > 0 ? (

            <>
              🔥 Deal Product

              <strong
                style={{
                  marginLeft: '10px',
                  fontSize: '18px'
                }}
              >
                {currentDiscount}% OFF
              </strong>
            </>

          ) : (

            'Enter an original price and lower selling price to create a deal.'

          )}

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
            required
            min="0"
            value={formData.stock}
            onChange={handleChange}
            style={inputStyle}
          />

        </div>


        {/* IMAGE */}

        <div
          style={{
            padding: '15px',
            border:
              '1px dashed #f97316',
            borderRadius: '8px'
          }}
        >

          <label
            htmlFor="product-image"
            style={{
              display: 'block',
              marginBottom: '10px',
              color: '#a1a1aa'
            }}
          >
            Upload Product Image
          </label>


          <input
            id="product-image"
            type="file"
            accept="image/*"
            required
            onChange={handleImageChange}
            style={{
              color: '#fff',
              width: '100%'
            }}
          />


          {image && (

            <p
              style={{
                marginTop: '10px',
                marginBottom: 0,
                color: '#22c55e',
                fontSize: '13px'
              }}
            >
              ✓ Selected: {image.name}
            </p>

          )}

        </div>


        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{
            marginTop: '10px',
            cursor:
              loading
                ? 'not-allowed'
                : 'pointer',
            opacity:
              loading
                ? 0.7
                : 1
          }}
        >

          {loading
            ? 'Uploading & Creating...'
            : currentDiscount > 0
              ? `Publish Deal (${currentDiscount}% OFF)`
              : 'Publish Product'}

        </button>


        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate('/admin')
          }
          disabled={loading}
          style={{
            padding: '11px',
            background: 'transparent',
            border:
              '1px solid #3f3f46',
            borderRadius: '7px',
            color: '#a1a1aa',
            cursor: loading
              ? 'not-allowed'
              : 'pointer'
          }}
        >
          ← Back to Admin Dashboard
        </button>

      </form>

    </div>

  );
};


// ==========================================
// INPUT STYLE
// ==========================================

const inputStyle = {

  width: '100%',

  boxSizing: 'border-box',

  padding: '12px',

  background: '#09090b',

  border:
    '1px solid #27272a',

  borderRadius: '6px',

  color: '#fff',

  fontSize: '15px',

  outline: 'none'

};


// ==========================================
// LABEL STYLE
// ==========================================

const labelStyle = {

  display: 'block',

  marginBottom: '7px',

  color: '#a1a1aa',

  fontSize: '14px',

  fontWeight: '500'

};


export default AddProduct;

