import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

//ดึงรายละเอียดกิจกรรม
export async function GET(request: NextRequest, { params }: { params: { eventId: string } }): Promise<NextResponse> {
  try {
    const event = await prisma.event.findUnique(
      {
        where: { id: params.eventId },
        include: { postedBy: true },
      }
  );
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}