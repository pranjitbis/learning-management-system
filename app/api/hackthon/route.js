import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "supersecret";

// Helper: Extract token from request
function getTokenFromRequest(req) {
  // First check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  
  // Then check cookies as fallback
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});
    
    return cookies.lms_token;
  }
  
  return null;
}

// Helper: Authenticate and check admin role
async function authenticateAdmin(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  try {
    const decoded = verify(token, JWT_SECRET);
    
    // Check if user is admin
    if (decoded.role !== "ADMIN") {
      return null;
    }
    
    return decoded;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}

// GET /api/hackthon - Public access
export async function GET(req) {
  try {
    const data = await prisma.hackthon.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching records" }, { status: 500 });
  }
}

// POST /api/hackthon - Admin only
export async function POST(req) {
  const user = await authenticateAdmin(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { name, email, rank } = await req.json();
    const newRecord = await prisma.hackthon.create({
      data: { name, email, rank: rank ? parseInt(rank) : null },
    });
    return NextResponse.json(newRecord, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error creating record" }, { status: 500 });
  }
}

// PUT /api/hackthon - Admin only
export async function PUT(req) {
  const user = await authenticateAdmin(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id, name, email, rank } = await req.json();
    const updated = await prisma.hackthon.update({
      where: { id },
      data: { name, email, rank: rank ? parseInt(rank) : null },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error updating record" }, { status: 500 });
  }
}

// DELETE /api/hackthon - Admin only
export async function DELETE(req) {
  const user = await authenticateAdmin(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    await prisma.hackthon.delete({ where: { id } });
    return NextResponse.json({ message: "Record deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error deleting record" }, { status: 500 });
  }
}