import { DB } from "@/class/Database";
import { Pool, PoolClient } from "pg";

// Transaction controller that makes sure the database 'ROLLBACK''s in case of ERROR
export default async function DBTransaction(
  func: (client: PoolClient, pool: Pool) => Promise<any>
) {
  let client: PoolClient | null = null;
  try {
    client = await DB.pool.connect();
    const originalQuery = client.query.bind(client);
    // (client as any).query = (...args: any[]) => {
    // captured synchronously per query
    // const queryStack = new Error().stack;
    // return (originalQuery as any)(...args).catch((err: any) => {
    //   err.stack = [
    //     `[DB Error] ${err.message}`,
    //     ``,
    //     `SQL:    ${typeof args[0] === "string" ? args[0] : args[0]?.text}`,
    //     `Params: ${JSON.stringify(args[1] ?? [])}`,
    //     ``,
    //     `--- Where it was called ---`,
    //     queryStack,
    //   ].join("\n");
    //   throw err;
    // });
    // };
    await client.query("BEGIN");
    const result = await func(client, DB.pool);
    await client.query("COMMIT");
    return result;
  } catch (error: any) {
    client && (await client.query("ROLLBACK"));
    throw error;
  } finally {
    client && client.release();
  }
}
