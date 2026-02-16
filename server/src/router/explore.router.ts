import { Elysia } from "elysia";
import exploreController from "../controller/explore/explore.controller";

export default new Elysia({ prefix: "/explore" }).get("/", (context) =>
  exploreController.list(context),
);
