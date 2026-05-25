/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

export default nextConfig;
