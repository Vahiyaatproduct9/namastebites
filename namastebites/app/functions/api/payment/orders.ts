import path from "@/app/path/path";
import { CartItem, JsonResponse, RazorPayVerify } from "@/app/types/types";
import withResult from "../../internal/withResult";
import useMessage from "@/app/store/useMessage";
import { useCart } from "@/app/store/useCart";
const setMessage = useMessage.getState().setMessage;
const setType = useMessage.getState().setType;
const clearCart = useCart.getState().clearCart;
const defaultErrMsg = "Something went wrong!";
async function initiatePayment(data: {
  data: CartItem[],
  instruction: string,
  user_id: string,
}) {
  const response = withResult(
    fetch(`${path}/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: data.data,
        special_instruction: data.instruction,
        user_id: data.user_id
      }),
    }),
  );
  return response;
}
async function verifyPayment(ids: RazorPayVerify) {
  const data = {
    ...ids,
    user_id: "test user",
  };
  const response = await fetch(`${path}/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    setMessage("Payment verification failed!");
    return new Error("Payment verification failed!");
  }
  const {success, data: result, message}: JsonResponse = await response.json();
  setType(success ? "success" : "error");
  setMessage(message || defaultErrMsg);
  if (!success) {
    return new Error(message || defaultErrMsg);
  }
  clearCart();
  return result;
}

const order = {
  initiatePayment,
  verifyPayment,
};

export default order;
