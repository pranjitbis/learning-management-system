import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import prisma from '@/lib/prisma'; // Use your existing Prisma client

// Helper: Verify JWT token with better error handling
async function verifyToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    
    // Debug log to see what's being received
    console.log("Auth header:", authHeader);
    
    if (!authHeader) {
      console.log("No authorization header");
      return null;
    }

    // Handle different token formats
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }

    // Check if token is empty or malformed
    if (!token || token === "null" || token === "undefined" || token.split('.').length !== 3) {
      console.log("Invalid token format:", token);
      return null;
    }

    // Verify the token
    const decoded = verify(token, process.env.NEXTAUTH_SECRET);
    console.log("Token verified for user:", decoded.userId);
    return decoded;
    
  } catch (err) {
    console.error("Token verification error:", err.message);
    return null;
  }
}

/**
 * POST - Admin creates new course with YouTube videos
 */
export async function POST(req) {
  try {
    const decoded = await verifyToken(req);
    
    // Debug log
    console.log("Decoded token:", decoded);
    
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, price, category, thumbnail, videos } = body;

    // Validation
    if (!title || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json({ error: "Videos array is required" }, { status: 400 });
    }

    // Validate video URLs
    const videosData = videos.map((v, index) => {
      if (!v.url || typeof v.url !== "string") {
        throw new Error(`Video at index ${index} is missing a valid 'url' string`);
      }
      
      // Basic YouTube URL validation
      if (!v.url.includes('youtube.com/') && !v.url.includes('youtu.be/')) {
        console.warn(`Video ${index + 1} may not be a valid YouTube URL: ${v.url}`);
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
    return NextResponse.json({ 
      error: err.message || "Failed to create course",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}

/**
 * GET - Fetch all courses
 */
export async function GET(req) {
  try {
    const decoded = await verifyToken(req);
    
    console.log("Fetching courses, user authenticated:", !!decoded);

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: { 
        videos: {
          orderBy: { position: 'asc' }
        }, 
        access: true 
      },
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
    return NextResponse.json({ 
      error: "Failed to fetch courses",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }, { status: 500 });
  }
}

/**
 * DELETE - Admin deletes a course
 */
export async function DELETE(req) {
  try {
    const decoded = await verifyToken(req);
    
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    const courseId = parseInt(id);
    
    // Verify course exists
    const course = await prisma.course.findUnique({ 
      where: { id: courseId }, 
      include: { videos: true } 
    });
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Delete related data in transaction
    await prisma.$transaction([
      prisma.userVideoProgress.deleteMany({ 
        where: { videoId: { in: course.videos.map((v) => v.id) } } 
      }),
      prisma.video.deleteMany({ where: { courseId } }),
      prisma.userCourseProgress.deleteMany({ where: { courseId } }),
      prisma.access.deleteMany({ where: { courseId } }),
      prisma.certificate.deleteMany({ where: { courseId } }),
      prisma.course.delete({ where: { id: courseId } }),
    ]);

    return NextResponse.json({ message: "Course deleted successfully" });
    
  } catch (err) {
    console.error("Error deleting course:", err);
    return NextResponse.json({ 
      error: "Failed to delete course",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }, { status: 500 });
  }
}