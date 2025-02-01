"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react'
import axios from 'axios';
import Nav from '../../components/Nav';
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area";
import CreateGroupModal from "../../components/CreateGroupModal";
import GroupJoinModal from "../../components/GroupJoinModal";
import { setgroups } from 'node:process';
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import CreateReviewModal from "../../components/CreateReviewModal";
import Image from "next/image";
interface Activity {
  imageMain?: string;
  activityName: string;
  description: string;
  contact?: string;
  categories?: string[];
}

interface Group {
  id: string;
  userId: string;
  groupName: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  listUserJoin: string[];
}

interface Review {
  id: string;
  user: { name: string; image?: string };
  rating: number;
  comment: string;
  createdAt: Date;
}

function ActivityDetail() {

  const [activity, setActivity] = useState<Activity | null>(null);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [groups, setGroups] = useState<Group[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]); // State for reviews
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session, update: updateSession} = useSession(); // ดึงข้อมูล session จาก NextAuth
  const { id } = useParams() as { id: string }; 

  const fetchGroups = async () => { 
    try {
      const response = await axios.get(`/api/group/activity/${id}`);
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

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
  

  const joinGroup = async (groupId: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to join a group.");
      return;
    }
    try {
      const payload = { groupId, userId: session.user.id };
      await axios.patch('/api/group/join', payload);
      toast.success("Successfully joined the group!");
      setIsGroupModalOpen(false);
      window.location.href = `/group/${groupId}`;
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join the group.");
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

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/activity/${id}/reviews`);
      setReviews(response.data);
      setFilteredReviews(response.data);
      const avgRating = response.data.reduce((sum: number, review: Review) => sum + review.rating, 0) / response.data.length;
      setAverageRating(avgRating);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleFilterReviews = (rating: number | null) => {
    setFilterRating(rating);
    if (rating === null) {
      setFilteredReviews(reviews); // Show all reviews if no filter is applied
    } else {
      setFilteredReviews(reviews.filter((review) => review.rating === rating));
    }
  };



  useEffect(() => {
    if (!id) return;
    updateSession();
    fetchGroups();
    fetchActivity();
    fetchCategories();
    fetchReviews();
  }, [id]);

  const handleCreateGroup = async (form: any) => {
    try {
      if (!session?.user?.id) {
        alert("User ID is required to create a group.");
        return;
      }

      const payload = {
        ...form,
        activityId: id,
        userId: session.user.id, // ส่ง userId จาก session ไปกับฟอร์ม
      };

      await axios.post("/api/group", payload);
      // alert("Activity created successfully!");
      setIsModalOpen(false);
      // Reload data
      const response = await axios.get(`/api/group/activity/${id}`);
      setGroups(response.data);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  const handleCreateReview = async (form: any) => {
    try {
      if (!session?.user?.id) {
        alert("User ID is required to create an Review.");
        return;
      }

      const payload = {
        ...form,
        userId: session.user.id, // ส่ง userId จาก session ไปกับฟอร์ม
      };

      await axios.post(`/api/activity/${id}/reviews`, payload);
      // alert("Activity created successfully!");
      setIsReviewModalOpen(false);
      // Reload data
      const response = await axios.get(`/api/activity/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error creating review:", error);
      alert("Failed to create review.");
    }
  };


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
      <div className="container mx-auto mt-24 px-4 sm:px-8 md:px-16 lg:px-24 max-w-screen-xl">
        <h1 className="text-3xl font-bold text-gray-800 my-4 break-words ">{activity.activityName}</h1>
        <div className="bg-slate-200 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-6 order-2 md:order-1">
            {/* <h1 className="text-3xl font-bold text-gray-800 mb-4">{activity.activityName}</h1> */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">รายละเอียด</h3>
            <p className="text-gray-600 text-lg mb-6 whitespace-pre-line">{activity.description}</p>
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
          <div className="md:w-1/2 order-1 md:order-2 md:mx-auto mx-5">
            <div className="relative w-full aspect-[5/3] mx-auto">
              <Image
                src={activity.imageMain || "https://via.placeholder.com/600x360"}
                alt="Activity"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                priority={true}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start w-full mt-10 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mr-4">กลุ่ม</h2>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            สร้างกลุ่ม
          </button>
        </div>
        <ScrollArea className="w-full max-w-5xl rounded-md border">
          <div className="flex w-max space-x-4 p-4">
          {groups.length > 0 ? (
            groups.map((group) => {
              const isGroupCreator = session?.user?.id === group.userId; // เช็คว่า user เป็นคนสร้างกลุ่ม
              const isGroupMember = session?.user?.id ? group.listUserJoin?.includes(session.user.id) : false; // เช็คว่า user อยู่ในกลุ่ม

              return (
                <div
                  key={group.id}
                  className="bg-white p-4 rounded-lg shadow-md border w-48 text-center py-10 cursor-pointer"
                  onClick={() => {
                    if (isGroupCreator || isGroupMember) {
                      // เปลี่ยนเส้นทางไปยังหน้า chat ของกลุ่ม
                      window.location.href = `/group/${group.id}`;
                    } else {
                      // เปิด GroupJoinModal
                      setSelectedGroup(group);
                      setIsGroupModalOpen(true);
                    }
                  }}
                >
                  <h3 className="text-lg font-bold text-gray-800">{group.groupName}</h3>
                  { group.date &&
                    <p className="text-sm text-gray-600">
                      {`${format(group.date, "eee d MMM", { locale: th })}`}
                    </p> 
                  }
                  <p className="text-sm text-gray-600">
                    {`เวลา ${group.startTime} - ${group.endTime}`}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-gray-600">ยังไม่มีกลุ่ม</div>
          )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* แสดงรีวิว */}
        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">รีวิว</h2>
            <button 
            className="bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
            onClick={() => setIsReviewModalOpen(true)}>
              เขียนรีวิว
            </button>
          </div>
          
          <div className="mt-4 flex flex-col md:flex-row gap-8">
            {/* Left Column: Average Rating and Rating Distribution */}
            <div className="w-full md:w-1/3">
              <div className="text-4xl font-bold text-yellow-500">{Number.isNaN(averageRating) ? "ไม่มีรีวิว" : averageRating.toFixed(1)}</div>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    className={`text-yellow-500 ${index < averageRating ? "" : "opacity-50"}`}
                  />
                ))}
              </div>
              <span className="text-gray-600">{reviews.length} รีวิว</span>
              
              <div className="mt-4 space-y-1 max-w-xs">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((review) => review.rating === star).length;
                  const percentage = (count / reviews.length) * 100 || 0;
                  return (
                    <div key={star} className="flex items-center">
                      <span className="text-gray-600 w-6">{star}</span>
                      <div className="bg-gray-200 w-full h-4 rounded-md mx-2">
                        <div
                          className="bg-yellow-500 h-4 rounded-md"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <ScrollArea className="w-full max-w-5xl rounded-md border"> */}
              <div className="w-full md:w-2/3 mb-7">
                <div className="my-1 flex justify-end">
                  <select
                    className="w-auto py-1 px-2 border rounded-md bg-white text-gray-600 text-sm"
                    value={filterRating ?? ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      handleFilterReviews(value);
                    }}
                  >
                    <option value="">ดูทั้งหมด</option>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <option key={star} value={star}>{star} ดาว</option>
                    ))}
                  </select>

                </div>

                <ScrollArea className="w-full max-w-5xl rounded-md border h-96"> {/* กำหนดความสูงเพื่อให้มีพื้นที่เลื่อน */}
                  <div className="space-y-6 p-4">
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex items-start mb-2">
                            <Image
                              src={review.user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                              alt={review.user.name}
                              width={40}
                              height={40}
                              className="rounded-full mr-4"
                            />
                            <div>
                              <div className="text-lg font-semibold text-gray-800">{review.user.name}</div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, index) => (
                                  <FaStar
                                    key={index}
                                    className={`text-yellow-500 ${index < review.rating ? "" : "opacity-50"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                          <div className="text-gray-500 text-xs mt-1">
                            {format(new Date(review.createdAt), "d MMM yyyy, HH:mm")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-600">ยังไม่มีรีวิว</div>
                    )}
                  </div>
                  <ScrollBar orientation="vertical" /> {/* เปลี่ยน orientation เป็นแนวตั้ง */}
                </ScrollArea>
              </div>
              {/* <ScrollBar orientation="horizontal" />
            </ScrollArea> */}
          </div>
        </div>
      </div>


      {selectedGroup && (
        <GroupJoinModal
          group={selectedGroup}
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          onJoin={joinGroup}
        />
      )}

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateGroup}
      />

      <CreateReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleCreateReview}
      />
    </div>
  );
}

export default ActivityDetail;