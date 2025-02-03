import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient();

// Define the expected input type
interface CreateActivityRequest {
  activityName: string
  imageMain: string 
  imageDetail?: string[]
  description: string
  location?: string
  userId: string
  categories: string[]
  contact: string
  address?: string
  dayTime: string
}
//โพสกิจกรรม
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateActivityRequest = await request.json();
    const { activityName, imageMain, imageDetail , description, location, userId, categories, contact, address, dayTime} = body;
    const session = await getServerSession(authOptions);
    console.log("sesssjaa",session);

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!activityName || !imageMain || !categories || !contact || !address || !dayTime) { 
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // console.log("xxxxx",body);
    // สร้างกิจกรรมใหม่ในฐานข้อมูล
    const newActivity = await prisma.activity.create({
      data: {
        activityName,
        imageMain,
        imageDetail ,
        description,
        categories,
        location,
        contact,
        dayTime: dayTime ?? "default-value",
        address,
        postedBy: {
          connect: { id: userId } 
        }
      },
    });

    const userdetail = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        activitiesPosted: true,
      },
    });
    console.log("xxxxx",userdetail);

    return NextResponse.json({ message: "Activity created", newActivity }, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//ดึงกิจกรรมทั้งหมด
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const activities = await prisma.activity.findMany({
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

    // คำนวณค่าเฉลี่ย rating สำหรับแต่ละกิจกรรม
    const activitiesWithAvgRating = activities.map(activity => {
      const ratings = activity.reviews.map(review => review.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0; // ถ้าไม่มีรีวิวให้ avgRating เป็น 0

      return {
        ...activity,
        avgRating,
      };
    });

    return NextResponse.json(activitiesWithAvgRating);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
