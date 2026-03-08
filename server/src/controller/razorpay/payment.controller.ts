import { Context } from "elysia";
import DBTransaction from "@/utils/databaseTransaction";
import payment from "@service/razorpay/payment.service";
async function createOrder(ctx: Context) {
  return await DBTransaction(payment.createOrderService(ctx));
}
async function verifyOrder(ctx: Context) {
  try {
    return await payment.verifyPaymentService(ctx);
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

export default {
  createOrder,
  verifyOrder,
};
