import { Elysia } from "elysia";
const port = process.env.PORT || 8000;
import searchRouter from "@router/search.router"
import { DB } from "./class/Database";
const app = new Elysia()
  .use(searchRouter)
  .get("/", () => "Hello Elysia")
  .listen(port);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${port}`
);