import './App.css'
import { HomePage } from './pages/HomePage';
import { CountryProvider } from './components/CountryProvider';
import { HeaderContainer } from './components/HeaderContainer';
import { ThemeProvider } from './components/ThemeProvider';


function App() {
  return (
    <ThemeProvider>
      <CountryProvider>
        <HeaderContainer />
        <HomePage />
      </CountryProvider>
    </ThemeProvider>
  )
}

export default App
