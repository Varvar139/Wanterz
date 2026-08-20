import { Calendar, MapPin, Tag } from 'lucide-react';
import type { Product } from '@/types';
import { navigate } from '@/lib/router';

function formatAED(price: number) {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(price);
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ProductCard({ product }: { product: Product }) {
  const photo = product.photos[0];
  const comingSoon = product.availability === 'coming-soon';

  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="group flex flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card dark:border-ink-800 dark:bg-ink-900"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-100 dark:bg-ink-800">
        {photo ? (
          <img
            src={photo}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-100 to-ink-200 text-ink-300 dark:from-ink-800 dark:to-ink-700 dark:text-ink-600">
            <Tag className="h-10 w-10" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-ink-700 backdrop-blur dark:bg-ink-950/80 dark:text-ink-100">
            {product.category}
          </span>
          {comingSoon && (
            <span className="rounded-full bg-ink-900/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
              Coming Soon
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-display font-bold text-ink-900 dark:text-white">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-500 dark:text-ink-400">
          {product.description}
        </p>
        <div className="mt-auto pt-3">
          <p className="font-display text-lg font-extrabold text-brand-600">
            {formatAED(product.price)}
          </p>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-ink-400 dark:text-ink-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {product.location || '—'}
            </span>
            {comingSoon && product.expectedDate ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(product.expectedDate).toLocaleDateString('en-AE', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            ) : (
              <span>{timeAgo(product.createdAt)}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
