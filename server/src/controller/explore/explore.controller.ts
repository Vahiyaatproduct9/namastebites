import { DB } from "@/class/Database";
import { exploreRequestBody } from "@/types/payment.type";
import { Context } from "elysia";
const list = async (ctx: Context) => {
  const { single } = exploreRequestBody.parse(ctx.query);
  if (single) {
    const item = (
      await DB.pool.query(`SELECT * FROM public.items WHERE item_id = $1`, [
        single,
      ])
    ).rows[0];
    return {
      status: 200,
      message: "Item fetched successfully",
      data: {
        item: item,
      },
    };
  }
  const itemList = (await DB.pool.query(`SELECT * FROM public.items`)).rows;
  const data = {
    items: itemList,
  };
  return {
    status: 200,
    message: "Items fetched successfully",
    data,
  };
};

export default {
  list,
};
