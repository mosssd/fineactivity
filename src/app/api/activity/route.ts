import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'
import { OpenAI } from "openai";
import axios from 'axios';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define the expected input type
interface CreateActivityRequest {
  activityName: string
  imageMain: string 
  imageDetail?: string[]
  description: string
  location?: string
  userId: string
  categories: string[]
  contact: string
  address?: string
  dayTime: string
}

async function getEmbeddingFromHuggingFace(text: string) {
  const HF_API_KEY = process.env.HF_API_KEY;  // ใช้ API Key จาก .env
  console.log("HF_API_KEY",HF_API_KEY);
  
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
      { inputs: text },
      {
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    return response.data;  // ส่งกลับข้อมูลที่ได้รับจาก API
  } catch (error) {
    console.error("Error while fetching embedding:", error);
    throw error;
  }
}

//โพสกิจกรรม
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateActivityRequest = await request.json();
    const { activityName, imageMain, imageDetail , description, location, userId, categories, contact, address, dayTime} = body;
    const session = await getServerSession(authOptions);
    console.log("sesssjaa",session);

    const categoriesMap = await prisma.category.findMany({
      where: {
        id: { in: categories },  // กรองหมวดหมู่ที่มี id ตรงกับที่รับมา
      },
      select: {
        name: true,  // เลือกเฉพาะชื่อหมวดหมู่
      },
    });

    const textForEmbedding = `${activityName} หมวดหมู่: ${categoriesMap.map(category => category.name).join(", ")}`;
    console.log("textForEmbeddinggggggg",textForEmbedding);
    // const embedding = await openai.embeddings.create({
    //   model: "text-embedding-ada-002",
    //   input: textForEmbedding,
    // });
    const embedding = await getEmbeddingFromHuggingFace(textForEmbedding);
    // ตรวจสอบข้อมูลเบื้องต้น
    if (!activityName || !imageMain || !categories || !contact || !address || !dayTime) { 
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    console.log("embeddingxxx",embedding);
    
    const newActivity = await prisma.activity.create({
      data: {
        activityName,
        imageMain,
        imageDetail ,
        description,
        categories,
        location,
        contact,
        dayTime: dayTime ?? "default-value",
        address,
        postedBy: {
          connect: { id: userId } 
        },
        vector: embedding,
      },
    });

    return NextResponse.json({ message: "Activity created", newActivity }, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//ดึงกิจกรรมทั้งหมด
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const activities = await prisma.activity.findMany({
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

    // คำนวณค่าเฉลี่ย rating สำหรับแต่ละกิจกรรม
    const activitiesWithAvgRating = activities.map(activity => {
      const ratings = activity.reviews.map(review => review.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0; // ถ้าไม่มีรีวิวให้ avgRating เป็น 0

      return {
        ...activity,
        avgRating,
      };
    });

    return NextResponse.json(activitiesWithAvgRating);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
