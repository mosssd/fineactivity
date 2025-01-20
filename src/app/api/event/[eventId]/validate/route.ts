import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ฟังก์ชันตรวจสอบ eventId
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
): Promise<NextResponse> {
  const { eventId } = params;

  try {
    // ตรวจสอบว่ามี eventId อยู่ในฐานข้อมูลหรือไม่
    const group = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!group) {
      // eventId ไม่พบในฐานข้อมูล
      return NextResponse.json(
        { valid: false},
        { status: 404 }
      );
    }

    // eventId มีอยู่ในฐานข้อมูล
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Error validating eventId:", error);
    return NextResponse.json(
      { valid: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
