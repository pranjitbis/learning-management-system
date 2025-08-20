// scripts/create-admin.js
import { hash } from 'bcryptjs';
import prisma from '../lib/prisma.js';

async function createAdminUser() {
  try {
    const adminEmail = 'pra';
    const adminPassword = 'pra';
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await hash(adminPassword, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    });

    console.log('Admin user created successfully:', adminUser);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();