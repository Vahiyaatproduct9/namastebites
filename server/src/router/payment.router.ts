import paymentController from "@controller/razorpay/payment.controller";
import Elysia from "elysia";

export default new Elysia({ prefix: "/payment" })
  .get("/", (ctx) => paymentController.createOrder(ctx))
  .post("/", (ctx) => paymentController.createOrder(ctx));
