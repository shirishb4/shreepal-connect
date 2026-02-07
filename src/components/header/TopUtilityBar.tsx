import { Link } from "react-router-dom";
import { Phone, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function TopUtilityBar() {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-full bg-slate-800 text-white px-4 py-2 flex justify-between items-center text-xs md:text-sm">
      <span className="font-semibold tracking-wide">
        Shreepal Complex CHS Ltd.
      </span>
      <div className="flex items-center gap-4 font-bold text-slate-100">
        <Link
          to="/emergency"
          className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
        >
          <Phone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Emergency Contacts</span>
          <span className="sm:hidden">Emergency</span>
        </Link>
        {!loading && (
          <>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login</span>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
