import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { TopUtilityBar } from "./header/TopUtilityBar";
import { DesktopNav } from "./header/DesktopNav";
import { MobileNav } from "./header/MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import shreepalLogo from "@/assets/shreepal-logo.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Band */}
      <TopUtilityBar />

      {/* Main Header: Branding + Navigation */}
      <div className="w-full bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo + Society Name */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={shreepalLogo}
              alt="Shreepal Complex Logo"
              className="h-10 w-10 md:h-12 md:w-12 rounded"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                Shreepal Complex
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Cooperative Housing Society
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <DesktopNav />
            <ThemeToggle />
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </header>
  );
}
