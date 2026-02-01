import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox, 
  Calendar as CalendarIcon, 
  Repeat, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Eye, 
  MoreHorizontal,
  Clock,
  Users,
  AlertCircle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { ImageWithFallback } from './components/figma/ImageWithFallback.tsx';
import logoAsset from "@/assets/image.png";
import { Drawer } from 'vaul';

// --- Types ---
type Section = 'inbox' | 'calendar' | 'followups';
type Mode = 'light' | 'dark' | 'high-contrast';
type CalendarViewType = 'week' | 'month';

interface FollowUpItem {
  id: number;
  title: string;
  context: string;
  priority: string;
  due: string;
  isWeekendBacklog?: boolean;
}

interface InboxItem {
  id: string;
  title: string;
  sender: string;
  senderAvatar: string;
  effort: string;
  blocking?: string;
  context?: string;
  urgency?: boolean;
}

// --- Components ---

interface NotificationPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const NotificationPanel = ({ isOpen, setIsOpen }: NotificationPanelProps) => {
  const notifications = [
    { id: 1, type: 'meeting', title: 'Strategy Sync', time: 'Starting in 10m', icon: Clock },
    { id: 2, type: 'followup', title: 'Review API Docs', time: 'Overdue', icon: Repeat },
    { id: 3, type: 'reply', title: 'Sarah Miller', time: '2h ago', icon: Inbox },
  ];

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 h-[80vh] outline-none">
          <div className="p-6 bg-background rounded-t-[32px] border-t border-border h-full flex flex-col">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <h2 className="text-xl font-black tracking-tight mb-6 uppercase">Notifications</h2>
            <div className="space-y-4 overflow-y-auto pb-8">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary-accent">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold leading-none mb-1">{n.title}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{n.time}</p>
                    </div>
                    <button className="text-xs font-bold text-primary-accent uppercase">View</button>
                  </div>
                );
              })}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

interface RescheduleSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onReschedule: (when: string) => void;
  activeItem: FollowUpItem | null;
}

