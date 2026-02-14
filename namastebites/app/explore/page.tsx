'use client';
import Image from "next/image";
import Items from "../components/items"
import { Food } from "../types/types";
import "./explore.css"
import { useCart } from "../store/useCart";
import { useEffect } from "react";
import PriceFooter from "../components/priceFooter/priceFooter";
const Explore = () => {
  const items: Food[] = [];
  for (let i = 0; i < 5; i++) {
    items.push({
      id: i.toString(),
      name: "Item " + i,
      price: i * 10 + 13,
      url: 'https://picsum.photos/seed/1234/400/400',
      quantity: 0
    })
  }
  const cart = useCart(s => s.cart);
  const addToCart = useCart(s => s.addToCart);
  const decreaseQuantity = useCart(s => s.decreaseQuantity);
  useEffect(() => {
    console.log('cart: ', cart);
  }, [cart]);
  const addButton = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(items.find(t => t.id === id)!);
  }
  const removeButton = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    decreaseQuantity(id);
  }
  return (
    <div className="explore-container">
      <div className="explore">
        <div className="explore-header">
          <h1 className="explore-text">Explore</h1>
        </div>
        <div className="explore-search">
          <input type="text" placeholder="Search" />
        </div>
        <div className="explore-body">
          <Items className="" items={items} Component={({ item }) => {
            return (
              <div style={{ backgroundImage: `url(${item.url})` }} className="item-container">
                <div className="item-description-container">
                  {[0, undefined, -1].includes(cart.find(t => t.id === item.id)?.quantity) ? (
                    <>
                      <div className="item-description">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">₹{item.price}</div>
                      </div>
                      <div className="add-to-cart">
                        <button className="item-button"
                          onClick={(e) => addButton(item.id, e)}
                        >+</button>
                      </div>
                    </>
                  ) : (
                    <div className="selected-item-description-container">
                      <button className="item-button"
                        onClick={(e) => removeButton(item.id, e)}
                      >-</button>
                      <div className="quantity">{cart.find(t => t.id === item.id)?.quantity || 1}</div>
                      <button className="item-button"
                        onClick={(e) => addButton(item.id, e)}
                      >+</button>
                    </div>
                  )}
                </div>

              </div>
            )
          }} />
        </div>
      </div>
      <PriceFooter />
    </div>
  )
}

export default Explore;