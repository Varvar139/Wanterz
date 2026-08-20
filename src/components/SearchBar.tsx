import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  placeholder?: string;
  autoFocus?: boolean;
  name?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'What do you want?',
  autoFocus,
  name,
}: SearchBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="group relative mx-auto w-full max-w-xl rounded-full p-2 transition-colors duration-300"
      style={{
        background:
          'linear-gradient(135deg, rgb(255, 237, 213) 0%, rgb(254, 215, 170) 100%)',
        boxShadow:
          'rgba(249, 115, 22, 0.35) 4px 4px 8px 0px, rgba(249, 115, 22, 0.25) 6px 6px 20px 0px',
      }}
    >
      <div
        className="relative flex items-center rounded-full p-1.5"
        style={{
          background:
            'linear-gradient(135deg, rgb(255, 247, 237) 0%, rgb(254, 224, 179) 100%)',
        }}
      >
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search Wanterz"
          className="flex-1 bg-transparent px-4 py-2.5 text-ink-900 outline-none placeholder:text-brand-400/70 dark:text-white dark:placeholder:text-brand-200/50"
        />
        <button
          type="submit"
          aria-label="Search"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-l-2 border-white transition-all hover:border-l-[3px] hover:bg-brand-500 active:scale-95"
          style={{
            background:
              'linear-gradient(135deg, rgb(249, 115, 22) 0%, rgb(234, 88, 12) 100%)',
          }}
        >
          <Search className="h-5 w-5 fill-white text-white" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
