"use client";
import React from "react";
import "./cart.css";
import { useCart } from "@store/useCart";
const Cart = () => {
  const cart = useCart((s) => s.cart);
  const getTotalPrice = useCart((s) => s.getTotalPrice);
  const increaseQuantity = useCart((s) => s.addToCart);
  const decreaseQuantity = useCart((s) => s.decreaseQuantity);
  const CartBody = () =>
    cart.map((t) => {
      const incrementItem = (
        id: string,
        e: React.MouseEvent<HTMLButtonElement>,
      ) => {
        const item = cart.find((t) => t.id === id)!;
        e.preventDefault();
        increaseQuantity(item);
      };
      const decrementItem = (
        id: string,
        e: React.MouseEvent<HTMLButtonElement>,
      ) => {
        e.preventDefault();
        decreaseQuantity(id);
      };
      return (
        <div key={t.id} className="item-body">
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
  return (
    <div className="cart">
      <div className="flex-body">
        <div className="body-1">
          <div className="cart-head">
            <h1 className="text-2xl font-bold">Cart</h1>
          </div>
          <div className="cart-body">
            <div className="cart-items">
              <CartBody />
            </div>
          </div>
          <div className="cart-footer"></div>
        </div>
        <div className="body-2">
          <div className="checkout">
            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

