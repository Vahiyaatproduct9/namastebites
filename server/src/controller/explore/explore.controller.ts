import { DB } from "@/class/Database";
import { Context } from "elysia";

const list = async (ctx: Context) => {
  try {
    const body = ctx.body;
    const itemList = (await DB.pool.query(`SELECT * FROM public.items`)).rows;
    console.log("data:", body);
    const data = {
      items: itemList,
    };
    return {
      status: 200,
      message: "Items fetched successfully",
      data,
    };
  } catch (e) {
    console.log("Error:", e);
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

export default {
  list,
};
