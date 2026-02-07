import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, Save, Plus, Trash2, Loader2, Mail, Phone as PhoneIcon, Home, Shield, ShieldCheck, Car } from "lucide-react";
import { ChangeEmailDialog } from "@/components/ChangeEmailDialog";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";

interface Profile {
  id: string;
  member_name: string;
  contact_number: string;
}

interface Unit {
  id: string;
  unit_type: "flat" | "shop" | "commercial";
  unit_number: string;
  wing: string | null;
  floor: string | null;
  occupancy_status: "self_occupied" | "rented" | "leased";
}

interface ParkingVehicle {
  id: string;
  vehicle_type: "two_wheeler" | "four_wheeler";
  vehicle_number: string;
  vehicle_make: string | null;
  vehicle_model: string | null;
}

const profileSchema = z.object({
  member_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  contact_number: z.string().trim().min(10, "Enter a valid contact number").max(15),
});

const unitSchema = z.object({
  unit_type: z.enum(["flat", "shop", "commercial"]),
  unit_number: z.string().trim().min(1, "Unit number is required").max(20),
  wing: z.string().trim().max(20).optional(),
  floor: z.string().trim().max(10).optional(),
  occupancy_status: z.enum(["self_occupied", "rented", "leased"]),
});

const vehicleSchema = z.object({
  vehicle_type: z.enum(["two_wheeler", "four_wheeler"]),
  vehicle_number: z.string().trim().min(1, "Vehicle number is required").max(20),
  vehicle_make: z.string().trim().max(50).optional(),
  vehicle_model: z.string().trim().max(50).optional(),
});

interface EditableUnit {
  id?: string;
  unit_type: "flat" | "shop" | "commercial";
  unit_number: string;
  wing: string;
  floor: string;
  occupancy_status: "self_occupied" | "rented" | "leased";
}

