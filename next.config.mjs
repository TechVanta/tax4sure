/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",          // Static HTML export → S3
  trailingSlash: true,       // Required for S3 static hosting
  images: {
    unoptimized: true,       // next/image optimization not available in static export
  },
};

export default nextConfig;
