import { createUserSchema } from "@/types/global.type";
import { Context } from "elysia";
import { Client, Pool } from "pg";
const createUserService =
  (ctx: Context) => async (client: Client, pool: Pool) => {
    const { event, clerk_id, email_address, name, image_url } =
      createUserSchema.parse(ctx.body);
    if (event === "created") {
      const createUser = (
        await pool.query(
          `
        INSERT INTO users (clerk_id, email, name)
        VALUES ($1, $2, $3)
        RETURNING user_id, email, name
        `,
          [clerk_id, email_address, name],
        )
      ).rows[0];
    } else if (event === "updated") {
      const updateUser = await pool.query(
        `
        UPDATE users
        SET
          email = $2,
          name = $3
        WHERE clerk_id = $1
        RETURNING user_id, email, name
      `,
        [clerk_id, email_address, name],
      );
    } else if (event === "deleted") {
      await pool.query(`
        DELETE FROM users
        WHERE clerk_id = $1
        RETURNING user_id, email, name
      `);
    }
  };
