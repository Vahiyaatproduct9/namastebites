"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "./thankyou.css";

const ThankYouContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams.get("amount");
  const mode = searchParams.get("mode");

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <div className="icon-container">
          <span className="material-symbols-outlined check-icon">
            check_circle
          </span>
        </div>
        <h1>Thank You for Your Order!</h1>
        <p className="message">
          Your delicious meal is being prepared and will be with you shortly.
        </p>

        <div className="order-details">
          <div className="detail-row">
            <span>Amount {mode === "cod" ? "to be Paid" : "Paid"}</span>
            <span className="amount">₹{amount}</span>
          </div>
          <div className="detail-row">
            <span>Payment Mode</span>
            <span className="mode">
              {mode === "cod" ? "Cash on Delivery" : "Online Payment"}
            </span>
          </div>
        </div>

        <div className="actions">
          <button className="home-btn" onClick={() => router.push("/explore")}>
            Continue Exploring
          </button>
          <button className="orders-btn" onClick={() => router.push("/orders")}>
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

const ThankYou = () => {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
};

export default ThankYou;