interface EditableVehicle {
  id?: string;
  vehicle_type: "two_wheeler" | "four_wheeler";
  vehicle_number: string;
  vehicle_make: string;
  vehicle_model: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userRole, setUserRole] = useState<{ role: string; is_approved: boolean } | null>(null);

  // Editable state
  const [memberName, setMemberName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [editableUnits, setEditableUnits] = useState<EditableUnit[]>([]);
  const [editableVehicles, setEditableVehicles] = useState<EditableVehicle[]>([]);

  // Track deletions
  const [deletedUnitIds, setDeletedUnitIds] = useState<string[]>([]);
  const [deletedVehicleIds, setDeletedVehicleIds] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [profileRes, unitsRes, roleRes, vehiclesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase.from("units").select("*").eq("user_id", user!.id).order("created_at"),
      supabase.from("user_roles").select("role, is_approved").eq("user_id", user!.id).single(),
      supabase.from("parking_vehicles").select("*").eq("user_id", user!.id).order("created_at"),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setMemberName(profileRes.data.member_name);
      setContactNumber(profileRes.data.contact_number);
    }

    if (unitsRes.data) {
      setEditableUnits(
        unitsRes.data.map((u: any) => ({
          id: u.id,
          unit_type: u.unit_type,
          unit_number: u.unit_number,
          wing: u.wing || "",
          floor: u.floor || "",
          occupancy_status: u.occupancy_status || "self_occupied",
        }))
      );
    }

    if (roleRes.data) {
      setUserRole(roleRes.data);
    }

    if (vehiclesRes.data) {
      setEditableVehicles(
        vehiclesRes.data.map((v: any) => ({
          id: v.id,
          vehicle_type: v.vehicle_type,
          vehicle_number: v.vehicle_number,
          vehicle_make: v.vehicle_make || "",
          vehicle_model: v.vehicle_model || "",
        }))
      );
    }

    setLoading(false);
  };

  // Unit helpers
  const addUnit = () => {
    setEditableUnits([
      ...editableUnits,
      { unit_type: "flat", unit_number: "", wing: "", floor: "", occupancy_status: "self_occupied" },
    ]);
  };

  const removeUnit = (index: number) => {
    const unit = editableUnits[index];
    if (unit.id) {
      setDeletedUnitIds([...deletedUnitIds, unit.id]);
    }
    setEditableUnits(editableUnits.filter((_, i) => i !== index));
  };

  const updateUnit = (index: number, field: string, value: string) => {
    const updated = [...editableUnits];
    updated[index] = { ...updated[index], [field]: value };
    setEditableUnits(updated);
  };

  // Vehicle helpers
  const twoWheelerCount = editableVehicles.filter((v) => v.vehicle_type === "two_wheeler").length;
  const fourWheelerCount = editableVehicles.filter((v) => v.vehicle_type === "four_wheeler").length;

  const addVehicle = (type: "two_wheeler" | "four_wheeler") => {
    if (type === "two_wheeler" && twoWheelerCount >= 3) {
      toast({ title: "Limit Reached", description: "Maximum 3 two-wheelers allowed.", variant: "destructive" });
      return;
    }
    if (type === "four_wheeler" && fourWheelerCount >= 2) {
      toast({ title: "Limit Reached", description: "Maximum 2 four-wheelers allowed.", variant: "destructive" });
      return;
    }
    setEditableVehicles([
      ...editableVehicles,
      { vehicle_type: type, vehicle_number: "", vehicle_make: "", vehicle_model: "" },
    ]);
  };

  const removeVehicle = (index: number) => {
    const vehicle = editableVehicles[index];
    if (vehicle.id) {
      setDeletedVehicleIds([...deletedVehicleIds, vehicle.id]);
    }
    setEditableVehicles(editableVehicles.filter((_, i) => i !== index));
  };

  const updateVehicle = (index: number, field: string, value: string) => {
    const updated = [...editableVehicles];
    updated[index] = { ...updated[index], [field]: value };
    setEditableVehicles(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate profile
    const profileResult = profileSchema.safeParse({ member_name: memberName, contact_number: contactNumber });
    if (!profileResult.success) {
      const fieldErrors: Record<string, string> = {};
      profileResult.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Validate units
    if (editableUnits.length === 0) {
      setErrors({ units: "At least one unit is required" });
      return;
    }

    for (let i = 0; i < editableUnits.length; i++) {
      const unitResult = unitSchema.safeParse(editableUnits[i]);
      if (!unitResult.success) {
        const fieldErrors: Record<string, string> = {};
        unitResult.error.errors.forEach((err) => {
          fieldErrors[`units_${i}_${err.path[0]}`] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    // Validate vehicles
    for (let i = 0; i < editableVehicles.length; i++) {
      const vehicleResult = vehicleSchema.safeParse(editableVehicles[i]);
      if (!vehicleResult.success) {
        const fieldErrors: Record<string, string> = {};
        vehicleResult.error.errors.forEach((err) => {
          fieldErrors[`vehicles_${i}_${err.path[0]}`] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setSaving(true);

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ member_name: memberName, contact_number: contactNumber })
      .eq("id", user!.id);

    if (profileError) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
      setSaving(false);
      return;
    }

    // Delete removed units
    if (deletedUnitIds.length > 0) {
      await supabase.from("units").delete().in("id", deletedUnitIds);
    }

    // Upsert units
    for (const unit of editableUnits) {
      if (unit.id) {
        await supabase
          .from("units")
          .update({
            unit_type: unit.unit_type,
            unit_number: unit.unit_number,
            wing: unit.wing || null,
            floor: unit.floor || null,
            occupancy_status: unit.occupancy_status,
          })
          .eq("id", unit.id);
      } else {
        await supabase.from("units").insert({
          user_id: user!.id,
          unit_type: unit.unit_type,
          unit_number: unit.unit_number,
          wing: unit.wing || null,
          floor: unit.floor || null,
          occupancy_status: unit.occupancy_status,
        });
      }
    }

    // Delete removed vehicles
    if (deletedVehicleIds.length > 0) {
      await supabase.from("parking_vehicles").delete().in("id", deletedVehicleIds);
    }

    // Upsert vehicles
    for (const vehicle of editableVehicles) {
      if (vehicle.id) {
        await supabase
          .from("parking_vehicles")
          .update({
            vehicle_type: vehicle.vehicle_type,
            vehicle_number: vehicle.vehicle_number,
            vehicle_make: vehicle.vehicle_make || null,
            vehicle_model: vehicle.vehicle_model || null,
          })
          .eq("id", vehicle.id);
      } else {
        await supabase.from("parking_vehicles").insert({
          user_id: user!.id,
          vehicle_type: vehicle.vehicle_type,
          vehicle_number: vehicle.vehicle_number,
          vehicle_make: vehicle.vehicle_make || null,
          vehicle_model: vehicle.vehicle_model || null,
        });
      }
    }

    setDeletedUnitIds([]);
    setDeletedVehicleIds([]);
    toast({ title: "Profile Updated", description: "Your changes have been saved." });
    await fetchData();
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <Layout>
      <PageHeader
        title="My Profile"
        description="View and manage your profile, unit, and parking details"
      />

      <section className="py-8">
        <div className="section-container max-w-2xl mx-auto">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Profile Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    Personal Information
                  </h2>
                </div>
                {userRole && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={userRole.is_approved ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      {userRole.is_approved ? (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      ) : (
                        <Shield className="h-3.5 w-3.5" />
                      )}
                      {userRole.role === "committee_member" ? "Committee Member" : "Member"}
                    </Badge>
                    {!userRole.is_approved && (
                      <Badge variant="outline" className="text-destructive border-destructive/50">
                        Pending Approval
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-email" className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Email
                    </Label>
                    <ChangeEmailDialog currentEmail={user.email || ""} />
                  </div>
                  <Input
                    id="profile-email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-name" className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Full Name *
                  </Label>
                  <Input
                    id="profile-name"
                    placeholder="Enter your full name"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    maxLength={100}
                    required
                  />
                  {errors.member_name && (
                    <p className="text-sm text-destructive">{errors.member_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-contact" className="flex items-center gap-2">
                    <PhoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    Contact Number *
                  </Label>
                  <Input
                    id="profile-contact"
                    placeholder="+91 98765 43210"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    maxLength={15}
                    required
                  />
                  {errors.contact_number && (
                    <p className="text-sm text-destructive">{errors.contact_number}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Unit Details */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-heading font-semibold text-foreground">
                    Unit Details
                  </h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addUnit}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Unit
                </Button>
              </div>

              <div className="space-y-3">
                {editableUnits.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No units added. Click "Add Unit" to add one.
                  </p>
                )}

                {editableUnits.map((unit, index) => (
                  <div
                    key={unit.id || `new-${index}`}
                    className="p-4 border border-border rounded-lg space-y-3 bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Unit {index + 1}
                        {!unit.id && (
                          <span className="ml-2 text-xs text-primary">(New)</span>
                        )}
                      </span>
                      {editableUnits.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUnit(index)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Type *</Label>
                        <Select
                          value={unit.unit_type}
                          onValueChange={(v) => updateUnit(index, "unit_type", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flat">Flat</SelectItem>
                            <SelectItem value="shop">Shop</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Unit No. *</Label>
                        <Input
                          placeholder="e.g. 101"
                          value={unit.unit_number}
                          onChange={(e) => updateUnit(index, "unit_number", e.target.value)}
                          maxLength={20}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Wing</Label>
                        <Input
                          placeholder="e.g. A"
                          value={unit.wing}
                          onChange={(e) => updateUnit(index, "wing", e.target.value)}
                          maxLength={20}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Floor</Label>
                        <Input
                          placeholder="e.g. 1st"
                          value={unit.floor}
                          onChange={(e) => updateUnit(index, "floor", e.target.value)}
                          maxLength={10}
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs">Occupancy Status *</Label>
                        <Select
                          value={unit.occupancy_status}
                          onValueChange={(v) => updateUnit(index, "occupancy_status", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="self_occupied">Self Occupied</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                            <SelectItem value="leased">Leased</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {errors[`units_${index}_unit_number`] && (
                      <p className="text-sm text-destructive">
                        {errors[`units_${index}_unit_number`]}
                      </p>
                    )}
                  </div>
                ))}

                {errors.units && (
                  <p className="text-sm text-destructive">{errors.units}</p>
                )}
              </div>
            </div>

            {/* Parking / Vehicle Details */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                      Parking Details
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Max 3 two-wheelers &amp; 2 four-wheelers
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addVehicle("two_wheeler")}
                    disabled={twoWheelerCount >= 3}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    Two-Wheeler
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addVehicle("four_wheeler")}
                    disabled={fourWheelerCount >= 2}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    Four-Wheeler
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {editableVehicles.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No vehicles added. Use the buttons above to add parking details.
                  </p>
                )}

                {editableVehicles.map((vehicle, index) => (
                  <div
                    key={vehicle.id || `new-v-${index}`}
                    className="p-4 border border-border rounded-lg space-y-3 bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {vehicle.vehicle_type === "two_wheeler" ? "🏍️ Two-Wheeler" : "🚗 Four-Wheeler"}
                        {!vehicle.id && (
                          <span className="ml-2 text-xs text-primary">(New)</span>
                        )}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVehicle(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Vehicle Number *</Label>
                        <Input
                          placeholder="e.g. MH-02-AB-1234"
                          value={vehicle.vehicle_number}
                          onChange={(e) => updateVehicle(index, "vehicle_number", e.target.value)}
                          maxLength={20}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Make</Label>
                        <Input
                          placeholder="e.g. Honda"
                          value={vehicle.vehicle_make}
                          onChange={(e) => updateVehicle(index, "vehicle_make", e.target.value)}
                          maxLength={50}
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs">Model</Label>
                        <Input
                          placeholder="e.g. Activa / City"
                          value={vehicle.vehicle_model}
                          onChange={(e) => updateVehicle(index, "vehicle_model", e.target.value)}
                          maxLength={50}
                        />
                      </div>
                    </div>

                    {errors[`vehicles_${index}_vehicle_number`] && (
                      <p className="text-sm text-destructive">
                        {errors[`vehicles_${index}_vehicle_number`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
