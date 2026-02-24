import path from "@/app/path/path";
import { CartItem } from "@/app/types/types";

export default class Order {
  private orders: CartItem[];
  constructor(orders: CartItem[]) {
    this.orders = orders;
  }
  /**
   * This method is used to initiate the payment for the order.
   */
  public async initiatePayment() {
    const response = await fetch(`${path}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.orders),
    });
    if (!response.ok) {
      throw new Error("Failed to create order");
    }
    const data = await response.json();
    return data;
  }
  /**
   * This method is used to get the payment status for the order.
   */
  public async getPaymentStatus() {
    return true;
  }
}
