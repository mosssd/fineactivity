"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import Nav from '../components/Nav';
import axios from 'axios';
import Link from 'next/link';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

function GroupPageComponent({ session }: { session: any }) { 
  const [data, setData] = useState<any[]>([]); // ใช้ useState เพื่อเก็บข้อมูลที่ดึงมาจาก API
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // ใช้สำหรับสถานะโหลด
  const [searchTerm, setSearchTerm] = useState("");
  // const { data: session, update: updateSession} = useSession(); // ดึงข้อมูล session จาก NextAuth


  const fetchData = async () => {
    try {
      if (!session || !session.user?.id){
        alert("กรุณาเข้าสู่ระบบก่อนใช้งาน")
        return
      }
      else {
        const userId = session.user.id;
        const response = await axios.get(`/api/group/user/${userId}`);
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // updateSession(); 
    console.log("ssss",session)
    // fetchCategories();
    if (session?.user.id) {
      fetchData();
    }
  }, []); 

  useEffect(() => {
    // กรองข้อมูลตามค่าการค้นหา
    if (searchTerm) {
      const filtered = data.filter((item) =>
        item.activityBy.activityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);


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
          <div className="text-3xl font-bold">กลุ่ม</div>
          <div className="flex space-x-4">
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
        {filteredData.map((item, index) => (
          <Link href={`/group/${item.id}`} key={index}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative z-10">
                    <img className="sm:w-[320px] sm:h-[180px] h-[200px] w-full object-cover" 
                      src={item.activityBy.imageMain || "https://via.placeholder.com/600x360"}
                      alt={item.activityBy.activityName}
                    />
                    {/* <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">{item.activityGroup.length} group
                    </div> */}
                </div>
                <div className="p-4">
                  <div className="text-base font-medium text-gray-600 mb-2 min-h-[3rem] line-clamp-2 ">
                    {item.activityBy.activityName}
                  </div>
                  <div className="text-black text-base font-bold overflow-hidden text-ellipsis line-clamp-1">กลุ่ม {item.groupName}</div>
                  {/* <div className="text-black text-base overflow-hidden text-ellipsis line-clamp-1">{`${format(item.date, "eee d MMM", { locale: th })} เวลา ${item.startTime} - ${item.endTime}`}</div> */}
                  {item.date ? (
                    <div className="text-gray-800 text-base">
                      วันที่: {format(new Date(item.date), "eee d MMM", { locale: th })}
                    </div>
                    )
                    : <div className="text-gray-800 text-base">
                      วันที่: ไม่ระบุ
                    
                  </div>}
                  <div className="text-gray-800 text-base mb-1">
                    เวลา: {item.startTime} - {item.endTime}
                  </div>
                </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default GroupPageComponent
