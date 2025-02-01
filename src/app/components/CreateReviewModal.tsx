"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: any) => void;
}
//ge
const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<{
    rating: number;
    comment: string;
  }>({
    rating: 0,
    comment: "",
  });

  const handleRatingChange = (rating: number) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit({ ...form });
    setForm({
      rating: 0,
      comment: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">เขียนรีวิว</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              คะแนน
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  className={`cursor-pointer ${
                    star <= form.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              เขียนรีวิว
            </label>
            <textarea
              id="comment"
              name="comment"
              placeholder="กรุณาเขียนรีวิว"
              value={form.comment}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
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

export default CreateReviewModal;
