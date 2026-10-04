import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { isApprovedCommitteeMember } = useUserRole();

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-background border-t border-border">
      <nav className="flex flex-col p-4 gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={onClose}
            className={`py-2.5 px-3 rounded text-base font-medium transition-colors border-b border-border ${
              isActive(link.href)
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {link.label}
          </Link>
        ))}
        {user && isApprovedCommitteeMember && (
          <Link
            to="/dashboard"
            onClick={onClose}
            className={`py-2.5 px-3 rounded text-base font-medium transition-colors border-b border-border flex items-center gap-2 ${
              isActive("/dashboard")
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
        )}
        {user && (
          <Link
            to="/profile"
            onClick={onClose}
            className={`py-2.5 px-3 rounded text-base font-medium transition-colors border-b border-border flex items-center gap-2 ${
              isActive("/profile")
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <User className="h-5 w-5" />
            My Profile
          </Link>
        )}
        {!user && (
          <Link
            to="/auth"
            onClick={onClose}
            className="py-2.5 px-3 rounded text-base font-medium text-warning hover:bg-muted flex items-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Login / Sign Up
          </Link>
        )}
      </nav>
    </div>
  );
}
