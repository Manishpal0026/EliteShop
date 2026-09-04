import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../styles/product.css";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const safeName =
        typeof product?.name === "string"
            ? product.name
            : "Unnamed Product";

    const safePrice =
        Number(product?.price) || 0;

    const safeOriginalPrice =
        Number(product?.originalPrice) || 0;

    const safeDiscount =
        Number(product?.discount) || 0;

    const safeImage =
        product?.imageUrl ||
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";

    const safeId = product?._id || "unknown";

    const [isWishlisted, setIsWishlisted] =
        useState(false);

    // Check wishlist
    useEffect(() => {
        const checkWishlist = () => {
            try {
                const wishlist =
                    JSON.parse(
                        localStorage.getItem(
                            "shopnestWishlist"
                        )
                    ) || [];

                setIsWishlisted(
                    wishlist.some(
                        (item) =>
                            item._id === safeId
                    )
                );
            } catch (error) {
                console.error(
                    "Wishlist error:",
                    error
                );
            }
        };

        checkWishlist();

        window.addEventListener(
            "wishlistUpdated",
            checkWishlist
        );

        return () => {
            window.removeEventListener(
                "wishlistUpdated",
                checkWishlist
            );
        };
    }, [safeId]);

    // Wishlist
    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (safeId === "unknown") {
            alert("Invalid product");
            return;
        }

        let wishlist =
            JSON.parse(
                localStorage.getItem(
                    "shopnestWishlist"
                )
            ) || [];

        const exists = wishlist.some(
            (item) =>
                item._id === safeId
        );

        if (exists) {
            wishlist = wishlist.filter(
                (item) =>
                    item._id !== safeId
            );

            setIsWishlisted(false);
        } else {
            wishlist.push(product);
            setIsWishlisted(true);
        }

        localStorage.setItem(
            "shopnestWishlist",
            JSON.stringify(wishlist)
        );

        window.dispatchEvent(
            new Event("wishlistUpdated")
        );
    };

    // Add to Redux Cart
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (safeId === "unknown") {
            alert("Invalid product");
            return;
        }

        dispatch(
            addToCart({
                ...product,
                productId: safeId,
                qty: 1,
            })
        );

        alert(
            `${safeName} added to cart!`
        );
    };

    return (
        <div className="product-card">

            <div className="product-image-container">

                <Link
                    to={`/product/${safeId}`}
                >
                    <img
                        src={safeImage}
                        alt={safeName}
                        className="product-image"
                    />
                </Link>

                <button
                    type="button"
                    className={`wishlist-btn ${
                        isWishlisted
                            ? "active"
                            : ""
                    }`}
                    onClick={
                        handleWishlist
                    }
                    title={
                        isWishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                    }
                >
                    <Heart
                        size={22}
                        fill={
                            isWishlisted
                                ? "currentColor"
                                : "none"
                        }
                    />
                </button>

                {safeDiscount > 0 && (
                    <span
                        style={{
                            position:
                                "absolute",
                            left: "10px",
                            top: "10px",
                            background:
                                "#e53935",
                            color: "#fff",
                            padding:
                                "5px 8px",
                            borderRadius:
                                "4px",
                            fontSize:
                                "12px",
                            fontWeight:
                                "600",
                        }}
                    >
                        {safeDiscount}% OFF
                    </span>
                )}
            </div>

            <div className="product-info">

                <h3 className="product-name">
                    {safeName}
                </h3>

                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        alignItems:
                            "center",
                        marginBottom:
                            "12px",
                    }}
                >
                    <span className="product-price">
                        ₹
                        {safePrice.toFixed(
                            2
                        )}
                    </span>

                    {safeOriginalPrice >
                        safePrice && (
                        <span
                            style={{
                                textDecoration:
                                    "line-through",
                                color: "#888",
                            }}
                        >
                            ₹
                            {safeOriginalPrice.toFixed(
                                2
                            )}
                        </span>
                    )}
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap:
                            "wrap",
                    }}
                >
                    <Link
                        to={`/product/${safeId}`}
                        className="product-link"
                    >
                        View Details
                    </Link>

                    <button
                        type="button"
                        onClick={
                            handleAddToCart
                        }
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "6px",
                            padding:
                                "8px 12px",
                            border: "none",
                            borderRadius:
                                "5px",
                            background:
                                "#ff9f00",
                            color: "#fff",
                            cursor:
                                "pointer",
                        }}
                    >
                        <ShoppingCart
                            size={17}
                        />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;