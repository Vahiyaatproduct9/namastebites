import { Elysia } from "elysia";
import exploreController from "../controller/explore/explore.controller";

export default new Elysia({ prefix: "/explore" }).post("/", (context) =>
  exploreController.list(context),
);
