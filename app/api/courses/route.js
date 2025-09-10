// app/api/courses/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST - Admin creates new course
 */
export async function POST(request) {
  try {
    // TEMPORARY ADMIN MOCK FOR TESTING
    // Remove this in production and use real JWT/token verification
    const decoded = { userId: 1, role: "ADMIN", email: "admin@example.com" };

    const body = await request.json();
    const { title, description, price, category, thumbnail, videos } = body;

    // Validation
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: "Videos array is required" },
        { status: 400 }
      );
    }

    const videosData = videos.map((v, index) => {
      if (!v.url || typeof v.url !== "string") {
        throw new Error(
          `Video at index ${index} is missing a valid 'url' string`
        );
      }

      // Store the full YouTube URL directly
      return {
        title: v.title || `Video ${index + 1}`,
        url: v.url, // Store full URL
        position: index + 1,
        published: true,
      };
    });

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        thumbnail: thumbnail || null,
        videos: { create: videosData },
      },
      include: {
        videos: { orderBy: { position: "asc" } },
        access: true,
      },
    });

    return NextResponse.json({ ...course, isApproved: false }, { status: 201 });
  } catch (err) {
    console.error("Error creating course:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to create course",
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Fetch all courses
 */
export async function GET(request) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        videos: { orderBy: { position: "asc" } },
        access: true,
      },
    });

    const coursesWithUrls = courses.map((course) => ({
      ...course,
      isApproved: false, // no auth check for testing
    }));

    return NextResponse.json(coursesWithUrls, { status: 200 });
  } catch (err) {
    console.error("Error fetching courses:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch courses",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update a course
 */
export async function PUT(request) {
  try {
    // TEMPORARY ADMIN MOCK FOR TESTING
    const decoded = { userId: 1, role: "ADMIN", email: "admin@example.com" };

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Course ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, price, category, thumbnail, videos } = body;

    // Validation
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: "Videos array is required" },
        { status: 400 }
      );
    }

    const courseId = parseInt(id);
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: { videos: true },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Prepare videos data
    const videosData = videos.map((v, index) => {
      if (!v.url || typeof v.url !== "string") {
        throw new Error(
          `Video at index ${index} is missing a valid 'url' string`
        );
      }

      // Convert YouTube URL to embed format
      let videoUrl = v.url;
      if (v.url.includes("youtube.com/watch?v=")) {
        const videoId = v.url.split("v=")[1].split("&")[0];
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (v.url.includes("youtu.be/")) {
        const videoId = v.url.split("youtu.be/")[1].split("?")[0];
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      return {
        id: v.id || undefined, // Keep existing ID if available
        title: v.title || `Video ${index + 1}`,
        url: videoUrl,
        position: index + 1,
        published: true,
      };
    });

    // Update course using transaction to handle video updates
    const updatedCourse = await prisma.$transaction(async (tx) => {
      // Delete existing videos not in the new list
      const existingVideoIds = existingCourse.videos.map((v) => v.id);
      const newVideoIds = videosData.map((v) => v.id).filter((id) => id);

      const videosToDelete = existingVideoIds.filter(
        (id) => !newVideoIds.includes(id)
      );

      if (videosToDelete.length > 0) {
        await tx.video.deleteMany({
          where: { id: { in: videosToDelete } },
        });
      }

      // Update course
      const course = await tx.course.update({
        where: { id: courseId },
        data: {
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price),
          category: category.trim(),
          thumbnail: thumbnail || null,
        },
        include: {
          videos: { orderBy: { position: "asc" } },
          access: true,
        },
      });

      // Update or create videos
      for (const videoData of videosData) {
        if (videoData.id) {
          // Update existing video
          await tx.video.update({
            where: { id: videoData.id },
            data: {
              title: videoData.title,
              url: videoData.url,
              position: videoData.position,
            },
          });
        } else {
          // Create new video
          await tx.video.create({
            data: {
              title: videoData.title,
              url: videoData.url,
              position: videoData.position,
              published: true,
              courseId: courseId,
            },
          });
        }
      }

      // Return the updated course with videos
      return await tx.course.findUnique({
        where: { id: courseId },
        include: {
          videos: { orderBy: { position: "asc" } },
          access: true,
        },
      });
    });

    return NextResponse.json(
      { ...updatedCourse, isApproved: false },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating course:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to update course",
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a course
 */
export async function DELETE(request) {
  try {
    // TEMP ADMIN MOCK
    const decoded = { userId: 1, role: "ADMIN", email: "admin@example.com" };

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "Course ID required" },
        { status: 400 }
      );

    const courseId = parseInt(id);
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { videos: true },
    });

    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.userVideoProgress.deleteMany({
        where: { videoId: { in: course.videos.map((v) => v.id) } },
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
    return NextResponse.json(
      {
        error: "Failed to delete course",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
