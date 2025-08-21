// prisma/seed.js
import prisma from '../app/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const passwordHash = await bcrypt.hash('pra', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'pra',
      password: passwordHash,
      role: 'ADMIN',
    }
  });
  console.log("Admin user created!");
}

main().catch(e => console.error(e)).finally(() => process.exit());
