import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import SellPage from '@/pages/SellPage';
import SearchPage from '@/pages/SearchPage';
import ProductPage from '@/pages/ProductPage';
import AboutPage from '@/pages/AboutPage';
import LoginPage from '@/pages/LoginPage';
import MyListingsPage from '@/pages/MyListingsPage';
import { useRoute } from '@/lib/router';
import { useTheme } from '@/lib/useTheme';

function App() {
  const route = useRoute();
  const [theme, toggleTheme] = useTheme();

  let page: React.ReactNode;
  switch (route.name) {
    case 'home':
      page = <HomePage />;
      break;
    case 'sell':
      page = <SellPage />;
      break;
    case 'search':
      page = (
        <SearchPage initialQuery={route.query} initialCategory={route.category} />
      );
      break;
    case 'product':
      page = <ProductPage id={route.id} />;
      break;
    case 'about':
      page = <AboutPage />;
      break;
    case 'login':
      page = <LoginPage />;
      break;
    case 'my-listings':
      page = <MyListingsPage />;
      break;
    default:
      page = <HomePage />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink-50 dark:bg-ink-950 transition-colors duration-300">
      <Header />
      <main className="flex-1">{page}</main>
      <Footer theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
