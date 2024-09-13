/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  reactStrictMode: false,
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 30000,
        maxSize: 250000,
        maxInitialRequests: 10,
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
