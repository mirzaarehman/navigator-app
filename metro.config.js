const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = {
  resolver: {
    unstable_enablePackageExports: true,
    extraNodeModules: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      util: require.resolve('util/'),
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
    },
  },
  transformer: {
    unstable_allowRequireContext: true,
  },
};

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(__dirname), config)
);
