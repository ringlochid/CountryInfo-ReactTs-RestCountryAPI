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

function ThemeSwitcherIcon() {
  const {theme} = useTheme();
  
  if (theme === 'light') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.8426 11.052C7.73486 11.052 5.21543 8.74226 5.21543 5.89457C5.21543 4.82024 5.57343 3.82526 6.18514 3C3.75229 3.75612 2 5.86498 2 8.35045C2 11.4708 4.75943 14 8.16286 14C10.8743 14 13.1757 12.3945 14 10.1636C13.1 10.7238 12.0129 11.052 10.8426 11.052Z" fill="currentColor"/>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M10.5904 0.0362357C10.7368 0.0977502 10.8423 0.229567 10.8716 0.384818L11.4545 3.54549L14.6152 4.12549C14.7704 4.15478 14.9022 4.26023 14.9638 4.4067C15.0253 4.55316 15.0077 4.72013 14.9169 4.85195L13.092 7.5L14.9169 10.1451C15.0077 10.2769 15.0253 10.4439 14.9638 10.5904C14.9022 10.7368 14.7704 10.8423 14.6152 10.8716L11.4545 11.4545L10.8716 14.6152C10.8423 14.7704 10.7368 14.9022 10.5904 14.9638C10.4439 15.0253 10.2769 15.0077 10.1451 14.9169L7.5 13.092L4.85487 14.9169C4.72306 15.0077 4.55609 15.0253 4.40963 14.9638C4.26316 14.9022 4.15771 14.7704 4.12842 14.6152L3.54549 11.4545L0.384818 10.8716C0.229567 10.8423 0.0977502 10.7368 0.0362357 10.5904C-0.0252788 10.4439 -0.00770325 10.2769 0.0831039 10.1451L1.90804 7.5L0.0831039 4.85487C-0.00770325 4.72306 -0.0252788 4.55609 0.0362357 4.40963C0.0977502 4.26316 0.229567 4.15771 0.384818 4.12842L3.54549 3.54549L4.12842 0.384818C4.15771 0.229567 4.26316 0.0977502 4.40963 0.0362357C4.55609 -0.0252788 4.72306 -0.00770325 4.85487 0.0831039L7.5 1.90804L10.1451 0.0831039C10.2769 -0.00770325 10.4439 -0.0252788 10.5904 0.0362357ZM4.68791 7.5C4.68791 6.75419 4.98418 6.03892 5.51155 5.51155C6.03892 4.98418 6.75419 4.68791 7.5 4.68791C8.24581 4.68791 8.96108 4.98418 9.48845 5.51155C10.0158 6.03892 10.3121 6.75419 10.3121 7.5C10.3121 8.24581 10.0158 8.96108 9.48845 9.48845C8.96108 10.0158 8.24581 10.3121 7.5 10.3121C6.75419 10.3121 6.03892 10.0158 5.51155 9.48845C4.98418 8.96108 4.68791 8.24581 4.68791 7.5ZM11.2495 7.5C11.2495 6.50558 10.8544 5.55189 10.1513 4.84873C9.44811 4.14557 8.49442 3.75054 7.5 3.75054C6.50558 3.75054 5.55189 4.14557 4.84873 4.84873C4.14557 5.55189 3.75054 6.50558 3.75054 7.5C3.75054 8.49442 4.14557 9.44811 4.84873 10.1513C5.55189 10.8544 6.50558 11.2495 7.5 11.2495C8.49442 11.2495 9.44811 10.8544 10.1513 10.1513C10.8544 9.44811 11.2495 8.49442 11.2495 7.5Z" fill="white"/>
    </svg>
  )
}


function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <>
      <label htmlFor="theme-switcher">
        <ThemeSwitcherIcon />
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
