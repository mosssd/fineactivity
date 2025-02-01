import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

//userกดบันทึกกิจกรรม เพิ่มกิจกรรมลงใน savedActivities ของผู้ใช้
export async function PATCH(request: NextRequest, { params }: { params: { activityId: string } }): Promise<NextResponse> {
  try {
    const { activityId } = params;
    const { userId } = await request.json();

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!activityId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ดึงข้อมูล user ปัจจุบัน
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { savedActivities: true }, // ดึงเฉพาะฟิลด์ savedActivities
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updatedSavedActivities;
    if (user.savedActivities.includes(activityId)) {
      // ถ้า activityId มีอยู่แล้ว → ลบออก
      updatedSavedActivities = user.savedActivities.filter((id: string) => id !== activityId);
    } else {
      // ถ้า activityId ยังไม่มี → เพิ่มเข้าไป
      updatedSavedActivities = [...user.savedActivities, activityId];
    }

    // อัปเดต savedActivities ของ user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { savedActivities: updatedSavedActivities },
    });

    return NextResponse.json({ message: "Activity save state updated", data: updatedUser }, { status: 200 });

  } catch (error) {
    console.error("Error updating saved activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}