import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//ดึงกลุ่มตาม activityId
export async function GET(request: NextRequest ,{ params }: { params: { activityId: string } }): Promise<NextResponse> {
  try {
    const { activityId } = await params
    console.log("activityid",activityId);
    const groups = await prisma.group.findMany({
      where: {
        activityId: activityId
      },
      include: {
        activityBy: true,
        postedBy: true,
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

