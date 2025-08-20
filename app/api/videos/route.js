// app/api/videos/route.js
import prisma from '../../lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { courseId, title, description, url } = body;

    if (!courseId || !title || !url) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({ where: { id: Number(courseId) } });
    if (!course) return new Response(JSON.stringify({ error: "Course not found" }), { status: 404 });

    // Add video
    const video = await prisma.video.create({
      data: {
        courseId: Number(courseId),
        title,
        description,
        url,
      },
    });

    return new Response(JSON.stringify(video), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
