// scripts/check-current-user.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCurrentUser() {
  try {
    // Get token from localStorage (for browser context)
    // This is just to help you understand what's happening
    console.log('ℹ️  Check your browser localStorage for "lms_token"');
    console.log('ℹ️  The token contains your user ID and role');
    console.log('ℹ️  You can decode it at https://jwt.io');
    
    // List all users to see what's available
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
      orderBy: { id: 'asc' }
    });

    console.log('\n📋 Available users in database:');
    users.forEach(user => {
      console.log(`ID: ${user.id} | Email: ${user.email} | Role: ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentUser();