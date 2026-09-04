import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

const Wishlist = () => {
const navigate = useNavigate();

const [wishlist, setWishlist] = useState([]);

// ==========================================
// LOAD WISHLIST
// ==========================================

useEffect(() => {
loadWishlist();


// Update wishlist if another component changes it
const handleWishlistUpdate = () => {
  loadWishlist();
};

window.addEventListener(
  "wishlistUpdated",
  handleWishlistUpdate
);

return () => {
  window.removeEventListener(
    "wishlistUpdated",
    handleWishlistUpdate
  );
};


}, []);

const loadWishlist = () => {
try {
const savedWishlist =
localStorage.getItem("shopnestWishlist");


  if (savedWishlist) {
    const parsedWishlist =
      JSON.parse(savedWishlist);

    if (Array.isArray(parsedWishlist)) {
      setWishlist(parsedWishlist);
    } else {
      setWishlist([]);
    }
  } else {
    setWishlist([]);
  }
} catch (error) {
  console.error(
    "Error loading wishlist:",
    error
  );

  setWishlist([]);
}


};

// ==========================================
// REMOVE PRODUCT
// ==========================================

const removeFromWishlist = (productId) => {
const updatedWishlist = wishlist.filter(
(product) =>
product._id !== productId
);


setWishlist(updatedWishlist);

localStorage.setItem(
  "shopnestWishlist",
  JSON.stringify(updatedWishlist)
);

window.dispatchEvent(
  new Event("wishlistUpdated")
);


};

// ==========================================
// CLEAR WISHLIST
// ==========================================

const clearWishlist = () => {
if (wishlist.length === 0) return;


const confirmed = window.confirm(
  "Are you sure you want to remove all wishlist products?"
);

if (!confirmed) return;

setWishlist([]);

localStorage.removeItem(
  "shopnestWishlist"
);

window.dispatchEvent(
  new Event("wishlistUpdated")
);


};

// ==========================================
// ADD TO CART
// ==========================================

const addToCart = (product) => {
try {
const savedCart =
localStorage.getItem("cartItems");


  let cart = [];

  if (savedCart) {
    const parsedCart =
      JSON.parse(savedCart);

    if (Array.isArray(parsedCart)) {
      cart = parsedCart;
    }
  }

  const existingProduct =
    cart.find(
      (item) =>
        item._id === product._id
    );

  if (existingProduct) {
    existingProduct.quantity =
      (existingProduct.quantity || 1) + 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem(
    "cartItems",
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  alert(
    `${product.name} added to cart!`
  );
} catch (error) {
  console.error(
    "Add to cart error:",
    error
  );

  alert(
    "Unable to add product to cart."
  );
}


};

// ==========================================
// EMPTY WISHLIST
// ==========================================

if (wishlist.length === 0) {
return (
<div
style={{
minHeight: "70vh",
background: "#09090b",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: "40px 20px",
}}
>
<div
style={{
textAlign: "center",
maxWidth: "500px",
}}
>
<div
style={{
width: "90px",
height: "90px",
margin: "0 auto 20px",
borderRadius: "50%",
background:
"rgba(249,115,22,0.1)",
display: "flex",
justifyContent: "center",
alignItems: "center",
}}
> <Heart
           size={45}
           color="#f97316"
         /> </div>


      <h2
        style={{
          color: "#fff",
          marginBottom: "10px",
        }}
      >
        Your Wishlist is Empty
      </h2>

      <p
        style={{
          color: "#a1a1aa",
          marginBottom: "25px",
        }}
      >
        Save products you love and
        come back to them later.
      </p>

      <button
        onClick={() => navigate("/shop")}
        style={{
          padding: "12px 25px",
          border: "none",
          borderRadius: "7px",
          background: "#f97316",
          color: "#fff",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Continue Shopping
      </button>
    </div>
  </div>
);


}

// ==========================================
// WISHLIST PAGE
// ==========================================

return (
<div
style={{
minHeight: "70vh",
background: "#09090b",
padding: "40px 20px",
}}
>
<div
style={{
maxWidth: "1200px",
margin: "0 auto",
}}
>


    {/* HEADER */}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "15px",
      }}
    >
      <div>
        <h1
          style={{
            color: "#fff",
            margin: 0,
          }}
        >
          My Wishlist ❤️
        </h1>

        <p
          style={{
            color: "#a1a1aa",
            marginTop: "8px",
          }}
        >
          {wishlist.length}{" "}
          {wishlist.length === 1
            ? "product"
            : "products"}{" "}
          saved
        </p>
      </div>

      <button
        onClick={clearWishlist}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "10px 15px",
          background: "transparent",
          border:
            "1px solid #3f3f46",
          borderRadius: "7px",
          color: "#f87171",
          cursor: "pointer",
        }}
      >
        <Trash2 size={17} />
        Clear Wishlist
      </button>
    </div>

    {/* PRODUCTS */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px",
      }}
    >
      {wishlist.map((product) => {
        const price =
          Number(product.price) || 0;

        const originalPrice =
          Number(
            product.originalPrice
          ) || price;

        const discount =
          originalPrice > price
            ? Math.round(
                ((originalPrice - price) /
                  originalPrice) *
                  100
              )
            : 0;

        return (
          <div
            key={product._id}
            style={{
              background: "#18181b",
              border:
                "1px solid #27272a",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}
          >

            {/* REMOVE */}

            <button
              onClick={() =>
                removeFromWishlist(
                  product._id
                )
              }
              title="Remove from wishlist"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 2,
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                background:
                  "rgba(0,0,0,0.7)",
                color: "#f87171",
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Heart
                size={19}
                fill="#f87171"
              />
            </button>

            {/* IMAGE */}

            <Link
              to={`/product/${product._id}`}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x400?text=Product";
                }}
              />
            </Link>

            {/* DETAILS */}

            <div
              style={{
                padding: "16px",
              }}
            >
              <p
                style={{
                  color: "#f97316",
                  fontSize: "12px",
                  fontWeight: "600",
                  margin: "0 0 6px",
                }}
              >
                {product.category}
              </p>

              <Link
                to={`/product/${product._id}`}
                style={{
                  textDecoration: "none",
                }}
              >
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    margin:
                      "0 0 10px",
                    lineHeight: "1.4",
                  }}
                >
                  {product.name}
                </h3>
              </Link>

              {/* PRICE */}

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "8px",
                  marginBottom:
                    "12px",
                }}
              >
                <strong
                  style={{
                    color: "#fff",
                    fontSize: "19px",
                  }}
                >
                  ₹{price.toLocaleString(
                    "en-IN"
                  )}
                </strong>

                {discount > 0 && (
                  <>
                    <span
                      style={{
                        color:
                          "#71717a",
                        textDecoration:
                          "line-through",
                        fontSize: "13px",
                      }}
                    >
                      ₹
                      {originalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <span
                      style={{
                        color:
                          "#22c55e",
                        fontSize: "12px",
                        fontWeight:
                          "600",
                      }}
                    >
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* CART BUTTON */}

              <button
                onClick={() =>
                  addToCart(product)
                }
                disabled={
                  Number(product.stock) <=
                  0
                }
                style={{
                  width: "100%",
                  padding: "11px",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  gap: "8px",
                  border: "none",
                  borderRadius: "7px",
                  background:
                    Number(product.stock) >
                    0
                      ? "#f97316"
                      : "#3f3f46",
                  color: "#fff",
                  fontWeight: "600",
                  cursor:
                    Number(product.stock) >
                    0
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                <ShoppingCart
                  size={17}
                />

                {Number(product.stock) >
                0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>


);

}
export default Wishlist;
