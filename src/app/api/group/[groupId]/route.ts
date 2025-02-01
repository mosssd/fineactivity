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

//update กลุ่ม
export async function PATCH(request: NextRequest ,{ params }: { params: { groupId: string } }): Promise<NextResponse> {
  try {
    const { groupId } = await params
    const body = await request.json();
    const { groupName, description, date, startTime, endTime } = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!groupId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // อัพเดทกลุ่มในฐานข้อมูล
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: {
        groupName,
        description,
        date,
        startTime,
        endTime,
      },
    });

    return NextResponse.json({ message: "group updated", updatedGroup });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//ลบกลุ่ม
export async function DELETE(request: NextRequest ,{ params }: { params: { groupId: string } }): Promise<NextResponse> {
  try {
    const { groupId } = await params

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { listUserJoin: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const updateUsers = group.listUserJoin.map(userId =>
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, listofGroup: true } })
    );
    
    // ดึงข้อมูล listofGroup ของผู้ใช้ทั้งหมด
    const users = await Promise.all(updateUsers);
    
    const updates = users.map(user => {
      if (user && user.listofGroup) {
        const updatedListofGroup = user.listofGroup.filter(group => group !== groupId);
        return prisma.user.update({
          where: { id: user.id },
          data: { listofGroup: { set: updatedListofGroup } },
        });
      }
    });
    
    // อัปเดตทั้งหมดพร้อมกันใน Transaction
    await prisma.$transaction(updates.filter(update => update !== undefined));
    // ลบกลุ่มในฐานข้อมูล
    await prisma.group.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ message: "group deleted" });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}