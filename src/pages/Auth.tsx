import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Plus, Trash2, LogIn, UserPlus } from "lucide-react";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const unitSchema = z.object({
  unit_type: z.enum(["flat", "shop", "commercial"], { required_error: "Select unit type" }),
  unit_number: z.string().trim().min(1, "Unit number is required").max(20),
  wing: z.string().trim().max(20).optional(),
  floor: z.string().trim().max(10).optional(),
  occupancy_status: z.enum(["self_occupied", "rented", "leased"]),
});

const signupSchema = z.object({
  member_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  contact_number: z.string().trim().min(10, "Enter a valid contact number").max(15),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["member", "committee_member"]),
  units: z.array(unitSchema).min(1, "Add at least one unit"),
});

interface UnitEntry {
  unit_type: "flat" | "shop" | "commercial";
  unit_number: string;
  wing: string;
  floor: string;
  occupancy_status: "self_occupied" | "rented" | "leased";
}

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = useCallback((seconds: number) => {
    setCooldown(seconds);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [memberName, setMemberName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [role, setRole] = useState<"member" | "committee_member">("member");
  const [units, setUnits] = useState<UnitEntry[]>([
    { unit_type: "flat", unit_number: "", wing: "", floor: "", occupancy_status: "self_occupied" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addUnit = () => {
    setUnits([...units, { unit_type: "flat", unit_number: "", wing: "", floor: "", occupancy_status: "self_occupied" }]);
  };

  const removeUnit = (index: number) => {
    if (units.length > 1) {
      setUnits(units.filter((_, i) => i !== index));
    }
  };

  const updateUnit = (index: number, field: keyof UnitEntry, value: string) => {
    const updated = [...units];
    updated[index] = { ...updated[index], [field]: value };
    setUnits(updated);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[`login_${err.path[0]}`] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Welcome back!", description: "You have been logged in successfully." });
      navigate("/");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      member_name: memberName,
      contact_number: contactNumber,
      email: signupEmail,
      password: signupPassword,
      role,
      units,
    };

    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join("_");
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          member_name: memberName,
          contact_number: contactNumber,
          role: role,
          units: units.map((unit) => ({
            unit_type: unit.unit_type,
            unit_number: unit.unit_number,
            wing: unit.wing || "",
            floor: unit.floor || "",
            occupancy_status: unit.occupancy_status,
          })),
        },
      },
    });

    if (error) {
      const isRateLimit = error.message?.toLowerCase().includes("rate limit") || error.status === 429;
      if (isRateLimit) {
        startCooldown(60);
      }
      toast({
        title: isRateLimit ? "Too Many Attempts" : "Signup Failed",
        description: isRateLimit
          ? "Email rate limit exceeded. Please wait 60 seconds before trying again."
          : error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Account Created!",
      description: "Please check your email to verify your account.",
    });
    setLoading(false);
    setActiveTab("login");
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="section-container max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-9 w-9 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-heading text-foreground">
              Member Portal
            </h1>
            <p className="text-muted-foreground mt-2">
              Login or register as a society member
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* LOGIN TAB */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                    {errors.login_email && (
                      <p className="text-sm text-destructive">{errors.login_email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    {errors.login_password && (
                      <p className="text-sm text-destructive">{errors.login_password}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <ForgotPasswordDialog />
                    <Button type="submit" className="ml-auto" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* SIGNUP TAB */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-5">
                   {/* Role Selection */}
                  <div className="space-y-2">
                    <Label>I am registering as</Label>
                    <Select value={role} onValueChange={(v: "member" | "committee_member") => setRole(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="committee_member">Committee Member</SelectItem>
                      </SelectContent>
                    </Select>
                    {role === "committee_member" && (
                      <p className="text-sm text-destructive bg-muted border border-border rounded-md p-2">
                        ⚠️ Committee Member role requires admin approval. Until approved, you will have standard Member access only.
                      </p>
                    )}
                  </div>

                  {/* Personal Details */}
                  <div className="space-y-2">
                    <Label htmlFor="member-name">Full Name *</Label>
                    <Input
                      id="member-name"
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
                    <Label htmlFor="contact-number">Contact Number *</Label>
                    <Input
                      id="contact-number"
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

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {/* Unit Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Unit Details *</Label>
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

                    {units.map((unit, index) => (
                      <div
                        key={index}
                        className="p-4 border border-border rounded-lg space-y-3 bg-muted/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Unit {index + 1}
                          </span>
                          {units.length > 1 && (
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

                  <Button type="submit" className="w-full" disabled={loading || cooldown > 0}>
                    {loading
                      ? "Creating Account..."
                      : cooldown > 0
                        ? `Please wait ${cooldown}s`
                        : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
