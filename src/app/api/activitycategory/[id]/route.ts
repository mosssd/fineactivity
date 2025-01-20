import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest ,{ params }: { params: { id: string }}): Promise<NextResponse> {
  try {
      const { id } = await params
      const category = await prisma.category.findUnique(
        {
          where: { id: id },
        }
    );
      if (!category) {
        return NextResponse.json({ error: "category not found" }, { status: 404 });
      }
      return NextResponse.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}