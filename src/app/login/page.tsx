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

      <div className="max-w-2xl mx-auto">
        <div id="authentication-modal" aria-hidden="true" className="hidden overflow-x-hidden overflow-y-auto fixed h-modal md:h-full top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center">
            <div className="relative w-full max-w-md px-4 h-full md:h-auto">
                <div className="bg-white rounded-lg shadow relative dark:bg-gray-700">
                    <div className="flex justify-end p-2">
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" ></path></svg>  
                        </button>
                    </div>
                    <form className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8" action="#">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
                        <div>
                            <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Your email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">Your password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required/>
                                </div>
                                <div className="text-sm ml-3">
                                <label className="font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                        </div>
                        <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                        </div>
                    </form>
                </div>
            </div>
        </div> 

        </div>

    </div>
  )
}

export default RegisterPage
