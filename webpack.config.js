const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Provide polyfills for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser"),
    "crypto": false,
    "fs": false,
    "path": false,
    "stream": false,
    "util": false,
    "assert": false,
    "os": false,
    "url": false,
    "querystring": false,
    "http": false,
    "https": false,
    "zlib": false,
    "tty": false,
    "net": false,
    "child_process": false,
  };

  // Provide global variables
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  // Define global variables
  config.plugins.push(
    new webpack.DefinePlugin({
      'global': 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    })
  );

  // Add node polyfills
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /node:buffer/,
      require.resolve('buffer')
    )
  );

  // Fix React Navigation web compatibility
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  // Handle node_modules that need JSX and CommonJS transformation
  config.module.rules.push({
    test: /node_modules\/(react-native-animatable|react-native-vector-icons|expo)\/.*\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react'
        ],
        plugins: [
          ['@babel/plugin-transform-modules-commonjs', { loose: true }]
        ]
      }
    }
  });

  // Add CommonJS polyfill for exports and require
  config.plugins.push(
    new webpack.DefinePlugin({
      'typeof exports': '"object"',
      'typeof module': '"object"',
      'typeof require': '"function"',
    })
  );

  // Add a plugin to handle CommonJS modules globally
  config.plugins.push(
    new webpack.BannerPlugin({
      banner: `
        if (typeof exports === 'undefined') {
          var exports = {};
        }
        if (typeof module === 'undefined') {
          var module = { exports: exports };
        }
        if (typeof require === 'undefined') {
          var require = function() { return {}; };
        }
      `,
      raw: true,
      entryOnly: false
    })
  );

  return config;
};