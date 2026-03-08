import path from "@/app/path/path";
import { CartItem } from "@/app/types/types";
import withResult from "../../internal/withResult";

async function initiatePayment(items: CartItem[]) {
  const response = withResult(
    fetch(`${path}/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    }),
  );
  return response;
}
async function verifyPayment(ids: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  const data = {
    ...ids,
    user_id: "test user",
  };
  const response = withResult(
    fetch(`${path}/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
  );
  return response;
}

const order = {
  initiatePayment,
  verifyPayment,
};

export default order;
