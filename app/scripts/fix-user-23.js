// scripts/fix-user-23.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUser23() {
  try {
    const userId = 23;
    
    console.log('🔍 Checking user with ID:', userId);
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('📋 Current user:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    if (user.role !== 'ADMIN') {
      console.log('🔄 Updating role from', user.role, 'to ADMIN...');
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: 'ADMIN' }
      });
      
      console.log('✅ Role updated successfully!');
      console.log('📧 Email:', updatedUser.email);
      console.log('🎯 New Role:', updatedUser.role);
    } else {
      console.log('✅ User already has ADMIN role.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixUser23();