/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,

  // ⛔ Important : activer Webpack au lieu de Turbopack
  // (obligatoire si tu utilises next-pwa)
  webpack: (config, { dev }) => {
      if (!dev) {
          config.devtool = 'source-map';
      }
      return config;
  },

  // Désactive complètement Turbopack :
  turbopack: {
      // Option vide = Turbopack désactivé
  },

  images: {
      remotePatterns: [
          { protocol: 'https', hostname: 'img.freepik.com' },
          { protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL, hostname: 'erp.turbodeliveryapp.com' },
          { protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL, hostname: 'resto.turbodeliveryapp.com' },
          { protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL, hostname: 'backend.turbodeliveryapp.com' },
          { protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL, hostname: 'customer.turbodeliveryapp.com' },
          { protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL, hostname: 'delivery.turbodeliveryapp.com' },
      ],
  },
});

module.exports = nextConfig;
