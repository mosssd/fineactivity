// pages/group/chat/[groupId].tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import axios from "axios";
import Nav from "../../../components/Nav";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

const GroupChatPage = () => {
  const { groupId } = useParams() as { groupId: string }; 
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      // Mock data for messages
      const mockMessages: Message[] = [
        {
          id: "1",
          userId: "123",
          userName: "John Doe",
          content: "Welcome to the group chat!",
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          userId: "456",
          userName: "Jane Smith",
          content: "Hello everyone!",
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const newMsg: Message = {
        id: `${Date.now()}`,
        userId: session?.user?.id || "",
        userName: session?.user?.name || "Anonymous",
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      // Mock adding a message locally
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");

      // Replace with actual API call
      // await axios.post(`/api/group/chat/${groupId}/message`, newMsg);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (groupId) fetchMessages();
  }, [groupId]);

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="text-center mt-20">Loading chat...</div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="container mx-auto mt-24 px-4 md:px-20">
        <h1 className="text-2xl font-bold mb-4">Group Chat</h1>
        <div className="border rounded-md p-4 h-[60vh] overflow-y-auto bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-4">
              <div className="text-sm text-gray-500">{msg.userName}</div>
              <div className="bg-white p-2 rounded-md shadow-sm">{msg.content}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage;
