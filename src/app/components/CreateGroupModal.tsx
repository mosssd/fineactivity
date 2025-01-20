"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: any) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<{
    groupName: string;
    description: string;
    date: Date | null;
    startTime: string;
    endTime: string;
  }>({
    groupName: "",
    description: "",
    date: null,
    startTime: "00:00",
    endTime: "00:00",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit({ ...form });
    setForm({
      groupName: "",
      description: "",
      date: null,
      startTime: "00:00",
      endTime: "00:00",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg h-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">สร้างกลุ่ม</h2>
        <div className="space-y-6">
          {/* ชื่อกลุ่ม */}
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700"
            >
              ชื่อกลุ่ม
            </label>
            <input
              id="groupName"
              type="text"
              name="groupName"
              placeholder="กรุณากรอกชื่อกลุ่ม"
              value={form.groupName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
            />
          </div>

          {/* คำอธิบาย */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              คำอธิบาย
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="กรุณากรอกคำอธิบาย"
              value={form.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
            />
          </div>

          {/* วันที่ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">วันที่</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {form.date ? format(form.date, "d MMM yyyy") : "เลือกวันที่"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.date || undefined}
                  onSelect={(date) => setForm((prev) => ({ ...prev, date: date || null }))}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* เวลาเริ่มต้น */}
          <div>
            <label
              htmlFor="starttime"
              className="block text-sm font-medium text-gray-700"
            >
              เวลาเริ่มต้น
            </label>
            <input
              id="starttime"
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
            />
          </div>

          {/* เวลาสิ้นสุด */}
          <div>
            <label
              htmlFor="endtime"
              className="block text-sm font-medium text-gray-700"
            >
              เวลาสิ้นสุด
            </label>
            <input
              id="endtime"
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
            />
          </div>

          {/* ปุ่มบันทึกและยกเลิก */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
