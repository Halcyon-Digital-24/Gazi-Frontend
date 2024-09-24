const config = {
    siteUrl: 'https://gcart.com.bd/',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', disallow: '/private/' },
        { userAgent: '*', allow: '/' },
      ],
    },
  };
  
  module.exports = config;