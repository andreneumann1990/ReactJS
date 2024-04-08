/**
 * @type {import('next').NextConfig}
 */

const isProduction = process.env.NODE_ENV === 'production'
const nextConfig = {
    assetPrefix: isProduction ? '/reactjs/example_2' : '',
    basePath: isProduction ? '/reactjs/example_2' : '',
    distDir: isProduction ? '../example_2' : undefined,
    output: isProduction ? 'export' : undefined,

    images: {
        unoptimized: true,
        path: isProduction ? '/reactjs/example_2' : undefined,
        remotePatterns: [{
            protocol: 'https',
            hostname: 'fakeimg.pl',
        }],
    },
}

module.exports = nextConfig

