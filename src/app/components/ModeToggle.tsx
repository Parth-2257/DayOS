import { Sun, Moon, Contrast } from 'lucide-react';
import type { DisplayMode } from '@/app/App';

interface ModeToggleProps {
  mode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  const modes: { value: DisplayMode; icon: JSX.Element; label: string }[] = [
    { value: 'light', icon: <Sun className="h-5 w-5" />, label: 'Light' },
    { value: 'dark', icon: <Moon className="h-5 w-5" />, label: 'Dark' },
    { value: 'high-contrast', icon: <Contrast className="h-5 w-5" />, label: 'High Contrast' }
  ];

  const currentIndex = modes.findIndex(m => m.value === mode);
  
  const cycleMode = () => {
    const nextIndex = (currentIndex + 1) % modes.length;
    onModeChange(modes[nextIndex].value);
  };

  const currentMode = modes[currentIndex];

  return (
    <button
      onClick={cycleMode}
      className="p-2 rounded-lg hover:bg-black/5 active:bg-black/10 transition-colors"
      title={`Current: ${currentMode.label}. Tap to switch.`}
    >
      {currentMode.icon}
    </button>
  );
}
