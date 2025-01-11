import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateCategoryRequest {
  name: string;
}
export async function POST(request: NextRequest): Promise<NextResponse>{
  try {
    const body: CreateCategoryRequest = await request.json();
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const data = await prisma.category.create({
      data: {
        name
      },
    });

    return NextResponse.json({
      massage: 'User created successfully',
      data : data,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await prisma.category.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}