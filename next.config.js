/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',      // où sera généré le service worker
    register: true,      // auto-enregistrer le service worker
    skipWaiting: true,   // active immédiatement le nouveau SW
});
  
const nextConfig = withPWA({
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'img.freepik.com' },
        { protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL, hostname: 'erp.turbodeliveryapp.com' },
        { protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL, hostname: 'resto.turbodeliveryapp.com' },
        { protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL, hostname: 'customer.turbodeliveryapp.com' },
        { protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL, hostname: 'delivery.turbodeliveryapp.com' },
      ],
    },
    productionBrowserSourceMaps: false,
    webpack(config, options) {
      if (!options.dev) {
        config.devtool = 'source-map';
      }
      return config;
    },
});
  
module.exports = nextConfig;
  