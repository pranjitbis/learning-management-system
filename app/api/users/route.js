import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

// GET: fetch all users with approved courses
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

// POST: create a new user
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

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
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

// DELETE: remove a user by query param ?id=
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });
    }

    const userId = parseInt(id);

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
