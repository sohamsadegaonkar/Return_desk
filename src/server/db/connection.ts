import { Pool } from "pg";

/** Kept separate from server-only so migration/seed Node processes can use it. */
export function databaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL is required for database operations.");
  const parsed = new URL(value);
  if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
    throw new Error("DATABASE_URL must use PostgreSQL.");
  }
  return value;
}

export function createPool(connectionString = databaseUrl()): Pool {
  const pool = new Pool({ connectionString, max: 5, connectionTimeoutMillis: 10_000, idleTimeoutMillis: 30_000 });
  // Never log connection strings or provider error details containing credentials.
  pool.on("error", () => console.error("An idle PostgreSQL connection failed."));
  return pool;
}
