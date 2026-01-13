import { createContext, useContext, useState, useEffect } from 'react'
import './App.css'

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const themeContext = createContext<ThemeContextType | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <themeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </themeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(themeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context;
}


function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <>
      <label htmlFor="theme-switcher">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.8426 11.052C7.73486 11.052 5.21543 8.74226 5.21543 5.89457C5.21543 4.82024 5.57343 3.82526 6.18514 3C3.75229 3.75612 2 5.86498 2 8.35045C2 11.4708 4.75943 14 8.16286 14C10.8743 14 13.1757 12.3945 14 10.1636C13.1 10.7238 12.0129 11.052 10.8426 11.052Z" fill="currentColor"/>
        </svg>
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </label>
      <input 
        type="checkbox" 
        id="theme-switcher" 
        checked={isDark}
        onChange={toggleTheme}
      />
    </>
  )
}

function HeaderContainer() {
  return (
    <header className='header-container'>
      <div className='header'>
        <h1>Where in the world?</h1>
        <div className='header-theme-container'>
        <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}


function App() {
  return (
    <ThemeProvider>
      <HeaderContainer />
    </ThemeProvider>
  )
}

export default App
