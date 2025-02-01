import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//ดึงdetailกลุ่มตามlistofGroupของผู้ใช้ แต่listofgroup เป็นarrayธรรมดาที่เก็บgroupIdเท่านั้น ไม่ได้เป็น prisma relation
export async function GET(request: NextRequest ,{ params }: { params: { userId: string } }): Promise<NextResponse> {
  try {
    const { userId } = await params
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        listofGroup: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const groups = await prisma.group.findMany({
      where: {
        id: {
          in: user.listofGroup,
        },
      },
      include: {
        activityBy: true,
      },
    });
    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


