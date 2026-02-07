import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { TopUtilityBar } from "./header/TopUtilityBar";
import { DesktopNav } from "./header/DesktopNav";
import { MobileNav } from "./header/MobileNav";
import shreepalLogo from "@/assets/shreepal-logo.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Utility Band */}
      <TopUtilityBar />

      {/* Main Header: Branding + Navigation */}
      <div className="w-full bg-white border-b border-slate-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo + Society Name */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={shreepalLogo}
              alt="Shreepal Complex Logo"
              className="h-10 w-10 md:h-12 md:w-12 rounded"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                Shreepal Complex
              </h1>
              <p className="text-xs md:text-sm text-slate-600">
                Cooperative Housing Society
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 border border-slate-400 rounded hover:bg-slate-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-slate-700" />
            ) : (
              <Menu className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </header>
  );
}
