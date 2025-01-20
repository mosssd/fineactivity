import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Batch API เพื่อดึงข้อมูลผู้ใช้หลายคน
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // อ่าน `userIds` จาก body ของคำขอ
    const body = await request.json();
    const { userIds }: { userIds: string[] } = body;

    if (!userIds || userIds.length === 0) {
      return NextResponse.json(
        { error: "No userIds provided" },
        { status: 400 }
      );
    }

    // ดึงข้อมูลผู้ใช้ที่ตรงกับ userIds ที่ส่งมา
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No users found for the provided userIds" },
        { status: 404 }
      );
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
