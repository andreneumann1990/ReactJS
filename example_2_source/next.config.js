/**
 * @type {import('next').NextConfig}
 */

//
// dev config;
//

// const nextConfig = {
//     images: {
//         unoptimized: true,
//         remotePatterns: [{
//             protocol: 'https',
//             hostname: 'fakeimg.pl',
//         }],
//     },
// }

//
// export config;
//

const nextConfig = {
    assetPrefix: '/reactjs/example_2/',
    basePath: '/reactjs/example_2',
    distDir: '../example_2',
    output: 'export',

    images: {
        unoptimized: true,
        path: '/reactjs/example_2',
        remotePatterns: [{
            protocol: 'https',
            hostname: 'fakeimg.pl',
        }],
    },
}

module.exports = nextConfig

