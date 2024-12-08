"use client"

import React, {useState} from 'react'
import Nav from '../components/Nav'
import Link from 'next/link'

function RegisterPage() {
  return (
    <div>
      <Nav />
      <div className="container mx-20 mt-20">
        <h3>Login Page</h3>
        <hr className='my-3'/>
        <form action="">
          <input className="block bg-gray-100 p-2 my-2 rounded-md" type="email" placeholder='Enter your email'/>
          <input className="block bg-gray-100 p-2 my-2 rounded-md" type="password" placeholder='Enter your password'/>
          <button type='submit' className='bg-blue-500 text-white p-1 rounded-md'>Sign In</button>
          <hr className='my-3'/>
          <p>Don't have an account? <Link className='text-blue-300 hover:underline' href="/register">Sign Up</Link></p>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
