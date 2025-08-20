import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { verify } from "jsonwebtoken";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = verify(token, process.env.NEXTAUTH_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const { videoId, progress, completed } = await req.json();

    // ✅ Upsert video progress
    await prisma.userVideoProgress.upsert({
      where: { userId_videoId: { userId, videoId } },
      update: { progress, completed, completedAt: completed ? new Date() : null },
      create: { userId, videoId, progress, completed, completedAt: completed ? new Date() : null },
    });

    // ✅ Update course progress
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    let courseCompleted = false;

    if (video) {
      const courseId = video.courseId;

      const totalVideos = await prisma.video.count({ where: { courseId } });
      const completedVideos = await prisma.userVideoProgress.count({
        where: { userId, completed: true, video: { courseId } },
      });

      courseCompleted = completedVideos === totalVideos;

      await prisma.userCourseProgress.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {
          videosWatched: completedVideos,
          totalVideos,
          completed: courseCompleted,
          completedAt: courseCompleted ? new Date() : null,
        },
        create: {
          userId,
          courseId,
          videosWatched: completedVideos,
          totalVideos,
          completed: courseCompleted,
          completedAt: courseCompleted ? new Date() : null,
        },
      });
    }

    // ✅ Return completion status
    return NextResponse.json({ success: true, courseCompleted });
  } catch (err) {
    console.error("Progress update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
