"use client";
import Image from "next/image";
import "./home.css";
import { Food } from "./types/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter()
  const [items, setItems] = useState<Food[]>([]);

  useEffect(() => {
    const data: Food[] = [];
    for (let i = 0; i <= 5; i++) {
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
              <div className="w-full flex justify-between items-center">
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
      <section className="navbar">
        <div className="px-2 py-1">Namaste Bites</div>
      </section>
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
    </>
  );
}
