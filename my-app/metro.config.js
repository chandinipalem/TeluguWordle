const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.server = config.server || {};
config.server.publicPath = "/TeluguWordle/_expo/";

module.exports = config;
