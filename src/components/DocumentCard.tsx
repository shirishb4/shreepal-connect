import { FileText, Download, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentCardProps {
  title: string;
  category: string;
  date: string;
  description?: string;
  source?: string;
  downloadUrl?: string;
  actionUrl?: string;
}

export function DocumentCard({
  title,
  category,
  date,
  description,
  source,
  downloadUrl,
  actionUrl,
}: DocumentCardProps) {
  const linkUrl = actionUrl ?? downloadUrl;
  const isExternal = Boolean(actionUrl);

  return (
    <div className="bg-card rounded-lg border border-border p-5 card-hover">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="h-6 w-6 text-secondary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full mb-2">
            {category}
          </span>
          <h3 className="font-semibold text-foreground leading-snug">{title}</h3>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          {source && (
            <p className="mt-1 text-xs font-medium text-foreground">Source: {source}</p>
          )}
        </div>
        {linkUrl && (
          <Button variant="outline" size="icon" className="flex-shrink-0" asChild>
            <a
              href={linkUrl}
              download={downloadUrl ? true : undefined}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              aria-label={isExternal ? `View official source for ${title}` : `Download ${title}`}
              title={isExternal ? "View official source" : "Download document"}
            >
              {isExternal ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
