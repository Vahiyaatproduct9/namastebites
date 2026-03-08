"use client";
import "./home.css";
import { Food } from "./types/types";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PriceFooter from "./components/priceFooter/priceFooter";
import { getItems } from "./functions/api/explore/explore";
import Items from "./components/Items/items";
import { useCart } from "./store/useCart";
export default function Home() {
  const router = useRouter();
  const [items, setItems] = useState<Food[]>([]);
  const cart = useCart((s) => s.cart);
  const addToCart = useCart((s) => s.addToCart);
  const addItem = useCallback(
    (id: string) => {
      addToCart(items.find((t) => t.id === id)!);
    },
    [addToCart, items],
  );
  const removeItem = useCart((s) => s.decreaseQuantity);
  function addButton(id: string, e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    addItem(id);
  }
  function removeButton(id: string, e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    removeItem(id);
  }
  useEffect(() => {
    const items: Food[] = [];
    getItems({ limit: 5 }).then((res) => {
      if (res.status === 200) {
        res.data?.items.map((item) => {
          items.push({
            id: item.item_id.toString(),
            name: item.name,
            price: Number(item.price),
            url: item.image_url,
            quantity: 0,
          });
        });
      }
      setItems(items);
    });
  }, []);

  return (
    <>
      <div className="body">
        <div className="hero">
          <h1>NAMASTE BITES</h1>
        </div>
        <div className="p-2 items-container">
          <div className="header">Top Items</div>
          <div className="items">
            <div className="items-body">
              <Items
                items={items}
                Component={({ item: t }) => {
                  const itemInfo = cart.find((item) => item.id === t.id);
                  return (
                    <div
                      className="item"
                      style={{ backgroundImage: `url(${t.url})` }}
                      key={t.id}
                      onClick={() => router.push(`/item/${t.id}`)}
                    >
                      <div className="item-description-container">
                        {[0, undefined, -1].includes(itemInfo?.quantity) ? (
                          <>
                            <div className="item-description">
                              <div className="item-name">{t.name}</div>
                              <div className="item-price">₹{t.price}</div>
                            </div>
                            <div className="add-to-cart">
                              <button
                                className="item-button"
                                onClick={(e) => addButton(t.id, e)}
                              >
                                +
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="selected-item-description-container">
                            <button
                              className="item-button"
                              onClick={(e) => removeButton(t.id, e)}
                            >
                              -
                            </button>
                            <div className="quantity">
                              {itemInfo?.quantity || 0}
                            </div>
                            <button
                              className="item-button"
                              onClick={(e) => addButton(t.id, e)}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
          <div className="explore-section">
            <div className="explore-content">
              <h2 className="explore-title">Discover More Flavors</h2>
              <p className="explore-description">
                Explore our complete menu with hundreds of delicious dishes
              </p>
              <button
                className="explore-button"
                onClick={() => router.push("/explore")}
              >
                <span className="button-text">Explore Full Menu</span>
                <span className="material-symbols-outlined arrow-icon">
                  arrow_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <PriceFooter />
    </>
  );
}