const RescheduleSheet = ({ isOpen, setIsOpen, onReschedule, activeItem }: RescheduleSheetProps) => {
  const [showCustom, setShowCustom] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const options = [
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'A week', value: 'week' },
    { label: 'A month', value: 'month' },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 h-auto outline-none">
          <div className="p-6 bg-background rounded-t-[32px] border-t border-border flex flex-col max-h-[90vh]">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            
            {!showCustom ? (
              <>
                <h2 className="text-xl font-black tracking-tight mb-2 uppercase text-center">Reschedule</h2>
                <p className="text-muted-foreground text-sm text-center mb-8 font-medium">When would you like to follow up on "{activeItem?.title}"?</p>
                
                <div className="space-y-3 mb-8">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (opt.value === 'custom') setShowCustom(true);
                        else {
                          onReschedule(opt.value);
                          setIsOpen(false);
                        }
                      }}
                      className="w-full h-14 bg-secondary hover:bg-primary-soft hover:text-primary-accent transition-colors rounded-2xl font-bold text-sm uppercase tracking-wider"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="pb-8">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setShowCustom(false)} className="text-primary-accent font-bold text-xs uppercase">Back</button>
                  <h2 className="text-sm font-black uppercase tracking-widest">Pick a date</h2>
                  <div className="w-10" />
                </div>
                <div className="bg-secondary rounded-3xl p-4 mb-6">
                  <div className="grid grid-cols-7 gap-1 text-center mb-4">
                    {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] font-black text-muted-foreground">{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }).map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedDate(new Date(2026, 0, i + 1))}
                        className={`h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          i + 1 === 15 ? 'bg-primary-accent text-white' : 'hover:bg-primary-soft text-foreground'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    onReschedule(selectedDate.toISOString());
                    setIsOpen(false);
                  }}
                  className="w-full h-14 bg-primary-accent text-white rounded-2xl font-black uppercase tracking-widest"
                >
                  Confirm Date
                </button>
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

const FollowUpForm = () => {
  return (
    <div className="p-6 bg-background rounded-t-[32px] border-t border-border h-full flex flex-col">
      <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
      <div className="flex-1">
        <h2 className="text-xl font-black tracking-tight mb-6 uppercase">Create Follow-up</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Task Title</label>
            <input 
              type="text" 
              placeholder="What needs to happen?" 
              className="w-full h-14 px-4 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary-accent text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Priority</label>
              <select className="w-full h-14 px-4 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary-accent text-sm font-medium appearance-none">
                <option>Now</option>
                <option>Soon</option>
                <option>Later</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Time Estimate</label>
              <select className="w-full h-14 px-4 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary-accent text-sm font-medium appearance-none">
                <option>5 min</option>
                <option>15 min</option>
                <option>30 min</option>
                <option>1 hour</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-8 pb-4">
        <button 
          onClick={() => {
            toast.success('Follow-up created');
          }}
          className="w-full h-16 bg-primary-accent text-white rounded-3xl font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all"
        >
          Schedule Follow-up
        </button>
      </div>
    </div>
  );
};

interface TopBarProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  onOpenNotifications: () => void;
}

const TopBar = ({ mode, setMode, onOpenNotifications }: TopBarProps) => {
  const toggleMode = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('high-contrast');
    else setMode('light');
  };

  const getModeIcon = () => {
    if (mode === 'light') return <Sun size={20} />;
    if (mode === 'dark') return <Moon size={20} />;
    return <Eye size={20} />;
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 h-16 bg-background border-b border-border shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-primary-soft">
          <ImageWithFallback 
            src={logoAsset} 
            alt="DayOS Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-primary-accent">DayOS</h1>
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={toggleMode}
          className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
          aria-label="Toggle display mode"
        >
          {getModeIcon()}
        </button>
        <button 
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
        </button>
      </div>
    </div>
  );
};

const BottomNav = ({ activeSection, setActiveSection }: { activeSection: Section; setActiveSection: (section: Section) => void }) => {
  const tabs = [
    { id: 'inbox' as Section, icon: Inbox, label: 'Inbox' },
    { id: 'calendar' as Section, icon: CalendarIcon, label: 'Calendar' },
    { id: 'followups' as Section, icon: Repeat, label: 'Follow-ups' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-20 bg-background border-t border-border pb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
              isActive ? 'text-primary-accent' : 'text-muted-foreground'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-primary-soft' : 'bg-transparent'}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const InboxCard = ({ item, isLater = false }: { item: InboxItem; isLater?: boolean }) => {
  if (isLater) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm mb-2 active:scale-[0.99] transition-transform flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
            <Inbox size={10} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{item.title}</h3>
        </div>
        <ChevronRight size={14} className="text-muted-foreground/20" />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card p-4 rounded-2xl border border-border shadow-sm mb-3 active:scale-[0.98] transition-transform relative overflow-hidden`}
    >
      {item.urgency && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-accent" />
      )}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {item.senderAvatar ? (
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
              {item.senderAvatar}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center text-primary-accent">
              <Users size={12} />
            </div>
          )}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">{item.sender}</span>
        </div>
        {item.effort && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
            <Clock size={10} />
            {item.effort}
          </div>
        )}
      </div>
      
      <h3 className="text-base font-semibold mb-2 leading-snug">{item.title}</h3>
      
      <div className="flex flex-wrap gap-2 items-center">
        {item.blocking && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-destructive/10 text-destructive text-[10px] font-bold">
            <AlertCircle size={10} />
            BLOCKING {item.blocking}
          </div>
        )}
        {item.context && (
          <span className="text-xs text-muted-foreground">{item.context}</span>
        )}
        <div className="ml-auto">
          <ChevronRight size={16} className="text-muted-foreground/30" />
        </div>
      </div>
    </motion.div>
  );
};

const InboxSection = ({ title, items, badge, isLater = false }: { title: string; items: InboxItem[]; badge?: string; isLater?: boolean }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{title}</h3>
        {badge && (
          <span className="bg-primary-accent/10 text-primary-accent text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <InboxCard key={item.id} item={item} isLater={isLater} />
        ))}
      </div>
    </div>
  );
};

