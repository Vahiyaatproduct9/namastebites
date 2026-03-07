import path from "@/app/path/path";
import { CartItem } from "@/app/types/types";

async function initiatePayment(items: CartItem[]) {
  const response = await fetch(`${path}/payment/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });
  const result = await response.json();
  return result;
}

const order = {
  initiatePayment,
};

export default order;
