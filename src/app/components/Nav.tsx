"use client"
import React, { useState } from "react";
import Link from "next/link";
import LoginModal from "../components/LoginModal";
import RegisterModel from "./RegisterModal";
import { useSession,signOut } from 'next-auth/react'
import { usePathname } from "next/navigation";

const NavbarMenu = [
  { id: 1, name: "Activity", link: "/activity" },
  { id: 2, name: "Event", link: "/event" },
  { id: 3, name: "Group", link: "/group" },
  { id: 4, name: "Saved", link: "/saved" },
];


function Nav() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession()
  const pathname = usePathname();
  console.log('session', session)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const openLogin = () => {
    setIsRegisterOpen(false); // ปิด RegisterModal ถ้าเปิดอยู่
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false); // ปิด LoginModal ถ้าเปิดอยู่
    setIsRegisterOpen(true);
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="p-5 flex bg-white justify-between items-center border-b-2 border-gray-300">
        <a href="/" id="home" className="text-2xl flex justify-self-center ml-10">
          <p className="text-black font-mono font-bold">FINE</p>
          <p className="text-orange-200 font-mono font-light">ACTIVITY</p>
        </a>
        <div className="hidden md:block">
          <ul className="flex justify-center items-center gap-20 text-l">
            {NavbarMenu.map((menu) => (
              <li key={menu.id}>
                <Link
                  className={`font-mono hover:text-gray-500 hover:underline underline-offset-8 ${
                    pathname === menu.link ? "underline" : ""}`} 
                  href={menu.link}
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* <ul className="flex">
          <li className="mx-3">
            <Link href="/login">Sign In</Link>
          </li>
        </ul> */}
        {!session ? (
        <button
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          onClick={() => setIsLoginOpen(true)} // เปิด Modal
        >
          Sign in
        </button>)
        : (
          <div className="relative hidden ml-8 md:block">
          {/* รูปโปรไฟล์ */}
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="focus:outline-none"
          >
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            )}
          </button>
      
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <ul className="py-2">
                {/* ไปหน้า Profile */}
                <li>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)} // ปิด dropdown เมื่อคลิก
                  >
                    Profile
                  </Link>
                </li>
                <hr className="border-t border-gray-200" />
                {/* Logout */}
                <li>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false); // ปิด dropdown เมื่อ logout
                      signOut(); // เรียกใช้ฟังก์ชัน logout จาก next-auth
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        )}
        <button
          className="p-2 md:hidden"
          onClick={toggleMenu} // เปิด/ปิดเมนู
        >
          <p>xxx</p>
        </button>
        {/* Dropdown/Side Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg md:hidden z-10">
          <ul className="flex flex-col items-start p-4">
          <li className="py-2 border-b w-full">
                <Link href="/activity" className="block w-full text-gray-700 hover:text-gray-900">
                  Activity
                </Link>
              </li>
              <li className="py-2 border-b w-full">
                <Link href="/event" className="block w-full text-gray-700 hover:text-gray-900">
                  Event
                </Link>
              </li>
              <li className="py-2 border-b w-full">
                <Link href="/group" className="block w-full text-gray-700 hover:text-gray-900">
                  Group
                </Link>
              </li>
              <li className="py-2 border-b w-full">
                <Link href="/saved" className="block w-full text-gray-700 hover:text-gray-900">
                  Saved
                </Link>
              </li>
            <hr className="border-t border-gray-200 my-2" />
            <li>
              <Link
                href="/profiletwo"
                className="block w-full text-gray-700 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsMenuOpen(false); // ปิด dropdown เมื่อ logout
                  signOut(); // เรียกใช้ฟังก์ชัน logout จาก next-auth
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
        )}
      </div>

      {/* เรียกใช้งาน Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={closeAllModals} onSwitchToRegister={openRegister} />
      <RegisterModel isOpen={isRegisterOpen} onClose={closeAllModals} onSwitchToLogin={openLogin} />
    </nav>
  );
}

export default Nav;
