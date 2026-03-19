import paymentController from "@controller/razorpay/payment.controller";
import Elysia from "elysia";

// THERE ARE 3 PHASES OF PAYMENT
// 1. ONLINE PAYMENT INITIATE
// 2. ONLINE PAYMENT VERIFY
// 3. OFFLINE PAYMENT
// we can set offline payment in createOrder Function...
export default new Elysia({ prefix: "/payment" })
  .post("/create", paymentController.createOrder)
  .post("/verify", paymentController.verifyOrder);
