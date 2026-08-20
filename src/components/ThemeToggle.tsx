interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <label id="theme-toggle-button" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <input
        id="toggle"
        type="checkbox"
        checked={theme === 'dark'}
        onChange={onToggle}
        aria-label="Toggle dark mode"
      />
      <svg id="theme-toggle-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122 34">
        {/* Background */}
        <rect id="container" x="0" y="0" width="114" height="34" rx="17" fill="#d8d8d8" />
        {/* Stars */}
        <g id="stars">
          <circle cx="28" cy="10" r="1.2" fill="#fff" />
          <circle cx="35" cy="14" r="1" fill="#fff" />
          <circle cx="42" cy="8" r="1.5" fill="#fff" />
          <circle cx="50" cy="12" r="1" fill="#fff" />
          <circle cx="58" cy="10" r="1.3" fill="#fff" />
        </g>
        {/* Cloud */}
        <g id="cloud">
          <path
            d="M20 22 Q20 17 25 17 Q27 13 32 14 Q36 12 38 16 Q42 16 42 22 Z"
            fill="#fff"
          />
        </g>
        {/* Sun rays */}
        <g id="sun">
          <circle cx="14" cy="17" r="6" fill="#ffcf48" />
          <g stroke="#ffcf48" strokeWidth="1.5" strokeLinecap="round">
            <line x1="14" y1="6" x2="14" y2="9" />
            <line x1="14" y1="25" x2="14" y2="28" />
            <line x1="3" y1="17" x2="6" y2="17" />
            <line x1="22" y1="17" x2="25" y2="17" />
          </g>
        </g>
        {/* Moon */}
        <g id="moon">
          <path
            d="M86 10 A8 8 0 1 0 86 26 A6 6 0 1 1 86 10 Z"
            fill="#fff"
          />
        </g>
        {/* Button */}
        <rect id="button" x="2" y="2.333" width="28" height="28" rx="14" fill="#fff" />
      </svg>
    </label>
  );
}
