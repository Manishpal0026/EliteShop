import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    removeFromCart,
    addToCart,
} from "../redux/cartSlice";
import "../styles/cart.css";

const Cart = () => {
    const cartItems = useSelector(
        (state) => state.cart.cartItems
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getQuantity = (item) =>
        Number(item.qty) ||
        Number(item.quantity) ||
        1;

    const getPrice = (item) =>
        Number(item.price) || 0;

    const totalItems = cartItems.reduce(
        (total, item) =>
            total + getQuantity(item),
        0
    );

    const totalPrice = cartItems.reduce(
        (total, item) =>
            total +
            getPrice(item) *
                getQuantity(item),
        0
    );

    const handleRemove = (item) => {
        dispatch(
            removeFromCart(
                item.productId ||
                    item._id
            )
        );
    };

    const handleUpdateQty = (
        item,
        quantity
    ) => {
        if (quantity <= 0) {
            handleRemove(item);
            return;
        }

        dispatch(
            addToCart({
                ...item,
                productId:
                    item.productId ||
                    item._id,
                qty: quantity,
            })
        );
    };

    return (
        <div className="cart-container">

            <h2>Shopping Cart</h2>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Add products to
                        continue shopping.
                    </p>

                    <Link to="/shop">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">

                    <div className="cart-items">

                        {cartItems.map(
                            (item) => {
                                const id =
                                    item.productId ||
                                    item._id;

                                const qty =
                                    getQuantity(
                                        item
                                    );

                                const price =
                                    getPrice(
                                        item
                                    );

                                return (
                                    <div
                                        key={id}
                                        className="cart-item"
                                    >
                                        <img
                                            src={
                                                item.imageUrl
                                            }
                                            alt={
                                                item.name
                                            }
                                            className="cart-item-image"
                                        />

                                        <div className="cart-item-details">

                                            <h4>
                                                {
                                                    item.name
                                                }
                                            </h4>

                                            <p>
                                                ₹
                                                {price.toFixed(
                                                    2
                                                )}
                                            </p>

                                            <div className="qty-controls">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleUpdateQty(
                                                            item,
                                                            qty -
                                                                1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>

                                                <span>
                                                    {
                                                        qty
                                                    }
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleUpdateQty(
                                                            item,
                                                            qty +
                                                                1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <p>
                                                Subtotal:
                                                ₹
                                                {(
                                                    price *
                                                    qty
                                                ).toFixed(
                                                    2
                                                )}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(
                                                        item
                                                    )
                                                }
                                                className="btn-remove"
                                            >
                                                Remove
                                            </button>

                                        </div>
                                    </div>
                                );
                            }
                        )}

                    </div>

                    <div className="cart-summary">

                        <h3>
                            Order Summary
                        </h3>

                        <p>
                            Total Products:{" "}
                            <strong>
                                {
                                    totalItems
                                }
                            </strong>
                        </p>

                        <p>
                            Product Cost:
                            <strong>
                                ₹
                                {totalPrice.toFixed(
                                    2
                                )}
                            </strong>
                        </p>

                        <p>
                            Delivery:
                            <strong>
                                FREE
                            </strong>
                        </p>

                        <hr />

                        <h2>
                            Total Amount:
                            ₹
                            {totalPrice.toFixed(
                                2
                            )}
                        </h2>

                        <button
                            type="button"
                            className="btn btn-checkout"
                            onClick={() =>
                                navigate(
                                    "/checkout"
                                )
                            }
                        >
                            Proceed to Checkout
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;