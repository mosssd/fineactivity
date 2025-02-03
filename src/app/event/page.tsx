"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import Nav from '../components/Nav';
import axios from 'axios';
import CreateEventModal from "../components/CreateEventModal";
import Link from 'next/link';
import { format, isSameDay} from 'date-fns'
import { th } from 'date-fns/locale'
import { DateTime } from 'next-auth/providers/kakao';

function eventPage() {
  const [data, setData] = useState<any[]>([]); // ใช้ useState เพื่อเก็บข้อมูลที่ดึงมาจาก API
  const [savedEvents, setSavedEvents] = useState<Record<string, boolean>>({});
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // ใช้สำหรับสถานะโหลด
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, update: updateSession} = useSession(); // ดึงข้อมูล session จาก NextAuth
  const userId = session?.user?.id;

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/activitycategory');
      const map: Record<string, string> = {};
      response.data.forEach((category: { id: string, name: string }) => {
        map[category.id] = category.name;
      });
      setCategoriesMap(map);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/event');
      setData(response.data);
      fetchCategories();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedEvents = async () => {
    if (!userId) return; // เช็คก่อนว่ามี userId หรือไม่
    
    try {
      console.log("Fetching saved Events...");
      const response = await axios.get(`/api/user/${userId}/savedevent`);
      const savedIds = response.data.savedEvents;
      const savedMap: Record<string, boolean> = {};
      savedIds.forEach((id: string) => {
        savedMap[id] = true;
      });
      setSavedEvents(savedMap);
    } catch (error) {
      console.error("Error fetching saved Events:", error);
    }
  };

  const handleSaveEvent = async (eventId: string) => {
    if (!session?.user?.id) {
      alert("Please log in to save events.");
      return;
    }

    try {
      await axios.patch(`/api/event/${eventId}/saved`, { userId: session.user.id });
      setSavedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
    } catch (error) {
      console.error("Error saving Event:", error);
    }
  };

  useEffect(() => {
    updateSession();

  }, []); 

    useEffect(() => {
      if (session?.user?.id) {
        fetchSavedEvents();
        fetchData();
      }
    }, [session]);

  useEffect(() => {
    // กรองข้อมูลตามค่าการค้นหา
    if (searchTerm) {
      const filtered = data.filter((item) =>
        item.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const handleCreateEvent = async (form: any) => {
    try {
      if (!session?.user?.id) {
        alert("User ID is required to create an activity.");
        return;
      }

      const payload = {
        ...form,
        userId: session.user.id, // ส่ง userId จาก session ไปกับฟอร์ม
      };

      await axios.post("/api/event", payload);
      // alert("event created successfully!");
      setIsModalOpen(false);
      // Reload data
      const response = await axios.get("/api/event");
      setData(response.data);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };
  
  function formatDateRange(startDate: Date, endDate: Date, startTime?: string) {
    if (isSameDay(startDate, endDate)) {
      // กรณีวันเดียวกัน
      return startTime
        ? `${format(startDate, "eee d MMM", { locale: th })} เวลา ${startTime}`
        : `${format(startDate, "eee d MMM", { locale: th })}`;
    } else {
      // กรณีคนละวัน
      return `${format(startDate, "d MMM", { locale: th })} - ${format(endDate, "d MMM", { locale: th })}`;
    }
  }

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="text-center mt-24">Loading...</div>
      </div>
      )
  }
  
  return (
    <div>
      <Nav />
      <div className="container mx-auto mt-24 max-w-screen-xl ">
      <div className="pt-6 mt-20">
        <div className="flex justify-between items-center px-10 md:px-20">
          <div className="text-3xl font-bold">อีเว้นต์</div>
          <div className="flex space-x-4">
          <Link href="/event/recommend">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">
          อีเว้นต์แนะนำ
        </button>
      </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              สร้างอีเว้นต์
            </button>
            <input
              type="text"
              placeholder="ค้นหา..."
              className="border border-gray-300 rounded-md px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10 md:px-20">
        {filteredData.map((item) => (
          <Link href={`/event/${item.id}`} key={item.id}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative z-10">
                  <img className="w-[320px] h-[180px] object-cover" src={item.image}/>
                  <button
                    className={`absolute top-4 right-4 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 bg-white`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveEvent(item.id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" 
                        className={`hover:fill-red-400 transition-all duration-300 ${savedEvents[item.id] ? 'fill-red-500' : 'fill-gray-500'}`} viewBox="0 -1 15 15">
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z" />
                    </svg>
                  </button>
              </div>
              <div className="p-4">
                  <div className="text-base font-medium text-gray-800 mb-2 min-h-[3rem] line-clamp-2 ">
                    {item.eventName}
                  </div>
                  <div className="text-gray-500 text-sm overflow-hidden text-ellipsis line-clamp-1">
                      {item.categories.map((id: string) => categoriesMap[id]).join(", ")}
                    </div>
                    <div className="text-blue-700 text-sm font-medium mt-1 mb-2">{formatDateRange(item.startDate,item.endDate,item.startTime)}</div>
                    <div className="flex items-center justify-end ">
                      <div className="text-gray-500 text-sm font-medium">
                        จำนวนสมาชิก: {item.listUserJoin.length} คน
                      </div>
                    </div>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
    </div>
    
  )
}

export default eventPage
