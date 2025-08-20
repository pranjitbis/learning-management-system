import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

const ADMIN_EMAIL = "pra";
const ADMIN_PASSWORD = "pra";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = sign(
        { userId: "admin", email: ADMIN_EMAIL, role: "ADMIN" },
        process.env.NEXTAUTH_SECRET,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({
        message: "Admin login successful",
        user: { name: "Admin", email: ADMIN_EMAIL },
        role: "ADMIN",
      });

      response.cookies.set("lms_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    // Regular user login
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
      role: user.role,
    });

    response.cookies.set("lms_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
