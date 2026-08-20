import { Zap } from 'lucide-react';
import { CATEGORIES, type Category } from '@/types';
import { navigate } from '@/lib/router';
import ThemeToggle from '@/components/ThemeToggle';

interface FooterProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Footer({ theme, onToggleTheme }: FooterProps) {
  const year = new Date().getFullYear();

  function go(path: string) {
    navigate(path);
  }

  function pickCategory(cat: Category) {
    navigate(`/search?cat=${encodeURIComponent(cat)}`);
  }

  return (
    <footer className="mt-20 border-t border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-500 text-white">
                <Zap className="h-5 w-5 fill-white" strokeWidth={2.5} />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight text-ink-900 dark:text-white">
                WANTER<span className="text-brand-500">Z</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500 dark:text-ink-400">
              Need it? No. Want it? YES. WANTERZ. A marketplace to discover and
              sell individual products — no mini-shops, just the stuff you want.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-ink-900 dark:text-white">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-500 dark:text-ink-400">
              <li>
                <button onClick={() => go('/')} className="hover:text-brand-600">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => go('/search')} className="hover:text-brand-600">
                  Search
                </button>
              </li>
              <li>
                <button onClick={() => go('/sell')} className="hover:text-brand-600">
                  Sell
                </button>
              </li>
              <li>
                <button onClick={() => go('/about')} className="hover:text-brand-600">
                  About
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-ink-900 dark:text-white">Categories</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-ink-500 dark:text-ink-400">
              {CATEGORIES.map((c) => (
                <li key={c.name}>
                  <button onClick={() => pickCategory(c.name)} className="hover:text-brand-600">
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-6 text-xs text-ink-400 dark:border-ink-800 dark:text-ink-500 sm:flex-row">
          <p>© {year} WANTERZ. This is a prototype — no real transactions.</p>
          <div className="flex items-center gap-4">
            <span className="font-medium hidden sm:inline">Need it? No. Want it? YES. WANTERZ.</span>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </div>
    </footer>
  );
}
