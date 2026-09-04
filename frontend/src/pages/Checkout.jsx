import React, {
    useState,
    useContext,
} from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";

const Checkout = () => {
    const { user } =
        useContext(AuthContext);

    const cartItems = useSelector(
        (state) => state.cart.cartItems
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [address, setAddress] =
        useState({
            fullName: "",
            street: "",
            city: "",
            postalCode: "",
            country: "",
            contact: "",
        });

    const quantity = (item) =>
        Number(item.qty) ||
        Number(item.quantity) ||
        1;

    const price = (item) =>
        Number(item.price) || 0;

    const totalPrice = cartItems.reduce(
        (total, item) =>
            total +
            price(item) *
                quantity(item),
        0
    );

    const totalItems = cartItems.reduce(
        (total, item) =>
            total + quantity(item),
        0
    );

    const handlePayment = async () => {
        if (!user) {
            alert(
                "Please login before placing your order."
            );

            navigate("/login");
            return;
        }

        if (!user.token) {
            alert(
                "Your session has expired. Please login again."
            );

            navigate("/login");
            return;
        }

        if (cartItems.length === 0) {
            alert(
                "Your cart is empty."
            );

            navigate("/shop");
            return;
        }

        setLoading(true);

        try {
            const items =
                cartItems.map((item) => ({
                    productId:
                        item.productId ||
                        item._id,

                    name:
                        item.name,

                    price:
                        price(item),

                    quantity:
                        quantity(item),

                    imageUrl:
                        item.imageUrl || "",
                }));

            const response =
                await fetch(
                    "/api/orders",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${user.token}`,
                        },

                        body: JSON.stringify({
                            items,

                            totalAmount:
                                totalPrice,

                            address,

                            paymentId:
                                "TEST_PAYMENT_" +
                                Date.now(),
                        }),
                    }
                );

            const data =
                await response.json();

            console.log(
                "Order response:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to create order"
                );
            }

            // Clear Redux cart
            dispatch(
                clearCart()
            );

            // Go to success page
            navigate(
                "/ordersuccess",
                {
                    state: {
                        order:
                            data.order,
                    },
                }
            );

        } catch (error) {
            console.error(
                "Order error:",
                error
            );

            alert(
                error.message ||
                    "Payment failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            alert(
                "Please login first."
            );

            navigate("/login");
            return;
        }

        handlePayment();
    };

    if (cartItems.length === 0) {
        return (
            <div
                style={{
                    textAlign:
                        "center",
                    padding:
                        "60px 20px",
                }}
            >
                <h2>
                    Your cart is empty
                </h2>

                <button
                    onClick={() =>
                        navigate(
                            "/shop"
                        )
                    }
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container">

            <h2>Checkout</h2>

            <div className="checkout-content">

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="shipping-form"
                >

                    <h3>
                        Shipping Address
                    </h3>

                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={
                            address.fullName
                        }
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                fullName:
                                    e.target.value,
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Street Address"
                        required
                        value={
                            address.street
                        }
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                street:
                                    e.target.value,
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="City"
                        required
                        value={
                            address.city
                        }
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                city:
                                    e.target.value,
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Postal Code"
                        required
                        value={
                            address.postalCode
                        }
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                postalCode:
                                    e.target.value,
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Country"
                        required
                        value={
                            address.country
                        }
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                country:
                                    e.target.value,
                            })
                        }
                    />

                    <input
                        type="tel"
                        placeholder="Contact Number"
                        required
                        value={
                            address.contact
                        }
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                contact:
                                    e.target.value,
                            })
                        }
                    />

                    {/* =====================
                        ORDER SUMMARY
                    ====================== */}

                    <div
                        className="checkout-summary"
                    >

                        <h3>
                            Order Summary
                        </h3>

                        <p>
                            Total Products:{" "}
                            {totalItems}
                        </p>

                        <p>
                            Product Cost: ₹
                            {totalPrice.toFixed(
                                2
                            )}
                        </p>

                        <p>
                            Delivery: FREE
                        </p>

                        <hr />

                        <h2>
                            Total to Pay: ₹
                            {totalPrice.toFixed(
                                2
                            )}
                        </h2>

                        <button
                            type="submit"
                            className="btn"
                            disabled={
                                loading
                            }
                        >
                            {loading
                                ? "Processing Order..."
                                : "Pay Now"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default Checkout;