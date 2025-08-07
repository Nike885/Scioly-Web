// Comprehensive theme system with dark mode support
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Light theme colors
export const lightColors = {
  primary: '#6EC6FF', // Light blue
  secondary: '#FFD54F', // Vibrant yellow
  accent: '#FF8A65', // Vibrant coral
  background: '#F8FAFF', // Very light background
  card: '#FFFFFF',
  cardShadow: 'rgba(110, 198, 255, 0.15)',
  text: '#2D3A4A',
  textSecondary: '#6D7A8A',
  success: '#81C784',
  warning: '#FFD54F',
  error: '#E57373',
  info: '#4FC3F7',
  gradientStart: '#F8FAFF',
  gradientEnd: '#E3F2FD',
  border: '#E0E0E0',
  inputBackground: '#F5F5F5',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E0E0E0',
  statusBar: 'light-content',
  statusBarBackground: '#6EC6FF',
};

// Dark theme colors - Updated to match mobile app
export const darkColors = {
  primary: '#6EC6FF', // Light blue - matches mobile app
  secondary: '#FFB74D', // Orange/yellow - matches mobile app
  accent: '#FF7043', // Darker coral
  background: '#121212', // Dark background - matches mobile app
  card: '#1E1E1E', // Dark card - matches mobile app
  cardShadow: 'rgba(79, 195, 247, 0.2)',
  text: '#FFFFFF', // White text - matches mobile app
  textSecondary: '#B0B0B0', // Light gray - matches mobile app
  success: '#66BB6A',
  warning: '#FFB74D',
  error: '#EF5350',
  info: '#42A5F5',
  gradientStart: '#121212',
  gradientEnd: '#1A1A1A',
  border: '#333333', // Dark border - matches mobile app
  inputBackground: '#2A2A2A',
  tabBar: '#1E1E1E',
  tabBarBorder: '#333333',
  statusBar: 'light-content',
  statusBarBackground: '#121212',
};

// Theme context and management
export class ThemeManager {
  static async getTheme(userId = null) {
    try {
      const key = userId ? `theme_${userId}` : 'theme';
      const theme = await AsyncStorage.getItem(key);
      return theme || 'dark'; // Default to dark mode
    } catch (error) {
      console.log('Error getting theme:', error);
      return 'dark'; // Default to dark mode
    }
  }

  static async setTheme(theme, userId = null) {
    try {
      const key = userId ? `theme_${userId}` : 'theme';
      await AsyncStorage.setItem(key, theme);
    } catch (error) {
      console.log('Error setting theme:', error);
    }
  }

  static getColors(theme = 'dark') { // Default to dark
    return theme === 'dark' ? darkColors : lightColors;
  }
}

// Default export for backward compatibility
export const colors = darkColors; // Default to dark colors

export const font = {
  family: 'System',
  size: {
    header: 28,
    title: 20,
    body: 16,
    small: 13,
  },
  weight: {
    regular: '400',
    bold: '700',
    semibold: '600',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Animation configurations
export const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Shadow configurations
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
}; 