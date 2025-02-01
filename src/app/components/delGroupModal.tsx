function DeleteGroupPopup({ isOpen, onClose, onConfirm }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-80">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          ยืนยันการลบกลุ่ม
        </h2>
        <p className="text-gray-600 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบกลุ่มนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            ลบกลุ่ม
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteGroupPopup;