"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import Nav from '../components/Nav';
import axios from 'axios';
import CreateActivityModal from "../components/CreateActivityModal";
import Link from 'next/link';

function ActivityPage() {
  const [data, setData] = useState<any[]>([]);
  const [savedActivities, setSavedActivities] = useState<Record<string, boolean>>({});
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // ใช้สำหรับสถานะโหลด
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      const response = await axios.get('/api/activity');
      setData(response.data);
      // fetchCategories();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    updateSession(); 
    fetchCategories();
    fetchData();
    // fetchSavedActivities();
  }, []); 

  useEffect(() => {
    if (session?.user?.id) {
      fetchSavedActivities();
    }
  }, [session]);
  
  useEffect(() => {
    // กรองข้อมูลตามค่าการค้นหา
    if (searchTerm) {
      const filtered = data.filter((item) =>
        item.activityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const handleCreateActivity = async (form: any) => {
    try {
      if (!session?.user?.id) {
        alert("User ID is required to create an activity.");
        return;
      }

      const payload = {
        ...form,
        userId: session.user.id, // ส่ง userId จาก session ไปกับฟอร์ม
      };

      await axios.post("/api/activity", payload);
      // alert("Activity created successfully!");
      setIsModalOpen(false);
      // Reload data
      const response = await axios.get("/api/activity");
      setData(response.data);
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("Failed to create activity.");
    }
  };

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
          <div className="text-3xl font-bold">กิจกรรม</div>
            <div className="flex space-x-4">
            <Link href="/activity/recommend">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                กิจกรรมแนะนำ
              </button>
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              สร้างกิจกรรม
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
          <Link href={`/activity/${item.id}`} key={item.id}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative z-10">
                  <img className="w-[320px] h-[180px] object-cover" 
                    src={item.imageMain || "https://via.placeholder.com/600x360"}
                    alt={item.activityName}
                  />
                  <button
                    className={`absolute top-4 right-4 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 bg-white`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveActivity(item.id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" 
                        className={`hover:fill-red-400 transition-all duration-300 ${savedActivities[item.id] ? 'fill-red-500' : 'fill-gray-500'}`} viewBox="0 -1 16 15">
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z" />
                    </svg>
                  </button>
                  <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">{item.activityGroup.length} group</div>
                </div>
                <div className="p-4">
                <div className="text-base font-medium text-gray-800 mb-2 min-h-[3rem] line-clamp-2 ">
                  {item.activityName}
                </div>
                    {/* <p className="text-gray-500 text-sm overflow-hidden text-ellipsis line-clamp-1">{item.description}</p> */}
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
                        {item.avgRating}
                      </span>
                      <span className="text-gray-500 text-sm py-0.5 ms-1">
                        ({item.reviews.length})
                      </span>
                  </div>
                </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
      <CreateActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateActivity}
      />
    </div>
    </div>
  )
}

export default ActivityPage
