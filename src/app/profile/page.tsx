'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect ,useState} from 'react'
import axios from 'axios'
import Link from 'next/link'
import Nav from '../components/Nav'

export default function Profile() {
  const { data: session, status, update: updateSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const userId = session?.user?.id;

  console.log('session', session)
  console.log('status', status)
  const router = useRouter()

  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      const response = await axios.get(`/api/user/${userId}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
      updateSession(); 
    }, []); 
  
    useEffect(() => {
      if (session?.user?.id) {
        fetchData();
      }
    }, [session]);

  // When after loading success and have session, show profile
  if (loading) {
    return (
      <div>
        <Nav />
        <div className="text-center mt-24">Loading...</div>
      </div>
      )
  }
  
  return (
    status === 'authenticated' &&
    session.user && (
<div className="flex h-screen w-full justify-center">
  <Nav />
  <div className="w-full max-w-screen-xl bg-white flex flex-col items-center py-10">
    {/* Profile Header */}
    <div className="w-full bg-gradient-to-r from-orange-400 to-orange-300 text-white pt-20 pb-12">
      <div className="w-full max-w-screen-xl mx-auto flex items-center justify-between px-4">
        {/* Profile Section */}
        <div className="flex-shrink-0 w-1/3 flex flex-col items-center justify-center p-6">
          <div className="w-28 h-28 mb-4">
            <img
              src={session.user.image ? data.image : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <h1 className="font-bold text-center">{data.name}</h1>
          <p className="text-center">{data.email}</p>
        </div>

        {/* Navigation Section */}
        <div className="bg-white rounded-xl shadow-xl p-2 mr-10">
          <div className="flex justify-around text-center divide-x-2 divide-solid bg-white">
            <Link href="/saved">
              <div className="bg-white p-4 hover:bg-gray-100">
                <h2 className="text-xl text-black">Saved</h2>
                <p className="text-black">{data.savedActivities.length + data.savedEvents.length}</p>
              </div>
            </Link>
            <Link href="/group">
              <div className="bg-white p-4 hover:bg-gray-100">
                <h2 className="text-xl text-black">Group</h2>
                <p className="text-black">{data.listofGroup.length}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-6 p-6">
      <div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Sign out
        </button>
      </div>
    </div>
  </div>
</div>

    )
  )
}
