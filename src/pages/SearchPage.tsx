import { useEffect, useMemo, useState } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, type Availability, type Category, type Product } from '@/types';
import { categoryIcon } from '@/components/categoryIcons';
import EmptyState from '@/components/EmptyState';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { getAllProducts } from '@/lib/storage';
import { navigate } from '@/lib/router';

type SortMode = 'newest' | 'price-low' | 'price-high';

export default function SearchPage({
  initialQuery,
  initialCategory,
}: {
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts().then((items) => {
      setAll(items);
      setLoading(false);
    });
  }, []);

  const [query, setQuery] = useState(initialQuery || '');
  const [category, setCategory] = useState<Category | 'all'>(
    (initialCategory as Category) || 'all'
  );
  const [availability, setAvailability] = useState<Availability | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sort, setSort] = useState<SortMode>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    let list = [...all];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (availability !== 'all') list = list.filter((p) => p.availability === availability);
    if (maxPrice !== '' && maxPrice > 0) list = list.filter((p) => p.price <= Number(maxPrice));

    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.createdAt - a.createdAt);

    return list;
  }, [all, query, category, availability, maxPrice, sort]);

  const hasFilters = category !== 'all' || availability !== 'all' || maxPrice !== '';

  function clearFilters() {
    setCategory('all');
    setAvailability('all');
    setMaxPrice('');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-ink-900 dark:text-white">
          Search
        </h1>
        <p className="text-ink-500 dark:text-ink-400">Find the stuff you want.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 card p-5">
            <FilterPanel
              category={category}
              setCategory={setCategory}
              availability={availability}
              setAvailability={setAvailability}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              hasFilters={hasFilters}
              clearFilters={clearFilters}
            />
          </div>
        </aside>

        <div className="flex-1">
          {/* Search bar */}
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={(e) => e.preventDefault()}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mx-auto mt-2 flex items-center gap-1 text-xs font-semibold text-ink-400 hover:text-ink-700 dark:text-ink-500 dark:hover:text-ink-200"
            >
              <X className="h-3 w-3" />
              Clear search
            </button>
          )}

          {/* Mobile filter toggle */}
          <div className="mt-3 flex items-center justify-between lg:hidden">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="btn-ghost px-4 py-2 text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasFilters && (
                <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs font-bold text-white">
                  !
                </span>
              )}
            </button>
            <SortSelect sort={sort} setSort={setSort} />
          </div>

          {filtersOpen && (
            <div className="mt-3 animate-fade-in card p-5 lg:hidden">
              <FilterPanel
                category={category}
                setCategory={setCategory}
                availability={availability}
                setAvailability={setAvailability}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                hasFilters={hasFilters}
                clearFilters={clearFilters}
              />
            </div>
          )}

          {/* Results header (desktop sort) */}
          <div className="mt-4 hidden items-center justify-between lg:flex">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {loading
                ? 'Loading...'
                : results.length > 0
                ? `${results.length} item${results.length === 1 ? '' : 's'}`
                : 'No items yet'}
            </p>
            <SortSelect sort={sort} setSort={setSort} />
          </div>

          {/* Results */}
          <div className="mt-4">
            {loading ? (
              <p className="text-center text-ink-500 dark:text-ink-400">Loading items...</p>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No products found yet."
                subtitle={
                  query || hasFilters
                    ? 'Try different keywords or clear your filters.'
                    : 'Be the first to post something!'
                }
                actionLabel="Sell"
                onAction={() => navigate('/sell')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  category,
  setCategory,
  availability,
  setAvailability,
  maxPrice,
  setMaxPrice,
  hasFilters,
  clearFilters,
}: {
  category: Category | 'all';
  setCategory: (c: Category | 'all') => void;
  availability: Availability | 'all';
  setAvailability: (a: Availability | 'all') => void;
  maxPrice: number | '';
  setMaxPrice: (v: number | '') => void;
  hasFilters: boolean;
  clearFilters: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-bold text-ink-900 dark:text-white">
          <Filter className="h-4 w-4" />
          Filters
        </p>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="label">Category</p>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
            All
          </FilterChip>
          {CATEGORIES.map((c) => {
            const Icon = categoryIcon(c.name);
            return (
              <FilterChip
                key={c.name}
                active={category === c.name}
                onClick={() => setCategory(c.name)}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.name}
              </FilterChip>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="label">Availability</p>
        <div className="flex flex-col gap-2">
          {(['all', 'available', 'coming-soon'] as const).map((a) => (
            <label
              key={a}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700 dark:text-ink-300"
            >
              <input
                type="radio"
                name="availability"
                checked={availability === a}
                onChange={() => setAvailability(a)}
                className="h-4 w-4 accent-brand-500"
              />
              <span className="capitalize">
                {a === 'all' ? 'All items' : a === 'available' ? 'Available now' : 'Coming soon'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Max price */}
      <div>
        <p className="label">Max price (AED)</p>
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="No limit"
          className="input py-2.5 text-sm"
        />
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? 'border-brand-400 bg-brand-50 text-brand-700'
          : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300 dark:hover:border-ink-600'
      }`}
    >
      {children}
    </button>
  );
}

function SortSelect({ sort, setSort }: { sort: SortMode; setSort: (s: SortMode) => void }) {
  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as SortMode)}
      className="rounded-2xl border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 outline-none focus:border-brand-400 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
    >
      <option value="newest">Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
  );
}
