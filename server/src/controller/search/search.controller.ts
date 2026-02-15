import { write } from "bun";
import { Context } from "elysia";

const list = async (ctx: Context) => {
  console.log('data:', ctx.params);
  await write("./log.txt", JSON.stringify(ctx, null, 2));
  return {
    status: 500,
    message: ctx,
  };
};

export default {
  list,
};