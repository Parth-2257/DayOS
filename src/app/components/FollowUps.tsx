import { useState } from 'react';
import { CheckCircle2, Calendar, X, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import type { FollowUp } from '@/app/App';

interface FollowUpsProps {
  followUps: FollowUp[];
  onMarkComplete: (id: string) => void;
  onReschedule: (id: string, newDate: Date) => void;
  filterDate: Date | null;
  onClearFilter: () => void;
}

export function FollowUps({ followUps, onMarkComplete, onReschedule, filterDate, onClearFilter }: FollowUpsProps) {
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const sortedFollowUps = [...followUps].sort((a, b) => {
    return new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime();
  });

  const getPriorityColor = (priority: FollowUp['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-500';
    }
  };

  const getPriorityBg = (priority: FollowUp['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      return 'Overdue';
    } else if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Tomorrow';
    } else if (days < 7) {
      return `${days} days`;
    } else {
      return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''}`;
    }
  };

  const getBestTimeToFollowUp = (followUpDate: Date) => {
    return followUpDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleReschedule = (id: string, days: number) => {
    const followUp = followUps.find(f => f.id === id);
    if (!followUp) return;

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    onReschedule(id, newDate);
    setRescheduleId(null);
  };

  const handleCustomReschedule = () => {
    if (rescheduleId) {
      onReschedule(rescheduleId, selectedDate);
      setRescheduleId(null);
    }
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Follow-Ups</h2>
          {filterDate && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                {filterDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </span>
              <button
                onClick={onClearFilter}
                className="p-1 rounded-full hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {sortedFollowUps.length} pending
        </div>
      </div>

      {sortedFollowUps.length === 0 ? (
        <Card className="p-12 rounded-2xl text-center">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">
            {filterDate ? 'No follow-ups for this date' : 'No pending follow-ups'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedFollowUps.map((followUp) => {
            const timeRemaining = formatTimeRemaining(new Date(followUp.followUpDate));
            const isOverdue = new Date(followUp.followUpDate) < new Date();

            return (
              <Card
                key={followUp.id}
                className={`p-4 rounded-2xl border-l-4 ${getPriorityBg(followUp.priority)} shadow-sm`}
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium mb-1">
                      {followUp.person}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {followUp.organization}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {followUp.meetingTitle}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Original:</span>
                      <span>
                        {followUp.originalMeetingDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Follow up:</span>
                      <span>{getBestTimeToFollowUp(new Date(followUp.followUpDate))}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${getPriorityBg(followUp.priority)}`}>
                      <AlertCircle className={`h-4 w-4 ${getPriorityColor(followUp.priority)}`} />
                      <span className={`text-sm font-medium ${getPriorityColor(followUp.priority)}`}>
                        {followUp.priority.charAt(0).toUpperCase() + followUp.priority.slice(1)}
                      </span>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isOverdue 
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {timeRemaining}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setRescheduleId(followUp.id)}
                      className="flex-1 h-11 rounded-xl"
                    >
                      Reschedule
                    </Button>
                    <Button
                      onClick={() => onMarkComplete(followUp.id)}
                      className="flex-1 h-11 rounded-xl bg-primary-accent hover:bg-primary-accent/90"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Done
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reschedule Bottom Sheet */}
      <Sheet open={rescheduleId !== null} onOpenChange={() => setRescheduleId(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Reschedule Follow-up</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-3 py-6">
            <Button
              variant="outline"
              className="w-full h-12 justify-start rounded-xl"
              onClick={() => rescheduleId && handleReschedule(rescheduleId, 2)}
            >
              2 days
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 justify-start rounded-xl"
              onClick={() => rescheduleId && handleReschedule(rescheduleId, 5)}
            >
              5 days
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 justify-start rounded-xl"
              onClick={() => rescheduleId && handleReschedule(rescheduleId, 7)}
            >
              1 week
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 justify-start rounded-xl"
              onClick={() => rescheduleId && handleReschedule(rescheduleId, 30)}
            >
              1 month
            </Button>
            
            <div className="pt-4 border-t space-y-3">
              <label className="text-sm font-medium">Custom Date</label>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full h-12 px-4 border rounded-xl"
                min={new Date().toISOString().split('T')[0]}
              />
              <Button
                className="w-full h-12 rounded-xl bg-primary-accent hover:bg-primary-accent/90"
                onClick={handleCustomReschedule}
              >
                Confirm Custom Date
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
