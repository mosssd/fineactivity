"use client"

import React, {useState} from 'react'
import Nav from '../components/Nav'
import Link from 'next/link'

function RegisterPage() {
  return (
    <div>
      <Nav />
      <div className="container mx-20 mt-20">
        <h3>Register Page</h3>
        <hr className='my-3'/>
        <form action="">
          <input className="block bg-gray-100 p-2 my-2 rounded-md" type="text" placeholder='Enter your name'/>
          <input className="block bg-gray-100 p-2 my-2 rounded-md" type="email" placeholder='Enter your email'/>
          <input className="block bg-gray-100 p-2 my-2 rounded-md" type="password" placeholder='Enter your password'/>
          <input className="block bg-gray-100 p-2 my-2 rounded-md" type="password" placeholder='Confirm your password'/>
          <button type='submit' className='bg-blue-500 text-white p-1 rounded-md'>Sign Up</button>
          <hr className='my-3'/>
          <p>Already have an account? <Link className='text-blue-300 hover:underline' href="/login">Sign In</Link></p>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
