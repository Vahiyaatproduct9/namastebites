import "@utils/patchStack";
import { Elysia } from "elysia";
const port = process.env.PORT || 8000;
import exploreRouter from "@router/explore.router";
import paymentRouter from "@router/payment.router";
import cors from "@elysiajs/cors";
import { ZodError } from "zod";
import { DatabaseError } from "pg";
import userRouter from "@router/user.router";
import { clerkWebhook } from "./webhooks/clerk";
import orderRouter from "@router/order.router";
const app = new Elysia()
  .onRequest((ctx) => {
    console.log("ctx body:", JSON.stringify(ctx.request.body, null, 2));
    console.log("ctx method:", ctx.request.method);
  })
  .onError((err) => {
    const error = err.error;
    if (error instanceof ZodError) {
      console.error("Zod Error: ", error);
      err.set.status = 400;
      return {
        status: 400,
        message: "Invalid Input Data.",
      };
    }
    if (error instanceof DatabaseError) {
      console.error("Database Error: ", error);
      return {
        status: 500,
        message: "Whoops! Our Database is down.",
      };
    }
    console.error("Server Error: ", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  })
  .mapResponse((ctx) => {
    let response = ctx.responseValue as any;
    ctx.set.status = response?.status;
    if (response?.status && response.status >= 400) {
      response = {
        ...response,
        success: response?.success ?? false,
      };
    }
    response = {
      ...response,
      success: response?.success ?? true,
    };
    return {
      ...response,
      provider: "Namaste Bites :)",
    };
  })
  .use(
    cors({
      origin: "*",
    }),
  )
  .use(exploreRouter)
  .use(paymentRouter)
  .use(userRouter)
  .use(orderRouter)
  .use(clerkWebhook)
  .get("/", () => "NamasteBites")
  .listen(port);
console.log(`Server running at ${app.server?.hostname}:${port}`);
