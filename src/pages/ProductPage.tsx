import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Download,
  MapPin,
  MessageCircle,
  QrCode,
  Share2,
  Tag,
} from 'lucide-react';
import QRCode from 'qrcode';
import { getProduct } from '@/lib/storage';
import { navigate } from '@/lib/router';
import EmptyState from '@/components/EmptyState';
import type { Product } from '@/types';

function formatAED(price: number) {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductPage({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    getProduct(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!product?.paymentLink) return;
    QRCode.toDataURL(product.paymentLink, {
      width: 240,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [product?.paymentLink]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-ink-500 dark:text-ink-400">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <EmptyState
          title="Item not found"
          subtitle="This item may have been removed, or the link is off. No listings exist yet until someone posts one."
          actionLabel="Back to home"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const comingSoon = product.availability === 'coming-soon';

  function downloadQr() {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'wanterz-payment-qr.png';
    link.click();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-4xl border border-ink-100 bg-ink-100 dark:border-ink-800 dark:bg-ink-800">
            {product.photos[activePhoto] ? (
              <img
                src={product.photos[activePhoto]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-300 dark:text-ink-600">
                <Tag className="h-16 w-16" />
              </div>
            )}
            {comingSoon && (
              <span className="absolute left-4 top-4 rounded-full bg-ink-900/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                Coming Soon
              </span>
            )}
          </div>

          {product.photos.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {product.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors ${
                    activePhoto === i ? 'border-brand-400' : 'border-ink-100 dark:border-ink-700'
                  }`}
                >
                  <img src={photo} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
              {product.category}
            </span>
            {comingSoon ? (
              <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-bold text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                Coming Soon
              </span>
            ) : (
              <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-bold text-success-600 dark:bg-success-500/15 dark:text-success-400">
                Available
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink-900 dark:text-white">
            {product.name}
          </h1>

          <p className="mt-2 font-display text-4xl font-extrabold text-brand-600">
            {formatAED(product.price)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-600 dark:text-ink-300">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-ink-400 dark:text-ink-500" />
              {product.location || 'Location not set'}
            </span>
            {comingSoon && product.expectedDate && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-ink-400 dark:text-ink-500" />
                Expected {new Date(product.expectedDate).toLocaleDateString('en-AE', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-ink-100 pt-6 dark:border-ink-800">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400 dark:text-ink-500">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-700 dark:text-ink-200">
              {product.description}
            </p>
          </div>

          {/* QR Code section */}
          {product.paymentLink && qrDataUrl && (
            <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-6 text-center dark:border-ink-800 dark:bg-ink-900">
              <div className="mb-3 flex items-center justify-center gap-2">
                <QrCode className="h-5 w-5 text-brand-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-ink-900 dark:text-white">
                  Scan to Pay
                </h2>
              </div>
              <p className="mb-4 text-xs text-ink-500 dark:text-ink-400">
                Scan this QR code with your phone's camera to pay for this item.
              </p>
              <div className="mx-auto inline-block rounded-2xl border border-ink-100 bg-white p-3 dark:border-ink-700">
                <img src={qrDataUrl} alt="Payment QR code" className="h-48 w-48" />
              </div>
              <button
                onClick={downloadQr}
                className="btn-ghost mt-4 px-4 py-2 text-sm"
              >
                <Download className="h-4 w-4" />
                Download QR
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto pt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary flex-1 py-3 text-base" disabled={comingSoon}>
                <MessageCircle className="h-5 w-5" />
                {comingSoon ? 'Notify me (soon)' : 'Contact seller'}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.name, text: product.description });
                  }
                }}
                className="btn-ghost px-5 py-3 text-sm"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-ink-400 dark:text-ink-500">
              Prototype only — no real messages or payments are processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
