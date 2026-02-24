import { client, pool } from "@libs/pg";

export class DB {
  static client = client;
  static pool = pool;
}