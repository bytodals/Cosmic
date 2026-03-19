const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {

  isCSSEnabled: true, // om du använder CSS → Tailwind/NativeWind
});

module.exports = withNativeWind(config, {
  // must match the actual globals file name used in the repo
  input: './globals.css',
});