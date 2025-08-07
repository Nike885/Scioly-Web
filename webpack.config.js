const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Handle problematic modules for web
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "path": false,
    "crypto": false,
  };

  // Add platform-specific file resolution
  config.resolve.alias = {
    ...config.resolve.alias,
    './OfflineService': './OfflineService.web.js',
    './supabase/supabaseClient': './supabase/supabaseClient.web.js',
  };

  // Exclude problematic modules from web build
  config.externals = {
    ...config.externals,
    'expo-sqlite': 'expo-sqlite',
  };

  return config;
}; 