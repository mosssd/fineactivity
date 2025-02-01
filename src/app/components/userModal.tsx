import React, { useMemo } from "react";
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area";

interface User {
  id: string;
  name: string;
  image: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  usersMap: Map<string, User>; // User data is passed as a map
  selectedUserIds: string[]; // List of selected user IDs
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  usersMap,
  selectedUserIds,
}) => {
  // Compute selected users based on IDs
  const selectedUsers = useMemo(() => {
    return selectedUserIds
      .map((userId) => usersMap.get(userId) || null)
      .filter(Boolean) as User[]; // Ensure no nulls are passed
  }, [selectedUserIds, usersMap]);
  

  if (!isOpen) {
    return null; // Don't render modal if it's closed
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-96 p-4">
        <h2 className="text-lg font-semibold mb-4">สมาชิกในกลุ่ม</h2>
        <ScrollArea className="h-60 w-full">
          <ul className="space-y-2">
            {selectedUsers.map((user) => (
              <li key={user.id} className="flex items-center">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

export default UserModal;
