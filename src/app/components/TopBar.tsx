import { Bell } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { ModeToggle } from '@/app/components/ModeToggle';
import type { DisplayMode } from '@/app/App';

interface TopBarProps {
  mode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  unreadCount: number;
  onNotificationClick: () => void;
}

export function TopBar({ mode, onModeChange, unreadCount, onNotificationClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-primary-soft shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-medium text-foreground">DayOS</h1>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-lg hover:bg-black/5 active:bg-black/10 transition-colors"
          >
            <Bell className="h-5 w-5 text-foreground" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-primary-soft">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </button>

          <ModeToggle mode={mode} onModeChange={onModeChange} />
        </div>
      </div>
    </header>
  );
}
