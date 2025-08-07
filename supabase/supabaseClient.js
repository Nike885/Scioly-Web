// supabase/supabaseClient.js - Web-compatible version
import { createClient } from '@supabase/supabase-js'

// Get environment variables with proper web compatibility
const getEnvVar = (key) => {
  // For web builds, check window.__ENV__ first
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key];
  }
  
  // For Node.js builds, check process.env
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  return null;
};

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
  
  // For web builds, don't throw error, just warn
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Supabase environment variables missing. App may not work properly.');
  } else {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
  }
}

// Create Supabase client with explicit headers
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public'
  }
});

// Test connection immediately (only if we have real credentials)
console.log('🧪 Testing Supabase connection...');
if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
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
  console.warn('⚠️ Skipping Supabase connection test - using placeholder credentials');
}