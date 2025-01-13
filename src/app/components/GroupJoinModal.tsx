import React from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface Group {
  id: string;
  groupName: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface GroupModalProps {
  group: Group;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (groupId: string) => void;
}

const GroupModal: React.FC<GroupModalProps> = ({ group, isOpen, onClose, onJoin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold">{group.groupName}</h2>
        <p className="text-gray-700">{group.description}</p>
        <p className="text-sm text-gray-600">
          วันที่: {format(group.date, "d MMM yyyy", { locale: th })}
          <br />
          เวลา: {group.startTime} - {group.endTime}
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
            onClick={onClose}
          >
            ปิด
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={() => onJoin(group.id)}
          >
            เข้าร่วมกลุ่ม
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
