import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}


async function getRecommendedActivities(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { savedActivities: true },
  });

  if (!user || user.savedActivities.length === 0) return [];
  console.log("userxx",user);
  // ดึงเวกเตอร์ของกิจกรรมที่ผู้ใช้บันทึกไว้
  const savedActivityIds = user.savedActivities.slice(-3); // ใช้ 3 กิจกรรมล่าสุด
  console.log("savedActivityIdsxx",savedActivityIds);
  const savedActivities = await prisma.activity.findMany({
    where: { id: { in: savedActivityIds } },
    select: { id: true, vector: true },
  });

  console.log("savedActivitiesxx",savedActivities);
  if (savedActivities.length === 0) return [];

  // ใช้เวกเตอร์ของแต่ละกิจกรรมโดยตรง แทนการเฉลี่ย
  const userVectors = savedActivities.map((act) => act.vector);
  
  console.log("userVectorsxx",userVectors);
  const candidateActivities = await prisma.activity.findMany({
    where: {
      id: { notIn: user.savedActivities },
    },
    select: { id: true, vector: true },
  });
  // console.log("candidateActivitiesxx",candidateActivities);
  if (candidateActivities.length === 0) return [];

// คำนวณ Cosine Similarity กับแต่ละเวกเตอร์ของกิจกรรมที่บันทึก
  const rankedActivities = candidateActivities
    .map((activity) => ({
      id: activity.id,
      similarity: Math.max(
        ...userVectors.map((userVec) => cosineSimilarity(activity.vector, userVec))
      ), // ใช้ค่าที่คล้ายที่สุด
    }))
    .sort((a, b) => b.similarity - a.similarity)
    // .slice(0, 10);
    console.log("rankedActivities",rankedActivities);
  return rankedActivities.map((a) => a.id);
}

export async function GET(request: NextRequest, { params }: { params: { userId: string } }): Promise<NextResponse> {
  const { userId } = await params

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  console.log("userIdrecjaa",userId);

  try {
    const recommendedActivities = await getRecommendedActivities(userId);
    console.log("recommendedActivities",recommendedActivities);

    if (recommendedActivities.length === 0) {
      return NextResponse.json([]);
    }
    const activities = await prisma.activity.findMany({
      where: { id: { in: recommendedActivities } },
      include: {
        // postedBy: true,
        activityGroup: true,
        reviews: {
          select: {
            rating: true, // ดึง rating ของแต่ละรีวิวมาใช้
          },
        },
      },
    });

    // เรียงลำดับ activities ให้ตรงกับลำดับของ recommendedActivities
    const orderedActivities = recommendedActivities.map(id => 
      activities.find(activity => activity.id === id)
    );

    return NextResponse.json(orderedActivities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }

}
