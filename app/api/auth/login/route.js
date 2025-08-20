import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user in database - REMOVED the invalid 'mode: insensitive'
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase() // Just use equals without mode
        }
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        password: true, 
        role: true 
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check if user has a password (might be social login user)
    if (!user.password) {
      return NextResponse.json({ error: "Please use social login or reset password" }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role || "USER" 
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role || "USER" 
      },
      role: user.role || "USER",
    });

    // Set cookie
    response.cookies.set("lms_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }, { status: 500 });
  }
}