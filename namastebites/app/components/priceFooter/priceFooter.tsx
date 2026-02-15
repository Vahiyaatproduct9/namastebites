/* eslint-disable react-hooks/set-state-in-effect */
import { useCart } from "@/app/store/useCart"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./price-footer.css"
const PriceFooter = () => {
  const router = useRouter()
  const cart = useCart(s => s.cart);
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const getTotalPrice = useCart(s => s.getTotalPrice)
  useEffect(() => {
    setTotalPrice(getTotalPrice())
  }, [cart, getTotalPrice])
  const checkout = () => {
    router.push('/cart')
  }
  return totalPrice > 0 ? (
    <div className="footer">
      <div className="px-2 py-1 max-w-300 items-center gap-2.5 justify-between flex  mx-auto">
        <div className="flex flex-col justify-between w-full">
          <div className="text-lg">Subtotal</div>
          <div className="text-lg">₹{totalPrice}</div>
        </div>
        <button
          onClick={checkout}
          className="max-w-75 w-full bg-red-600 text-white py-4 rounded-2xl active:scale-[0.95] transition duration-300 ease-in-out font-extrabold">
          CHECKOUT
        </button>
      </div>
    </div>
  ) : null
}

export default PriceFooter;