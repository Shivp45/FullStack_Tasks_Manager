import React, { useEffect, useState } from 'react';
import { getInitialTheme, applyTheme } from '../theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 border rounded flex items-center space-x-2"
      aria-label="Toggle dark mode"
    >
      <span>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
    </button>
  );
}
