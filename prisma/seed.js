// prisma/seed.js
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'ADMIN',
    }
  });
  console.log("Admin user created!");
}

main().catch(e => console.error(e)).finally(() => process.exit());
