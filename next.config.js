/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      undici: false, // prevent Firebase from trying to load the Node version
    };

    return config;
  },
};

module.exports = nextConfig;
