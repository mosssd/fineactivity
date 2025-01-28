"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Nav from "../../components/Nav";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import UserModal from "../../components/userModal";
import Link from "next/link";
import EditGroupModal from "../../components/EditGroupModal"; // Import EditGroupModal
import DeleteGroupPopup from "../../components/delGroupModal"; // Import DeleteGroupPopup
import { useSession } from "next-auth/react";
import { FaEdit, FaTrash } from "react-icons/fa";
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
}

function GroupDetail() {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for EditGroupModal
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [usersMap, setUsersMap] = useState<Map<string, any>>(new Map());
  const { groupId } = useParams() as { groupId: string };
  const { data: session, update: updateSession} = useSession(); 
  const userId = session?.user?.id;
  // Fetch group details
  useEffect(() => {
    updateSession();
    if (groupId) {
      const fetchGroupDetails = async () => {
        try {
          const response = await axios.get(`/api/group/${groupId}`);
          setGroup(response.data);

          // Fetch user data in batch if listUserJoin exists
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
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(`/api/group/${groupId}`);
      alert("กลุ่มถูกลบเรียบร้อยแล้ว");
      window.location.href = `/activity/${group?.activityId}`; // Redirect to homepage or another page
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
      <div className="container mx-auto mt-24 px-10 md:px-20">
        <h1 className="text-3xl font-bold text-gray-800 my-4">{group.groupName}</h1>

        <div className="bg-slate-200 overflow-hidden flex flex-col md:flex-row mb-8">
          <div className="md:w-1/2 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">รายละเอียด</h3>
            <div className="ml-2">
              <p className="text-gray-600 text-base mb-3">{group.description}</p>
              <div className="text-gray-800 text-base mb-1">
                วันที่: {format(new Date(group.date), "eee d MMM", { locale: th })}
              </div>
              <div className="text-gray-800 text-base mb-1">
                เวลา: {group.startTime} - {group.endTime}
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
          </div>
          <div className="md:w-1/2 p-6">
            <button
              onClick={openUserModal}
              className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-300 m-2"
            >
              ดูสมาชิก
            </button>
            <Link
              href={`chat/${group.id}`}
              className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition duration-300 mt-4 inline-block m-2"
            >
              ไปที่แชทของกลุ่ม
            </Link>
            {/* แสดงปุ่ม Edit เฉพาะเจ้าของกลุ่ม */}
            {userId === group.postedBy.id && (
              <>
                <button
                  onClick={openEditModal}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-yellow-600 transition duration-300 m-2"
                >
                  แก้ไขกลุ่ม
                </button>
                <button
                  onClick={() => setIsDeletePopupOpen(true)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 transition duration-300 m-2"
                >
                  ลบกลุ่ม
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        usersMap={usersMap}
        selectedUserIds={group.listUserJoin}
      />

      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        defaultValues={{
          groupName: group.groupName,
          description: group.description,
          date: new Date(group.date),
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
