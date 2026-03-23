/* eslint-disable @typescript-eslint/no-explicit-any */
import { APICall, APICallFull } from "../apiClient";
import { CartItem, RazorPayVerify } from "@/app/types/types";
import useMessage from "@/app/store/useMessage";
import { useCart } from "@/app/store/useCart";
import { NEXT_PUBLIC_RZP_KEY } from "@/app/env";
const setMessage = useMessage.getState().setMessage;
const clearCart = useCart.getState().clearCart;

/*
 * Used for offline payments
 */
async function PaymentCashOnDelivery(data: {
  data: CartItem[];
  instruction: string;
  user_id: string;
}) {
  return await APICall("/payment/create", {
    method: "POST",
    body: {
      items: data.data,
      special_instructions: data.instruction,
      user_id: data.user_id,
      mode: "cash_on_delivery",
    },
  });
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
  const result = await APICallFull("/payment/create", {
    method: "POST",
    body: {
      items: data.data,
      instruction: data.instruction,
      user_id: data.user.id,
      mode: "online",
    },
  });

  if (!result.success || !result.data || !result.data.order) {
    setMessage("No Order Found. Make sure you have listed your orders.");
    return false;
  }

  const { order } = result.data;
  const rzpScreenData = {
    order,
    user: data.user,
    instruction: data.instruction,
  };

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
  const result = await APICallFull("/payment/verify", {
    method: "POST",
    body: data,
  });

  if (result.success) {
    // APICallFull already handles success message if returned in result.message
    return true;
  }
  return false;
}

const order = {
  PaymentCashOnDelivery,
  PaymentOnline,
};

export default order;
