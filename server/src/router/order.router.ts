import { listOrders } from "@controller/order/order.controller";
import Elysia from "elysia";

export default new Elysia({ prefix: "/order" }).get("/", listOrders);
