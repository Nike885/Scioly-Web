// supabase/supabaseClient.web.js - Web-compatible version
import { createClient } from '@supabase/supabase-js'

// For web builds, we need to handle environment variables differently
const getEnvVar = (key) => {
  // Try multiple ways to get environment variables
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  // For web builds, environment variables might be injected differently
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key];
  }
  
  // Fallback for development
  if (key === 'EXPO_PUBLIC_SUPABASE_URL') {
    return 'https://your-project.supabase.co'; // Replace with your actual URL
  }
  
  if (key === 'EXPO_PUBLIC_SUPABASE_ANON_KEY') {
    return 'your-anon-key'; // Replace with your actual key
  }
  
  return null;
};

// Get environment variables
const supabaseUrl = getEnvVar('EXPO_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY');

// Debug environment variables
console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Key:', supabaseAnonKey ? `Present (${supabaseAnonKey.substring(0, 20)}...)` : 'Missing');

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseAnonKey ? 'Present' : 'Missing');
  
  // Don't throw error, just log it for web builds
  console.warn('⚠️ Supabase environment variables missing. App may not work properly.');
}

// Create Supabase client with explicit headers
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey || '',
      'Authorization': `Bearer ${supabaseAnonKey || ''}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public'
  }
});

// Test connection immediately
console.log('🧪 Testing Supabase connection...');
if (supabaseUrl && supabaseAnonKey) {
  supabase
    .from('students')
    .select('count')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Supabase connection test failed:', error);
      } else {
        console.log('✅ Supabase connection test successful');
      }
    })
    .catch(err => {
      console.error('❌ Supabase connection exception:', err);
    });
} else {
  console.warn('⚠️ Skipping Supabase connection test - no credentials');
} 