import { createContext } from 'react';

export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

export const themeContext = createContext<ThemeContextType | null>(null);
