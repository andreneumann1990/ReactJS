/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    assetPrefix: '/reactjs/example_2/',
    basePath: '/reactjs/example_2',
    distDir: '../example_2',
    output: 'export',

    images: {
        unoptimized: true,
        path: '/reactjs/example_2',
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'fakeimg.pl',
            // port: '',
            // pathname: '/account123/**',
        },
        ],
    },
}

module.exports = nextConfig

