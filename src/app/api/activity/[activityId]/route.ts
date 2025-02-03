import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

//ดึงรายละเอียดกิจกรรม
export async function GET(request: NextRequest, { params }: { params: { activityId: string } }): Promise<NextResponse> {
  try {
    const activity = await prisma.activity.findUnique(
      {
        where: { id: params.activityId },
        select: {
          id: true,
          activityName: true,
          imageMain: true,
          imageDetail: true,
          description: true,
          categories: true,
          location: true,
          contact: true,
          dayTime: true,
          address: true,
        },
      }
  );
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}