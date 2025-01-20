import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//ดึงกลุ่มตาม groupId
export async function GET(request: NextRequest ,{ params }: { params: { groupId: string } }): Promise<NextResponse> {
  try {
    const { groupId } = await params
    console.log("groupId",groupId);
    const group = await prisma.group.findUnique({
      where: {
        id: groupId
      },
      include: {
        activityBy: true,
        postedBy: true,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


