import { listOrdersService } from "@/service/order/order.service";
import { Context } from "elysia";

async function listOrders(ctx: Context) {
  return await listOrdersService(ctx);
}

export { listOrders };
