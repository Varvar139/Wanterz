import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { CATEGORIES, type Category, type Product } from '@/types';
import { categoryIcon } from '@/components/categoryIcons';
import EmptyState from '@/components/EmptyState';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { getAllProducts } from '@/lib/storage';
import { navigate } from '@/lib/router';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts().then((items) => {
      setProducts(items);
      setLoading(false);
    });
  }, []);

  const justPoppedUp = products.filter((p) => p.availability === 'available');
  const trending = products.filter((p) => p.trending);
  const comingSoon = products.filter((p) => p.availability === 'coming-soon');

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  function pickCategory(cat: Category) {
    navigate(`/search?cat=${encodeURIComponent(cat)}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
          <div className="mx-auto mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
            <Sparkles className="h-4 w-4" />
            A fresh marketplace — be the first to list
          </div>

          <h1 className="animate-fade-up font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink-900 dark:text-white sm:text-7xl">
            NEED IT? NO.
            <br />
            <span className="text-brand-500">WANT IT?</span>{' '}
            <span className="relative inline-block">
              YES.
              <span className="absolute -bottom-1 left-0 h-3 w-full -z-10 rounded-full bg-brand-200/60" />
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl animate-fade-up text-balance text-lg text-ink-500 dark:text-ink-300 [animation-delay:80ms]">
            <span className="font-bold text-ink-800 dark:text-white">WANTERZ</span> is where you
            discover and sell individual products. No mini-shops. Just the
            stuff you want.
          </p>

          {/* Search bar */}
          <div className="mt-8 animate-fade-up [animation-delay:140ms]">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={submitSearch}
            />
          </div>

          <p className="mt-4 animate-fade-in text-xs font-medium text-ink-400 dark:text-ink-500 [animation-delay:200ms]">
            Try a category below, or sell something yourself.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl scroll-mt-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">
              Browse categories
            </h2>
            <p className="text-sm text-ink-500 dark:text-ink-400">Find your kind of want.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {CATEGORIES.map((c, i) => {
            const Icon = categoryIcon(c.name);
            return (
              <button
                key={c.name}
                onClick={() => pickCategory(c.name)}
                style={{ animationDelay: `${i * 40}ms` }}
                className="group flex animate-fade-up flex-col items-center gap-2.5 rounded-3xl border border-ink-100 bg-white p-4 text-center shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card dark:border-ink-800 dark:bg-ink-900 dark:hover:border-brand-500/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-ink-800 dark:text-ink-300">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="text-xs font-bold text-ink-700 dark:text-ink-200">{c.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto mt-14 max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-center text-ink-500 dark:text-ink-400">Loading items...</p>
        ) : (
          <>
            <Section
              icon={<Zap className="h-5 w-5" />}
              title="Just Popped Up"
              subtitle="Fresh listings, hot off the press."
            >
              {justPoppedUp.length > 0 ? (
                <Grid items={justPoppedUp} />
              ) : (
                <EmptyState
                  title="No items here yet."
                  subtitle="Be the first to post something!"
                  actionLabel="Sell"
                  onAction={() => navigate('/sell')}
                />
              )}
            </Section>

            <Section
              icon={<TrendingUp className="h-5 w-5" />}
              title="Trending"
              subtitle="What everyone's wanting right now."
            >
              {trending.length > 0 ? (
                <Grid items={trending} />
              ) : (
                <EmptyState
                  title="No items here yet."
                  subtitle="Be the first to post something!"
                  actionLabel="Sell"
                  onAction={() => navigate('/sell')}
                />
              )}
            </Section>

            <Section
              icon={<Sparkles className="h-5 w-5" />}
              title="Coming Soon"
              subtitle="Items arriving on the horizon."
            >
              {comingSoon.length > 0 ? (
                <Grid items={comingSoon} />
              ) : (
                <EmptyState
                  title="No items here yet."
                  subtitle="Be the first to post something!"
                  actionLabel="Sell"
                  onAction={() => navigate('/sell')}
                />
              )}
            </Section>
          </>
        )}
      </section>

      {/* CTA band */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-4xl bg-ink-900 px-6 py-12 text-center sm:px-12">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Got something worth wanting?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-ink-300">
              List it on WANTERZ in under a minute. No shops, no fees, no fuss.
            </p>
            <button
              onClick={() => navigate('/sell')}
              className="btn-primary mt-6 px-6 py-3 text-base"
            >
              Sell
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          {icon}
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Grid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
