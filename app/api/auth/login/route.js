import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "supersecret";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // --- Admin login ---
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = sign({ userId: "admin", role: "ADMIN" }, JWT_SECRET, { expiresIn: "7d" });

      const response = NextResponse.json({
        message: "Login successful",
        token, // ✅ include token in JSON
        user: { name: "Admin", email: email },
        role: "ADMIN",
        redirect: "/admin",
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

    // --- Regular user login ---
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
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      token, // ✅ include token in JSON
      user: { id: user.id, name: user.name, email: user.email },
      role: user.role,
      redirect: user.role === "ADMIN" ? "/admin" : "/dashboard",
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
