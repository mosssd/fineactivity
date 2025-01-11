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
      <div className="flex h-screen items-center justify-center">
        <Nav/>
        <div className="bg-white p-6 rounded-md shadow-md">
        <div className="text-center mb-4">
            <img
              src={session.user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="rounded-full w-20 h-20 mx-auto"
            />
          </div>
          <p>
            Welcome, <b>{session.user.name}!</b>
          </p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>

          <button
            onClick={() => signOut({ callbackUrl: '/signin' })}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    )
  )
}