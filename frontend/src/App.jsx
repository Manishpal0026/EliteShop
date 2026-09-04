import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';

import AdminRoute from './components/AdminRoute';

// ==========================================
// COMMON COMPONENTS
// ==========================================

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ==========================================
// CUSTOMER PAGES
// ==========================================

import Home from './pages/home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// ==========================================
// AUTHENTICATION
// ==========================================

import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';

// ==========================================
// CUSTOMER ACCOUNT
// ==========================================

import Profile from './pages/Profile';
import OrderSuccess from './pages/OrderSuccess';

// ==========================================
// INFORMATION PAGES
// ==========================================

import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import ReturnPolicy from './pages/ReturnPolicy';

// ==========================================
// DEALS
// ==========================================

import Deals from './pages/Deals';

// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from './admin/AdminDashboard';
import AddProduct from './admin/AddProduct';
import AdminProducts from './admin/AdminProducts';
import EditProduct from './admin/EditProduct';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';


function App() {
  return (
    <Router>

      {/* ====================================
          NAVBAR
      ==================================== */}

      <Navbar />


      {/* ====================================
          MAIN CONTENT
      ==================================== */}

      <div className="main-content">

        <Routes>

          {/* ==================================
              CUSTOMER HOME
          ================================== */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* ==================================
              SHOP
          ================================== */}

          <Route
            path="/shop"
            element={<Shop />}
          />


          {/* ==================================
              PRODUCT DETAILS
          ================================== */}

          <Route
            path="/product/:id"
            element={<ProductDetail />}
          />


          {/* ==================================
              DEALS
          ================================== */}

          <Route
            path="/deals"
            element={<Deals />}
          />


          {/* ==================================
              CART
          ================================== */}

          <Route
            path="/cart"
            element={<Cart />}
          />


          <Route
          path="/wishlist"
          element={<Wishlist />}
          />

          {/* ==================================
              CHECKOUT
          ================================== */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />


          {/* ==================================
              CUSTOMER LOGIN
          ================================== */}

          <Route
            path="/login"
            element={<Login />}
          />


          {/* ==================================
              ADMIN LOGIN
          ================================== */}

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />


          {/* ==================================
              CUSTOMER REGISTRATION
          ================================== */}

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ==================================
              CUSTOMER PROFILE
          ================================== */}

          <Route
            path="/profile"
            element={<Profile />}
          />


          {/* ==================================
              ORDER SUCCESS
          ================================== */}

          <Route
            path="/order"
            element={<OrderSuccess />}
          />

          <Route
            path="/ordersuccess"
            element={<OrderSuccess />}
          />


          {/* ==================================
              ABOUT
          ================================== */}

          <Route
            path="/about"
            element={<About />}
          />

            <Route
            path="/contact"
            element={<Contact />}
          />
          {/* ==================================
              DISCLAIMER
          ================================== */}

          <Route
            path="/disclaimer"
            element={<Disclaimer />}
          />


          {/* ==================================
              RETURN POLICY
          ================================== */}

          <Route
            path="/return"
            element={<ReturnPolicy />}
          />


          {/* ==========================================
              PROTECTED ADMIN DASHBOARD
          ========================================== */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />


          {/* ==========================================
              PROTECTED ADMIN ADD PRODUCT
          ========================================== */}

          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />


          {/* ==========================================
              PROTECTED ADMIN PRODUCTS
          ========================================== */}

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />


          {/* ==========================================
              PROTECTED ADMIN EDIT PRODUCT
          ========================================== */}

          <Route
            path="/admin/edit-product/:id"
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />


          {/* ==========================================
              PROTECTED ADMIN ORDERS
          ========================================== */}

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />


          {/* ==========================================
              PROTECTED ADMIN USERS
          ========================================== */}

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />


          {/* ==========================================
              404 PAGE
          ========================================== */}

          <Route
            path="*"
            element={
              <div style={{
                padding: '50px',
                textAlign: 'center'
              }}>
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />

        </Routes>

      </div>


      {/* ====================================
          FOOTER
      ==================================== */}

      <Footer />

    </Router>
  );
}

export default App;

