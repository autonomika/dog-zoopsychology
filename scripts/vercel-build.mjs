#!/usr/bin/env node
import { execSync } from "node:child_process";

execSync("npx prisma generate", { stdio: "inherit" });

const db = process.env.DATABASE_URL ?? "";
const isRemoteDb =
  db.startsWith("postgresql://") &&
  !db.includes("localhost") &&
  !db.includes("127.0.0.1");

if (isRemoteDb) {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
} else if (process.env.VERCEL) {
  console.warn("\n⚠ DATABASE_URL не задан — схема БД не применена. Добавьте Neon URL в Vercel env.\n");
} else {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
}

execSync("npx next build", { stdio: "inherit" });
