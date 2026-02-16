import { Elysia } from "elysia";
const port = process.env.PORT || 8000;
import exploreRouter from "@router/explore.router";
import paymentRouter from "@router/payment.router";
import cors from "@elysiajs/cors";
const app = new Elysia()
  .use(
    cors({
      origin: "*",
    }),
  )
  .use(exploreRouter)
  .use(paymentRouter)
  .get("/", () => "NamasteBites")
  .listen(port);
console.log(`Server running at ${app.server?.hostname}:${port}`);
