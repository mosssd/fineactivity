import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

//ดึงรายละเอียดuser
export async function GET(request: NextRequest, { params }: { params: { userId: string } }): Promise<NextResponse> {
  try {
    const { userId } = await params
    const user = await prisma.user.findUnique(
      {
        where: { id: params.userId },
        // include: { postedBy: true },
      }
  );
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}