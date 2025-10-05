// prisma/seed.js
import prisma from '../app/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const passwordHash = await bcrypt.hash('pranjit@gmail.com', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'pranjit@gmail.com',
      password: passwordHash,
      role: 'ADMIN',
    }
  });
  console.log("Admin user created!");
}

main().catch(e => console.error(e)).finally(() => process.exit());
