import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState('none');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedBackground = localStorage.getItem('backgroundTheme');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    if (savedBackground) {
      setBackgroundTheme(savedBackground);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const changeBackgroundTheme = (theme) => {
    setBackgroundTheme(theme);
    localStorage.setItem('backgroundTheme', theme);
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      backgroundTheme, 
      changeBackgroundTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};