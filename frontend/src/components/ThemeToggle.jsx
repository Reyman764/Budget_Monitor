import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { MoonIcon, SunIcon } from './icons';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={className}
    >
      {isDark ? (
        <SunIcon className="h-[1.15rem] w-[1.15rem]" />
      ) : (
        <MoonIcon className="h-[1.15rem] w-[1.15rem]" />
      )}
    </Button>
  );
}
