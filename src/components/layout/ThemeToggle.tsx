import { useThemeStore } from '../../store/themeStore';

export default function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);
  const isLight = mode === 'light';

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="relative w-12 h-7 rounded-full border border-dispatch-line bg-dispatch-panel2 flex items-center px-0.5 transition-colors"
    >
      <span
        className={`absolute w-5 h-5 rounded-full bg-dispatch-accent transition-transform duration-200 ${
          isLight ? 'translate-x-[20px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
