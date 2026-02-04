const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add .sqlite to asset extensions so Metro bundles it
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.concat(['sqlite']);

module.exports = defaultConfig;
