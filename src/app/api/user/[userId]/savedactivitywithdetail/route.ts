import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

//ดึงรายละเอียดuser แค่ SavedActivity with detail

export async function GET(request: NextRequest, { params }: { params: { userId: string } }): Promise<NextResponse> {
  try {
    const { userId } = await params
    const user = await prisma.user.findUnique(
      {
        where: { id: userId },
        select: {
          savedActivities: true,
        },
        // include: { postedBy: true },
      }
  );
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    const activities = await prisma.activity.findMany({
      where: {
        id: { in: user.savedActivities }, // ดึงข้อมูลที่ id ตรงกับใน savedActivities
      },
      include: {
        // postedBy: true,
        activityGroup: true,
        reviews: {
          select: {
            rating: true, // ดึง rating ของแต่ละรีวิวมาใช้
          },
        },
      },
    });
    const orderedActivities = user.savedActivities.map(activityId => 
      activities.find(activity => activity.id === activityId)
    ).filter(activity => activity !== undefined)
    .reverse(); // กรองค่า null ออก
    
    const activitiesWithAvgRating = activities.map(orderedActivities => {
      const ratings = orderedActivities.reviews.map(review => review.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0; // ถ้าไม่มีรีวิวให้ avgRating เป็น 0

      return {
        ...orderedActivities,
        avgRating,
      };
    });

    return NextResponse.json( activitiesWithAvgRating );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}