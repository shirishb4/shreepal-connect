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
import { User, Save, Plus, Trash2, Loader2, Mail, Phone as PhoneIcon, Home } from "lucide-react";
import { ChangeEmailDialog } from "@/components/ChangeEmailDialog";
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
});

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Editable state
  const [memberName, setMemberName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [editableUnits, setEditableUnits] = useState<
    { id?: string; unit_type: "flat" | "shop" | "commercial"; unit_number: string; wing: string; floor: string }[]
  >([]);

  // Track which units were deleted
  const [deletedUnitIds, setDeletedUnitIds] = useState<string[]>([]);

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
    const [profileRes, unitsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase.from("units").select("*").eq("user_id", user!.id).order("created_at"),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setMemberName(profileRes.data.member_name);
      setContactNumber(profileRes.data.contact_number);
    }

    if (unitsRes.data) {
      setUnits(unitsRes.data);
      setEditableUnits(
        unitsRes.data.map((u) => ({
          id: u.id,
          unit_type: u.unit_type,
          unit_number: u.unit_number,
          wing: u.wing || "",
          floor: u.floor || "",
        }))
      );
    }

    setLoading(false);
  };

  const addUnit = () => {
    setEditableUnits([
      ...editableUnits,
      { unit_type: "flat", unit_number: "", wing: "", floor: "" },
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
      const { error: deleteError } = await supabase
        .from("units")
        .delete()
        .in("id", deletedUnitIds);
      if (deleteError) {
        console.error("Failed to delete units:", deleteError);
      }
    }

    // Upsert existing + insert new units
    for (const unit of editableUnits) {
      if (unit.id) {
        // Update existing
        await supabase
          .from("units")
          .update({
            unit_type: unit.unit_type,
            unit_number: unit.unit_number,
            wing: unit.wing || null,
            floor: unit.floor || null,
          })
          .eq("id", unit.id);
      } else {
        // Insert new
        await supabase.from("units").insert({
          user_id: user!.id,
          unit_type: unit.unit_type,
          unit_number: unit.unit_number,
          wing: unit.wing || null,
          floor: unit.floor || null,
        });
      }
    }

    setDeletedUnitIds([]);
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
        description="View and manage your profile and unit details"
      />

      <section className="py-8">
        <div className="section-container max-w-2xl mx-auto">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Profile Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  Personal Information
                </h2>
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
