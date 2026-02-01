import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import type { Meeting } from '@/app/App';

interface FollowUpPopupProps {
  meeting: Meeting;
  onCreateFollowUp: (meetingId: string, days: number | Date) => void;
  onDismiss: () => void;
}

export function FollowUpPopup({ meeting, onCreateFollowUp, onDismiss }: FollowUpPopupProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customDate, setCustomDate] = useState(new Date());

  const handleQuickSelect = (days: number) => {
    onCreateFollowUp(meeting.id, days);
  };

  const handleCustomDate = () => {
    onCreateFollowUp(meeting.id, customDate);
  };

  return (
    <Dialog open={true} onOpenChange={onDismiss}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Follow-up</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 rounded-lg bg-accent/50 border">
            <div className="font-medium mb-1">{meeting.title}</div>
            <div className="text-sm text-muted-foreground">
              {meeting.person} • {meeting.organization}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {meeting.startTime.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Would you like to set a follow-up for this meeting?
            </p>

            {!showCustom ? (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickSelect(2)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  2 days
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickSelect(5)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  5 days
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickSelect(7)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  1 week
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickSelect(30)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  1 month
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowCustom(true)}
                >
                  Custom date
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <input
                  type="date"
                  value={customDate.toISOString().split('T')[0]}
                  onChange={(e) => setCustomDate(new Date(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCustom(false)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCustomDate}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            )}

            {!showCustom && (
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={onDismiss}
              >
                No follow-up needed
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
