import paymentController from "@controller/razorpay/payment.controller";
import Elysia from "elysia";

export default new Elysia({ prefix: "/payment" })
  .post("/create", paymentController.createOrder)
  .post("/verify", paymentController.verifyOrder);
