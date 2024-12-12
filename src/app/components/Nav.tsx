"use client"
import React, { useState } from "react";
import Link from "next/link";
import LoginModal from "../components/LoginModal";
import RegisterModel from "./RegisterModal";
import { useSession } from 'next-auth/react'

const NavbarMenu = [
  { id: 1, name: "Activity", link: "/activity" },
  { id: 2, name: "Event", link: "/event" },
  { id: 3, name: "Group", link: "/group" },
  { id: 4, name: "Saved", link: "/saved" },
];

function Nav() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { data: session } = useSession()
  console.log('session', session)

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
        <a href="#" id="home" className="text-2xl flex justify-self-center ml-10">
          <p className="text-black font-mono font-bold">FINE</p>
          <p className="text-orange-200 font-mono font-light">ACTIVITY</p>
        </a>
        <div className="hidden md:block">
          <ul className="flex justify-center items-center gap-20 text-l">
            {NavbarMenu.map((menu) => (
              <li key={menu.id}>
                <Link
                  className="font-mono hover:text-gray-500 hover:underline underline-offset-8"
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
          <li className='mx-3'>
            {/* <Link href="/profile">Profile</Link> */}
            <Link href="/profiletwo">Profile</Link>
          </li>
        )}
        <button className="p-2 md:hidden">
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      {/* เรียกใช้งาน Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={closeAllModals} onSwitchToRegister={openRegister} />
      <RegisterModel isOpen={isRegisterOpen} onClose={closeAllModals} onSwitchToLogin={openLogin} />
    </nav>
  );
}

export default Nav;
