import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";

/* ======================================================
   GET: Fetch Dashboard Data
====================================================== */
export async function GET(req) {
  try {
    // 1) Authentication
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

    const userId = parseInt(decoded.userId);
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // 2) User verification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3) Get approved courses for user
    const accessList = await prisma.access.findMany({
      where: { userId, approved: true },
      include: {
        course: {
          include: {
            videos: {
              select: {
                id: true,
                title: true,
                url: true,
                duration: true,
                position: true,
              },
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });
    const courses = accessList.map((a) => a.course);

    // 4) Get user's video progress
    const userVideoProgress = await prisma.userVideoProgress.findMany({
      where: { userId },
      select: { videoId: true, progress: true, completed: true },
    });
    const progressMap = new Map(
      userVideoProgress.map((p) => [
        p.videoId,
        { progress: p.progress, completed: p.completed },
      ])
    );

    // Helper function: format duration
    function formatDuration(seconds) {
      if (!seconds || isNaN(seconds)) return "--:--";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    // 5) Process courses with progress and certificates
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const totalVideos = course.videos.length;

        const videosWithProgress = course.videos.map((video, index) => {
          const vp = progressMap.get(video.id);
          const completed = Boolean(vp?.completed);
          const progress = vp?.progress ?? 0;

          // First video is always unlocked, others depend on previous video completion
          const locked =
            index > 0 &&
            !progressMap.get(course.videos[index - 1].id)?.completed;

          return {
            ...video,
            progress,
            completed,
            locked,
            formattedDuration: video.duration
              ? formatDuration(video.duration)
              : "--:--",
          };
        });

        const videosWatched = videosWithProgress.filter(
          (v) => v.completed
        ).length;
        const completed = totalVideos > 0 && videosWatched === totalVideos;
        const completionPercentage =
          totalVideos === 0
            ? 0
            : Math.round((videosWatched / totalVideos) * 100);

        const approvedCert = await prisma.certificate.findFirst({
          where: { userId, courseId: course.id, approved: true },
          select: { filePath: true },
        });

        const certificateUrl = approvedCert
          ? `/uploads/certificates/${approvedCert.filePath}`
          : null;

        return {
          ...course,
          videos: videosWithProgress,
          certificateUrl,
          progress: {
            videosWatched,
            totalVideos,
            completionPercentage,
            completed,
          },
        };
      })
    );

    // 6) Success response
    return NextResponse.json({
      user,
      courses: coursesWithProgress,
      stats: {
        totalCourses: coursesWithProgress.length,
        completedCourses: coursesWithProgress.filter(
          (c) => c.progress.completed
        ).length,
        inProgressCourses: coursesWithProgress.filter(
          (c) => !c.progress.completed && c.progress.videosWatched > 0
        ).length,
        totalVideosWatched: coursesWithProgress.reduce(
          (sum, c) => sum + c.progress.videosWatched,
          0
        ),
      },
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

/* ======================================================
   POST: Update Video Duration & Progress
====================================================== */
export async function POST(req) {
  try {
    // 1) Authentication
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

    const userId = parseInt(decoded.userId);
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // 2) Parse body
    const { videoId, duration, progress, completed } = await req.json();
    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }
    const videoIdNum = parseInt(videoId);
    if (isNaN(videoIdNum)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    // 3) Verify the user has access to this video
    const videoAccess = await prisma.video.findFirst({
      where: {
        id: videoIdNum,
        course: {
          access: { some: { userId, approved: true } },
        },
      },
    });
    if (!videoAccess) {
      return NextResponse.json(
        { error: "No access to this video" },
        { status: 403 }
      );
    }

    // 4) Prepare updates
    const updates = {};

    // ✅ Duration update goes to Video (uses updatedAt)
    if (duration !== undefined && duration > 0) {
      updates.duration = {
        update: {
          where: { id: videoIdNum },
          data: {
            duration: Math.round(duration),
            updatedAt: new Date(),
          },
        },
      };
    }

    // ✅ Progress update goes to userVideoProgress (uses lastUpdated)
    if (progress !== undefined || completed !== undefined) {
      const progressData = {
        progress: Math.min(100, Math.max(0, progress || 0)),
        completed: completed || false,
        lastUpdated: new Date(),
      };

      updates.progress = {
        upsert: {
          where: { userId_videoId: { userId, videoId: videoIdNum } },
          update: progressData,
          create: { userId, videoId: videoIdNum, ...progressData },
        },
      };
    }

    // 5) Execute updates
    if (Object.keys(updates).length > 0) {
      if (updates.duration && updates.progress) {
        await prisma.$transaction([
          prisma.video.update(updates.duration.update),
          prisma.userVideoProgress.upsert(updates.progress.upsert),
        ]);
      } else if (updates.duration) {
        await prisma.video.update(updates.duration.update);
      } else if (updates.progress) {
        await prisma.userVideoProgress.upsert(updates.progress.upsert);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Video data updated successfully",
      updated: {
        duration: duration !== undefined,
        progress: progress !== undefined,
        completed: completed !== undefined,
      },
    });
  } catch (err) {
    console.error("Video update error:", err);
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update video data" },
      { status: 500 }
    );
  }
}
