import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentCardProps {
  title: string;
  category: string;
  date: string;
  downloadUrl?: string;
}

export function DocumentCard({
  title,
  category,
  date,
  downloadUrl,
}: DocumentCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 card-hover">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="h-6 w-6 text-secondary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full mb-2">
            {category}
          </span>
          <h3 className="font-semibold text-foreground leading-snug">{title}</h3>
          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>
        {downloadUrl && (
          <Button variant="outline" size="icon" className="flex-shrink-0" asChild>
            <a href={downloadUrl} download aria-label="Download document">
              <Download className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
