import prisma from "../../../lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(request) {
  try {
    // 1. Authentication Check
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json(
        { error: "Unauthorized - Missing or invalid token" },
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 2. Token Verification
    const token = authHeader.split(" ")[1];
    let payload;
    try {
      payload = verify(token, process.env.NEXTAUTH_SECRET);
    } catch (err) {
      return Response.json(
        { error: "Unauthorized - Invalid token" },
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 3. Fetch User Data with Progress
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        access: {
          where: { approved: true },
          include: {
            course: {
              include: {
                videos: {
                  orderBy: { id: "asc" }, // Ensure consistent ordering
                },
                progress: {
                  where: { userId: payload.userId },
                },
                certificates: {
                  where: { userId: payload.userId },
                  orderBy: { issuedAt: "desc" }, // Get most recent first
                  take: 1, // Only need the latest certificate
                },
                _count: {
                  select: { videos: true }, // Get total video count
                },
              },
            },
          },
        },
        // Include video-level progress for more detailed tracking
        videoProgress: {
          where: {
            video: {
              course: {
                access: {
                  some: {
                    userId: payload.userId,
                    approved: true,
                  },
                },
              },
            },
          },
          select: {
            videoId: true,
            progress: true,
            completed: true,
            video: {
              select: {
                courseId: true,
                duration: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 4. Process Course Data with Detailed Progress
    const courses = user.access.map((access) => {
      const course = access.course;
      const courseProgress = course.progress[0];
      const videoProgressMap = user.videoProgress
        .filter((vp) => vp.video.courseId === course.id)
        .reduce((map, vp) => {
          map[vp.videoId] = vp;
          return map;
        }, {});

      // Calculate completion percentage
      const totalVideos = course._count.videos;
      const completedVideos = Object.values(videoProgressMap).filter(
        (vp) => vp.completed
      ).length;
      const completionPercentage =
        totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        totalVideos,
        completedVideos,
        completionPercentage,
        isCompleted: courseProgress?.completed || false,
        lastAccessed: courseProgress?.lastWatchedAt || null,
        hasCertificate: course.certificates.length > 0,
        certificate: course.certificates[0] || null,
        videos: course.videos.map((video) => ({
          id: video.id,
          title: video.title,
          duration: video.duration,
          progress: videoProgressMap[video.id]?.progress || 0,
          isCompleted: videoProgressMap[video.id]?.completed || false,
          lastWatched: videoProgressMap[video.id]?.completedAt || null,
        })),
      };
    });

    // 5. Prepare Response
    const completedCourses = courses.filter((c) => c.isCompleted);
    const inProgressCourses = courses.filter(
      (c) => !c.isCompleted && c.completedVideos > 0
    );
    const notStartedCourses = courses.filter((c) => c.completedVideos === 0);

    const responseData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt,
      },
      stats: {
        totalCourses: courses.length,
        completedCourses: completedCourses.length,
        inProgressCourses: inProgressCourses.length,
        notStartedCourses: notStartedCourses.length,
        totalVideosWatched: user.videoProgress.filter((vp) => vp.progress > 0)
          .length,
        totalMinutesWatched: Math.floor(
          user.videoProgress.reduce((sum, vp) => sum + vp.progress, 0) / 60
        ),
      },
      courses: {
        completed: completedCourses,
        inProgress: inProgressCourses,
        notStarted: notStartedCourses,
      },
      certificates: courses
        .filter((c) => c.hasCertificate)
        .map((c) => c.certificate),
    };

    return Response.json(responseData, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return Response.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
