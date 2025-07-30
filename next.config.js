/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.freepik.com',
            },
            {
                protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL,
                hostname: 'erp.turbodeliveryapp.com',
            },
            {
                protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL,
                hostname: 'resto.turbodeliveryapp.com',
            },
            {
                protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL,
                hostname: 'customer.turbodeliveryapp.com',
            },
            {
                protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL,
                hostname: 'delivery.turbodeliveryapp.com',
            },
        ],
    },
    productionBrowserSourceMaps: false,
    webpack(config, options) {
        if (!options.dev) {
        config.devtool = 'source-map';
        }
        return config;
    }
};

module.exports = nextConfig;
