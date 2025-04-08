import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

//ดึงรายละเอียดuser แค่ SavedEvent with detail

export async function GET(request: NextRequest, { params }: { params: { userId: string } }): Promise<NextResponse> {
  try {
    const { userId } = await params
    const user = await prisma.user.findUnique(
      {
        where: { id: userId },
        select: {
          savedEvents: true,
        },
        // include: { postedBy: true },
      }
  );
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    const events = await prisma.event.findMany({
      where: {
        id: { in: user.savedEvents }, // ดึงข้อมูลที่ id ตรงกับใน savedevents
      },
      include: {
        postedBy: true,
      },
    });
    const orderedEvents = user.savedEvents.map(eventId => 
      events.find(event => event.id === eventId)
    ).filter(event => event !== undefined) // กรองค่า null ออก
    .reverse();

    const filteredEvents = orderedEvents.filter((event) => {
        return new Date(event.endDate) >= new Date();
      }
    );
    return NextResponse.json(filteredEvents);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}