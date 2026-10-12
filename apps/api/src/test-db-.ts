
import { pool } from "./config/database.js";

try {
  const result = await pool.query("SELECT NOW() AS current_time");

  console.log("✅ Neon PostgreSQL connected successfully!");
  console.log("Database time:", result.rows[0].current_time);
} catch (error) {
  console.error("❌ Database connection failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}