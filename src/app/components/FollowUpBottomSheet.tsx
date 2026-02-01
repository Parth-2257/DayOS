import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import { Button } from '@/app/components/ui/button';
import type { Meeting } from '@/app/App';

interface FollowUpBottomSheetProps {
  meeting: Meeting;
  onCreateFollowUp: (meetingId: string, days: number | Date) => void;
  onDismiss: () => void;
}

export function FollowUpBottomSheet({ meeting, onCreateFollowUp, onDismiss }: FollowUpBottomSheetProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customDate, setCustomDate] = useState(new Date());

  const handleQuickSelect = (days: number) => {
    onCreateFollowUp(meeting.id, days);
  };

  const handleCustomDate = () => {
    onCreateFollowUp(meeting.id, customDate);
  };

  return (
    <Sheet open={true} onOpenChange={onDismiss}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Set a follow-up?</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-6">
          <div className="p-4 rounded-2xl bg-accent/50 border">
            <div className="font-medium mb-2">{meeting.title}</div>
            <div className="text-sm text-muted-foreground mb-1">
              {meeting.person} • {meeting.organization}
            </div>
            <div className="text-sm text-muted-foreground">
              {meeting.startTime.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </div>
          </div>

          {!showCustom ? (
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 justify-start rounded-xl"
                onClick={() => handleQuickSelect(2)}
              >
                <Calendar className="h-5 w-5 mr-3" />
                2 days
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 justify-start rounded-xl"
                onClick={() => handleQuickSelect(5)}
              >
                <Calendar className="h-5 w-5 mr-3" />
                5 days
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 justify-start rounded-xl"
                onClick={() => handleQuickSelect(7)}
              >
                <Calendar className="h-5 w-5 mr-3" />
                1 week
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 justify-start rounded-xl"
                onClick={() => handleQuickSelect(30)}
              >
                <Calendar className="h-5 w-5 mr-3" />
                1 month
              </Button>
              
              <Button
                variant="ghost"
                className="w-full h-12 rounded-xl"
                onClick={() => setShowCustom(true)}
              >
                Custom date
              </Button>

              <Button
                variant="ghost"
                className="w-full h-12 rounded-xl text-muted-foreground"
                onClick={onDismiss}
              >
                None
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-medium">Select a date</label>
              <input
                type="date"
                value={customDate.toISOString().split('T')[0]}
                onChange={(e) => setCustomDate(new Date(e.target.value))}
                className="w-full h-12 px-4 border rounded-xl"
                min={new Date().toISOString().split('T')[0]}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                  onClick={() => setShowCustom(false)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl bg-primary-accent hover:bg-primary-accent/90"
                  onClick={handleCustomDate}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
