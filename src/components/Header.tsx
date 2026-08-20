import { useEffect, useState } from 'react';
import { LogIn, LogOut, Menu, Package, Search, Tag, User, X, Zap } from 'lucide-react';
import { CATEGORIES, type Category } from '@/types';
import { navigate, useRoute, type Route } from '@/lib/router';
import { useAuth } from '@/lib/auth';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Categories', path: '/#categories' },
  { label: 'Sell', path: '/sell' },
  { label: 'Search', path: '/search' },
  { label: 'About', path: '/about' },
];

function isActive(route: Route, path: string) {
  if (path === '/') return route.name === 'home';
  if (path === '/sell') return route.name === 'sell';
  if (path === '/search') return route.name === 'search';
  if (path === '/about') return route.name === 'about';
  if (path === '/my-listings') return route.name === 'my-listings';
  if (path === '/#categories') return route.name === 'home';
  return false;
}

export default function Header() {
  const route = useRoute();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
  }, [route]);

  function handleNav(path: string) {
    if (path === '/#categories') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      navigate(path);
    }
  }

  function pickCategory(cat: Category) {
    navigate(`/search?cat=${encodeURIComponent(cat)}`);
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-ink-900/85 backdrop-blur-xl border-b border-ink-100 dark:border-ink-800 shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2.5 shrink-0"
            aria-label="WANTERZ home"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft transition-transform group-hover:scale-105 group-active:scale-95">
              <Zap className="h-5 w-5 fill-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight text-ink-900 dark:text-white">
              WANTER<span className="text-brand-500">Z</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className={`relative rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive(route, item.path)
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100 dark:text-ink-300 dark:hover:text-white dark:hover:bg-ink-800'
                }`}
              >
                {item.label}
                {item.label === 'Categories' && (
                  <span className="ml-1 text-ink-400">▾</span>
                )}
              </button>
            ))}
            {user && (
              <button
                onClick={() => handleNav('/my-listings')}
                className={`relative rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive(route, '/my-listings')
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100 dark:text-ink-300 dark:hover:text-white dark:hover:bg-ink-800'
                }`}
              >
                My Listings
              </button>
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate('/search')}
              className="btn-ghost px-3.5 py-2 text-sm"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            <button
              onClick={() => navigate('/sell')}
              className="btn-primary px-4 py-2 text-sm"
            >
              <Tag className="h-4 w-4" />
              <span>Sell</span>
            </button>
            {user ? (
              <button
                onClick={signOut}
                className="user-profile"
                title="Sign out"
                aria-label="Sign out"
              >
                <span className="user-profile-inner">
                  <User className="h-5 w-5" />
                  <span className="max-w-[60px] truncate">{user.email}</span>
                  <LogOut className="h-4 w-4 opacity-60" />
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="user-profile"
                title="Sign in"
                aria-label="Sign in"
              >
                <span className="user-profile-inner">
                  <LogIn className="h-5 w-5" />
                  Sign in
                </span>
              </button>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="btn-ghost px-3 py-2"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Categories dropdown (desktop) */}
      {route.name === 'home' && (
        <div
          className={`absolute left-1/2 top-full hidden -translate-x-1/2 pt-2 md:block ${
            catOpen ? '' : 'pointer-events-none'
          }`}
          onMouseEnter={() => setCatOpen(true)}
          onMouseLeave={() => setCatOpen(false)}
        >
          {catOpen && (
            <div className="card animate-scale-in grid w-[520px] grid-cols-3 gap-1 p-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => pickCategory(c.name)}
                  className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700 dark:text-ink-200 dark:hover:bg-ink-800 dark:hover:text-brand-400"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="mx-4 mb-3 animate-fade-up rounded-3xl border border-ink-100 bg-white p-4 shadow-card dark:border-ink-800 dark:bg-ink-900">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.path)}
                  className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
                    isActive(route, item.path)
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
                      : 'text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {user && (
                <button
                  onClick={() => handleNav('/my-listings')}
                  className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
                    isActive(route, '/my-listings')
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
                      : 'text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800'
                  }`}
                >
                  <Package className="mr-1.5 inline h-4 w-4" />
                  My Listings
                </button>
              )}
            </nav>
            <div className="mt-3 border-t border-ink-100 pt-3 dark:border-ink-800">
              <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-ink-400">
                Categories
              </p>
              <div className="grid grid-cols-3 gap-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => pickCategory(c.name)}
                    className="rounded-xl px-2 py-2 text-xs font-medium text-ink-600 hover:bg-brand-50 hover:text-brand-700 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-brand-400"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => navigate('/sell')}
                className="btn-primary w-full py-2.5 text-sm"
              >
                <Tag className="h-4 w-4" />
                Sell
              </button>
              {user ? (
                <button
                  onClick={signOut}
                  className="btn-ghost w-full py-2.5 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out ({user.email})
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="btn-ghost w-full py-2.5 text-sm"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
