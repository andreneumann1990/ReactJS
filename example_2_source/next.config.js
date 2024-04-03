/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  distDir: '../example_2',

//   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//     // Override production minification
//     if (!dev) {
//       config.optimization.minimize = false;
//       // Optionally, customize the minifier settings
//       // config.optimization.minimizer = [new TerserPlugin({...})];
//     }
//
//     return config;
//   },
    images: {
        unoptimized: true,
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

