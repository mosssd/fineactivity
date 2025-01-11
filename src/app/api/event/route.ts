import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { DateTime } from 'next-auth/providers/kakao';


const prisma = new PrismaClient();

// Define the expected input type
interface CreateEventRequest {
  eventName: string
  image: string 
  description: string
  address?: string
  userId: string
  categories?: string[]
  contact: string
  startDate: DateTime
  endDate: DateTime
  startTime: string
  endTime: string
}
//โพสกิจกรรม
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateEventRequest = await request.json();
    const { eventName, image, description, address, userId, categories, contact, startDate, endDate, startTime, endTime} = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!eventName || !description || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    console.log("xxxxx",body);
    // สร้างอีเว้นใหม่ในฐานข้อมูล
    const newEvent = await prisma.event.create({
      data: {
        eventName,
        image,
        description,
        categories,
        address,
        contact,
        startDate,
        endDate,
        startTime,
        endTime,
        postedBy: {
          connect: { id: userId } 
        }
      },
    });

    // const userdetail = await prisma.user.findUnique({
    //   where: { id: userId },
    //   include: {
    //     activitiesPosted: true,
    //   },
    // });
    // console.log("xxxxx",userdetail);

    return NextResponse.json({ message: "Event created", newEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//ดึงกิจกรรมทั้งหมด
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const events = await prisma.event.findMany(
      {
        include: {
          postedBy: true,
        },
      }
    );

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}