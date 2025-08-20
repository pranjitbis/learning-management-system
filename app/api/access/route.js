import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// GET all access requests (optional ?approved=true)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const approvedFilter = searchParams.get("approved");
    const userIdFilter = searchParams.get("userId");
    const courseIdFilter = searchParams.get("courseId");

    const where = {
      ...(approvedFilter !== null && { approved: approvedFilter === "true" }),
      ...(userIdFilter && { userId: parseInt(userIdFilter) }),
      ...(courseIdFilter && { courseId: parseInt(courseIdFilter) }),
    };

    const accessList = await prisma.access.findMany({
      where,
      orderBy: { requestedAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
          },
        },
      },
    });

    return NextResponse.json(accessList, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching access requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch access requests" },
      { status: 500 }
    );
  }
}

// POST approve/reject or grant access
export async function POST(req) {
  try {
    const { id, userId, courseId, approved } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing userId or courseId" },
        { status: 400 }
      );
    }

    const existingAccess = await prisma.access.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    let updatedAccess;
    if (existingAccess) {
      updatedAccess = await prisma.access.update({
        where: { id: existingAccess.id },
        data: {
          approved: approved ?? true,
          grantedAt: approved ? new Date() : null,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnail: true,
            },
          },
        },
      });
    } else {
      updatedAccess = await prisma.access.create({
        data: {
          userId,
          courseId,
          approved: approved ?? true,
          grantedAt: approved ? new Date() : null,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnail: true,
            },
          },
        },
      });
    }

    return NextResponse.json(updatedAccess, { status: 200 });
  } catch (error) {
    console.error("❌ Error granting/updating access:", error);
    return NextResponse.json(
      { error: "Failed to update access request" },
      { status: 500 }
    );
  }
}

// ✅ DELETE access
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const accessId = searchParams.get("id");
    if (!accessId) {
      return NextResponse.json(
        { error: "Missing access ID" },
        { status: 400 }
      );
    }

    await prisma.access.delete({ where: { id: parseInt(accessId) } });

    return NextResponse.json(
      { message: "Access removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting access:", error);
    return NextResponse.json(
      { error: "Failed to remove access" },
      { status: 500 }
    );
  }
}
