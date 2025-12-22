import { LucideIcon } from "lucide-react";

interface EmergencyContactCardProps {
  icon: LucideIcon;
  title: string;
  number: string;
  description?: string;
  variant?: "default" | "highlight";
}

export function EmergencyContactCard({
  icon: Icon,
  title,
  number,
  description,
  variant = "default",
}: EmergencyContactCardProps) {
  const isHighlight = variant === "highlight";

  return (
    <div
      className={`p-6 rounded-xl border-2 transition-all ${
        isHighlight
          ? "bg-emergency/10 border-emergency"
          : "bg-card border-border hover:border-accent/50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isHighlight ? "bg-emergency text-emergency-foreground" : "bg-accent text-accent-foreground"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
          <a
            href={`tel:${number.replace(/\s/g, "")}`}
            className={`text-xl font-semibold block mt-1 hover:underline ${
              isHighlight ? "text-emergency" : "text-accent"
            }`}
          >
            {number}
          </a>
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
