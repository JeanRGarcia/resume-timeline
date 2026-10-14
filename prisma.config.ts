import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// `prisma migrate` takes a Postgres advisory lock, which is unreliable through a
// pooler (PgBouncer): a lock can get stuck on a pooled connection and make every
// later build time out. So migrations use the direct (non-pooled) URL when the
// provider supplies one (Neon sets DATABASE_URL_UNPOOLED); the app keeps using the
// pooled DATABASE_URL at runtime.
const migrationUrl = process.env.DATABASE_URL_UNPOOLED ?? env("DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: migrationUrl,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
