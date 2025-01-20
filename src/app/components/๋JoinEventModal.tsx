"use client";
import React from "react";

interface ModalProps {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const JoinEventModal: React.FC<ModalProps> = ({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p>{description}</p>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-300 px-4 py-2 rounded mr-2"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinEventModal;
