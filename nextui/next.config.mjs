/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  reactStrictMode: false,
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000,
        maxInitialRequests: 25,
      };
    }
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: 'nextjs-node-loader',
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
