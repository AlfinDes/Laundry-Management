import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
        </button>
    );
}
