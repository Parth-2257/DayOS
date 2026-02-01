import { Mail, Calendar, Clock, Search } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import type { Email, Meeting } from '@/app/App';

interface InboxProps {
  emails: Email[];
  meetings: Meeting[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Inbox({ emails, meetings, searchQuery, onSearchChange }: InboxProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const upcomingMeetings = meetings
    .filter(m => m.startTime > new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 2);

  const hasResults = searchQuery && (emails.length > 0 || meetings.length > 0);
  const noResults = searchQuery && emails.length === 0 && meetings.length === 0;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search messages, meetings..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-12 text-base rounded-xl bg-accent/50 border-none"
        />
      </div>

      {/* Upcoming Meetings */}
      {!searchQuery && upcomingMeetings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground px-1">
            Upcoming
          </h2>
          {upcomingMeetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="p-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-10 w-10 rounded-full bg-primary-accent/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-accent" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium mb-1">{meeting.title}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {meeting.person} • {meeting.organization}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-accent">
                    <Clock className="h-4 w-4" />
                    {meeting.startTime.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-medium text-muted-foreground">
            {searchQuery ? 'Search Results' : 'Messages'}
          </h2>
          {!searchQuery && (
            <span className="text-sm text-muted-foreground">
              {emails.filter(e => !e.read).length} unread
            </span>
          )}
        </div>

        {noResults && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No results found for "{searchQuery}"</p>
          </div>
        )}

        {emails.map((email) => (
          <Card
            key={email.id}
            className={`p-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform ${
              !email.read ? 'bg-accent/30' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                  <Mail className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${!email.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {email.from}
                    </span>
                    {!email.read && (
                      <div className="h-2 w-2 rounded-full bg-primary-accent flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground flex-shrink-0">
                    {formatDate(email.date)}
                  </span>
                </div>
                
                {email.organization && (
                  <div className="text-xs text-muted-foreground mb-2">
                    {email.organization}
                  </div>
                )}
                
                <div className={`mb-2 ${!email.read ? 'font-medium' : ''}`}>
                  {email.subject}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {email.preview}
                </p>
              </div>
            </div>
          </Card>
        ))}

        {hasResults && meetings.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground px-1 mb-3">
              Meetings
            </h3>
            {meetings.map((meeting) => (
              <Card
                key={meeting.id}
                className="p-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform mb-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-accent-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">{meeting.title}</div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {meeting.person} • {meeting.organization}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {meeting.startTime.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
