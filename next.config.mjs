/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "media.istockphoto.com",
      "upload.wikimedia.org",
      "pngimg.com",
      "images.seeklogo.com",
    ],
  },
};

export default nextConfig;
