import React from 'react'
import Nav from '../components/Nav';

const jsonData = [
  { id: 1, content: "Item 1" },
  { id: 2, content: "Item 2" },
  { id: 3, content: "Item 3" },
  { id: 4, content: "Item 4" },
  { id: 5, content: "Item 5" },
  { id: 6, content: "Item 6" },
  { id: 7, content: "Item 7" },
  { id: 8, content: "Item 8" },
  { id: 9, content: "Item 9" },
  { id: 10, content: "Item 10" },
  { id: 11, content: "Item 11" },
  { id: 12, content: "Item 12" },
  { id: 13, content: "Item 13" },
  { id: 14, content: "Item 14" },
  { id: 15, content: "Item 15" },
  { id: 16, content: "Item 16" }
];

function page() {
  return (
    <div>
      <Nav />
      <div className="container mx-auto mt-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10 md:px-20">
        {jsonData.map((item) => (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative z-10">
                  <img className="w-full h-full object-cover" src="https://via.placeholder.com/600x360"/>
                  <div className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center">
                    <button className='pt-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="fill-gray-500 hover:fill-red-500 transition-all duration-300" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-gray-800 text-white px-2 py-1 m-2 rounded-md text-xs">1 group
                  </div>
              </div>
              <div className="p-4">
                  <div className="text-lg font-medium text-gray-800 mb-2">Title {item.content}</div>
                  <p className="text-gray-500 text-sm overflow-hidden text-ellipsis line-clamp-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed
                      egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.</p>
                      <div className="flex items-center mt-2.5 mb-5">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <svg className="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                      </svg>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">5.0</span>
              </div>
              </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default page
