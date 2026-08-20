import { type LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = PackageOpen,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink-200 bg-white/60 px-6 py-12 text-center dark:border-ink-700 dark:bg-ink-900/40">
      <div className="relative mb-4">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-200" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <Icon className="h-8 w-8" strokeWidth={1.75} />
        </div>
      </div>
      <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">{title}</h3>
      {subtitle && (
        <p className="mt-1 max-w-xs text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary mt-5 px-5 py-2.5 text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
