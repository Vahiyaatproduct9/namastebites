import { client, pool } from "@libs/pg";
import { Pool, Client } from "pg";

class DBClass {
  client: Client = client;
  pool: Pool = pool;
  // constructor() {
  //   this.pool = pool;
  //   this.client = client;
  // }
}

const DB = new DBClass();
export { DB };
