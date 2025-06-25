const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Fix for GitHub Pages static asset path
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith("/_expo/")) {
        req.url = `/TeluguWordle${req.url}`;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
