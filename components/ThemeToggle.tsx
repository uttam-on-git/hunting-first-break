import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.dataset.theme = 'dark';
      setTheme('dark');
      return;
    }
    document.documentElement.dataset.theme = 'light';
    setTheme('light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className="theme-toggle-button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      <span className="sr-only">Toggle theme</span>
      <Sun className="theme-icon theme-icon-sun" aria-hidden="true" />
      <Moon className="theme-icon theme-icon-moon" aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
