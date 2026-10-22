import { Link } from "react-router-dom";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WishlistInvitation() {
  return (
    <section className="border-y border-accent/30 bg-secondary py-7">
      <div className="section-container flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <ClipboardList className="h-8 w-8 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Member consultation</p>
            <h2 className="text-xl md:text-2xl font-heading text-foreground">Redevelopment Expectations &amp; Member Wishlist</h2>
          </div>
        </div>
        <Button asChild className="shrink-0 self-start md:self-center">
          <Link to="/redevelopment/wishlist">Open member form <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}