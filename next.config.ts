import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com',
               'res.cloudinary.com',
               'cdn-icons-png.flaticon.com',
               'encrypted-tbn0.gstatic.com',
               'cdn.textstudio.com',
               'img.freepik.com',
    ], // อนุญาตให้ใช้รูปภาพจากโดเมนนี้
  },
};

export default nextConfig;
