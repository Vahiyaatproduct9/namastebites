import { Context } from "elysia";
import * as z from "zod";
import { paymentOrderSchema } from "@/types/payment.type";
import razorpay from "@libs/razorpay";
const createOrder = async (ctx: Context) => {
  try {
    const body = paymentOrderSchema.parse(ctx.body);
    const { amount, notes } = body;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt",
      notes: {
        message: "Order initiated!",
      },
    });
    console.log("order:", order);
    return {
      status: 200,
      message: "Order created successfully",
      data: { order, amount, notes },
    };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        message: "Invalid request",
        data: null,
      };
    }
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

export default {
  createOrder,
};
