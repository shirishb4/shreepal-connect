import { User, Phone, Mail } from "lucide-react";

interface CommitteeMemberCardProps {
  name: string;
  designation: string;
  phone?: string;
  email?: string;
}

export function CommitteeMemberCard({
  name,
  designation,
  phone,
  email,
}: CommitteeMemberCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 card-hover">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-7 w-7 text-secondary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-bold text-foreground truncate">
            {name}
          </h3>
          <p className="text-accent font-semibold mt-0.5">{designation}</p>
          
          <div className="mt-4 space-y-2">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{phone}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{email}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
