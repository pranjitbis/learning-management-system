// app/api/login/route.js
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

    // Admin login
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = sign({ userId: "admin", role: "ADMIN" }, JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "7d",
      });

      const res = NextResponse.json({
        message: "Login successful",
        token,
        user: { id: "admin", name: "Admin", email },
        role: "ADMIN",
        redirect: "/app/admin",
      });

      res.cookies.set("lms_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return res;
    }

    // Regular user login
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const userRole = user.role || "USER";
    const token = sign({ userId: user.id, role: userRole }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    const redirect = userRole === "ADMIN" ? "/app/admin" : "/dashboard";

    const res = NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
      role: userRole,
      redirect,
    });

    res.cookies.set("lms_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
