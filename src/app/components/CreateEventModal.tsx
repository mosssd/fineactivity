"use client";

import React, { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries: ["places"] = ["places"]; // ใช้ Places API
interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: any) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      libraries,
    });

  const [form, setForm] = useState<{
    eventName: string;
    image: string;
    description: string;
    contact: string;
    categories: string[];
    startTime: string | null;
    endTime: string | null;
    startDate: Date | null;
    endDate: Date | null;
    location: string; // ✅ เพิ่มที่อยู่
  }>({
    eventName: "",
    image: "",
    description: "",
    contact: "",
    location: "", // ✅ เก็บที่อยู่ + พิกัด // ค่าเริ่มต้นของที่อยู่
    categories: [],
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  });
  const [categoriesOptions, setCategoriesOptions] = useState<any[]>([]);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/activitycategory");
        setCategoriesOptions(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (result: any) => {
    setForm((prev) => ({
      ...prev,
      image: result.info.secure_url, // เก็บ URL ของรูปภาพที่อัปโหลดในฟอร์ม
    }));
  };
  
  const handleCategoryChange = (selectedList: any[], selectedItem: any) => {
    setForm((prev) => ({
      ...prev,
      categories: selectedList.map((category) => category.id), // ดึงเฉพาะ id
    }));
  };

  const handleSubmit = () => {
    onSubmit({ ...form }); // ส่ง userId พร้อม form
    setForm({
      eventName: "",
      image: "",
      description: "",
      contact: "",
      categories: [],
      startTime: null,
      endTime: null,
      startDate: null,
      endDate: null,
      location: "", // ✅ เก็บที่อยู่ + พิกัด
    });
  };

    // เมื่อผู้ใช้เลือกที่อยู่จาก Google Maps
  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.address_components) {
        let placeName = place.name || ""; // ชื่อสถานที่
        let province = "";
  
        place.address_components.forEach((component) => {
          if (component.types.includes("administrative_area_level_1")) {
            province = component.long_name; // ดึงชื่อจังหวัด
          }
        });
  
        setForm((prev) => ({
          ...prev,
          location: `${placeName}, ${province}`, // เก็บเป็น string
        }));
      }
    }
  };

  if (!isLoaded) return <p>Loading...</p>; 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg h-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">สร้างกิจกรรม</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">ชื่อกิจกรรม</label>
            <input
              id="eventName"
              type="text"
              name="eventName"
              placeholder="กรุณากรอกชื่อกิจกรรม"
              value={form.eventName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">คำอธิบาย</label>
            <textarea
              id="description"
              name="description"
              placeholder="กรุณากรอกคำอธิบาย"
              value={form.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
            />
          </div>

          {/* Google Places Autocomplete */}
          <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">พิกัด</label>
          <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceSelect}>
            <input
              type="text"
              placeholder="กรุณากรอกพิกัด"
              value={form.location} // ตอนนี้ form.location เป็น string แล้ว
              onChange={(e) => setForm((prev) => ({
                ...prev,
                location: e.target.value // เปลี่ยนแค่ location เป็น string
              }))}
              className="w-full border rounded-md px-4 py-2 mt-2"
            />
          </Autocomplete>
          </div>

          {/* วันที่เริ่มต้น */}
          <div>
            <label className="block text-sm font-medium text-gray-700">วันที่เริ่มต้น</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {form.startDate ? format(form.startDate, "d MMM yyyy") : "เลือกวันที่เริ่มต้น"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.startDate || undefined}
                  onSelect={(date) => setForm((prev) => ({ ...prev, startDate: date || null }))}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* วันที่สิ้นสุด */}
          <div>
            <label className="block text-sm font-medium text-gray-700">วันที่สิ้นสุด</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {form.endDate ? format(form.endDate, "d MMM yyyy") : "เลือกวันที่สิ้นสุด"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.endDate || undefined}
                  onSelect={(date) => setForm((prev) => ({ ...prev, endDate: date || null }))}
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
              value={form.startTime || ""}
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
              value={form.endTime || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">อัปโหลดรูปภาพ</label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={handleImageUpload}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                >
                  เลือกรูปภาพ
                </button>
              )}
            </CldUploadWidget>
          </div>

          {form.image && (
            <div className="mt-2">
              <img src={form.image} alt="Preview" className="w-24 h-auto mx-auto" />
            </div>
          )}


          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">ข้อมูลติดต่อ</label>
            <input
              id="contact"
              type="text"
              name="contact"
              placeholder="กรุณากรอกข้อมูลติดต่อ"
              value={form.contact}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
            />
          </div>

          <div>
            <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
              หมวดหมู่กิจกรรม
            </label>
            <Multiselect
              options={categoriesOptions}
              displayValue="name"
              selectedValues={categoriesOptions.filter((category) =>
                form.categories.includes(category.id)
              )}
              onSelect={(selectedList) => handleCategoryChange(selectedList, null)}
              onRemove={(selectedList) => handleCategoryChange(selectedList, null)}
              placeholder="เลือกหมวดหมู่"
              className="mt-2"
            />
          </div>


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

export default CreateEventModal;