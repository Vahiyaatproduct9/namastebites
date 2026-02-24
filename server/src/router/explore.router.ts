import { Elysia } from "elysia";
import exploreController from "../controller/explore/explore.controller";
import { errorHandler } from "@/middleware/error-handler";

export default new Elysia({ prefix: "/explore" }).post("/", (context) =>
  exploreController.list(context),
);
