import { DB } from "@/class/Database";
import { orderListSchema } from "@/types/global.type";
import { getClerkId } from "@/utils/http_helper";
import { Context } from "elysia";
import z from "zod";

async function listOrdersService(ctx: Context) {
  const pool = DB.pool;
  const { clerk_id, success } = await getClerkId(
    ctx.headers as Record<string, string>,
  );
  if (!success) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
  const orderList = (
    await pool.query(
      `
    WITH u AS (
      SELECT user_id FROM users
      WHERE clerk_id = $1
    ),
    o AS (
      SELECT id, transaction_id FROM orders
      WHERE user_id = (SELECT user_id FROM u)
    ),
    oi AS (
      SELECT
        o.id,
        o.transaction_id,
        JSONB_AGG(
          TO_JSONB(i) || JSONB_BUILD_OBJECT('quantity', oi.quantity)
        ) AS items
      FROM order_items oi
      JOIN items i ON i.item_id = oi.item_id
      JOIN o ON o.id = oi.order_id
      GROUP BY o.id, o.transaction_id
    )
    SELECT *
    FROM oi
  `,
      [clerk_id],
    )
  ).rows as z.infer<typeof orderListSchema>;
  return {
    status: 200,
    data: orderList,
    message: "Orders Listed!",
  };
}

export { listOrdersService };
