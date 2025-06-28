const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('bin');

config.server = {
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith('/_expo/')) {
        req.url = `/TeluguWordle${req.url}`;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
