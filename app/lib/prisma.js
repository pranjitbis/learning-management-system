// client-project/app/lib/prisma.js
import { PrismaClient } from "@prisma/client";

// For Next.js hot reloading in development, attach Prisma to global object
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ["query", "info", "warn", "error"], // optional: helpful for debugging
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
