import userService from "@/service/user/user.service";
import DBTransaction from "@/utils/databaseTransaction";
import { Context } from "elysia";

export async function createUser(ctx: Context) {
  const result = await DBTransaction(userService(ctx));
  return result;
}
