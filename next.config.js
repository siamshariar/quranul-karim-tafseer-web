const slug = "1-al-fatihah";

module.exports = {
  // Optimize for Vercel deployment
  experimental: {
    // Reduce bundle size
    optimizeCss: true,
  },

  // Increase build timeout for API calls
  staticPageGenerationTimeout: 1000, // 1000 seconds = ~16 minutes

  async redirects() {
    return [
      {
        source: "/chapters",
        destination: `/chapters/${slug}`,
        permanent: true,
      },
    ];
  },
};
