import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import "./Navbar.css";

const Navbar = ({ cartCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const navigate = useNavigate();

  const categories = [
    "Electronics",
    "Mobiles",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books",
    "Grocery",
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchTerm.trim();

    if (!value) return;

    navigate(`/shop?search=${encodeURIComponent(value)}`);

    setSearchTerm("");
    setMobileMenu(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
    setCategoryOpen(false);
    setMobileMenu(false);
  };

  return (
    <>
      <header className="navbar">

        {/* ================= MAIN NAVBAR ================= */}

        <div className="navbar-container">

          {/* LOGO */}

          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🛍️</span>

            <span className="logo-text">
              Shop<span>Nest</span>
            </span>
          </Link>


          {/* SEARCH */}

          <form
            className="navbar-search"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search products, brands and more..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button type="submit">
              <Search size={20} />
            </button>
          </form>


          {/* DESKTOP ACTIONS */}

          <div className="navbar-actions">

            <Link to="/login" className="nav-login">
              <User size={20} />

              <span>Login</span>
            </Link>


            <Link to="/wishlist" className="nav-action">

              <Heart size={21} />

              <span>Wishlist</span>

            </Link>


            <Link
              to="/cart"
              className="nav-action cart-action"
            >

              <div className="cart-icon-wrapper">

                <ShoppingCart size={22} />

                {cartCount > 0 && (
                  <span className="cart-badge">
                    {cartCount}
                  </span>
                )}

              </div>

              <span>Cart</span>

            </Link>

          </div>


          {/* MOBILE MENU BUTTON */}

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>

        </div>


        {/* ================= CATEGORY BAR ================= */}

        <div className="category-bar">

          <div className="category-container">

            <Link
              to="/"
              className="category-link"
            >
              Home
            </Link>


            <Link
              to="/shop"
              className="category-link"
            >
              Shop
            </Link>


            {/* CATEGORY DROPDOWN */}

            <div
              className="category-dropdown"
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => setCategoryOpen(false)}
            >

              <button
                className="category-link category-button"
                onClick={() =>
                  setCategoryOpen(!categoryOpen)
                }
              >
                Categories

                <ChevronDown size={16} />
              </button>


              {categoryOpen && (

                <div className="dropdown-menu">

                  {categories.map((category) => (

                    <button
                      key={category}
                      className="dropdown-item"
                      onClick={() =>
                        handleCategoryClick(category)
                      }
                    >
                      {category}
                    </button>

                  ))}

                </div>

              )}

            </div>


            <Link
              to="/deals"
              className="category-link"
            >
              Deals
            </Link>


            <Link
              to="/about"
              className="category-link"
            >
              About
            </Link>


            <Link
              to="/contact"
              className="category-link"
            >
              Contact
            </Link>

          </div>

        </div>

      </header>


      {/* ================= MOBILE MENU ================= */}

      {mobileMenu && (

        <div className="mobile-menu">

          <Link
            to="/"
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>


          <Link
            to="/shop"
            onClick={() => setMobileMenu(false)}
          >
            Shop
          </Link>


          <Link
            to="/wishlist"
            onClick={() => setMobileMenu(false)}
          >
            <Heart size={18} />
            Wishlist
          </Link>


          <Link
            to="/cart"
            onClick={() => setMobileMenu(false)}
          >
            <ShoppingCart size={18} />
            Cart ({cartCount})
          </Link>


          <Link
            to="/login"
            onClick={() => setMobileMenu(false)}
          >
            <User size={18} />
            Login / Register
          </Link>


          <div className="mobile-categories">

            <strong>Categories</strong>

            {categories.map((category) => (

              <button
                key={category}
                onClick={() =>
                  handleCategoryClick(category)
                }
              >
                {category}
              </button>

            ))}

          </div>

        </div>

      )}

    </>
  );
};

export default Navbar;