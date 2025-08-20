import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();

// Helper: Verify JWT token
async function verifyToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    return verify(token, process.env.NEXTAUTH_SECRET);
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}

/**
 * POST - Admin creates new course with YouTube videos
 */
export async function POST(req) {
  const decoded = await verifyToken(req);
  if (!decoded || decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, price, category, thumbnail, videos } = body;

    // Validation
    if (!title || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json({ error: "Videos array is required" }, { status: 400 });
    }

    // Ensure each video has a valid URL
    const videosData = videos.map((v, index) => {
      if (!v.url || typeof v.url !== "string") {
        throw new Error(`Video at index ${index} is missing a valid 'url' string`);
      }
      return {
        title: v.title || `Video ${index + 1}`,
        url: v.url,
        position: index + 1,
        published: true,
      };
    });

    // Create course in DB
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        thumbnail: thumbnail || null,
        videos: { create: videosData },
      },
      include: { videos: true, access: true },
    });

    return NextResponse.json({ ...course, isApproved: false }, { status: 201 });
  } catch (err) {
    console.error("Error creating course:", err);
    return NextResponse.json({ error: err.message || "Failed to create course" }, { status: 500 });
  }
}

/**
 * GET - Fetch all courses
 */
export async function GET(req) {
  try {
    const decoded = await verifyToken(req);

    const courses = await prisma.course.findMany({
      orderBy: { id: "desc" },
      include: { videos: true, access: true },
    });

    const coursesWithUrls = courses.map((course) => ({
      ...course,
      isApproved: decoded
        ? course.access.some((a) => a.userId === decoded.userId && a.approved === true)
        : false,
    }));

    return NextResponse.json(coursesWithUrls, { status: 200 });
  } catch (err) {
    console.error("Error fetching courses:", err);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

/**
 * DELETE - Admin deletes a course
 */
export async function DELETE(req) {
  const decoded = await verifyToken(req);
  if (!decoded || decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Course ID required" }, { status: 400 });

    const courseId = parseInt(id);
    const course = await prisma.course.findUnique({ where: { id: courseId }, include: { videos: true } });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Delete related data
    await prisma.$transaction([
      prisma.userVideoProgress.deleteMany({ where: { videoId: { in: course.videos.map((v) => v.id) } } }),
      prisma.video.deleteMany({ where: { courseId } }),
      prisma.userCourseProgress.deleteMany({ where: { courseId } }),
      prisma.access.deleteMany({ where: { courseId } }),
      prisma.certificate.deleteMany({ where: { courseId } }),
      prisma.course.delete({ where: { id: courseId } }),
    ]);

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
