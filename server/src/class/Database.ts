import { client, pool } from "@libs/pg";
import { Pool, Client } from "pg";

class DBClass {
  client: Client = client;
  pool: Pool = pool;
  constructor() {
    pool.on("error", (err) => {
      console.error("Error in pool: ", err);
    });
  }
}

const DB = new DBClass();
export { DB };
