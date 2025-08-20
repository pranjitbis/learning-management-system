import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function DELETE(req, context) {
  try {
    const params = await context.params; // ✅ await params
    const certId = parseInt(params.id);

    const cert = await prisma.certificate.findUnique({ where: { id: certId } });
    if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });

    // Delete file from public/uploads/certificates
    const filePath = path.join(process.cwd(), "public/uploads/certificates", cert.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.certificate.delete({ where: { id: certId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/certificates/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
