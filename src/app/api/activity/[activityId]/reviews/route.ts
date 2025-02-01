import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

//เขียนรีวิวกิจกรรม
export async function POST(request: NextRequest, { params }: { params: { activityId: string } }): Promise<NextResponse> {
  try {
    const { activityId } = await params
    const { rating, comment, userId } = await request.json()
    const review = await prisma.review.create({
      data: {
        rating: rating,
        comment: comment,
        activityId: activityId,
        userId: userId, // Replace "someUserId" with the actual user ID
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error posting review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//ดึงรีวิวกิจกรรม
export async function GET(request: NextRequest, { params }: { params: { activityId: string } }): Promise<NextResponse> {
  try {
    const { activityId } = await params
    const reviews = await prisma.review.findMany({
      where: { activityId: activityId },
      include: { user: true },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}