import { createUserSchema } from "@/types/global.type";
import { Context } from "elysia";
import { Client, Pool } from "pg";

const createUserService =
  (ctx: Context) => async (client: Client, pool: Pool) => {
    const { clerk_id, email_address, name, image_url } = createUserSchema.parse(
      ctx.body,
    );
  const createUser = ()
  };
