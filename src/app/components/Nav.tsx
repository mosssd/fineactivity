import React from 'react'
import Link from 'next/link'

const NavbarMenu = [
  {
    id:1,
    name: 'Activity',
    link: '/activity'
  },
  {
    id:2,
    name: 'Event',
    link: '/event'
  },
  {
    id:3,
    name: 'Group',
    link: '/group'
  },
  {
    id:4,
    name: 'Saved',
    link: '/saved'
  }
]

function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="p-5 flex bg-white justify-between items-center border-b-2 border-gray-300">
        <a href="#" id="home" className=' text-2xl flex justify-self-center ml-10'>
          <p className="text-black font-mono font-bold">FINE</p>
          <p className='text-orange-200 font-mono font-light'>ACTIVITY</p>
        </a>
        <div className='hidden md:block'>
          <ul className='flex justify-center items-center gap-20 text-l'>
            {NavbarMenu.map((menu) => (
              <li key={menu.id}>
                <Link className="font-mono hover:text-gray-500 hover:underline underline-offset-8" href={menu.link}>{menu.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <ul className='flex'>
          <li className='mx-3'><Link href="/login">Sign In</Link></li>
          {/* <li className='mx-3'><Link href="/register">Sign Up</Link></li> */}
        </ul>
        {/* <button className='hidden p-2 ml-10 md:block'>
          <img className="h-10 max-w-lg rounded-lg ml-auto" src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png" alt="" />
        </button> */}
        <button className='p-2 md:hidden'>
          <i className="fa-solid fa-bars"></i>
        </button>

        <div id="nav-dialog" className='fixed hidden z-10 md:hidden bg-white inset-0 p-3'>
            <div id="nav-bar" className='flex justify-between'>
              <a href="#" id="home" className=' text-2xl flex justify-self-center ml-10'>
                <p className="text-black font-mono font-bold">FINE</p>
                <p className='text-orange-200 font-mono font-light'>ACTIVITY</p>
              </a>
              <button className='p-2 md:hidden'>
                <i className="fa-solid fa-x"></i>
              </button>
            </div>
            <div className='mt-6 ml-4'>
              <ul>
                {NavbarMenu.map((menu) => (
                  <li key={menu.id}>
                    <Link className="font-mono m-3 p-3 hover:bg-gray-50 block rounded-lg " href={menu.link}>{menu.name}</Link>
                  </li>
                ))}
              </ul>
              <ul className='flex'>
                <li className='mx-3'><Link href="/login">sign in</Link></li>
                <li className='mx-3'><Link href="/login">sign in</Link></li>
              </ul>
              <div className='h-[1px] bg-slate-600'></div>
              <a className="font-mono m-3 p-3 hover:bg-gray-50 block rounded-lg " href="/Profile">Profile</a>
            </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
