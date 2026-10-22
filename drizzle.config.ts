import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { databaseUrl } from "./src/server/db/connection";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: databaseUrl() },
  strict: true,
});
