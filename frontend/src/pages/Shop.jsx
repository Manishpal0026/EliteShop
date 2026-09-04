import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const Shop = () => {
  console.log('SHOP PAGE IS LOADED');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read search/category from URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  );

  const [category, setCategory] = useState(
    searchParams.get('category') || 'All'
  );

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState('newest');


  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch('/api/products');

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }

      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // ==========================================
  // SYNC URL → SEARCH/CATEGORY
  // ==========================================

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'All';

    setSearch(urlSearch);
    setCategory(urlCategory);

  }, [searchParams]);


  // ==========================================
  // UNIQUE CATEGORIES
  // ==========================================

  const categories = [
    'All',
    ...new Set(
      Array.isArray(products)
        ? products
            .map((product) => product?.category)
            .filter(
              (categoryName) =>
                typeof categoryName === 'string' &&
                categoryName.trim() !== ''
            )
        : []
    )
  ];


  // ==========================================
  // SAFE HELPERS
  // ==========================================

  const safeText = (value) =>
    typeof value === 'string' ? value : '';

  const safeNumber = (value) => {
    const num = Number(value);

    return Number.isFinite(num)
      ? num
      : 0;
  };


  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  let filteredProducts = (
    Array.isArray(products)
      ? products
      : []
  ).filter((product) => {

    const productName =
      safeText(product?.name);

    const productDescription =
      safeText(product?.description);

    const productCategory =
      safeText(product?.category);

    const productPrice =
      safeNumber(product?.price);

    const productRating =
      safeNumber(product?.ratings);

    const productStock =
      safeNumber(product?.stock);


    // ------------------------------------------
    // SEARCH
    // ------------------------------------------

    const searchValue =
      search.trim().toLowerCase();

    const matchesSearch =
      searchValue === '' ||
      productName
        .toLowerCase()
        .includes(searchValue) ||
      productDescription
        .toLowerCase()
        .includes(searchValue) ||
      productCategory
        .toLowerCase()
        .includes(searchValue);


    // ------------------------------------------
    // CATEGORY
    // ------------------------------------------

    const matchesCategory =
      category === 'All' ||
      productCategory.toLowerCase() ===
        category.toLowerCase();


    // ------------------------------------------
    // MIN PRICE
    // ------------------------------------------

    const matchesMinPrice =
      minPrice === '' ||
      productPrice >= Number(minPrice);


    // ------------------------------------------
    // MAX PRICE
    // ------------------------------------------

    const matchesMaxPrice =
      maxPrice === '' ||
      productPrice <= Number(maxPrice);


    // ------------------------------------------
    // RATING
    // ------------------------------------------

    const matchesRating =
      rating === 0 ||
      productRating >= Number(rating);


    // ------------------------------------------
    // STOCK
    // ------------------------------------------

    const matchesStock =
      !inStock ||
      productStock > 0;


    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesRating &&
      matchesStock
    );
  });


  // ==========================================
  // SORT PRODUCTS
  // ==========================================

  filteredProducts = [
    ...filteredProducts
  ].sort((a, b) => {

    const aPrice =
      safeNumber(a?.price);

    const bPrice =
      safeNumber(b?.price);

    const aRating =
      safeNumber(a?.ratings);

    const bRating =
      safeNumber(b?.ratings);

    const aName =
      safeText(a?.name);

    const bName =
      safeText(b?.name);


    switch (sort) {

      case 'price-low':
        return aPrice - bPrice;


      case 'price-high':
        return bPrice - aPrice;


      case 'rating':
        return bRating - aRating;


      case 'name':
        return aName.localeCompare(bName);


      case 'newest':
      default: {

        const aDate =
          new Date(
            a?.createdAt || 0
          ).getTime();

        const bDate =
          new Date(
            b?.createdAt || 0
          ).getTime();

        return bDate - aDate;
      }
    }
  });


  // ==========================================
  // HANDLE SEARCH
  // ==========================================

  const handleSearchChange = (e) => {

    const value = e.target.value;

    setSearch(value);

    const newParams =
      new URLSearchParams(searchParams);

    if (value.trim()) {

      newParams.set(
        'search',
        value
      );

    } else {

      newParams.delete('search');

    }

    setSearchParams(newParams);
  };


  // ==========================================
  // HANDLE CATEGORY
  // ==========================================

  const handleCategoryChange = (value) => {

    setCategory(value);

    const newParams =
      new URLSearchParams(searchParams);

    if (value && value !== 'All') {

      newParams.set(
        'category',
        value
      );

    } else {

      newParams.delete('category');

    }

    setSearchParams(newParams);
  };


  // ==========================================
  // CLEAR ALL FILTERS
  // ==========================================

  const clearFilters = () => {

    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setRating(0);
    setInStock(false);
    setSort('newest');

    setSearchParams({});
  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="shop-container">


      {/* ======================================
          HEADER
      ======================================= */}

      <div className="shop-header">

        <div>

          <h2>
            {search
              ? `Search Results for "${search}"`
              : category !== 'All'
                ? `${category} Products`
                : 'All Products'}
          </h2>

          <p>
            Showing {filteredProducts.length} of{' '}
            {products.length} products
          </p>

        </div>


        {/* SORT */}

        <div className="sort-container">

          <label htmlFor="sort">
            Sort by:
          </label>

          <select
            id="sort"
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >

            <option value="newest">
              Newest
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>

            <option value="name">
              Name: A-Z
            </option>

          </select>

        </div>

      </div>


      {/* ======================================
          SEARCH
      ======================================= */}

      <div
        style={{
          marginBottom: '25px'
        }}
      >

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          className="search-bar"
        />

      </div>


      {/* ======================================
          SHOP CONTENT
      ======================================= */}

      <div className="shop-content">


        {/* ====================================
            FILTER SIDEBAR
        ===================================== */}

        <aside className="filter-sidebar">

          <div className="filter-header">

            <h3>
              Filters
            </h3>

            <button
              type="button"
              onClick={clearFilters}
              className="clear-filter-btn"
            >
              Clear All
            </button>

          </div>


          {/* CATEGORY */}

          <div className="filter-section">

            <h4>
              Category
            </h4>

            {categories.map((cat) => (

              <label
                key={cat}
                className="filter-option"
              >

                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={
                    category === cat
                  }
                  onChange={(e) =>
                    handleCategoryChange(
                      e.target.value
                    )
                  }
                />

                <span>
                  {cat}
                </span>

              </label>

            ))}

          </div>


          {/* PRICE */}

          <div className="filter-section">

            <h4>
              Price Range
            </h4>

            <div className="price-inputs">

              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                min="0"
                onChange={(e) =>
                  setMinPrice(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                min="0"
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* RATING */}

          <div className="filter-section">

            <h4>
              Rating
            </h4>

            {[4, 3, 2, 1].map(
              (value) => (

                <label
                  key={value}
                  className="filter-option"
                >

                  <input
                    type="radio"
                    name="rating"
                    checked={
                      rating === value
                    }
                    onChange={() =>
                      setRating(value)
                    }
                  />

                  <span>

                    {'★'.repeat(value)}

                    {'☆'.repeat(
                      5 - value
                    )}

                    {' & above'}

                  </span>

                </label>

              )
            )}


            <label
              className="filter-option"
            >

              <input
                type="radio"
                name="rating"
                checked={
                  rating === 0
                }
                onChange={() =>
                  setRating(0)
                }
              />

              <span>
                All Ratings
              </span>

            </label>

          </div>


          {/* STOCK */}

          <div className="filter-section">

            <h4>
              Availability
            </h4>

            <label
              className="filter-option"
            >

              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) =>
                  setInStock(
                    e.target.checked
                  )
                }
              />

              <span>
                In Stock Only
              </span>

            </label>

          </div>

        </aside>


        {/* ====================================
            PRODUCTS
        ===================================== */}

        <main className="products-section">

          {loading ? (

            <div className="loading-message">

              Loading products...

            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="no-products">

              <h3>
                No products found
              </h3>

              <p>

                {search
                  ? `We couldn't find any products matching "${search}".`
                  : 'Try changing your filters or search.'}

              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="clear-filter-btn"
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="product-grid">

              {filteredProducts.map(
                (product) => (

                  <ProductCard
                    key={product._id}
                    product={product}
                  />

                )
              )}

            </div>

          )}

        </main>

      </div>

    </div>
  );
};

export default Shop;