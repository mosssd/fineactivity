import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the expected input type
interface CreateGroupRequest {
  groupName: string
  description: string
  activityId: string
  userId: string
  date: Date
  startTime: string
  endTime: string
}
//โพสกลุ่ม
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateGroupRequest = await request.json();
    const { groupName, description, activityId, userId, date, startTime, endTime} = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!groupName || !description || !activityId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    console.log("xxxxx",body);
    // สร้างกิจกรรมใหม่ในฐานข้อมูล
    const newgroup = await prisma.group.create({
      data: {
        groupName,
        description,
        date,
        startTime,
        endTime,
        activityBy: {
          connect: { id: activityId } 
        },
        postedBy: {
          connect: { id: userId }
        },
      },
    });

    return NextResponse.json({ message: "group created", newgroup }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
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
      },
    }
  );

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}