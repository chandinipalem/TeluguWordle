const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// ⚠️ Key fix: force correct base path for GitHub Pages
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Redirect GitHub Pages requests to correct base path
      if (req.url.startsWith('/TeluguWordle')) {
        req.url = req.url.replace('/TeluguWordle', '');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
