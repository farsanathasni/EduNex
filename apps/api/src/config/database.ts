
import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema/index.js";

const connectionString =
  process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DATABASE_URL_POOLED is missing");
}

export const pool = new Pool({
  connectionString,
  max: 10,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });
