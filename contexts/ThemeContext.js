import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeManager, lightColors, darkColors } from '../utils/theme';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [colors, setColors] = useState(lightColors);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadTheme();
  }, [user]);

  const loadTheme = async () => {
    try {
      const userId = user?.id || user?.email || user?.sNumber;
      const savedTheme = await ThemeManager.getTheme(userId);
      setTheme(savedTheme);
      setColors(ThemeManager.getColors(savedTheme));
    } catch (error) {
      console.log('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const userId = user?.id || user?.email || user?.sNumber;
    await ThemeManager.setTheme(newTheme, userId);
    setTheme(newTheme);
    setColors(ThemeManager.getColors(newTheme));
  };

  const setThemeMode = async (newTheme) => {
    const userId = user?.id || user?.email || user?.sNumber;
    await ThemeManager.setTheme(newTheme, userId);
    setTheme(newTheme);
    setColors(ThemeManager.getColors(newTheme));
  };

  if (loading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        toggleTheme,
        setThemeMode,
        isDark: theme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 