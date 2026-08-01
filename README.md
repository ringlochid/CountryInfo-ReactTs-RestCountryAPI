# 🌍 Country Info

A modern, responsive web application for exploring information about countries around the world. Built with React and TypeScript around a bundled country dataset.

![Preview](./preview.jpg)

## ✨ Features

- **Browse All Countries** - View a grid of country cards with flags, population, region, and capital
- **Search** - Search countries by name, capital, or country code (parallel search)
- **Filter by Region** - Filter countries by continent (Africa, Americas, Asia, Europe, Oceania)
- **Detailed View** - Click any country to see full details including:
  - Native name, population, region, sub-region
  - Top level domain, currencies, languages
  - Border countries (clickable links)
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Fluid Typography** - Font sizes scale smoothly with viewport using CSS `clamp()`

## 🚀 Live Demo

**[View Live Site](https://ringlochid.me/RestCountryInfo/)**

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **CSS Variables** | Theming & responsive typography |
| **Bundled country dataset** | Country data without runtime API dependencies |
| **GitHub Actions** | CI/CD deployment |

## 📁 Project Structure

```
src/
├── api/
│   └── restcountries.ts    # API functions & type definitions
├── components/
│   ├── CardContainer.tsx   # Country cards grid
│   ├── CountryProvider.tsx # Country context provider
│   ├── DetailContainer.tsx # Country detail view
│   ├── HeaderContainer.tsx # Header with theme toggle
│   ├── SearchContainer.tsx # Search & filter bar
│   └── ThemeProvider.tsx   # Theme context provider
├── context/
│   ├── countryContext.ts   # Country state context
│   ├── themeContext.ts     # Theme state context
│   ├── useCountry.ts       # Country hook
│   └── useTheme.ts         # Theme hook
├── pages/
│   ├── HomePage.tsx        # Main countries list
│   └── DetailPage.tsx      # Country detail page
├── App.tsx                 # Router configuration
├── App.css                 # Component styles
└── index.css               # Global styles & CSS variables
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ringlochid/RestCountryInfo.git

# Navigate to project directory
cd RestCountryInfo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Country data

The app reads a bundled snapshot of 250 countries. Searches, region filters,
detail pages, and border-country links all run locally, so the public site does
not expose an API key or depend on a deprecated endpoint.

## 🎨 Features Explained

### Local Search
The search feature matches country names, capitals, and country codes directly
against the bundled dataset.

### Responsive Typography
Uses CSS `clamp()` for fluid font scaling:
```css
--font-size-xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
```

### Theme Persistence
The theme preference is stored and toggled via React Context, supporting both light and dark modes.

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from [Frontend Mentor](https://www.frontendmentor.io/)
- Country data snapshot supplied with the project
