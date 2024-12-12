'use client'
import { FC ,useState} from "react";
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
import axios from 'axios';

interface RegisterModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void; // เพิ่ม callback สำหรับเปลี่ยนไป Login
}

const RegisterModel: FC<RegisterModelProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleClose = () => {
    // ล้างข้อมูล State ทั้งหมด
    setName("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
    onClose(); // ปิด Modal
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      console.log(response.data);
      alert('Account created successfully!');
      onClose(); // ปิด Modal
    } catch (error: any) {
      // ใช้ error.response เพื่อตรวจสอบข้อความผิดพลาดจาก API
      setErrorMessage(
        error.response?.data?.error || 'An unexpected error occurred'
      );
    }
  };

  if (!isOpen) return null; // ถ้า Modal ไม่เปิด ให้ return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-4 relative w-full max-w-md">
        {/* ปุ่มปิด */}
        <div className="flex justify-end p-2">
                    <button onClick={handleClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>  
                    </button>
                </div>
        {/* ฟอร์ม */}
        <form onSubmit={handleRegister} className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8" action="#">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create account</h3>
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-2">
                            {errorMessage}
                        </div>
          )}
                    <div>
                        <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Name</label>
                        <input type="text" name="name" id="name" placeholder="Name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required
                                value={name}
                                onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Email address</label>
                        <input type="email" 
                                name="email" 
                                id="email" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Email address" required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Password</label>
                        <input type="password" name="password" id="password" placeholder="Password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    {/* <div className="flex justify-between">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="remember" aria-describedby="remember" type="checkbox" className="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required/>
                            </div>
                            <div className="text-sm ml-3">
                            <label className="font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                            </div>
                        </div>
                        <a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                    </div> */}
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign up</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Already have an account?{" "}
                        <button onClick={onSwitchToLogin} className="text-blue-700 hover:underline dark:text-blue-500">
                          login
                        </button>
                    </div>
                    
                </form>
      </div>
    </div>
  );
};

export default RegisterModel;
