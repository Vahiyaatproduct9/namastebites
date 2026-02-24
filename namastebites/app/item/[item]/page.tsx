'use client';
import { Usable, use, useEffect, useState } from "react"
import "./item.css"
import { useCart } from "@/app/store/useCart";
import PriceFooter from "@/app/components/priceFooter/priceFooter";
import { exploreItemType } from "@/app/types/types";
import { getItem } from "@/app/functions/api/explore/explore";

const Item = ({ params }: { params: Usable<{ item: string }> }) => {
  const { item: id } = use<{ item: string }>(params);
  const [item, setItem] = useState<exploreItemType>();
  const cart = useCart(s => s.cart)
  useEffect(() => {
    getItem({single: id}).then((res) => {
      console.log(res);
      if (res.status === 200 && res.data) {
        setItem(res.data.item);
      } else {
        console.error('Failed to fetch item');
      }
    });
  }, [id])
  const decreaseQuantity = () => useCart.getState().decreaseQuantity(id);
  const incrementQuantity = (item?: exploreItemType) => {
    if (!item) return;
    useCart.getState().addToCart({
      name: item.name,
      id: item.item_id.toString(),
      price: parseFloat(item.price),
      url: item.image_url,
    });
  }
  const selectedItem = cart.find((t) => t.id === id);
  return (
    <div className="item">
      <div className="flex-body">
        <div className="body-1">
          <div className="thumbnail" style={{backgroundImage: item?.image_url ? `url('${item.image_url}')` : 'none'}} />
          <div className="flex justify-between items-center">
            <h1 className="item-name">{item?.name}</h1>
            <p className="item-price">₹{item?.price}</p>
          </div>
        </div>
        <div className="body-2">
          <div className="info-container">
            <div className="description">
              <h1>Description</h1>
              <p>{item?.description}</p>
            </div>
            <div className="info">
              {/* <span>
                <h1>Price</h1>
                <p>{itemData.price}</p>
              </span> */}
            </div>
          </div>
          <div className="actions">
            {selectedItem?.quantity ? (
              <div className="quantity">
                <button
                onClick={() => incrementQuantity(item)}
                >+</button>
                {selectedItem?.quantity || 1}
                <button onClick={decreaseQuantity}>-</button>
              </div>
            ) : (
              <button
              onClick={() => incrementQuantity(item)}
              className="add-button">
                Add to Plate
              </button>
            )}
          </div>
        </div>
      </div>
      <PriceFooter />
    </div>
  )
}

export default Item;