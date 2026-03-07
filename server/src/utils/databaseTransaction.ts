import { DB } from "@/class/Database";
import { Pool, PoolClient } from "pg";

// Transaction controller that makes sure the database 'ROLLBACK''s in case of ERROR
export default async function DBTransaction(
  func: (client: PoolClient, pool: Pool) => Promise<any>,
) {
  let client: PoolClient | null = null;
  try {
    client = await DB.pool.connect();
    await client.query("BEGIN");
    const result = await func(client, DB.pool);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    console.error("Error in DBTransaction: ", error);
    client && (await client.query("ROLLBACK"));
    throw new Error("Error in DBTransaction");
  } finally {
    client && client.release();
  }
}
