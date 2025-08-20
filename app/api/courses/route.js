import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import prisma from '@/lib/prisma';

// Helper: Verify JWT token from headers (for API routes)
async function verifyAPIToken(request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader) {
      // Check if we have user info from middleware
      const userId = request.headers.get('x-user-id');
      const userRole = request.headers.get('x-user-role');
      const userEmail = request.headers.get('x-user-email');
      
      if (userId && userRole && userEmail) {
        return { userId, role: userRole, email: userEmail };
      }
      
      console.log("No authorization header or user headers");
      return null;
    }

    // Extract token
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }

    if (!token || token === "null" || token === "undefined") {
      console.log("Invalid token format");
      return null;
    }

    // Verify the token
    const decoded = verify(token, process.env.NEXTAUTH_SECRET);
    return decoded;
    
  } catch (err) {
    console.error("API Token verification error:", err.message);
    return null;
  }
}

/**
 * POST - Admin creates new course
 */
export async function POST(request) {
  try {
    const decoded = await verifyAPIToken(request);
    
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, price, category, thumbnail, videos } = body;

    // Validation
    if (!title || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json({ error: "Videos array is required" }, { status: 400 });
    }

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
      error: err.message || "Failed to create course"
    }, { status: 500 });
  }
}

/**
 * GET - Fetch all courses
 */
export async function GET(request) {
  try {
    const decoded = await verifyAPIToken(request);

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
      error: "Failed to fetch courses"
    }, { status: 500 });
  }
}

/**
 * DELETE - Admin deletes a course
 */
export async function DELETE(request) {
  try {
    const decoded = await verifyAPIToken(request);
    
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    const courseId = parseInt(id);
    const course = await prisma.course.findUnique({ 
      where: { id: courseId }, 
      include: { videos: true } 
    });
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

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
      error: "Failed to delete course"
    }, { status: 500 });
  }
}