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
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // ใช้สำหรับสถานะโหลด
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, update: updateSession} = useSession(); // ดึงข้อมูล session จาก NextAuth

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    updateSession();

    fetchCategories();
    fetchData();
  }, []); 

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
  
  function formatDateRange(startDate :Date, endDate :Date, startTime :string) {
    if (isSameDay(startDate, endDate)) {
      // กรณีวันเดียวกัน
      return `${format(startDate, "eee d MMM", { locale: th })} เวลา ${startTime}`;
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
      <div className="pt-6 mt-20">
        <div className="flex justify-between items-center px-10 md:px-20">
          <div className="text-3xl font-bold">อีเว้นต์</div>
          <div className="flex space-x-4">
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
        {filteredData.map((item,index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
            <Link href={`/event/${item.id}`}>
              <div className="relative z-10">
                  <img className="w-[600px] h-[200px] object-cover" src={item.image}/>
                  <div className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center">
                    <button className='pt-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="fill-gray-500 hover:fill-red-500 transition-all duration-300" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z" />
                      </svg>
                    </button>
                  </div>
              </div>
              <div className="p-4">
                  <div className="text-base font-medium text-gray-800 mb-2 min-h-[3rem] line-clamp-2 ">
                    {item.eventName}
                  </div>
                  <div className="text-gray-500 text-base overflow-hidden text-ellipsis line-clamp-1">
                      {item.categories.map((id: string) => categoriesMap[id]).join(", ")}
                    </div>
                    <div className="text-blue-700 text-base font-medium mt-1 mb-2">{formatDateRange(item.startDate,item.endDate,item.startTime)}</div>
                    <div className="flex items-center justify-end ">
                      <div className="text-gray-500 text-sm font-medium">
                        จำนวนสมาชิก: {item.listUserJoin.length} คน
                      </div>
                    </div>
              </div>
            </Link>
          </div>
        ))}
        </div>
      </div>
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
    
  )
}

export default eventPage
