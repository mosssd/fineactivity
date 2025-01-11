"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Nav from '../../components/Nav';
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area";
interface Activity {
  imageMain?: string;
  activityName: string;
  description: string;
  contact?: string;
  categories?: string[];
}

interface Group {
  id: string;
  name: string;
  date: string;
}

function ActivityDetail() {

  const [activity, setActivity] = useState<Activity | null>(null);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams() as { id: string }; 

  const mockGroups: Group[] = [
    { id: "1", name: "Group Alpha", date: "2025-01-10" },
    { id: "2", name: "Group Beta", date: "2025-01-12" },
    { id: "3", name: "Group Gamma", date: "2025-01-15" },
  ];

  useEffect(() => {
    if (!id) return;

    const fetchActivity = async () => {
      try {
        const response = await axios.get(`/api/activity/${id}`);
        setActivity(response.data);
      } catch (error) {
        console.error("Error fetching activity details:", error);
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
    
    setGroups(mockGroups);
    fetchActivity();
    fetchCategories();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="text-center mt-20">Loading...</div>
      </div>
      )
  }

  if (!activity) {
    return <div className="text-center mt-20">Activity not found.</div>;
  }

  return (
    <div>
      <Nav />
      <div className="container mx-auto mt-24 px-10 md:px-20">
        <h1 className="text-3xl font-bold text-gray-800 my-4 ">{activity.activityName}</h1>
        <div className="bg-slate-200 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-6">
            {/* <h1 className="text-3xl font-bold text-gray-800 mb-4">{activity.activityName}</h1> */}
            <p className="text-gray-600 text-lg mb-6">{activity.description}</p>
            <div className="text-gray-800 text-sm mb-4">Contact: {activity.contact || "N/A"}</div>
            <div className="mt-4">
              {activity.categories && activity.categories.length > 0 ? (
                activity.categories.map((categoryId) => (
                  <span
                    key={categoryId}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 mr-2"
                  >
                    {categoriesMap[categoryId] || "Unknown"}
                  </span>
                ))
              ) : (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                  no category
                </span>
              )}
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              className="w-72 h-72 mx-auto object-cover rounded-md"
              src={activity.imageMain || "https://via.placeholder.com/600x360"}
              alt="Activity"
            />
          </div>
        </div>
        <div className="flex items-center justify-start w-full mt-10 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mr-4">กลุ่ม</h2>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
            onClick={() => {
              console.log("สร้างกลุ่มใหม่");
            }}
          >
            สร้างกลุ่ม
          </button>
        </div>
        <ScrollArea className="w-full max-w-5xl rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {groups.length > 0 ? (
              groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white p-4 rounded-lg shadow-md border w-48 text-center py-10"
                >
                  <h3 className="text-lg font-bold text-gray-800">{group.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(group.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-gray-600">No groups available.</div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export default ActivityDetail;