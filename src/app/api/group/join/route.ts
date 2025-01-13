import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//เข้ากลุ่ม
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { groupId, userId } = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!groupId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ตรวจสอบว่ากลุ่มมีอยู่จริงหรือไม่
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // ตรวจสอบว่าผู้ใช้อยู่ในกลุ่มแล้วหรือไม่
    if (group.listUserJoin.includes(userId)) {
      return NextResponse.json({ error: "User already joined the group" }, { status: 400 });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // เพิ่ม userId ใน listUserJoin ของกลุ่ม และ groupId ใน listofGroup ของผู้ใช้
    const [updatedGroup, updatedUser] = await prisma.$transaction([
      prisma.group.update({
        where: { id: groupId },
        data: {
          listUserJoin: {
            push: userId, // เพิ่ม userId ใน array listUserJoin
          },
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          listofGroup: {
            push: groupId, // เพิ่ม groupId ใน array listofGroup
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        message: "User joined the group successfully",
        updatedGroup,
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}