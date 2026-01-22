// app/api/courses/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Helper function to convert YouTube ID/URL to embed URL
 */
function normalizeYouTubeUrl(urlOrId) {
  if (!urlOrId || typeof urlOrId !== "string") {
    throw new Error("Invalid URL or ID");
  }

  const trimmed = urlOrId.trim();

  // If it's already a full URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    // Convert youtu.be to youtube.com/embed
    if (trimmed.includes("youtu.be/")) {
      const videoId = trimmed.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert watch URL to embed URL
    else if (trimmed.includes("youtube.com/watch")) {
      const urlParams = new URL(trimmed);
      const videoId = urlParams.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    // Already embed URL or other valid URL
    return trimmed;
  }
  // If it's just a YouTube ID (like xBacRip8o5Y)
  else {
    // Check if it looks like a YouTube ID (11 characters, alphanumeric with underscores and hyphens)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return `https://www.youtube.com/embed/${trimmed}`;
    }
    // If not a valid YouTube ID format, assume it's meant to be a full URL
    return `https://www.youtube.com/embed/${trimmed}`;
  }
}

/**
 * POST - Admin creates new course
 */
export async function POST(request) {
  try {
    // TEMPORARY ADMIN MOCK FOR TESTING
    const decoded = { userId: 1, role: "ADMIN", email: "elenxia@gmail.com" };

    const body = await request.json();
    console.log("Received POST request body:", JSON.stringify(body, null, 2));

    const { title, description, price, category, thumbnail, videos } = body;

    // Validation
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, description, price, category",
        },
        { status: 400 },
      );
    }

    console.log("Videos received:", videos);

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: "At least one video is required" },
        { status: 400 },
      );
    }

    // Enhanced validation with better error messages
    const videosData = videos.map((v, index) => {
      console.log(`Processing video ${index}:`, v);

      // Check if video object exists
      if (!v) {
        throw new Error(`Video at index ${index} is null or undefined`);
      }

      // Check if url property exists
      if (!v.hasOwnProperty("url")) {
        throw new Error(
          `Video at index ${index} (title: "${v.title || "untitled"}") is missing 'url' property`,
        );
      }

      // Check if url is null or undefined
      if (v.url === null || v.url === undefined) {
        throw new Error(
          `Video at index ${index} (title: "${v.title || "untitled"}") has null/undefined URL`,
        );
      }

      // Check if url is a string
      if (typeof v.url !== "string") {
        throw new Error(
          `Video at index ${index} has invalid URL type: ${typeof v.url}. Expected string.`,
        );
      }

      // Check if url is not empty after trimming
      const urlString = v.url.toString().trim();
      if (!urlString) {
        throw new Error(
          `Video at index ${index} (title: "${v.title || "untitled"}") has empty URL`,
        );
      }

      try {
        // Normalize YouTube URL/ID to embed URL
        const normalizedUrl = normalizeYouTubeUrl(urlString);

        console.log(
          `Normalized URL for video ${index}: ${urlString} -> ${normalizedUrl}`,
        );

        return {
          title: v.title || `Video ${index + 1}`,
          url: normalizedUrl,
          position: index + 1,
          published: true,
        };
      } catch (urlError) {
        throw new Error(
          `Video at index ${index} (title: "${v.title || "untitled"}") has invalid URL/ID: "${urlString}". Please enter a valid YouTube URL or ID.`,
        );
      }
    });

    console.log("Processed videos data:", videosData);

    // Check if price is valid
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json(
        { error: "Invalid price value" },
        { status: 400 },
      );
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        category: category.trim(),
        thumbnail: thumbnail || null,
        videos: { create: videosData },
      },
      include: {
        videos: { orderBy: { position: "asc" } },
        access: true,
      },
    });

    console.log("Course created successfully:", course.id);

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        course: { ...course, isApproved: false },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating course:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to create course",
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 },
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
      isApproved: false,
    }));

    return NextResponse.json(
      {
        success: true,
        courses: coursesWithUrls,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error fetching courses:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch courses",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 },
    );
  }
}

/**
 * PUT - Update a course
 */
export async function PUT(request) {
  try {
    const decoded = { userId: 1, role: "ADMIN", email: "elenxia@gmail.com" };

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Course ID required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { title, description, price, category, thumbnail, videos } = body;

    // Validation
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one video is required" },
        { status: 400 },
      );
    }

    const courseId = parseInt(id);
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: { videos: true },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 },
      );
    }

    // Prepare videos data
    const videosData = videos.map((v, index) => {
      if (!v) {
        throw new Error(`Video at index ${index} is null or undefined`);
      }

      if (!v.hasOwnProperty("url")) {
        throw new Error(
          `Video at index ${index} (title: "${v.title || "untitled"}") is missing 'url' property`,
        );
      }

      if (v.url === null || v.url === undefined) {
        throw new Error(
          `Video at index ${index} (title: "${v.title || "untitled"}") has null/undefined URL`,
        );
      }

      if (typeof v.url !== "string") {
        throw new Error(
          `Video at index ${index} has invalid URL type: ${typeof v.url}. Expected string.`,
        );
      }

      const urlString = v.url.toString().trim();
      if (!urlString) {
        throw new Error(
          `Video at index ${index} (title: "${v.title || "untitled"}") has empty URL`,
        );
      }

      const normalizedUrl = normalizeYouTubeUrl(urlString);

      return {
        id: v.id || undefined,
        title: v.title || `Video ${index + 1}`,
        url: normalizedUrl,
        position: index + 1,
        published: true,
      };
    });

    // Update course using transaction
    const updatedCourse = await prisma.$transaction(async (tx) => {
      // Delete existing videos not in the new list
      const existingVideoIds = existingCourse.videos.map((v) => v.id);
      const newVideoIds = videosData.map((v) => v.id).filter((id) => id);

      const videosToDelete = existingVideoIds.filter(
        (id) => !newVideoIds.includes(id),
      );

      if (videosToDelete.length > 0) {
        await tx.video.deleteMany({
          where: { id: { in: videosToDelete } },
        });
      }

      // Update course
      await tx.course.update({
        where: { id: courseId },
        data: {
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price),
          category: category.trim(),
          thumbnail: thumbnail || null,
        },
      });

      // Update or create videos
      for (const videoData of videosData) {
        if (videoData.id) {
          await tx.video.update({
            where: { id: videoData.id },
            data: {
              title: videoData.title,
              url: videoData.url,
              position: videoData.position,
            },
          });
        } else {
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
      {
        success: true,
        message: "Course updated successfully",
        course: { ...updatedCourse, isApproved: false },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error updating course:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to update course",
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE - Delete a course
 */
export async function DELETE(request) {
  try {
    const decoded = { userId: 1, role: "ADMIN", email: "elenxia@gmail.com" };

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Course ID required" },
        { status: 400 },
      );
    }

    const courseId = parseInt(id);
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { videos: true },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 },
      );
    }

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

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting course:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete course",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 },
    );
  }
}
