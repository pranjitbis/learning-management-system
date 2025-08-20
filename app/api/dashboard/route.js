import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(req) {
  try {
    // 1) Auth
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

    // 2) Ensure user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3) Get only APPROVED courses for this user
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

    // 4) Pull user's per-video progress once
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

    // 5) For each course, compute progress + attach approved certificate + determine locked status
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const totalVideos = course.videos.length;

        const videosWithProgress = course.videos.map((video, index) => {
          const vp = progressMap.get(video.id);
          const completed = Boolean(vp?.completed);
          const progress = vp?.progress ?? 0;
          
          // First video is always unlocked, others depend on previous video completion
          const locked = index > 0 && !progressMap.get(course.videos[index - 1].id)?.completed;
          
          return {
            ...video,
            progress,
            completed,
            locked,
            formattedDuration: video.duration ? formatDuration(video.duration) : "--:--"
          };
        });

        const videosWatched = videosWithProgress.filter((v) => v.completed).length;
        const completed = totalVideos > 0 && videosWatched === totalVideos;
        const completionPercentage =
          totalVideos === 0 ? 0 : Math.round((videosWatched / totalVideos) * 100);

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

    // Helper function to format duration
    function formatDuration(seconds) {
      if (!seconds || isNaN(seconds)) return "--:--";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 6) Respond
    return NextResponse.json({ user, courses: coursesWithProgress });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", details: err.message },
      { status: 500 }
    );
  }
}