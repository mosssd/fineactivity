"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import Nav from '../components/Nav';
import axios from 'axios';
import Link from 'next/link';
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area";
import { isSameDay, format } from 'date-fns';
import { th } from 'date-fns/locale';

function ActivityPage() {
  const [data, setData] = useState<any[]>([]);
  const [dataEvent, setDataEvent] = useState<any[]>([]);
  const [savedActivities, setSavedActivities] = useState<Record<string, boolean>>({});
  const [savedEvents, setSavedEvents] = useState<Record<string, boolean>>({});
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true); // ใช้สำหรับสถานะโหลด
  const { data: session, update: updateSession} = useSession(); 
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
      console.log("Fetching data...");
      const response = await axios.get(`/api/user/${userId}/savedactivitywithdetail`);
      setData(response.data);
      fetchCategories();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataEvent = async () => {
    try {
      console.log("Fetching data...");
      const response = await axios.get(`/api/user/${userId}/savedeventwithdetail`);
      setDataEvent(response.data);
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

const fetchSavedActivities = async () => {
  if (!userId) return; // เช็คก่อนว่ามี userId หรือไม่
  
  try {
    console.log("Fetching saved activities...");
    const response = await axios.get(`/api/user/${userId}/savedactivity`);
    const savedIds = response.data.savedActivities;
    const savedMap: Record<string, boolean> = {};
    savedIds.forEach((id: string) => {
      savedMap[id] = true;
    });
    setSavedActivities(savedMap);
    console.log("Saved activities:", savedMap);
  } catch (error) {
    console.error("Error fetching saved activities:", error);
  }
};

  const handleSaveActivity = async (activityId: string) => {
    if (!session?.user?.id) {
      alert("Please log in to save activities.");
      return;
    }

    try {
      await axios.patch(`/api/activity/${activityId}/saved`, { userId: session.user.id });
      setSavedActivities((prev) => ({ ...prev, [activityId]: !prev[activityId] }));
    } catch (error) {
      console.error("Error saving activity:", error);
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
      fetchSavedActivities();
      fetchData();
      fetchDataEvent();
    }
  }, [session]);
  
  // useEffect(() => {
  //   // กรองข้อมูลตามค่าการค้นหา
  //   if (searchTerm) {
  //     const filtered = data.filter((item) =>
  //       item.activityName.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredData(filtered);
  //   } else {
  //     setFilteredData(data);
  //   }
  // }, [searchTerm, data]);


  if (loading) {
    return (
      <div>
        <Nav />
        <div className="text-center mt-24">Loading...</div>
      </div>
      )
  }

 function formatDateRange(startDate :Date, endDate :Date, startTime :string) {
    if (isSameDay(startDate, endDate)) {
      // กรณีวันเดียวกัน
      return `${format(startDate, "eee d MMM", { locale: th })} เวลา ${startTime}`;
    } else {
      // กรณีคนละวัน
      return `${format(startDate, "d MMM", { locale: th })} - ${format(endDate, "d MMM", { locale: th })}`;
    }
  }


  return (
    <div>
      <Nav />
      <div className="container mx-auto mt-24 px-4 sm:px-8 md:px-16 lg:px-24 max-w-screen-xl">
        <div className="pt-6 mt-20">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold">กิจกรรมที่บันทึกไว้</div>
              {/* <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="border border-gray-300 rounded-md px-4 py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div> */}
          </div>
        </div>
        
        <div className="container mx-auto py-6 flex justify-center">
          <ScrollArea className="w-full max-w-6xl rounded-md border">
            <div className="flex w-max space-x-4 p-4">
            {data.length > 0 ? (
              data.map((item) => (
                <Link href={`/activity/${item.id}`} key={item.id}>
                  <div className="w-64 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="relative z-10">
                      <img className="w-[320px] h-[180px] object-cover" 
                        src={item.imageMain || "https://via.placeholder.com/600x360"}
                        alt={item.activityName}
                      />
                      <button
                        className="absolute top-4 right-4 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveActivity(item.id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" 
                            className={`hover:fill-red-400 transition-all duration-300 ${savedActivities[item.id] ? 'fill-red-500' : 'fill-gray-500'}`} 
                            viewBox="0 -1 15 15">
                          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z" />
                        </svg>
                      </button>
                      <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">
                        {item.activityGroup.length} group
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-base font-medium text-gray-800 mb-2 min-h-[3rem] line-clamp-2">
                        {item.activityName}
                      </div>
                      <div className="text-gray-500 text-sm overflow-hidden text-ellipsis line-clamp-1">
                        {item.categories.map((id: string) => categoriesMap[id]).join(", ")}
                      </div>
                      <div className="flex items-center mt-2.5 mb-4">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <svg className="w-4 h-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                          </svg>
                      </div>
                      {/* <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">{item.avgRating}</span> */}
                      <span className="text-yellow-400 text-sm font-bold py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                        {item.avgRating || 0}
                      </span>
                      <span className="text-gray-500 text-sm py-0.5 ms-1">
                        ({item.reviews.length})
                      </span>
                  </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full text-center text-gray-500 py-ภ">
                ไม่มีกิจกรรมที่บันทึกไว้
              </div>
            )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          </div>

          <div className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">อีเว้นต์ที่บันทึกไว้</div>
                {/* <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="ค้นหา..."
                    className="border border-gray-300 rounded-md px-4 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div> */}
            </div>
          </div>
          
          <div className="container mx-auto py-6 flex justify-center">
            <ScrollArea className="w-full max-w-6xl rounded-md border">
              <div className="flex w-max space-x-4 p-4">
              {dataEvent.length > 0 ? (
                dataEvent.map((item) => (
                  <Link href={`/event/${item.id}`} key={item.id}>
                    <div className="w-64 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
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
                ))
              ) : (
                <div className="w-full text-center text-gray-500 py-ภ">
                  ไม่มีอีเว้นต์ที่บันทึกไว้
                </div>
              )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            </div>
        </div>
        </div>
  )
}

export default ActivityPage
