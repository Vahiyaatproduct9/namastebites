/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "@/app/path/path";
import { CartItem, JsonResponse, RazorPayVerify } from "@/app/types/types";
import withResult from "../../internal/withResult";
import useMessage from "@/app/store/useMessage";
import { useCart } from "@/app/store/useCart";
import { NEXT_PUBLIC_RZP_KEY } from "@/app/env";
const setMessage = useMessage.getState().setMessage;
const setType = useMessage.getState().setType;
const clearCart = useCart.getState().clearCart;
const defaultErrMsg = "Something went wrong!";
// 2 function
// online Payment
// offline Payment

/*
 * Used for offline payments
 */
async function PaymentCashOnDelivery(data: {
  data: CartItem[];
  instruction: string;
  user_id: string;
}) {
  const response = await withResult(
    fetch(`${path}/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: data.data,
        special_instructions: data.instruction,
        user_id: data.user_id,
        mode: "cash_on_delivery",
      }),
    }),
  );
  return response;
}

/*
 * Used for online payments
 */
async function PaymentOnline(data: {
  data: CartItem[];
  instruction: string;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}): Promise<boolean> {
  const response = await initiatePaymentOnline({
    items: data.data,
    instruction: data.instruction,
    user_id: data.user.id,
  });
  const { order } = response;
  const rzpScreenData = {
    order,
    user: data.user,
    instruction: data.instruction,
  };
  if (!order) {
    setMessage("No Order Found. Make sure you have listed your orders.");
    return false;
  }
  try {
    const checkoutResponse = await showRzpScreen(rzpScreenData);
    if (!checkoutResponse) {
      setMessage("Payment failed");
      return false;
    }
    const verifyResponse: boolean = await verifyPayment(checkoutResponse);
    if (verifyResponse) {
      clearCart();
    }
    return verifyResponse;
  } catch (error) {
    console.error("Payment process failed:", error);
    return false;
  }
}

/*
 * I;m not sure about this
 * maybe we could bring the rzp screen to this file.
 */

// AS YOU CAN SEE I HAVE
// ADD THE ONLINE AND OFFLINE PAYMENT METHODS
// LETS CONTINUE TO APPLY THIS IN THE BACKEND SYSTEM
async function initiatePaymentOnline(data: {
  items: CartItem[];
  instruction: string;
  user_id: string;
}) {
  const response = await withResult(
    fetch(`${path}/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        mode: "online",
      }),
    }),
  );
  return response;
}

async function showRzpScreen(data: {
  order: {
    amount: number;
    id: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  instruction: string;
}): Promise<RazorPayVerify & { user_id: string | null }> {
  return new Promise((resolve, reject) => {
    const options = {
      key: NEXT_PUBLIC_RZP_KEY,
      amount: data.order.amount,
      currency: "INR",
      description: "Namaste Bites",
      image: "http://picsum.photos/400/400",
      order_id: data.order.id,
      handler: (res: RazorPayVerify) => {
        console.log("response: ", res);
        const sendData = {
          ...res,
          user_id: data.user?.id || null,
        };
        resolve(sendData);
      },
      prefill: {
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
      },
      notes: {
        instruction: data.instruction,
      },
      theme: {
        color: "#CCC",
      },
      retry: {
        max_count: 3,
      },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", (res: any) => {
      console.log("payment failed!", res);
      setMessage("Payment failed!");
      reject(new Error("Payment failed"));
    });
    rzp.open();
  });
}

async function verifyPayment(
  data: RazorPayVerify & {
    user_id: string | null;
  },
): Promise<boolean> {
  const response = await fetch(`${path}/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    setMessage("Payment verification failed!");
    return false;
  }
  const { success, message }: JsonResponse = await response.json();
  setType(success ? "success" : "error");
  setMessage(message || defaultErrMsg);
  if (!success) {
    setMessage(message || defaultErrMsg);
    setType("error");
    return false;
  }
  // clearCart();
  return true;
}

const order = {
  PaymentCashOnDelivery,
  PaymentOnline,
};

export default order;
