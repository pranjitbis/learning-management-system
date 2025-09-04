// scripts/create-proper-admin.js
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createProperAdmin() {
  try {
    const adminEmail = "elenxia23@gmail.com";
    const adminPassword = "Fatima@Elenxia1";

    console.log("🔍 Checking for existing admin...");

    // Delete any existing user with this email to avoid conflicts
    await prisma.user
      .deleteMany({
        where: { email: adminEmail },
      })
      .catch(() => {}); // Ignore errors if user doesn't exist

    console.log("👤 Creating new admin user...");

    // Hash password
    const hashedPassword = await hash(adminPassword, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin User",
        role: "ADMIN",
      },
    });

    console.log("🎉 Admin user created successfully!");
    console.log("📧 Email:", adminUser.email);
    console.log("👤 Name:", adminUser.name);
    console.log("🎯 Role:", adminUser.role);
    console.log("🆔 ID:", adminUser.id);
    console.log("\n✅ Please log in with:");
    console.log("   Email: pra");
    console.log("   Password: pra");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createProperAdmin();
