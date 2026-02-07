import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UserRole {
  role: "member" | "committee_member";
  is_approved: boolean;
}

export function useUserRole() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role, is_approved")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setUserRole({
          role: data.role,
          is_approved: data.is_approved,
        });
      }
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  const isApprovedCommitteeMember =
    userRole?.role === "committee_member" && userRole?.is_approved === true;

  const isPendingCommitteeMember =
    userRole?.role === "committee_member" && userRole?.is_approved === false;

  return {
    userRole,
    loading,
    isApprovedCommitteeMember,
    isPendingCommitteeMember,
  };
}
