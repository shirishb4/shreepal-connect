import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface MemberProfile {
  id: string;
  member_name: string;
  contact_number: string;
  created_at: string;
}

interface RoleData {
  user_id: string;
  role: "member" | "committee_member";
  is_approved: boolean;
}

interface UnitData {
  id: string;
  user_id: string;
  unit_type: "flat" | "shop" | "commercial";
  unit_number: string;
  wing: string | null;
  floor: string | null;
}

interface PendingApprovalsTabProps {
  profiles: MemberProfile[];
  roles: RoleData[];
  units: UnitData[];
  onRoleUpdated: () => void;
}

export function PendingApprovalsTab({ profiles, roles, units, onRoleUpdated }: PendingApprovalsTabProps) {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingRoles = roles.filter((r) => r.role === "committee_member" && !r.is_approved);

  const handleApproval = async (userId: string, approve: boolean) => {
    setProcessingId(userId);

    if (approve) {
      const { error } = await supabase
        .from("user_roles")
        .update({ is_approved: true })
        .eq("user_id", userId)
        .eq("role", "committee_member");

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Approved", description: "Committee member request has been approved." });
        onRoleUpdated();
      }
    } else {
      // Reject: downgrade to member role and auto-approve
      const { error } = await supabase
        .from("user_roles")
        .update({ role: "member" as const, is_approved: true })
        .eq("user_id", userId)
        .eq("role", "committee_member");

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Rejected", description: "Request rejected. User has been set as a regular Member." });
        onRoleUpdated();
      }
    }

    setProcessingId(null);
  };

  const getUserUnits = (userId: string) => units.filter((u) => u.user_id === userId);
  const getProfile = (userId: string) => profiles.find((p) => p.id === userId);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
                    <p>No pending approval requests</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pendingRoles.map((role) => {
                const profile = getProfile(role.user_id);
                const memberUnits = getUserUnits(role.user_id);
                const isProcessing = processingId === role.user_id;

                return (
                  <TableRow key={role.user_id}>
                    <TableCell className="font-medium">
                      {profile?.member_name || "Unknown"}
                      <Badge variant="outline" className="ml-2 text-xs">
                        Committee Request
                      </Badge>
                    </TableCell>
                    <TableCell>{profile?.contact_number || "–"}</TableCell>
                    <TableCell>
                      {memberUnits.length > 0
                        ? memberUnits.map((u) => `${u.wing ? u.wing + "-" : ""}${u.unit_number}`).join(", ")
                        : "–"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {profile ? new Date(profile.created_at).toLocaleDateString("en-IN") : "–"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="default"
                              disabled={isProcessing}
                              className="gap-1"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              )}
                              Approve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Committee Member?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will grant <strong>{profile?.member_name}</strong> full committee member access including the ability to view all members, units, and manage approvals.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleApproval(role.user_id, true)}>
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isProcessing}
                              className="gap-1 text-destructive hover:text-destructive"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Committee Request?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will reject <strong>{profile?.member_name}</strong>'s committee member request and set their role to regular Member.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleApproval(role.user_id, false)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
