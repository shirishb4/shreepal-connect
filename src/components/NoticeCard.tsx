import { Bell, Calendar, ChevronRight } from "lucide-react";

interface NoticeCardProps {
  title: string;
  date: string;
  excerpt: string;
  isNew?: boolean;
}

export function NoticeCard({ title, date, excerpt, isNew }: NoticeCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 card-hover group cursor-pointer">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {isNew && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                <Bell className="h-3 w-3" />
                New
              </span>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground mt-2 line-clamp-2">{excerpt}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
      </div>
    </div>
  );
}
