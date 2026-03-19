/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useState } from "react";
import "./cart.css";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/store/useCart";
import Script from "next/script";
import { CartItem, Food } from "../types/types";
import Order from "@api/payment/orders";
import useMessage from "../store/useMessage";
import { useUser } from "@clerk/nextjs";
import { useLocation } from "../store/useLocation";
import useProfile from "../store/useProfile";

const Cart = () => {
  const { user } = useUser();
  const { phone } = useProfile();
  const router = useRouter();
  const setMessage = useMessage((s) => s.setMessage);
  const cart = useCart((s) => s.cart);
  const getTotalPrice = useCart((s) => s.getTotalPrice);
  const [instruction, setInstruction] = useState<string>("");
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<"online" | "cod">("online");
  const [loading, setLoading] = useState(false);

  const { locations, currentLocationId } = useLocation();
  const currentLocation = locations.find((l) => l.id === currentLocationId);
  const isProfileComplete = phone && phone.length >= 10 && phone.length <= 11;
  useEffect(() => {
    const total = getTotalPrice();
    setTotalPrice(total);
  }, [cart, getTotalPrice]);

  const goToExplore = () => {
    router.push("/explore");
  };
  const goToSettings = () => {
    router.push("/settings?fromCart=true");
  };
  const checkout = async () => {
    if (!currentLocation) {
      setMessage("Please select a delivery location first!");
      router.push("/settings?fromCart=true");
      return;
    }
    setLoading(true);
    try {
      const data: CartItem[] = cart;
      if (paymentMode === "cod") {
        const response = await Order.PaymentCashOnDelivery({
          data,
          instruction,
          user_id: user?.id || "",
        });
        console.log("payment response: ", response);
        if (response) {
          useCart.getState().clearCart();
          router.push(`/thankyou?amount=${totalPrice}&mode=cod`);
        }
      } else if (paymentMode === "online") {
        const response = await Order.PaymentOnline({
          data,
          instruction,
          user: {
            id: user?.id || "",
            name: user?.fullName || "",
            phone: phone || "",
            email: user?.emailAddresses[0]?.emailAddress || "",
          },
        });
        console.log("Payment Response: ", response);
        if (response) {
          router.push(`/thankyou?amount=${totalPrice}&mode=online`);
        }
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setMessage("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("instruction updated!", instruction);
  }, [instruction]);
  return (
    <div className="cart">
      <Script
        id="razorpay"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => console.log("Script Loaded!")}
      />
      <div className="cart-head">
        <h1 className="text-2xl font-bold">Cart</h1>
      </div>
      <div className="flex-body">
        <div className="body-1">
          {totalPrice === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>Add some delicious items to your cart!</p>
              <button className="explore-button" onClick={goToExplore}>
                Explore
              </button>
            </div>
          ) : (
            <div className="cart-body">
              <div className="cart-items">
                <CartBody
                  goToItem={(id) => router.push(`/item/${id}`)}
                  cart={cart}
                />
              </div>
            </div>
          )}
        </div>
        {totalPrice > 0 && (
          <div className="body-2">
            <div className="checkout">
              <div>
                <div className="checkout-header">
                  <h2>Checkout</h2>
                </div>
                <div className="checkout-info">
                  <span>
                    <text>Name</text>
                    <text>{user?.fullName || "Guest"}</text>
                  </span>
                  <span>
                    <text>Location</text>
                    <text>
                      {currentLocation ? (
                        `${currentLocation.address}, ${currentLocation.city}${currentLocation.landmark ? ` (Near ${currentLocation.landmark})` : ""}`
                      ) : (
                        <span style={{ color: "#ff4d4d" }}>
                          No delivery location selected
                        </span>
                      )}
                      <button
                        className="change-location-btn"
                        onClick={goToSettings}
                      >
                        {currentLocation ? "Change" : "Add Location"}
                      </button>
                    </text>
                  </span>
                  <span>
                    <text>Delivery Time</text>
                    <text>20-30 minutes</text>
                  </span>
                </div>
              </div>
              <div className="checkout-final">
                <div className="payment-mode-selection">
                  <h3>Payment Method</h3>
                  <div className="payment-mode-options">
                    <label
                      className={`payment-mode-option ${paymentMode === "online" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        value="online"
                        checked={paymentMode === "online"}
                        onChange={(e) =>
                          setPaymentMode(e.target.value as "online" | "cod")
                        }
                      />
                      <span className="mode-label">
                        <span className="mode-icon">💳</span>
                        <span className="mode-text">Online Payment</span>
                      </span>
                    </label>
                    <label
                      className={`payment-mode-option ${paymentMode === "cod" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        value="cod"
                        checked={paymentMode === "cod"}
                        onChange={(e) =>
                          setPaymentMode(e.target.value as "online" | "cod")
                        }
                      />
                      <span className="mode-label">
                        <span className="mode-icon">💵</span>
                        <span className="mode-text">Cash on Delivery</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="special-instructions">
                  <textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="Add any special instructions for your order..."
                  />
                </div>
                {!currentLocation && (
                  <p
                    style={{
                      color: "#ff4d4d",
                      marginBottom: "10px",
                      textAlign: "center",
                      fontSize: "0.9rem",
                    }}
                  >
                    Please set your delivery location to proceed.
                  </p>
                )}
                {!isProfileComplete && (
                  <p
                    style={{
                      color: "#ff4d4d",
                      marginBottom: "10px",
                      textAlign: "center",
                      fontSize: "0.9rem",
                    }}
                  >
                    Please add your phone number in settings to proceed.
                  </p>
                )}
                <p>Delivery charges will be calculated at checkout</p>
                <div className="checkout-total">
                  <div className="checkout-total-label">Total</div>
                  <div className="checkout-total-value">₹{totalPrice}</div>
                </div>
                <div className="checkout-button-container">
                  {!currentLocation || !isProfileComplete ? (
                    <button
                      className="checkout-button"
                      onClick={goToSettings}
                      style={{ background: "var(--color-primary)" }}
                    >
                      Complete Profile in Settings
                    </button>
                  ) : (
                    <button
                      className="checkout-button"
                      disabled={totalPrice === 0 || loading}
                      style={{
                        opacity: (totalPrice === 0 || loading) ? 0.5 : 1,
                        cursor: (totalPrice === 0 || loading) ? "not-allowed" : "pointer",
                      }}
                      onClick={checkout}
                    >
                      {loading ? (
                        <div className="loading-spinner-small"></div>
                      ) : "Proceed to Checkout"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CartBody = (props: {
  cart: Food[];
  goToItem: (itemId: string) => void;
}) => {
  const increaseQuantity = useCart((s) => s.addToCart);
  const decreaseQuantity = useCart((s) => s.decreaseQuantity);
  const incrementItem = (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const item = props.cart.find((t) => t.id === id)!;
    e.stopPropagation();
    increaseQuantity(item);
  };
  const decrementItem = (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    decreaseQuantity(id);
  };

  return props.cart.map((t) => {
    return (
      <div
        key={t.id}
        className="item-body"
        onClick={() => props.goToItem(t.id)}
      >
        <div
          className="thumbnail"
          style={{ backgroundImage: `url(${t.url})` }}
        />
        <div className="item-details">
          <div className="details">
            <div className="item-name">{t.name}</div>
            <div className="item-price">₹{t.price * t.quantity}</div>
          </div>
          <div className="quantity">
            <button onClick={(e) => decrementItem(t.id, e)}>-</button>
            <div>{t.quantity}</div>
            <button onClick={(e) => incrementItem(t.id, e)}>+</button>
          </div>
        </div>
      </div>
    );
  });
};

export default Cart;
