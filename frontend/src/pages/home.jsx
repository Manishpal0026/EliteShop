import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        const featuredProducts = data
          .filter((product) => product.isFeatured)
          .slice(0, 4);

        setProducts(
          featuredProducts.length
            ? featuredProducts
            : data.slice(0, 4)
        );
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">

      {/* =====================================================
          SHOPNEST BANNER CAROUSEL
      ====================================================== */}

      <Banner />


      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}

      <section className="featured-section">

        <div className="featured-header">
          <h2>Featured Products</h2>

          <p>
            Explore our handpicked products just for you.
          </p>
        </div>


        {loading ? (

          <div className="loading-message">
            Loading products...
          </div>

        ) : products.length > 0 ? (

          <div className="product-grid">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        ) : (

          <div className="no-products">
            <h3>No Featured Products Found</h3>

            <p>
              Check back soon for our latest products.
            </p>
          </div>

        )}

      </section>

    </div>
  );
};

export default Home;

