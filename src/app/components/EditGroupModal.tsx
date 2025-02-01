import React, { useState } from "react";

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedGroup: any) => void;
  defaultValues: {
    groupName: string;
    description: string;
    date: Date | null;
    startTime: string;
    endTime: string;
  };
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const [groupName, setGroupName] = useState(defaultValues.groupName);
  const [description, setDescription] = useState(defaultValues.description);
  const [date, setDate] = useState(defaultValues.date ? defaultValues.date.toISOString() : ""); // Convert Date to YYYY-MM-DD
  const [startTime, setStartTime] = useState(defaultValues.startTime);
  const [endTime, setEndTime] = useState(defaultValues.endTime);

  const handleSubmit = () => {
    const isoDate =  date ? new Date(date).toISOString(): null;
    onSubmit({
      groupName,
      description,
      date:isoDate ? new Date(isoDate) : null,
      startTime,
      endTime,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">แก้ไขกลุ่ม</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ชื่อกลุ่ม</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">รายละเอียด</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">วันที่</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <div>
            <label className="block text-sm font-medium mb-1">เวลาเริ่ม</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">เวลาสิ้นสุด</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;
