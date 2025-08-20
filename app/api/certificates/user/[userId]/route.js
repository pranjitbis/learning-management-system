import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();

    const userId = parseInt(formData.get("userId"));
    const courseId = parseInt(formData.get("courseId"));
    const certificateFile = formData.get("certificate");

    if (!certificateFile) throw new Error("No file uploaded");

    // Create uploads/certificates folder
    const uploadDir = path.join(process.cwd(), "uploads/certificates");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `cert_${Date.now()}${path.extname(certificateFile.name)}`;
    const filePath = path.join(uploadDir, fileName);
    const buffer = await certificateFile.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Save to DB
    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        filePath: fileName,
        approved: true, // admin approved by default
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
