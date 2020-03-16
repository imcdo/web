// sw-config.js
module.exports = {
    runtimeCaching: [
      {
        urlPattern: '/api/**',
        handler: 'networkOnly',
      },
      {
        urlPattern: '/api-1.1/**',
        handler: 'networkOnly'
      }
    ],
  };