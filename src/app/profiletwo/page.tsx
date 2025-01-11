'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Nav from '../components/Nav'

export default function Profile() {
  const { data: session, status, update: updateSession } = useSession();

  console.log('session', session)
  console.log('status', status)
  const router = useRouter()
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
    if (status === "authenticated" && session?.user && !session?.user.id) {
      updateSession(); // บังคับโหลด session ใหม่
    }
  }, [status, session]);

  // When after loading success and have session, show profile

  if (status === "loading") return <p>Loading session...</p>
  
  return (
    status === 'authenticated' &&
    session.user && (
      <div className="flex h-screen items-start justify-center ">
        <Nav/>
        <div className="bg-gray-100 flex flex-col items-center py-10">
      {/* Profile Header */}
      <div className="w-full bg-orange-300 text-white pt-20 ">
        <div className="mx-auto flex items-center justify-between">
          {/* Profile Section */}
          <div className="flex-shrink-0 w-1/3 flex flex-col items-center justify-center p-6">
            <div className="w-28 h-28 mb-4">
              <img
                src={session.user.image? session.user.image : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <h1 className="font-bold text-center">{session.user.name}</h1>
            <p className="text-center ">{session.user.email}</p>
          </div>

          {/* Navigation Section */}
          <div className="bg-white rounded-xl shadow-xl p-2 mr-10">
            <div className="flex justify-around text-center divide-x-2 divide-solid bg-gray-100">
              <div className='bg-white p-4'>
                <h2 className="text-xl text-black">Saved</h2>
                <p className="text-black">0</p>
              </div>
              <div className='bg-white p-4'>
                <h2 className="text-xl text-black">Group</h2>
                <p className="text-black">0</p>
              </div>
              <div className='bg-white p-4'>
                <h2 className="text-xl text-black">Review</h2>
                <p className="text-black">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-6 p-6">
        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">About Me</h2>
          <p className="text-gray-600 mt-2">
            Hi, I’m John! I specialize in building amazing web applications and creating engaging digital experiences. I love exploring new technologies and sharing knowledge with the community.
          </p>
        </div>

        {/* Portfolio Section */}
        {/* <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Portfolio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold">Project A</h3>
              <p className="text-sm text-gray-600">A web app for managing tasks efficiently.</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold">Project B</h3>
              <p className="text-sm text-gray-600">A platform for sharing creative content.</p>
            </div>
          </div>
        </div> */}

        {/* Social Links */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Connect with Me</h2>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 transition duration-200"
            >
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a
              href="#"
              className="text-gray-800 hover:text-black transition duration-200"
            >
              <i className="fab fa-github text-2xl"></i>
            </a>
            <a
              href="#"
              className="text-blue-500 hover:text-blue-600 transition duration-200"
            >
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md hover:from-purple-600 hover:to-blue-600 transition duration-200">
            Sign out
          </button>
        </div>
      </div>
    </div>


      </div>
    )
  )
}