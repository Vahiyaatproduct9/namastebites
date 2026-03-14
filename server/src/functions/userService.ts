import {
  createOrUpdateUserSchema,
  deleteUserSchema,
} from "@/types/global.type";
import { PoolClient } from "pg";
import z from "zod";

const userService = (event: any) => async (client: PoolClient) => {
  Bun.write("data/create-user-info.json", JSON.stringify(event, null, 2)).then(
    () => console.log("Done!")
  );
  const { type } = event;
  z.enum(["user.created", "user.updated", "user.deleted"]).parse(type);
  if (type === "user.created") {
    const {
      data: { id, username, first_name, last_name, email_addresses },
      type,
      object,
      instance_id,
      timestamp,
    } = createOrUpdateUserSchema.parse(event);
    const name = `${first_name} ${last_name}`;
    const email = email_addresses[0]?.email_address || null;
    if (type === "user.created") {
      const userExsists = (
        await client.query(
          `
      SELECT 1 FROM USERS WHERE CLERK_ID = $1
    `,
          [id]
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
        INSERT INTO users(clerk_id, email, name)
        VALUES ($1, $2, $3)
        RETURNING user_id, email, name
        `,
          [id, email, name]
        )
      ).rows[0];
    }
  } else if (type === "user.updated") {
    const {
      data: { email_addresses, id, first_name, last_name },
    } = createOrUpdateUserSchema.parse(event);
    const name = [first_name, last_name]
      .filter((name) => (typeof name === "string" || name !== "" ? name : ""))
      .join(" ");
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
      [id, email, name]
    );
  } else if (type === "user.deleted") {
    const {
      data: { id },
    } = deleteUserSchema.parse(event);
    await client.query(
      `
        DELETE FROM users
        WHERE clerk_id = $1
        RETURNING user_id, email, name
      `,
      [id]
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

export default userService;
