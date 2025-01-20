import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//เข้ากลุ่ม
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { eventId, userId } = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!eventId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ตรวจสอบว่ากลุ่มมีอยู่จริงหรือไม่
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "event not found" }, { status: 404 });
    }

    // ตรวจสอบว่าผู้ใช้อยู่ในกลุ่มแล้วหรือไม่
    if (event.listUserJoin.includes(userId)) {
      return NextResponse.json({ error: "User already joined the event" }, { status: 400 });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // เพิ่ม userId ใน listUserJoin ของกลุ่ม และ eventId ใน listofGroup ของผู้ใช้
    const [updatedGroup, updatedUser] = await prisma.$transaction([
      prisma.event.update({
        where: { id: eventId },
        data: {
          listUserJoin: {
            push: userId, // เพิ่ม userId ใน array listUserJoin
          },
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          listofEvent: {
            push: eventId, // เพิ่ม eventId ใน array listofEvent
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        message: "User joined the event successfully",
        updatedGroup,
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}