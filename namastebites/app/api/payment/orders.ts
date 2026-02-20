import path from "@/app/path/path";
import { PaymentPostBodyType } from "@/app/types/types";

export async function initiateOrderPayment(body: PaymentPostBodyType) {
  console.log("body:", body);
  const response = await fetch(`${path}/payment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to create order");
  }
  const data = await response.json();
  console.log("payment data:", data);
  return data;
}
