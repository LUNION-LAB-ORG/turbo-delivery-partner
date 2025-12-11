/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
    reactStrictMode: true,

    turbopack: {},

    // ✅ CRITIQUE : Désactiver le file tracing qui consomme trop de mémoire
    output: 'standalone',

    webpack: (config, { isServer, webpack }) => {
        // Optimisations mémoire
        config.optimization = {
            ...config.optimization,
            minimize: true,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                },
            },
        };

        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push({
                'module': 'commonjs module',
                'node:module': 'commonjs module',
                'canvas': 'commonjs canvas',
                'sharp': 'commonjs sharp',
                'pureimage': 'commonjs pureimage',
                'paddleocr': 'commonjs paddleocr',
                'tesseract.js': 'commonjs tesseract.js',
                'scribe.js-ocr': 'commonjs scribe.js-ocr',
            });
        } else {
            config.resolve.fallback = {
                fs: false,
                path: false,
                module: false,
                canvas: false,
            };
        }

        config.ignoreWarnings = [
            { module: /node_modules\/axios/ },
        ];

        return config;
    },

    // ✅ CRITIQUE : Exclure un maximum de fichiers du tracing
    outputFileTracingExcludes: {
        '*': [
            'node_modules/@swc/core-*',
            'node_modules/esbuild',
            'node_modules/webpack',
            'node_modules/terser',
            'node_modules/@next/swc-*',
            'node_modules/@paddlejs-models',
            'node_modules/paddleocr',
            'node_modules/pureimage',
            'node_modules/canvas',
            'node_modules/sharp',
            '.git',
            '.next/cache',
        ],
    },

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'img.freepik.com' },
            { protocol: 'https', hostname: 'erp.turbodeliveryapp.com' },
            { protocol: 'https', hostname: 'resto.turbodeliveryapp.com' },
            { protocol: 'https', hostname: 'backend.turbodeliveryapp.com' },
            { protocol: 'https', hostname: 'customer.turbodeliveryapp.com' },
            { protocol: 'https', hostname: 'delivery.turbodeliveryapp.com' },
        ],
    },

    experimental: {
        optimizePackageImports: [
            '@heroui/react',
            '@radix-ui/react-icons',
            'lucide-react',
            'react-icons',
        ],
    },
};

module.exports = withPWA(nextConfig);