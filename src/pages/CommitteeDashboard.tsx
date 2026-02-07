import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, Clock, CheckCircle2, XCircle, Loader2, ShieldAlert } from "lucide-react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PendingApprovalsTab } from "@/components/PendingApprovalsTab";

interface MemberProfile {
  id: string;
  member_name: string;
  contact_number: string;
  created_at: string;
}

interface UnitData {
  id: string;
  user_id: string;
  unit_type: "flat" | "shop" | "commercial";
  unit_number: string;
  wing: string | null;
  floor: string | null;
}

interface RoleData {
  user_id: string;
  role: "member" | "committee_member";
  is_approved: boolean;
}

export default function CommitteeDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isApprovedCommitteeMember, loading: roleLoading } = useUserRole();

  const [profiles, setProfiles] = useState<MemberProfile[]>([]);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const isLoading = authLoading || roleLoading;

  // Redirect non-authorized users
  useEffect(() => {
    if (!isLoading && (!user || !isApprovedCommitteeMember)) {
      navigate("/", { replace: true });
    }
  }, [isLoading, user, isApprovedCommitteeMember, navigate]);

  const fetchData = async () => {
    setDataLoading(true);
    const [profilesRes, unitsRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("id, member_name, contact_number, created_at").order("created_at", { ascending: false }),
      supabase.from("units").select("id, user_id, unit_type, unit_number, wing, floor"),
      supabase.from("user_roles").select("user_id, role, is_approved"),
    ]);

    if (profilesRes.data) setProfiles(profilesRes.data);
    if (unitsRes.data) setUnits(unitsRes.data);
    if (rolesRes.data) setRoles(rolesRes.data);
    setDataLoading(false);
  };

  // Fetch data once authorized
  useEffect(() => {
    if (!isApprovedCommitteeMember) return;
    fetchData();
  }, [isApprovedCommitteeMember]);

  // Show loading state while checking auth/role
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  // Guard: don't render if not approved (redirect will fire)
  if (!isApprovedCommitteeMember) return null;

  const getRole = (userId: string) => roles.find((r) => r.user_id === userId);
  const getUserUnits = (userId: string) => units.filter((u) => u.user_id === userId);

  const totalMembers = profiles.length;
  const totalUnits = units.length;
  const pendingApprovals = roles.filter((r) => r.role === "committee_member" && !r.is_approved).length;

  return (
    <Layout>
      <PageHeader
        title="Committee Dashboard"
        description="Manage society members, units, and role approvals"
      />

      <section className="py-10 md:py-16">
        <div className="section-container">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dataLoading ? "–" : totalMembers}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dataLoading ? "–" : totalUnits}</p>
                <p className="text-sm text-muted-foreground">Registered Units</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dataLoading ? "–" : pendingApprovals}</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </div>

          {dataLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Tabs defaultValue={pendingApprovals > 0 ? "approvals" : "members"}>
              <TabsList className="mb-6">
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="units" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Units
                </TabsTrigger>
                <TabsTrigger value="approvals" className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Approvals
                  {pendingApprovals > 0 && (
                    <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                      {pendingApprovals}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Members Tab */}
              <TabsContent value="members">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profiles.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No members registered yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          profiles.map((profile) => {
                            const role = getRole(profile.id);
                            const memberUnits = getUserUnits(profile.id);
                            return (
                              <TableRow key={profile.id}>
                                <TableCell className="font-medium">{profile.member_name}</TableCell>
                                <TableCell>{profile.contact_number}</TableCell>
                                <TableCell>
                                  <Badge variant={role?.role === "committee_member" ? "default" : "secondary"}>
                                    {role?.role === "committee_member" ? "Committee" : "Member"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {role?.is_approved ? (
                                    <span className="flex items-center gap-1 text-sm text-accent-foreground">
                                      <CheckCircle2 className="h-4 w-4 text-accent" /> Approved
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-sm text-destructive">
                                      <XCircle className="h-4 w-4" /> Pending
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {memberUnits.length > 0
                                    ? memberUnits.map((u) => `${u.wing ? u.wing + "-" : ""}${u.unit_number}`).join(", ")
                                    : "–"}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                  {new Date(profile.created_at).toLocaleDateString("en-IN")}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Units Tab */}
              <TabsContent value="units">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit No.</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Wing</TableHead>
                          <TableHead>Floor</TableHead>
                          <TableHead>Owner</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {units.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No units registered yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          units.map((unit) => {
                            const owner = profiles.find((p) => p.id === unit.user_id);
                            return (
                              <TableRow key={unit.id}>
                                <TableCell className="font-medium">{unit.unit_number}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="capitalize">
                                    {unit.unit_type}
                                  </Badge>
                                </TableCell>
                                <TableCell>{unit.wing || "–"}</TableCell>
                                <TableCell>{unit.floor || "–"}</TableCell>
                                <TableCell>{owner?.member_name || "Unknown"}</TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              {/* Approvals Tab */}
              <TabsContent value="approvals">
                <PendingApprovalsTab
                  profiles={profiles}
                  roles={roles}
                  units={units}
                  onRoleUpdated={fetchData}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </Layout>
  );
}
