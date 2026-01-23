import './App.css'
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { CountryProvider } from './components/CountryProvider';
import { HeaderContainer } from './components/HeaderContainer';
import { ThemeProvider } from './components/ThemeProvider';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/country/:id",
    element: <DetailPage />,
  },
]);

function App() {
  return (
    <ThemeProvider>
      <CountryProvider>
        <HeaderContainer />
        <RouterProvider router={router} />
      </CountryProvider>
    </ThemeProvider>
  )
}

export default App
