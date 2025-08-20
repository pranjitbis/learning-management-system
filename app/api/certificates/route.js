import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// GET: fetch all certificates or for a specific user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") ? parseInt(searchParams.get("userId")) : null;

    const whereClause = userId ? { userId } : {};

    const certificates = await prisma.certificate.findMany({
      where: whereClause,
      include: { user: true, course: true },
      orderBy: { issuedAt: "desc" },
    });

    const certificatesWithStatus = await Promise.all(
      certificates.map(async (cert) => {
        const userData = cert.user ? { id: cert.user.id, name: cert.user.name, email: cert.user.email } : null;
        const courseData = cert.course ? { id: cert.course.id, title: cert.course.title } : null;

        return {
          id: cert.id,
          userId: cert.userId,
          courseId: cert.courseId,
          approved: cert.approved,
          issuedAt: cert.issuedAt,
          filePath: cert.filePath,
          user: userData,
          course: courseData,
          certificateUrl: cert.filePath ? `/uploads/certificates/${cert.filePath}` : null,
        };
      })
    );

    return NextResponse.json(certificatesWithStatus, { status: 200 });
  } catch (err) {
    console.error("GET /api/certificates error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: upload a certificate
export async function POST(req) {
  try {
    const formData = await req.formData();
    const userId = parseInt(formData.get("userId"));
    const courseId = parseInt(formData.get("courseId"));
    const file = formData.get("certificate");

    if (!userId || !courseId || !file) throw new Error("Missing data or file");

    // Prevent duplicate certificate
    const existing = await prisma.certificate.findFirst({ where: { userId, courseId } });
    if (existing) {
      return NextResponse.json({ error: "Certificate already exists for this user and course." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/certificates");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `cert_${Date.now()}${path.extname(file.name || "certificate.pdf")}`;
    const filePath = path.join(uploadDir, fileName);
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    const certificate = await prisma.certificate.create({
      data: { userId, courseId, filePath: fileName, approved: true },
      include: { user: true, course: true },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (err) {
    console.error("POST /api/certificates error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
