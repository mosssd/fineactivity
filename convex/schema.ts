import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    groupId: v.string(), // อ้างอิงถึงกลุ่มใน MongoDB
    userId: v.string(),  // อ้างอิงถึงผู้ใช้ใน MongoDB
    text: v.string(),    // เนื้อหาข้อความ
    creatAt: v.string(), // วันที่สร้างข้อความ
  }),
});