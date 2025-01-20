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
  address?: string
  userId: string
  categories?: string[]
  contact: string
}
//โพสกิจกรรม
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateActivityRequest = await request.json();
    const { activityName, imageMain, imageDetail , description, address, userId, categories, contact} = body;
    const session = await getServerSession(authOptions);
    console.log("sesssjaa",session);

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!activityName || !description || !imageMain) {
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
        address,
        contact,
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
    const activities = await prisma.activity.findMany(
      {
      include: {
        postedBy: true,
        activityGroup: true,
      },
    }
  );

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}