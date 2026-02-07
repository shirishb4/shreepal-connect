import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User } from "lucide-react";
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

export function DesktopNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { isApprovedCommitteeMember } = useUserRole();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={`px-3 py-2 text-sm font-medium transition-colors rounded ${
            isActive(link.href)
              ? "text-slate-900 bg-slate-100 underline underline-offset-4"
              : "text-slate-600 hover:text-slate-900 hover:underline underline-offset-4"
          }`}
        >
          {link.label}
        </Link>
      ))}
      {user && isApprovedCommitteeMember && (
        <Link
          to="/dashboard"
          className={`px-3 py-2 text-sm font-medium transition-colors rounded flex items-center gap-1.5 ${
            isActive("/dashboard")
              ? "text-slate-900 bg-slate-100 underline underline-offset-4"
              : "text-slate-600 hover:text-slate-900 hover:underline underline-offset-4"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      )}
      {user && (
        <Link
          to="/profile"
          className={`px-3 py-2 text-sm font-medium transition-colors rounded flex items-center gap-1.5 ${
            isActive("/profile")
              ? "text-slate-900 bg-slate-100 underline underline-offset-4"
              : "text-slate-600 hover:text-slate-900 hover:underline underline-offset-4"
          }`}
        >
          <User className="h-4 w-4" />
          Profile
        </Link>
      )}
    </nav>
  );
}
