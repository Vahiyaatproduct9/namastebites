'use client';
import { Usable, use } from "react"
import "./item.css"
import { useCart } from "@/app/store/useCart";
import PriceFooter from "@/app/components/priceFooter/priceFooter";

const Item = ({ params }: { params: Usable<{ item: string }> }) => {
  const { item } = use<{ item: string }>(params);
  const itemData = {
    id: item,
    name: 'Plain Samosa',
    url: 'https://picsum.photos/seed/1234/400/400',
    price: 10,
    description: "This is a delicious item. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  };
  const increaseQuantity = useCart(s => s.addToCart)
  const decreaseQuantity = useCart(s => s.decreaseQuantity);
  const cart = useCart(s => s.cart);
  const selectedItem = cart.find((t) => t.id === item);
  return (
    <div className="item">
      <div className="flex-body">
        <div className="body-1">
          <div className="thumbnail" style={{backgroundImage: `url('https://picsum.photos/seed/1234/400/400')`}} />
          <div className="flex justify-between items-center">
            <h1 className="item-name">{itemData.name}</h1>
            <p className="item-price">₹{itemData.price}</p>
          </div>
        </div>
        <div className="body-2">
          <div className="info-container">
            <div className="description">
              <h1>Description</h1>
              <p>{itemData.description}</p>
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
                onClick={() => increaseQuantity(itemData)}
                >+</button>
                {selectedItem?.quantity || 1}
                <button onClick={() => decreaseQuantity(item)}>-</button>
              </div>
            ) : (
              <button
              onClick={() => increaseQuantity(itemData)}
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