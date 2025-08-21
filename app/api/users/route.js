import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

// ---------------------
// GET: fetch all users with approved courses
// ---------------------
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        access: {
          where: { approved: true },
          select: {
            id: true,
            course: { select: { title: true } },
          },
        },
      },
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      access: user.access.map((a) => ({
        id: a.id,
        name: a.course?.title || "No course",
      })),
    }));

    return new Response(JSON.stringify(formattedUsers), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

// ---------------------
// POST: create a new user
// ---------------------
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, userId, courseId, action } = body;

    // --- Add new user ---
    if (!action || action === "createUser") {
      if (!name || !email || !password) {
        return new Response(
          JSON.stringify({ error: "Name, email, and password are required" }),
          { status: 400 }
        );
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || "USER",
        },
      });

      return new Response(JSON.stringify(newUser), { status: 201 });
    }

    // --- Grant course access ---
    if (action === "grantAccess") {
      if (!userId || !courseId) {
        return new Response(JSON.stringify({ error: "User ID and course ID required" }), { status: 400 });
      }

      const access = await prisma.access.create({
        data: {
          userId: parseInt(userId),
          courseId: parseInt(courseId),
          approved: true,
        },
        include: { course: true },
      });

      // Return updated user with access
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
          access: {
            where: { approved: true },
            include: { course: true },
          },
        },
      });

      const formattedUser = {
        ...user,
        access: user.access.map((a) => ({
          id: a.id,
          name: a.course?.title || "No course",
        })),
      };

      return new Response(JSON.stringify(formattedUser), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

// ---------------------
// DELETE: remove a user or access record by query param ?id=
// ---------------------
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const type = url.searchParams.get("type"); // "user" or "access"

    if (!id) {
      return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });
    }

    const numericId = parseInt(id);

    if (type === "access") {
      await prisma.access.delete({ where: { id: numericId } });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      // Delete user
      const existingUser = await prisma.user.findUnique({ where: { id: numericId } });
      if (!existingUser) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      }

      await prisma.user.delete({ where: { id: numericId } });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
