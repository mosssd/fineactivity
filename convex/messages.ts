import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new message
export const createMessage = mutation({
  args: {
    groupId: v.string(),
    userId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const newMesssageId = await ctx.db.insert("messages", { 
      groupId: args.groupId, 
      userId: args.userId, 
      text: args.text, 
      creatAt: new Date().toISOString()

    });
    return newMesssageId;
  },
});

// Get all messages in a group
export const getMessages = query({
  args: {
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
    .query("messages")
    .filter(q => q.eq(q.field("groupId"), args.groupId))
    .collect();
    return messages;
  },
});
