import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const Deals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "/api/products/deals"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch deals"
                    );
                }

                const data =
                    await response.json();

                setProducts(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Deals error:",
                    error
                );

                setError(
                    "Unable to load deals."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                }}
            >
                <h2>Loading Deals...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                    textAlign: "center",
                }}
            >
                <div>
                    <h2>{error}</h2>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                        style={{
                            marginTop:
                                "15px",
                            padding:
                                "10px 20px",
                            border: "none",
                            borderRadius:
                                "5px",
                            cursor:
                                "pointer",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding:
                    "30px 20px 60px",
            }}
        >
            {/* Header */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom:
                        "35px",
                }}
            >
                <h1>
                    🔥 Today's Best Deals
                </h1>

                <p
                    style={{
                        color: "#666",
                        marginTop:
                            "10px",
                    }}
                >
                    Grab amazing products
                    at discounted prices.
                </p>
            </div>

            {/* No Deals */}
            {products.length === 0 ? (
                <div
                    style={{
                        textAlign:
                            "center",
                        padding:
                            "60px 20px",
                    }}
                >
                    <h2>
                        No deals available
                    </h2>

                    <p
                        style={{
                            color:
                                "#777",
                        }}
                    >
                        Check back later
                        for new offers.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display:
                            "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {products.map(
                        (product) => (
                            <ProductCard
                                key={
                                    product._id
                                }
                                product={
                                    product
                                }
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Deals;