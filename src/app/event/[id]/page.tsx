"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Nav from '../../components/Nav';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format,isSameDay } from 'date-fns';
import { th } from 'date-fns/locale';
import { toast } from 'react-toastify';
import JoinEventModal from '@/app/components/๋JoinEventModal';
import { useMemo } from 'react';
import UserModal from '@/app/components/userModal'; 
import { CalendarIcon, ChatBubbleLeftRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import Image from "next/image";

interface Event {
  image?: string;
  eventName: string;
  description: string;
  contact?: string;
  categories?: string[];
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  listUserJoin: string[];
}

function formatDateRange(startDate: Date, endDate: Date, startTime: string, endTime: string) {
  if (isSameDay(startDate, endDate)) {
    // กรณีวันเดียวกัน
    return `${format(startDate, "EEEEที่ d MMMM yyyy", { locale: th })} เวลา ${startTime} - ${endTime}`;
  } else {
    // กรณีคนละวัน
    return `${format(startDate, "d MMM", { locale: th })} - ${format(endDate, "d MMM", { locale: th })} เวลา ${startTime}-${endTime}`;
  }
}

function EventDetail() {
  const [event, setEvent] = useState<Event | null>(null);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // สำหรับ UserModal
  const [usersMap, setUsersMap] = useState<Map<string, any>>(new Map());
  const { data: session, update: updateSession } = useSession();
  const { id } = useParams() as { id: string };

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/event/${id}`);
      setEvent(response.data);
      // ดึงข้อมูลผู้ใช้ที่อยู่ใน listUserJoin
      if (response.data?.listUserJoin?.length) {
        const userResponse = await axios.post("/api/users/batch", {
          userIds: response.data.listUserJoin,
        });
        const userMap: Map<string, any> = new Map(
          userResponse.data.map((user: any) => [user.id, user])
        );
        setUsersMap(userMap);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/activitycategory');
      const map: Record<string, string> = {};
      response.data.forEach((category: { id: string; name: string }) => {
        map[category.id] = category.name;
      });
      setCategoriesMap(map);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // const isUserJoined = useMemo(() => {
  //   if (!event || !session?.user?.id) return false;
  //   return event.listUserJoin.includes(session.user.id);
  // }, [event, session]);

  const handleJoinEvent = async () => {
    if (!session?.user?.id) {
      toast.error("คุณต้องเข้าสู่ระบบก่อนเข้าร่วมกิจกรรม");
      return;
    }
    try {
      const payload = { eventId: id, userId: session.user.id }; // ใช้ id ของ event และ user
      await axios.patch('/api/event/join', payload); // เปลี่ยนเป็น method patch
      toast.success("คุณได้เข้าร่วมกิจกรรมเรียบร้อยแล้ว!");
      setShowPopup(false); // ปิด popup หลังจากสำเร็จ
      window.location.reload();
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("ไม่สามารถเข้าร่วมกิจกรรมได้ กรุณาลองอีกครั้ง");
    }
  };


  useEffect(() => {
    if (!id) return;
    updateSession();
    fetchEvent();
    fetchCategories();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="text-center mt-20">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center mt-20">Event not found.</div>;
  }

  const isUserJoined = event.listUserJoin.includes(session?.user?.id || "");

  return (
    <div>
      <Nav />
      <div className="container mx-auto mt-24 px-4 sm:px-8 md:px-16 lg:px-24 max-w-screen-xl">
        <div className='flex flex-initial items-center'>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mr-4 mb-1 break-words">{event.eventName}</h1>
              </div>
          <div className="my-1">
            <p className="text-red-500 text-sm font-semibold">
            <CalendarIcon className="w-6 h-6 inline-block mr-1" />
              {formatDateRange(
                new Date(event.startDate),
                new Date(event.endDate),
                event.startTime,
                event.endTime
              )}
            </p>
          </div>
        <div className="bg-slate-200 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-6 order-2 md:order-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">รายละเอียด</h3>
            <div className="ml-2">
              <p className="text-gray-600 text-lg mb-6 whitespace-pre-line">{event.description}</p>
              <div className="text-gray-800 text-sm mb-4">Contact: {event.contact || "N/A"}</div>
              <div className="mt-4">
                {event.categories && event.categories.length > 0 ? (
                  event.categories.map((categoryId) => (
                    <span
                      key={categoryId}
                      className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 mr-2"
                    >
                      {categoriesMap[categoryId] || "Unknown"}
                    </span>
                  ))
                ) : (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                    No category
                  </span>
                )}
              </div>
            </div>
              <div className="mt-6">
              <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="bg-white text-black py-2 px-4 rounded-md shadow-md hover:bg-gray-200 transition duration-300 m-2"
                >
                  <UserCircleIcon className="w-6 h-6 inline-block mr-1" />สมาชิก
                </button>
                {isUserJoined ? (
                  <Link
                    href={`chat/${id}`}
                    className="bg-white text-black py-2 px-4 rounded-md shadow-md hover:bg-gray-200 transition duration-300 mt-4 inline-block m-2"
                  >
                    <ChatBubbleLeftRightIcon className="w-6 h-6 inline-block mr-1" />เปิดแชท
                  </Link>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                    onClick={() => setShowPopup(true)}
                  >
                    เข้าร่วมอีเว้นต์
                  </button>
                )}
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2 md:mx-auto mx-5">
            <div className="relative w-full aspect-[5/3] mx-auto">
              <Image
                src={event.image || "https://via.placeholder.com/600x360"}
                alt="Activity"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <JoinEventModal
          title="ยืนยันการเข้าร่วม"
          description="คุณต้องการเข้าร่วมอีเว้นต์นี้ใช่หรือไม่?"
          confirmText="ยืนยัน"
          cancelText="ยกเลิก"
          onConfirm={handleJoinEvent}
          onCancel={() => setShowPopup(false)}
        />
      )}
      
      {isUserModalOpen && (
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          usersMap={usersMap}
          selectedUserIds={event.listUserJoin}
        />
      )}
    </div>
  );
}

export default EventDetail;