const InboxView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const meetings = {
    now: [{ id: 'm1', title: "Weekly Sync with Design Team", sender: "Calendar", senderAvatar: "C", effort: "45 min", blocking: "4 people", context: "Starting in 5 min", urgency: true }],
    soon: [{ id: 'm2', title: "Product Roadmap Review", sender: "Calendar", senderAvatar: "C", effort: "1h", context: "Starts in 2h" }],
    later: []
  };

  const emails = {
    now: [{ id: 'e1', title: "Confirm budget for Q3 marketing campaign", sender: "Sarah Miller", senderAvatar: "SM", effort: "10 min", blocking: "1 task", context: "Decision needed by EOD", urgency: true }],
    soon: [
      { id: 'e2', title: "Follow up: Project Orion Feedback", sender: "James Wilson", senderAvatar: "JW", effort: "15 min", context: "Replied yesterday" },
      { id: 'e3', title: "Review technical specs for API v2", sender: "Dev Team", senderAvatar: "DT", effort: "30 min", context: "Due tomorrow" },
    ],
    later: [
      { id: 'e4', title: "Monthly Newsletter: Tech Trends", sender: "Substack", senderAvatar: "S", effort: "5 min" },
      { id: 'e5', title: "Company-wide social next Friday", sender: "HR", senderAvatar: "HR", effort: "2 min" },
    ]
  };

  return (
    <div className="px-4 py-6">
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Search your day..." 
          className="w-full h-12 pl-10 pr-4 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary-accent/20 transition-all text-sm font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-black uppercase tracking-widest text-primary-accent mb-6 flex items-center gap-2">
          <CalendarIcon size={14} /> Meetings
        </h2>
        <InboxSection title="Now" items={meetings.now} badge="ACTIVE" />
        <InboxSection title="Soon" items={meetings.soon} badge="ACTIVE" />
        <InboxSection title="Later" items={meetings.later} isLater badge="ACTIVE" />
      </div>

      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-primary-accent mb-6 flex items-center gap-2">
          <Inbox size={14} /> Emails
        </h2>
        <InboxSection title="Now" items={emails.now} badge="PRIORITY" />
        <InboxSection title="Soon" items={emails.soon} badge="PRIORITY" />
        <InboxSection title="Later" items={emails.later} isLater badge="PRIORITY" />
      </div>

      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Trigger asChild>
          <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary-accent text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40">
            <Plus size={28} />
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] outline-none">
            <FollowUpForm />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

