import { Context } from "elysia";
import DBTransaction from "@/utils/databaseTransaction";
import payment from "@service/razorpay/payment.service";
async function createOrder(ctx: Context) {
  const res = await DBTransaction(payment.createOrderService(ctx));
  return res;
}

export default {
  createOrder,
};
