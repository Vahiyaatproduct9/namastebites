import { Context } from "elysia";
import DBTransaction from "@/utils/databaseTransaction";
import payment from "@service/razorpay/payment.service";
async function createOrder(ctx: Context) {
  return await DBTransaction(payment.createOrderService(ctx));
}

async function verifyOrder(ctx: Context) {
  return await DBTransaction(payment.verifyPaymentService(ctx));
}

export default {
  createOrder,
  verifyOrder,
};
