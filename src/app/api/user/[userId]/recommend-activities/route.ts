import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const getRecommendedActivities = async (userId: string) => {
  // ดึงข้อมูลของผู้ใช้ รวมถึง savedActivities (แค่ 10 อันล่าสุด)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { savedActivities: true },
  });

  if (!user || !user.savedActivities.length) return [];

  // เอาแค่ 10 กิจกรรมล่าสุด
  const latestSavedActivities = user.savedActivities.slice(-10).reverse(); // เอาอันล่าสุดมาก่อน

  // ดึงหมวดหมู่ของกิจกรรมที่ถูกบันทึกล่าสุด
  const categories = await prisma.activity.findMany({
    where: { id: { in: latestSavedActivities } },
    select: { id: true, categories: true },
  });

  // จัดน้ำหนักของหมวดหมู่ โดยให้กิจกรรมที่ถูกบันทึกล่าสุดมีน้ำหนักมากกว่า
  const categoryWeights: Record<string, number> = {};

  categories.forEach((activity, index) => {
    activity.categories.forEach((category) => {
      const weight = 10 - index; // อันที่บันทึกล่าสุดมีน้ำหนักมากกว่า
      categoryWeights[category] = (categoryWeights[category] || 0) + weight;
    });
  });

  // เรียงหมวดหมู่ที่มีน้ำหนักมากสุด
  const sortedCategories = Object.keys(categoryWeights).sort(
    (a, b) => categoryWeights[b] - categoryWeights[a]
  );

  // ดึงกิจกรรมที่ตรงกับหมวดหมู่ที่มีน้ำหนักมากสุด
  const recommendedActivities = await prisma.activity.findMany({
    where: {
      categories: { hasSome: sortedCategories },
      id: { notIn: latestSavedActivities }, // ไม่แนะนำกิจกรรมที่บันทึกไปแล้ว
    },
    include: {
      postedBy: true,
      activityGroup: true,
    },
    orderBy: { createdAt: "desc" }, // จัดลำดับจากกิจกรรมล่าสุด
    take: 10,
  });

  return recommendedActivities;
};

export async function GET(request: NextRequest, { params }: { params: { userId: string } }): Promise<NextResponse> {
  const { userId } = await params

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const recommendedActivities = await getRecommendedActivities(userId);
    return NextResponse.json( recommendedActivities );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }

}
