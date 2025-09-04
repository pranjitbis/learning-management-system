import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "supersecret";

export async function GET(req) {
  try {
    // Get token from cookies
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});
    
    const token = cookies.lms_token;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    // Verify token
    const decoded = verify(token, JWT_SECRET);
    
    return NextResponse.json({
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}