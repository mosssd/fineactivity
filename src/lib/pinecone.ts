import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!, // ใส่ API Key จาก Pinecone
});

export const index = pinecone.Index("activities-index"); // ตั้งชื่อ Index