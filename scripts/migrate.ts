import "dotenv/config";
import { resolve } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createPool } from "../src/server/db/connection";

async function main() {
  const pool = createPool();
  try {
    await migrate(drizzle(pool), { migrationsFolder: resolve(process.cwd(), "drizzle") });
    console.log("Committed migrations applied successfully.");
  } finally {
    await pool.end();
  }
}
main().catch(() => {
  console.error("Migration failed. Check PostgreSQL connectivity and the committed schema; no credentials are logged.");
  process.exitCode = 1;
});
