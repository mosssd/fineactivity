"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Nav from "../../components/Nav";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import UserModal from "../../components/userModal";
import Link from "next/link";
import Image from "next/image";
import EditGroupModal from "../../components/EditGroupModal";
import DeleteGroupPopup from "../../components/delGroupModal";
import { useSession } from "next-auth/react";
import { TrashIcon, PencilSquareIcon, ChatBubbleLeftRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { MapPinIcon, ClockIcon, PhoneIcon, InformationCircleIcon ,CalendarIcon } from "@heroicons/react/24/solid";

interface Group {
  id: string;
  activityId: string;
  groupName: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  listUserJoin: string[];
  postedBy: {
    id: string;
    name: string;
    image: string | null;
  };
  activityBy: {
    imageMain: string;
  };
}

function GroupDetail() {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [usersMap, setUsersMap] = useState<Map<string, any>>(new Map());
  const { groupId } = useParams() as { groupId: string };
  const { data: session, update: updateSession } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    updateSession();
    if (groupId) {
      const fetchGroupDetails = async () => {
        try {
          const response = await axios.get(`/api/group/${groupId}`);
          setGroup(response.data);

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
          console.error("Error fetching group details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchGroupDetails();
    }
  }, [groupId]);

  const handleEditSubmit = async (updatedGroup: any) => {
    try {
      await axios.patch(`/api/group/${groupId}`, updatedGroup);
      setGroup((prevGroup) => ({
        ...prevGroup,
        ...updatedGroup,
        date: new Date(updatedGroup.date),
      } as Group));
      setIsEditModalOpen(false);
      // window.location.reload();
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(`/api/group/${groupId}`);
      alert("กลุ่มถูกลบเรียบร้อยแล้ว");
      // window.location.href = `/activity/${group?.activityId}`;
      window.history.back();
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("เกิดข้อผิดพลาดในการลบกลุ่ม");
    }
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="text-center mt-20">Loading...</div>
      </div>
    );
  }

  if (!group) {
    return <div className="text-center mt-20">Group not found.</div>;
  }

  const openUserModal = () => {
    setIsUserModalOpen(true);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <Nav />
      <div className="container mx-auto mt-24 px-4 sm:px-8 md:px-16 lg:px-24 max-w-screen-xl">
        {/* ชื่อกลุ่มและปุ่มแก้ไข/ลบ */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{group.groupName}</h1>
          {userId === group.postedBy.id && (
            <div className="flex space-x-2">
              <button
                onClick={openEditModal}
                className="text-white rounded-full transition duration-300"
              >
                <PencilSquareIcon className="w-6 h-6 text-gray-500 hover:text-yellow-500 transition duration-300" />
              </button>
              <button
                onClick={() => setIsDeletePopupOpen(true)}
                className="text-white rounded-full transition duration-300"
              >
                <TrashIcon className="w-6 h-6 text-gray-500 hover:text-red-500 transition duration-300" />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden flex flex-col md:flex-row mb-8">
          <div className="md:w-1/2 p-6 order-2 md:order-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">รายละเอียด</h3>
            <div className="ml-2">
            <p className="text-gray-700 text-base mb-4 bg-gray-100 p-4 rounded-md whitespace-pre-line overflow-y-auto max-h-24 leading-relaxed border-2 border-solid">{group.description}</p>
                {/* {group.date && group.date?.toISOString() !== "1970-01-01T00:00:00.000Z" && ( */}
                <div className="bg-gray-100 p-4 rounded-md mb-4 border-2 border-solid">  
                {group.date && (
                  <div className="flex items-center text-gray-700 mb-2">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    <span>{format(new Date(group.date), "eee d MMM", { locale: th })}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700 mb-2">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    <span>{group.startTime} - {group.endTime}</span>
                </div>
              <div className="text-gray-800 text-base mb-1">
                หัวหน้ากลุ่ม:
                <img
                  src={group.postedBy.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={`${group.postedBy.name}'s avatar`}
                  className="inline-block w-8 h-8 rounded-full ml-2"
                />
                <span className="font-semibold ml-2">{group.postedBy.name}</span>
              </div>
              </div>
              <button
              onClick={openUserModal}
              className="bg-white text-black py-2 px-4 rounded-md border-2 hover:bg-gray-200 transition duration-300 m-2"
            >
              <UserCircleIcon className="w-6 h-6 inline-block mr-1" />สมาชิก
            </button>
            <Link
              href={`chat/${group.id}`}
              className="bg-white text-black py-2 px-4 rounded-md border-2 hover:bg-gray-200 transition duration-300 mt-4 inline-block m-2"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6 inline-block mr-1" />เปิดแชท
            </Link>
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2 md:mx-auto mx-5">
            <div className="relative w-full aspect-[5/3] mx-auto">
              <Image
                src={group.activityBy.imageMain || "https://via.placeholder.com/600x360"}
                alt="Activity"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                priority={true}
              />
            </div>
            {/* <button
              onClick={openUserModal}
              className="bg-white text-black py-2 px-4 rounded-md shadow-md hover:bg-gray-200 transition duration-300 m-2"
            >
              <UserCircleIcon className="w-6 h-6 inline-block mr-1" />สมาชิก
            </button>
            <Link
              href={`chat/${group.id}`}
              className="bg-white text-black py-2 px-4 rounded-md shadow-md hover:bg-gray-200 transition duration-300 mt-4 inline-block m-2"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6 inline-block mr-1" />เปิดแชท
            </Link> */}
          </div>
        </div>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        usersMap={usersMap}
        selectedUserIds={group.listUserJoin}
      />

      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        defaultValues={{
          groupName: group.groupName,
          description: group.description,
          date: group.date ? new Date(group.date): null,
          startTime: group.startTime,
          endTime: group.endTime,
        }}
      />

      <DeleteGroupPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={() => {
          handleDeleteGroup();
          setIsDeletePopupOpen(false);
        }}
      />
    </div>
  );
}

export default GroupDetail;