import "dotenv/config";
import prisma from "../app/lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("Elenxia@112233", 10);

  await prisma.user.upsert({
    where: { email: "elenxia@gmail.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "elenxia@gmail.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin user created!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit();
  });
