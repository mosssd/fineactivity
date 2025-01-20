import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ฟังก์ชันตรวจสอบ groupId
export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
): Promise<NextResponse> {
  const { groupId } = params;

  try {
    // ตรวจสอบว่ามี groupId อยู่ในฐานข้อมูลหรือไม่
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      // groupId ไม่พบในฐานข้อมูล
      return NextResponse.json(
        { valid: false},
        { status: 404 }
      );
    }

    // groupId มีอยู่ในฐานข้อมูล
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Error validating groupId:", error);
    return NextResponse.json(
      { valid: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
