import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import shreepalLogo from "@/assets/shreepal-logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/committee", label: "Committee" },
  { href: "/redevelopment", label: "Redevelopment" },
  { href: "/emergency", label: "Emergency" },
  { href: "/documents", label: "Documents" },
  { href: "/notices", label: "Notices" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Top bar with emergency contact */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="section-container flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <img src={shreepalLogo} alt="Shreepal Complex Logo" className="h-6 w-6 rounded" />
            <span className="hidden sm:inline font-semibold text-base">Shreepal Complex CHS Ltd.</span>
          </div>
          <Link
            to="/emergency"
            className="flex items-center gap-2 hover:underline"
          >
            <Phone className="h-4 w-4" />
            <span>Emergency Contacts</span>
          </Link>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="section-container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={shreepalLogo} alt="Shreepal Complex Logo" className="w-12 h-12 rounded-lg object-cover" />
            <div className="hidden sm:block">
              <h1 className="font-heading text-lg font-bold text-foreground leading-tight">
                Shreepal Complex
              </h1>
              <p className="text-sm text-muted-foreground">
                Cooperative Housing Society
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-md text-body font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-body font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
