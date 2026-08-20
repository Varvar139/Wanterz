import {
  ArrowRight,
  Package,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  Zap,
} from 'lucide-react';
import { navigate } from '@/lib/router';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
          <Sparkles className="h-4 w-4" />
          The WANTERZ story
        </div>
        <h1 className="font-display text-4xl font-extrabold text-ink-900 dark:text-white sm:text-5xl">
          We don't sell needs.
          <br />
          We sell <span className="text-brand-500">wants.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-ink-500 dark:text-ink-400">
          WANTERZ is a marketplace built around a simple idea: people don't
          always need things — they want them. And wanting is good.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Feature
          icon={<Package className="h-6 w-6" />}
          title="Individual items only"
          text="No mini-shops, no storefronts. Sellers list one product at a time — clean and simple."
        />
        <Feature
          icon={<Zap className="h-6 w-6" />}
          title="Built for discovery"
          text="Browse by category, search what you want, and spot fresh items the moment they pop up."
        />
        <Feature
          icon={<Users className="h-6 w-6" />}
          title="Anyone can sell"
          text="Got something worth wanting? List it in under a minute — no fees, no setup."
        />
        <Feature
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Prototype-safe"
          text="This is an MVP. Listings live on your device. No payments and no sensitive info collected."
        />
      </div>

      {/* How it works */}
      <div className="mt-14">
        <h2 className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">
          How it works
        </h2>
        <div className="mt-6 space-y-4">
          <Step n={1} title="Want something" text="Search or browse categories to find the thing you're after." />
          <Step n={2} title="Have something" text="List your item with a photo, price in AED, and a location." />
          <Step n={3} title="WANTERZ it" text="Your item goes live for others to discover. That's it." />
        </div>
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-4xl border border-ink-100 bg-white p-8 text-center shadow-soft dark:border-ink-800 dark:bg-ink-900">
        <Tag className="mx-auto h-8 w-8 text-brand-500" />
        <h2 className="mt-3 font-display text-2xl font-extrabold text-ink-900 dark:text-white">
          Ready to list your first want?
        </h2>
        <p className="mt-1 text-ink-500 dark:text-ink-400">Be the first item on WANTERZ.</p>
        <button
          onClick={() => navigate('/sell')}
          className="btn-primary mt-5 px-6 py-3 text-base"
        >
          Sell
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        {icon}
      </span>
      <h3 className="mt-3 font-display font-bold text-ink-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{text}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-extrabold text-white dark:bg-brand-500 dark:text-white">
        {n}
      </span>
      <div>
        <h3 className="font-bold text-ink-900 dark:text-white">{title}</h3>
        <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{text}</p>
      </div>
    </div>
  );
}
