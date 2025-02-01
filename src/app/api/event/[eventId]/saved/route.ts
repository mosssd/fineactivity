import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

//userกดบันทึกกิจกรรม เพิ่มกิจกรรมลงใน savedEvents ของผู้ใช้
export async function PATCH(request: NextRequest, { params }: { params: { eventId: string } }): Promise<NextResponse> {
  try {
    const { eventId } = params;
    const { userId } = await request.json();

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!eventId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ดึงข้อมูล user ปัจจุบัน
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { savedEvents: true }, // ดึงเฉพาะฟิลด์ savedEvents
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updatedsavedEvents;
    if (user.savedEvents.includes(eventId)) {
      // ถ้า eventId มีอยู่แล้ว → ลบออก
      updatedsavedEvents = user.savedEvents.filter((id: string) => id !== eventId);
    } else {
      // ถ้า eventId ยังไม่มี → เพิ่มเข้าไป
      updatedsavedEvents = [...user.savedEvents, eventId];
    }

    // อัปเดต savedEvents ของ user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { savedEvents: updatedsavedEvents },
    });

    return NextResponse.json({ message: "event save state updated", data: updatedUser }, { status: 200 });

  } catch (error) {
    console.error("Error updating saved event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}