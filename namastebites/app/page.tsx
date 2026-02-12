"use client";
import "./home.css";
import { Food } from "./types/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter()
  const [items, setItems] = useState<Food[]>([]);

  useEffect(() => {
    const data: Food[] = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        url: 'https://picsum.photos/seed/1234/400/400',
        name: 'Plain Samosa',
        price: 10,
        quantity: 0,
        id: Math.floor(Math.random() * 1000).toString()
      })
    }
    setItems(data);
  }, []);
  const addItem = useCallback((id: string) => {
    setItems(prev =>
      prev.map(t => t.id === id ? { ...t, quantity: t.quantity + 1 } : t)
    );
  }, []);
  const removeItem = useCallback((id: string) => {
    setItems(prev =>
      prev.map(t => t.id === id ? { ...t, quantity: t.quantity - 1 } : t)
    );
  }, []);
  function addButton(id: string, e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    addItem(id);
  }
  function removeButton(id: string, e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    removeItem(id);
  }
  const FoodList = () => {
    return items.map((t) => {
      return (
        <div className="item" key={t.id} onClick={() => router.push(`/item/${t.id}`)}>
          <div
            className="thumbnail"
            style={{
              backgroundImage: `url(${t.url})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
          <div className="item-description-container">
            {t.quantity === 0 ? (
              <>
                <div className="item-description">
                  <div className="item-name">{t.name}</div>
                  <div className="item-price">₹{t.price}</div>
                </div>
                <div className="add-to-cart">
                  <button className="item-button" onClick={(e) => addButton(t.id, e)}>+</button>
                </div>
              </>
            ) : (
              <div className="selected-item-description-container">
                <button className="item-button" onClick={(e) => removeButton(t.id, e)}>-</button>
                <div className="quantity">{t.quantity}</div>
                <button className="item-button" onClick={(e) => addButton(t.id, e)}>+</button>
              </div>
            )}
          </div>
        </div>
      )
    })
  }
  return (
    <>

      <div className="body">
        <div className="hero">
          <h1>NAMASTE BITES</h1>
        </div>
        <div className="p-2 items">
          <div className="header">Top Items</div>
          <div className="items-body">
            <FoodList />
          </div>
        </div>
      </div>
      {items.reduce((a, b) => a + b.price * b.quantity, 0) > 0 && (
        <div className="footer">
          <div className="px-2 py-1 max-w-[1200px] items-center gap-[10px] justify-between flex  mx-auto">
            <div className="flex justify-between w-full">
              <div className="text-lg">Subtotal</div>
              <div className="text-lg">₹{items.reduce((a, b) => a + b.price * b.quantity, 0)}</div>
            </div>
            <button className="max-w-[300px] w-full bg-red-600 text-white py-4 rounded-2xl active:scale-[0.95] transition duration-300 ease-in-out">
              CHECKOUT
            </button>
          </div>
        </div>
      )}
    </>
  );
}
