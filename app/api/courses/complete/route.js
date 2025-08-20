import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = verify(token, process.env.NEXTAUTH_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    // Mark course as complete or update progress
    await prisma.userCourseProgress.upsert({
      where: {
        userId_courseId: {
          userId: payload.userId,
          courseId
        }
      },
      update: { completed: true, completedAt: new Date() },
      create: {
        userId: payload.userId,
        courseId,
        completed: true,
        completedAt: new Date()
      }
    });

    return NextResponse.json({ message: 'Course marked as complete' });
  } catch (error) {
    console.error('Error completing course:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
