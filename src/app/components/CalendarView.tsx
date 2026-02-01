import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import type { Meeting, FollowUp } from '@/app/App';

interface CalendarViewProps {
  meetings: Meeting[];
  followUps: FollowUp[];
  onFollowUpIndicatorClick: (date: Date) => void;
}

export function CalendarView({ meetings, followUps, onFollowUpIndicatorClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');

  const startOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(currentDate);

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(m => {
      return m.startTime.toDateString() === date.toDateString();
    });
  };

  const getFollowUpsForDate = (date: Date) => {
    return followUps.filter(f => {
      return new Date(f.followUpDate).toDateString() === date.toDateString();
    });
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (view === 'week') {
      navigateWeek(direction);
    } else {
      navigateDay(direction);
    }
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Calendar Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {view === 'week' 
              ? weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            }
          </h2>

          <div className="flex gap-1 bg-accent/50 rounded-xl p-1">
            <button
              onClick={() => setView('day')}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                view === 'day'
                  ? 'bg-background shadow-sm font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                view === 'week'
                  ? 'bg-background shadow-sm font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="h-10 px-4 rounded-xl"
          >
            Today
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('prev')}
              className="h-10 w-10 rounded-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('next')}
              className="h-10 w-10 rounded-xl"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {view === 'week' ? (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayMeetings = getMeetingsForDate(day);
            const dayFollowUps = getFollowUpsForDate(day);
            const weekend = isWeekend(day);
            const today = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`rounded-2xl p-2 min-h-[120px] ${
                  weekend ? 'bg-accent/30' : 'bg-card'
                } ${today ? 'ring-2 ring-primary-accent' : ''}`}
              >
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-base font-medium ${
                      today ? 'text-primary-accent' : ''
                    }`}>
                      {day.getDate()}
                    </div>
                  </div>

                  {dayMeetings.length > 0 && (
                    <div className="space-y-1">
                      {dayMeetings.slice(0, 2).map((meeting) => (
                        <div
                          key={meeting.id}
                          className="p-1.5 rounded-lg bg-primary-accent/10 border border-primary-accent/20"
                        >
                          <div className="text-[10px] text-primary-accent font-medium mb-0.5">
                            {meeting.startTime.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-xs line-clamp-1">{meeting.title}</div>
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <div className="text-[10px] text-center text-muted-foreground">
                          +{dayMeetings.length - 2} more
                        </div>
                      )}
                    </div>
                  )}

                  {dayFollowUps.length > 0 && (
                    <button
                      onClick={() => onFollowUpIndicatorClick(day)}
                      className="w-full flex items-center justify-center gap-1 p-1 rounded-lg bg-accent hover:bg-accent/80 active:scale-95 transition-all"
                    >
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.min(dayFollowUps.length, 3) }).map((_, i) => (
                          <CheckCircle2 key={i} className="h-3 w-3 text-primary-accent" />
                        ))}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Day View */
        <div className="space-y-3">
          <Card className="p-4 rounded-2xl">
            <div className="flex items-center justify-between pb-3 border-b mb-3">
              <div>
                <div className="text-sm text-muted-foreground">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="text-xl font-medium">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </div>
              </div>
              {isWeekend(currentDate) && (
                <div className="px-3 py-1 rounded-full bg-accent text-sm">
                  Weekend
                </div>
              )}
            </div>

            <div className="space-y-3">
              {getMeetingsForDate(currentDate).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No meetings scheduled</p>
                </div>
              ) : (
                getMeetingsForDate(currentDate).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 rounded-xl bg-accent/50 active:scale-[0.98] transition-transform"
                  >
                    <div className="font-medium mb-2">{meeting.title}</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {meeting.person} • {meeting.organization}
                    </div>
                    <div className="text-sm text-primary-accent">
                      {meeting.startTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                      {' - '}
                      {meeting.endTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))
              )}

              {getFollowUpsForDate(currentDate).length > 0 && (
                <button
                  onClick={() => onFollowUpIndicatorClick(currentDate)}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-accent hover:bg-accent/80 active:scale-[0.98] transition-all"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary-accent" />
                  <span className="font-medium">
                    View {getFollowUpsForDate(currentDate).length} Follow-up
                    {getFollowUpsForDate(currentDate).length > 1 ? 's' : ''}
                  </span>
                </button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
