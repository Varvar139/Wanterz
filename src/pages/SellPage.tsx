import { useRef, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  ImagePlus,
  Link2,
  LogIn,
  MapPin,
  Tag,
  Upload,
  X,
} from 'lucide-react';
import { CATEGORIES, type Availability, type Category } from '@/types';
import { categoryIcon } from '@/components/categoryIcons';
import { addProduct } from '@/lib/storage';
import { navigate } from '@/lib/router';
import { useAuth } from '@/lib/auth';

interface FormState {
  name: string;
  description: string;
  price: string;
  category: Category;
  photos: string[];
  location: string;
  availability: Availability;
  expectedDate: string;
  paymentLink: string;
}

const INITIAL: FormState = {
  name: '',
  description: '',
  price: '',
  category: 'Tech',
  photos: [],
  location: '',
  availability: 'available',
  expectedDate: '',
  paymentLink: '',
};

export default function SellPage() {
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        setForm((f) => ({ ...f, photos: [...f.photos, reader.result as string].slice(0, 6) }));
      };
      reader.readAsDataURL(file);
    });
  }

  function removePhoto(idx: number) {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Give your item a name.';
    if (!form.description.trim()) e.description = 'Describe what you are selling.';
    if (!form.price || Number(form.price) <= 0) e.price = 'Enter a price in AED.';
    if (!form.location.trim()) e.location = 'Where is it?';
    if (form.availability === 'coming-soon' && !form.expectedDate)
      e.expectedDate = 'Pick an expected date.';
    if (form.photos.length === 0) e.photos = 'Add at least one photo.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const product = await addProduct({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Math.round(Number(form.price)),
      category: form.category,
      photos: form.photos,
      location: form.location.trim(),
      availability: form.availability,
      expectedDate: form.availability === 'coming-soon' ? form.expectedDate : undefined,
      paymentLink: form.paymentLink.trim() || undefined,
      trending: false,
    });
    setSaving(false);
    if (product) {
      setSubmitted(product.id);
    } else {
      setErrors({ form: 'Could not save your listing. Make sure you are signed in.' });
    }
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-ink-500 dark:text-ink-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <div className="card p-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft">
            <LogIn className="h-6 w-6" />
          </span>
          <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">
            Sign in to sell
          </h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            You need an account to list items on WANTERZ.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary mt-6 px-5 py-2.5 text-sm"
          >
            <LogIn className="h-4 w-4" />
            Sign in or sign up
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <div className="relative mb-6">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success-400" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-success-500 text-white">
            <Check className="h-10 w-10" strokeWidth={3} />
          </div>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-ink-900 dark:text-white">
          Your item is live!
        </h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          "{form.name}" is now on WANTERZ. Go check it out or list another.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate(`/product/${submitted}`)}
            className="btn-primary px-5 py-2.5 text-sm"
          >
            View my item
          </button>
          <button
            onClick={() => {
              setForm(INITIAL);
              setSubmitted(null);
            }}
            className="btn-ghost px-5 py-2.5 text-sm"
          >
            List another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-ink-900 dark:text-white">
          Sell
        </h1>
        <p className="mt-1 text-ink-500 dark:text-ink-400">
          List something worth wanting. It takes less than a minute.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photos */}
        <div>
          <label className="label">Product photos</label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
              dragging
                ? 'border-brand-400 bg-brand-50'
                : 'border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50/40 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10'
            }`}
          >
            <ImagePlus className="h-8 w-8 text-brand-500" />
            <p className="mt-2 text-sm font-semibold text-ink-700 dark:text-ink-200">
              Tap to upload or drag photos here
            </p>
            <p className="text-xs text-ink-400 dark:text-ink-500">Up to 6 photos · PNG or JPG</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {form.photos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {form.photos.map((photo, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl border border-ink-200 dark:border-ink-700">
                  <img src={photo} alt={`preview ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(i);
                    }}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.photos && <p className="mt-1.5 text-sm text-error-500">{errors.photos}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="label">Product name</label>
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Retro sneakers, gaming console, vintage watch…"
            className="input"
          />
          {errors.name && <p className="mt-1.5 text-sm text-error-500">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What is it? What condition? Why is it worth wanting?"
            rows={4}
            className="input resize-none"
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-error-500">{errors.description}</p>
          )}
        </div>

        {/* Price + Location */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Price (AED)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                placeholder="0"
                className="input pl-12"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-400">
                AED
              </span>
            </div>
            {errors.price && <p className="mt-1.5 text-sm text-error-500">{errors.price}</p>}
          </div>
          <div>
            <label className="label">Location</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Dubai, Abu Dhabi…"
                className="input pl-11"
              />
            </div>
            {errors.location && <p className="mt-1.5 text-sm text-error-500">{errors.location}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="label">Category</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {CATEGORIES.map((c) => {
              const Icon = categoryIcon(c.name);
              const active = form.category === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => update('category', c.name)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-semibold transition-all ${
                    active
                      ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-glow'
                      : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300 dark:hover:border-ink-600'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="label">Availability</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update('availability', 'available')}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                form.availability === 'available'
                  ? 'border-brand-400 bg-brand-50 shadow-glow'
                  : 'border-ink-200 bg-white hover:border-ink-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-ink-600'
              }`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${form.availability === 'available' ? 'bg-success-500 text-white' : 'bg-ink-100 text-ink-500'}`}>
                <Tag className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-ink-900 dark:text-white">Available now</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">Ready to sell today</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => update('availability', 'coming-soon')}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                form.availability === 'coming-soon'
                  ? 'border-brand-400 bg-brand-50 shadow-glow'
                  : 'border-ink-200 bg-white hover:border-ink-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-ink-600'
              }`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${form.availability === 'coming-soon' ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-500'}`}>
                <Calendar className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-ink-900 dark:text-white">Coming soon</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">List it ahead of time</p>
              </div>
            </button>
          </div>
        </div>

        {/* Expected date */}
        {form.availability === 'coming-soon' && (
          <div className="animate-fade-in">
            <label className="label">Expected availability date</label>
            <input
              type="date"
              value={form.expectedDate}
              onChange={(e) => update('expectedDate', e.target.value)}
              className="input"
            />
            {errors.expectedDate && (
              <p className="mt-1.5 text-sm text-error-500">{errors.expectedDate}</p>
            )}
          </div>
        )}

        {/* Payment link (optional) */}
        <div>
          <label className="label">Payment link (optional)</label>
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={form.paymentLink}
              onChange={(e) => update('paymentLink', e.target.value)}
              placeholder="e.g. https://pay.example.com/your-link"
              className="input pl-11"
            />
          </div>
          <p className="mt-1.5 text-xs text-ink-400 dark:text-ink-500">
            Add a payment link and buyers will see a QR code they can scan to pay you.
          </p>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 text-base">
            <Upload className="h-5 w-5" />
            {saving ? 'Posting...' : 'Post my item'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-ghost px-6 py-3 text-sm"
          >
            Cancel
          </button>
        </div>

        {errors.form && (
          <p className="text-center text-sm text-error-500">{errors.form}</p>
        )}

        <p className="text-center text-xs text-ink-400 dark:text-ink-500">
          Sign in to post and manage your listings. WANTERZ is a prototype — no
          real payments are processed.
        </p>
      </form>
    </div>
  );
}
