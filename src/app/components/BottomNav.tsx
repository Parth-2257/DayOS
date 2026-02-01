import { Mail, Calendar, CheckCircle2 } from 'lucide-react';
import type { Tab } from '@/app/App';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'inbox' as Tab, icon: Mail, label: 'Inbox' },
    { id: 'calendar' as Tab, icon: Calendar, label: 'Calendar' },
    { id: 'follow-ups' as Tab, icon: CheckCircle2, label: 'Follow-Ups' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-lg transition-colors min-w-[80px] ${
                isActive
                  ? 'text-primary-accent'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