const CalendarView = () => {
  const [viewType, setViewType] = useState<CalendarViewType>('week');
  const [selectedDayIndex, setSelectedDayIndex] = useState(4);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const today = 4;

  const events = [
    { time: '09:00', title: 'Focus Time', duration: '1h', type: 'focus' },
    { time: '10:30', title: 'Design Sync', duration: '45m', type: 'meeting', participants: 3 },
    { time: '12:00', title: 'Lunch Break', duration: '1h', type: 'personal' },
    { time: '14:00', title: 'Product Review', duration: '1.5h', type: 'meeting', conflict: true },
  ];

  const indicators = { 4: { inbox: true, followups: true }, 5: { inbox: true, followups: false }, 6: { inbox: false, followups: true } };

  const monthPriorities = {
    2: [{ type: 'meeting', title: 'Team sync' }],
    4: [{ type: 'meeting', title: 'Strategy' }, { type: 'followup', title: 'Review spec' }, { type: 'email', title: 'Budget update' }],
    5: [{ type: 'followup', title: 'Review spec' }, { type: 'email', title: 'Reply to Alex' }],
    8: [{ type: 'email', title: 'Budget' }],
    12: [{ type: 'meeting', title: 'Client call' }, { type: 'followup', title: 'Send notes' }],
    15: [{ type: 'followup', title: 'Update docs' }],
    20: [{ type: 'email', title: 'HR query' }],
    25: [{ type: 'meeting', title: 'Product' }, { type: 'email', title: 'Team update' }],
    30: [{ type: 'meeting', title: 'Weekly sync' }],
  };

  const getPriorityIcon = (type: string) => {
    if (type === 'meeting') return <CalendarIcon size={8} />;
    if (type === 'followup') return <Repeat size={8} />;
    if (type === 'email') return <Inbox size={8} />;
    return null;
  };

  const getPriorityValue = (type: string) => {
    if (type === 'meeting') return 1;
    if (type === 'followup') return 2;
    if (type === 'email') return 3;
    return 4;
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black uppercase tracking-tighter">{viewType === 'week' ? 'Weekly View' : 'January 2026'}</h2>
        <button 
          onClick={() => setViewType(viewType === 'week' ? 'month' : 'week')}
          className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-primary-soft hover:text-primary-accent transition-all rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          {viewType === 'week' ? 'Monthly' : 'Weekly'}
          <ChevronRight size={12} className={viewType === 'month' ? 'rotate-90' : ''} />
        </button>
      </div>

      {viewType === 'week' ? (
        <>
          <div className="flex items-center justify-between mb-8 overflow-x-auto py-2 no-scrollbar">
            {days.map((day, i) => (
              <button
                key={day} 
                onClick={() => setSelectedDayIndex(i)}
                className={`relative flex flex-col items-center min-w-[48px] p-2 rounded-2xl transition-all cursor-pointer active:scale-95 ${i === selectedDayIndex ? 'bg-primary-accent text-white shadow-lg' : i === today ? 'bg-primary-accent/20 text-primary-accent' : 'text-muted-foreground hover:bg-accent'}`}
              >
                <span className="text-[10px] font-bold mb-1 opacity-60 uppercase">{day}</span>
                <span className="text-lg font-black tracking-tighter">{26 + i}</span>
                <div className="absolute -bottom-1 flex gap-0.5">
                  {indicators[i as keyof typeof indicators]?.inbox && <div className={`w-1 h-1 rounded-full ${i === selectedDayIndex ? 'bg-white' : 'bg-primary-accent'}`} />}
                  {indicators[i as keyof typeof indicators]?.followups && <div className={`w-1 h-1 rounded-full ${i === selectedDayIndex ? 'bg-white/60' : 'bg-muted-foreground/40'}`} />}
                </div>
              </button>
            ))}
          </div>
          <div className="space-y-6">
            {events.map((event, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 text-right pt-1"><span className="text-[10px] font-bold text-muted-foreground">{event.time}</span></div>
                <div className={`flex-1 p-4 rounded-2xl border border-border flex flex-col gap-2 ${event.conflict ? 'bg-destructive/5 border-destructive/20' : 'bg-card shadow-sm'}`}>
                  <div className="flex justify-between items-center"><h4 className="font-bold text-sm uppercase tracking-tight">{event.title}</h4><span className="text-[10px] font-medium text-muted-foreground uppercase">{event.duration}</span></div>
                  {event.participants && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Users size={12} /><span>{event.participants} participants</span></div>}
                  {event.conflict && <div className="flex items-center gap-1 text-[10px] font-bold text-destructive"><AlertCircle size={12} /><span>POTENTIAL CONFLICT DETECTED</span></div>}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-card border border-border rounded-[32px] p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map((d, idx) => (<div key={d} className={`text-[10px] font-black text-center py-2 uppercase ${idx === 5 || idx === 6 ? 'text-muted-foreground/50' : 'text-foreground/70'}`}>{d[0]}</div>))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === 30;
              const priorityItems = monthPriorities[dayNum as keyof typeof monthPriorities];
              const dayOfWeek = (3 + i) % 7;
              const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
              return (
                <div key={i} className={`aspect-square rounded-xl p-1.5 flex flex-col items-start justify-start transition-colors border border-transparent ${isToday ? 'bg-primary-soft border-primary-accent/10' : isWeekend ? 'bg-muted/30 hover:bg-muted/50' : 'hover:bg-secondary'}`}>
                  <span className={`text-[10px] font-black mb-1 ${isToday ? 'text-primary-accent' : isWeekend ? 'text-muted-foreground/60' : 'text-foreground/70'}`}>{dayNum}</span>
                  {priorityItems && (
                    <div className="w-full flex flex-col gap-0.5 overflow-hidden">
                      {priorityItems.sort((a, b) => getPriorityValue(a.type) - getPriorityValue(b.type)).map((item, index) => (
                        <div key={index} className="flex items-center gap-1 w-full"><span className="shrink-0 text-foreground/60">{getPriorityIcon(item.type)}</span><span className="text-[7px] font-medium text-foreground/70 truncate uppercase tracking-tighter">{item.title}</span></div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary-accent text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform"><Plus size={28} /></button>
    </div>
  );
};

const FollowUpsView = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<FollowUpItem | null>(null);
  const [followups, setFollowups] = useState([
    { id: 1, title: "Send notes from Design Sync", context: "Auto-suggested based on meeting", priority: "high", due: "In 2h" },
    { id: 2, title: "Check in with Alex on API docs", context: "Waiting for response for 2 days", priority: "medium", due: "Today" },
    { id: 3, title: "Plan next week's sprint", context: "Recurring weekly", priority: "low", due: "Monday" },
    { id: 4, title: "Review Q1 budget proposals", context: "Catch-up work", priority: "medium", due: "Saturday", isWeekendBacklog: true },
    { id: 5, title: "Update project documentation", context: "Deferred from weekday", priority: "low", due: "Sunday", isWeekendBacklog: true },
  ]);

  const handleComplete = (id: number) => {
    setFollowups(followups.filter(item => item.id !== id));
    toast.success('Follow-up completed');
  };

  const handleReschedule = (when: string) => toast.success(`Rescheduled for ${when}`);

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-tight mb-2">Follow-ups</h2>
        <p className="text-muted-foreground text-sm">Action items from your conversations and meetings.</p>
      </div>
      <div className="space-y-4">
        {followups.map((item) => (
          <div key={item.id} className="bg-card p-5 rounded-3xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${item.priority === 'high' ? 'bg-destructive/10 text-destructive' : item.priority === 'medium' ? 'bg-primary-soft text-primary-accent' : 'bg-secondary text-muted-foreground'}`}>{item.priority} priority</div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.due}</span>
            </div>
            <h3 className="text-lg font-bold mb-1 leading-tight">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{item.context}</p>
            <div className="flex gap-2">
              <button onClick={() => handleComplete(item.id)} className="flex-1 h-11 bg-primary-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Complete</button>
              <button onClick={() => { setActiveItem(item); setIsRescheduleOpen(true); }} className="flex-1 h-11 bg-secondary text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest">Reschedule</button>
              <button className="w-11 h-11 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground"><MoreHorizontal size={20} /></button>
            </div>
          </div>
        ))}
      </div>
      <Drawer.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
        <Drawer.Trigger asChild><button className="fixed bottom-24 right-6 w-14 h-14 bg-primary-accent text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40"><Plus size={28} /></button></Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] outline-none"><FollowUpForm /></Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <RescheduleSheet isOpen={isRescheduleOpen} setIsOpen={setIsRescheduleOpen} onReschedule={handleReschedule} activeItem={activeItem} />
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('inbox');
  const [mode, setMode] = useState<Mode>('light');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  const renderContent = () => {
    switch (activeSection) {
      case 'inbox': return <InboxView />;
      case 'calendar': return <CalendarView />;
      case 'followups': return <FollowUpsView />;
      default: return <InboxView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary-accent/20">
      <TopBar mode={mode} setMode={setMode} onOpenNotifications={() => setIsNotificationsOpen(true)} />
      <main className="pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>{renderContent()}</motion.div>
        </AnimatePresence>
      </main>
      <BottomNav activeSection={activeSection} setActiveSection={setActiveSection} />
      <NotificationPanel isOpen={isNotificationsOpen} setIsOpen={setIsNotificationsOpen} />
      <Toaster position="top-center" expand={false} richColors />
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}