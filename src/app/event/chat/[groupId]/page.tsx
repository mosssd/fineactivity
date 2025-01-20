// pages/group/chat/[groupId].tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import axios from "axios";
import Nav from "../../../components/Nav";
import { useSession } from "next-auth/react";
import { api } from "../../../../../convex/_generated/api"; // Ensure this path is correct and the api object includes the message property
import { Divide } from "lucide-react";

interface Message {
  groupId: string;
  userId: string;
  text: string;
  // creatAt: string;
}

interface User {
  userId: string;
  name: string;
  image: string;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("th-TH", options);
};

const formatTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  };
  return new Date(dateString).toLocaleTimeString("th-TH", options);
};

const GroupChatPage = () => {
  const { groupId } = useParams() as { groupId: string };
  const { data: session, update: updateSession} = useSession();
  const [newMessage, setNewMessage] = useState("");
  const [userCache, setUserCache] = useState<Map<string, User>>(new Map()); // Cache ข้อมูลผู้ใช้
  // const [enrichedMessages, setEnrichedMessages] = useState<(any)[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const createMessage = useMutation(api.messages.createMessage);
  const messages = useQuery(api.messages.getMessages, { groupId });

  const [isGroupValid, setIsGroupValid] = useState<boolean | null>(null);
  const validateGroupId = async () => {
    try {
      const response = await axios.get(`/api/event/${groupId}/validate`);
      setIsGroupValid(response.data.valid); // สมมติ API ส่ง `valid` กลับมา
    } catch (error) {
      console.error("Error validating groupId:", error);
      setIsGroupValid(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก MongoDB
  const fetchGroupAndUsers = async () => {
    try {
      // ดึงข้อมูลกลุ่ม (รวม listUserJoin)
      const { data: groupData } = await axios.get(`/api/event/${groupId}`);
      // setListUserJoin(groupData.listUserJoin);

      // ดึงข้อมูลผู้ใช้จาก MongoDB โดยใช้ listUserJoin
      const userDetails = await Promise.all(
        groupData.listUserJoin.map(async (userId: string) => {
          const response = await axios.get(`/api/user/${userId}`);
          const userData = response.data;
          return {
            userId,
            name: userData.name,
            image:
              userData.image ||
              "https://static.vecteezy.com/system/resources/thumbnails/004/607/791/small_2x/man-face-emotive-icon-smiling-male-character-in-blue-shirt-flat-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-web-design-vector.jpg",
          };
        })
      );

      // อัปเดต userCache
      setUserCache(
        new Map(userDetails.map((user) => [user.userId, user]))
      );
    } catch (error) {
      console.error("Error fetching group or user data:", error);
    }
  };



  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const newMsg: Message = {
        groupId: groupId,
        userId: session?.user?.id || "",
        text: newMessage,
      };
      createMessage(newMsg);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    updateSession(); 
    if (groupId) {
      validateGroupId();
    }
    fetchGroupAndUsers();
  }, []); 

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!messages) {
    return (
      <div>
        <Nav />
        <div className="text-center mt-20">Loading chat...</div>
      </div>
    );
  }

  if (!isGroupValid) {
    return (
      <div>
        <Nav />
        <div className="text-center mt-20 text-red-500">Invalid group ID. Please check the URL.</div>
      </div>
    );
  }

  let lastDate: string | null = null;
  
  return (
    <div>
      <Nav />
      <div className="container mx-auto mt-24 px-4 md:px-20">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        <div className="border rounded-md p-4 h-[60vh] overflow-y-auto bg-gray-50">
        {messages?.map((msg) => {
            const messageDate = formatDate(msg.creatAt);
            const isOwnMessage = msg.userId === session?.user?.id;
            const showDate = lastDate !== messageDate;
            lastDate = messageDate;
            const user = userCache.get(msg.userId) || { name: "Loading...", image: "" };

            return (
              <React.Fragment key={msg._id}>
                {showDate && (
                  <div className="text-center text-sm text-gray-500 my-2 bg-gray-100 py-1 rounded-md">
                    {messageDate}
                  </div>
                )}
                <div className={`mb-4 flex items-start ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                  {!isOwnMessage && (
                  <img
                    src={user.image || "https://static.vecteezy.com/system/resources/thumbnails/004/607/791/small_2x/man-face-emotive-icon-smiling-male-character-in-blue-shirt-flat-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-web-design-vector.jpg"}
                    alt={msg.userId}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                )}

                <div className={`max-w-xs ${isOwnMessage ? "text-right" : ""}`}>
                <div className="text-sm text-gray-500">{isOwnMessage ? "" : user.name}</div>
                  <div
                    className={`p-2 rounded-md shadow-sm ${
                      isOwnMessage ? "bg-blue-500 text-white" : "bg-white"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      textAlign: "left", // ข้อความชิดซ้ายในกล่อง
                      paddingLeft: isOwnMessage ? "10px" : undefined, // จัด padding ให้เหมาะสม
                      display: "inline-block", 
                    }}
                    >
                      {msg.text}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{formatTime(msg.creatAt)}</div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        <div className="mt-4 flex">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md resize-none"
            rows={1}
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