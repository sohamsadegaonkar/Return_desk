import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import { createPool } from "./connection";
import * as schema from "./schema";

const state = globalThis as typeof globalThis & {
  returnDeskPool?: Pool;
  returnDeskDb?: NodePgDatabase<typeof schema>;
};

/** Lazy initialization permits builds without production database credentials. */
export function getPool(): Pool {
  return state.returnDeskPool ??= createPool();
}

export function getDb(): NodePgDatabase<typeof schema> {
  return state.returnDeskDb ??= drizzle(getPool(), { schema });
}
