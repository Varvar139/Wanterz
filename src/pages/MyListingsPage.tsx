import { useEffect, useState } from 'react';
import { LogIn, Package, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getMyProducts, deleteProduct } from '@/lib/storage';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { navigate } from '@/lib/router';

export default function MyListingsPage() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoadingProducts(true);
    getMyProducts(user.id).then((items) => {
      setProducts(items);
      setLoadingProducts(false);
    });
  }, [user]);

  async function handleDelete(id: string) {
    const ok = await deleteProduct(id);
    if (ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-ink-500 dark:text-ink-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <EmptyState
          icon={LogIn}
          title="Sign in to see your listings"
          subtitle="You need an account to view and manage the items you're selling."
          actionLabel="Sign in"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900 dark:text-white">
            My Listings
          </h1>
          <p className="text-ink-500 dark:text-ink-400">
            Everything you're selling on WANTERZ.
          </p>
        </div>
        <button
          onClick={() => navigate('/sell')}
          className="btn-primary px-4 py-2.5 text-sm"
        >
          <Package className="h-4 w-4" />
          Sell new item
        </button>
      </div>

      {loadingProducts ? (
        <p className="text-ink-500 dark:text-ink-400">Loading your items...</p>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No listings yet"
          subtitle="Post your first item and it'll show up here."
          actionLabel="Sell"
          onAction={() => navigate('/sell')}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <div key={p.id} className="relative group">
              <ProductCard product={p} />
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-error-500 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                aria-label="Delete listing"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
