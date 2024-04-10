/**
 * @type {import('next').NextConfig}
 */

const isProduction = process.env.NODE_ENV === 'production'
const nextConfig = {
    assetPrefix: isProduction ? '/reactjs/example_3' : '',
    basePath: isProduction ? '/reactjs/example_3' : '',
    // distDir: isProduction ? '../example_3' : undefined,
    // output: isProduction ? 'export' : undefined,

    images: {
        unoptimized: true,
        path: isProduction ? '/reactjs/example_3' : undefined,
        remotePatterns: [{
            protocol: 'https',
            hostname: 'fakeimg.pl',
        }],
    },

    publicRuntimeConfig: {
        backEndHRef: isProduction ? "https://example-3-b52da596edfb.herokuapp.com" : 'http://localhost:8080',
    },
}

module.exports = nextConfig

