import { X, Bell, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import type { Notification } from '@/app/App';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

export function NotificationPanel({ notifications, onClose, onMarkRead }: NotificationPanelProps) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="h-5 w-5" />;
      case 'follow-up':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'deadline':
        return <Clock className="h-5 w-5" />;
      case 'reply':
        return <Bell className="h-5 w-5" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-0 left-0 right-0 z-50 max-h-[80vh] animate-in slide-in-from-top duration-200">
        <Card className="m-4 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <h3 className="font-medium">Notifications</h3>
              {notifications.some(n => !n.read) && (
                <span className="text-sm text-muted-foreground">
                  ({notifications.filter(n => !n.read).length} new)
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="max-h-[60vh]">
            {sortedNotifications.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y">
                {sortedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 active:bg-accent/50 transition-colors ${
                      !notification.read ? 'bg-accent/30' : ''
                    }`}
                    onClick={() => onMarkRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 p-2 rounded-full ${
                        !notification.read ? 'bg-primary-accent/10 text-primary-accent' : 'bg-accent text-accent-foreground'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="font-medium text-sm">
                            {notification.title}
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary-accent flex-shrink-0 mt-1" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          
                          {notification.type === 'meeting' && 
                           notification.message.includes('Meeting Overlap') && (
                            <div className="flex items-center gap-1 text-xs text-amber-600">
                              <AlertCircle className="h-3 w-3" />
                              <span>Conflict</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {sortedNotifications.length > 0 && sortedNotifications.some(n => !n.read) && (
            <div className="p-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-11 rounded-xl"
                onClick={() => {
                  notifications.forEach(n => onMarkRead(n.id));
                }}
              >
                Mark all as read
              </Button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
