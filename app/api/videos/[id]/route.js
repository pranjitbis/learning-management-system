import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const videoId = parseInt(params.id);
    if (isNaN(videoId)) return new NextResponse("Invalid video ID", { status: 400 });

    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video?.url) return new NextResponse("Video not found", { status: 404 });

    const videoPath = path.join(process.cwd(), "public/uploads", video.url);
    if (!fs.existsSync(videoPath)) return new NextResponse("Video file missing", { status: 404 });

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.get("range");

    if (range) {
      // Handle partial content (streaming)
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      
      const file = fs.createReadStream(videoPath, { start, end });
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };

      return new NextResponse(file, { status: 206, headers });
    } else {
      // Full video download
      const headers = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      const file = fs.createReadStream(videoPath);
      return new NextResponse(file, { headers });
    }
  } catch (err) {
    console.error("Video streaming error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}