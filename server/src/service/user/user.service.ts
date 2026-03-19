import { writeFile } from "fs/promises";
import {
  createOrUpdateUserSchema,
  deleteUserSchema,
  updateUserSchema,
} from "@/types/global.type";
import { Context } from "elysia";
import { PoolClient } from "pg";
import z from "zod";
import { getClerkId } from "@/utils/http_helper";
const userService = (ctx: Context) => async (client: PoolClient) => {
  await writeFile(
    "data/create-user-info.json",
    JSON.stringify(ctx.body, null, 2),
  ).then((res) => console.log("Done!", res));
  const { type } = ctx.body as any;
  z.enum(["user.created", "user.updated", "user.deleted"]).parse(type);
  if (type === "user.created") {
    const {
      data: { id, username, first_name, last_name, email_addresses },
      type,
      object,
      instance_id,
      timestamp,
    } = createOrUpdateUserSchema.parse(ctx.body);
    const name = `${first_name} ${last_name}`;
    const email = email_addresses[0]?.email_address || null;
    if (type === "user.created") {
      const userExsists = (
        await client.query(
          `
      SELECT 1 FROM USERS WHERE CLERK_ID = $1
    `,
          [id],
        )
      ).rows[0];
      if (userExsists) {
        return {
          status: 400,
          message: "User already exists",
        };
      }
      const createUser = (
        await client.query(
          `
        INSERT INTO users (clerk_id, email, name)
        VALUES ($1, $2, $3)
        RETURNING user_id, email, name
        `,
          [id, email, name],
        )
      ).rows[0];
    }
  } else if (type === "user.updated") {
    const {
      data: { email_addresses, id, first_name, last_name },
    } = createOrUpdateUserSchema.parse(ctx.body);
    const name = `${first_name} ${last_name}`;
    const email = email_addresses[0]?.email_address || null;
    const updateUser = await client.query(
      `
        UPDATE users
        SET
          email = COALESCE($2, NULL),
          name = $3
        WHERE clerk_id = $1
        RETURNING user_id, email, name
      `,
      [id, email, name],
    );
  } else if (type === "user.deleted") {
    const {
      data: { id },
    } = deleteUserSchema.parse(ctx.body);
    await client.query(
      `
        DELETE FROM users
        WHERE clerk_id = $1
        RETURNING user_id, email, name
      `,
      [id],
    );
  }
  const verb =
    type === "user.created"
      ? "created"
      : type === "user.updated"
        ? "updated"
        : "deleted";
  return {
    message: `User ${verb} successfully`,
    status: type === "user.created" ? 201 : 200,
  };
};

export const updateUserService =
  (ctx: Context) => async (client: PoolClient) => {
    console.log("body:", ctx.body);
    const { clerk_id, success } = await getClerkId(
      ctx.headers as Record<string, string>,
    );
    if (!success) return { status: 401, message: "Unauthorized" };
    const { data } = updateUserSchema.parse(ctx.body);
    const email = data?.email || null;
    const phone = data?.phone || null;
    // Check if phone number is valid
    if (phone && (phone.length < 10 || phone.length > 11)) {
      return {
        message: "Invalid phone number",
        status: 400,
      };
    }
    const name = data?.name || null;
    const conditionsList: string[] = [];
    if (email) conditionsList.push(`email = '${email}'`);
    if (phone) conditionsList.push(`phone = '+91${phone}'`);
    if (name) conditionsList.push(`name = '${name}'`);
    const updateUser = await client.query(
      `
      UPDATE users
      SET
      ${conditionsList.join(",\n")}
      WHERE clerk_id = $1
      RETURNING user_id, email, name
    `,
      [clerk_id],
    );
    return {
      message: `User updated successfully`,
      status: 200,
    };
  };

export default userService;
