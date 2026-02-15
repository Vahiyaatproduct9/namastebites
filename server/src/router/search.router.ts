import { Elysia } from "elysia";
import searchController from "../controller/search/search.controller";

export default new Elysia({ prefix: "/search" })
  .get("/", (context) => searchController.list(context))
  .get("/food", (context) => searchController.list(context))
  .get("/restaurant", (context) => searchController.list(context));