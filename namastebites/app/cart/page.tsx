/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import React, { useEffect } from "react";
import "./cart.css"
import { useRouter } from "next/navigation";
import { useCart } from "@store/useCart"
import { Food } from "../types/types";
const Cart = () => {
  const router = useRouter();
  const cart = useCart(s => s.cart);
  const getTotalPrice = useCart(s => s.getTotalPrice);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);

  useEffect(() => {
    const total = getTotalPrice();
    setTotalPrice(total);
  }, [cart, getTotalPrice])
  

  const goToExplore = () => {
    router.push("/explore");
  }

  return (
    <div className="cart">
          <div className="cart-head">
            <h1 className="text-2xl font-bold">Cart</h1>
          </div>
      <div className="flex-body">
        <div className="body-1">
            {totalPrice === 0 ? (
              <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some delicious items to your cart!</p>
                <button className="explore-button" onClick={goToExplore}>Explore</button>
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
                  <text>John Doe</text>
                </span>
                <span>
                  <text>Location</text>
                  <text>Street 1, Aurora Lane, Kolkata, West Bengal, 700001</text>
                </span>
                <span>
                  <text>Delivery Time</text>
                  <text>20-30 minutes</text>
                </span>
              </div>
              </div>
              <div className="checkout-final">
                <div className="special-instructions">
                  <textarea placeholder="Add any special instructions for your order..."></textarea>
                </div>
                <p>Delivery charges will be calculated at checkout</p>
                <div className="checkout-total">
                  <div className="checkout-total-label">Total</div>
                  <div className="checkout-total-value">₹{totalPrice}</div>
                </div>
                <div className="checkout-button-container">
                  <button className="checkout-button"
                    disabled={totalPrice === 0}
                    style={{ opacity: totalPrice === 0 ? 0.5 : 1, cursor: totalPrice === 0 ? 'not-allowed' : 'pointer' }}
                    onClick={() => {}}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

  const CartBody = (props: {
    cart: Food[];
    goToItem: (itemId: string) => void;
  }) => {
  const increaseQuantity = useCart(s => s.addToCart);
  const decreaseQuantity = useCart(s => s.decreaseQuantity);
  const incrementItem = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const item = props.cart.find(t => t.id === id)!;
    e.stopPropagation();
    increaseQuantity(item);
  }
  const decrementItem = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    decreaseQuantity(id);
  }
    
    return props.cart.map(t => {
    return (
      <div key={t.id} className="item-body" onClick={() => props.goToItem(t.id)}>
        <div className="thumbnail" style={{ backgroundImage: `url(${t.url})` }} />
        <div className="item-details">
          <div className="details">
            <div className="item-name">{t.name}</div>
            <div className="item-price">₹{t.price * t.quantity}</div>
          </div>
          <div className="quantity">
            <button onClick={e => decrementItem(t.id, e)}>-</button>
            <div>{t.quantity}</div>
            <button onClick={e => incrementItem(t.id, e)}>+</button>
          </div>
        </div>
      </div>
    )
  })
  }


export default Cart;