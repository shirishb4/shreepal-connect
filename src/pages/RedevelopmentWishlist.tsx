import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ClipboardList, Download, AlertCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { sections, views, memberSchema, disclaimer, buildWishlistDocument, type Answers, type MemberDetails } from "@/lib/wishlist";

const emptyMember: MemberDetails = { name: "", unit: "", contact: "", area: "", priorities: ["", "", "", "", ""], other: "" };

export default function RedevelopmentWishlist() {
  const { user } = useAuth();
  const [member, setMember] = useState<MemberDetails>(emptyMember);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  useEffect(() => {
    if (!user) return;
    let active = true;
    Promise.all([
      supabase.from("profiles").select("member_name, contact_number").eq("id", user.id).maybeSingle(),
      supabase.from("units").select("unit_number, wing").eq("user_id", user.id).limit(1),
    ]).then(([profile, units]) => {
      if (!active) return;
      const unit = units.data?.[0];
      setMember(m => ({ ...m, name: m.name || profile.data?.member_name || "", contact: m.contact || profile.data?.contact_number || "", unit: m.unit || (unit ? [unit.wing, unit.unit_number].filter(Boolean).join(" / ") : "") }));
    }).catch(() => {});
    return () => { active = false; };
  }, [user]);
  const changeStep = (next: number) => {
    setError("");
    setStep(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const setDetail = (key: keyof Omit<MemberDetails, "priorities">, value: string) => setMember(m => ({ ...m, [key]: value }));
  const setAnswer = (id: string, key: "view" | "preference" | "remarks", value: string) => {
    setAnswers(a => ({ ...a, [id]: { view: "", preference: "", remarks: "", ...a[id], [key]: value } }));
    setDownloaded(false);
  };
  const answered = Object.values(answers).filter(a => a.view).length;
  const count = sections.reduce((n, s) => n + s.items.length, 0);
  const section = sections[step - 1];
  const download = () => {
    const parsed = memberSchema.safeParse(member);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || "Check your member details."); return; }
    if (!acknowledged) { setError("Please acknowledge that this is non-binding member feedback."); return; }
    const url = URL.createObjectURL(new Blob([buildWishlistDocument(parsed.data, answers)], { type: "text/html;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "Shreepal-Member-Redevelopment-Wishlist.html"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true); setError("");
  };
  return (
    <Layout>
      <section className="bg-secondary border-b border-border py-8 md:py-12">
        <div className="section-container">
          <Button asChild variant="link" className="px-0 mb-4"><Link to="/redevelopment"><ArrowLeft />Redevelopment Committee</Link></Button>
          <div className="flex items-start gap-4"><ClipboardList className="h-9 w-9 shrink-0 text-accent" /><div>
            <p className="text-sm text-muted-foreground mb-2">SHREEPAL COMPLEX CHSL • MEMBER CONSULTATION</p>
            <h1 className="font-heading text-2xl md:text-3xl text-foreground">Redevelopment Expectations &amp; Member Wishlist</h1>
            <p className="mt-4 text-sm text-muted-foreground max-w-3xl">{disclaimer}</p>
          </div></div>
        </div>
      </section>
      <div className="section-container py-8">
        <div role="status" className="flex items-start gap-3 border-l-4 border-warning bg-muted p-4 mb-8 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
          <p>Online submission is temporarily unavailable. You can complete and download your wishlist, but it will not reach the committee automatically.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside>
            <p className="font-semibold mb-3">{answered} / {count} views recorded</p>
            <nav aria-label="Questionnaire sections" className="flex flex-col gap-1">
              {["Member details", ...sections.map(s => `${s.id}. ${s.title}`), "Review & download"].map((title, n) => (
                <Button key={title} variant={step === n ? "secondary" : "ghost"} onClick={() => changeStep(n)} className="h-auto min-h-10 justify-start whitespace-normal text-left px-3 py-3 leading-snug">{title}</Button>
              ))}
            </nav>
          </aside>
          <div className="min-w-0">
            {step === 0 ? (
              <section>
                <h2 className="font-heading text-2xl mb-6">Member details</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {([{ key: "name", label: "Member name *", max: 100 }, { key: "unit", label: "Flat / commercial unit number *", max: 40 }, { key: "contact", label: "Contact number *", max: 20 }, { key: "area", label: "Existing carpet area (sq. ft., if known)", max: 40 }] as const).map(f => (
                    <div key={f.key} className="space-y-2"><Label htmlFor={f.key}>{f.label}</Label><Input id={f.key} value={member[f.key]} maxLength={f.max} onChange={e => setDetail(f.key, e.target.value)} autoComplete={f.key === "name" ? "name" : f.key === "contact" ? "tel" : "off"} /></div>
                  ))}
                </div>
                <h3 className="font-semibold mt-8 mb-4">Your top five priorities</h3>
                <div className="space-y-4">{member.priorities.map((p, i) => <div key={i} className="space-y-2"><Label htmlFor={`priority-${i}`}>Priority {i + 1}</Label><Input id={`priority-${i}`} value={p} maxLength={300} onChange={e => setMember(m => ({ ...m, priorities: m.priorities.map((v, n) => n === i ? e.target.value : v) }))} /></div>)}</div>
                <div className="mt-6 space-y-2"><Label htmlFor="other">Other expectations / alternative proposal</Label><Textarea id="other" rows={4} maxLength={3000} value={member.other} onChange={e => setDetail("other", e.target.value)} /></div>
              </section>
            ) : section ? (
              <section>
                <h2 className="font-heading text-2xl mb-6">{section.id}. {section.title}</h2>
                <div className="divide-y divide-border">{section.items.map((item, i) => (
                  <fieldset key={item.id} className="py-6 first:pt-0">
                    <legend className="font-semibold text-lg pt-4">{i + 1}. {item.title}</legend>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">{item.proposal}</p>
                    <RadioGroup aria-label={`${item.title} — member view`} value={answers[item.id]?.view || ""} onValueChange={v => setAnswer(item.id, "view", v)} className="flex flex-wrap gap-x-6 gap-y-3 mb-5">
                      {views.map(v => <div key={v} className="flex items-center gap-2"><RadioGroupItem id={`${item.id}-${v}`} value={v} /><Label htmlFor={`${item.id}-${v}`}>{v}</Label></div>)}
                    </RadioGroup>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor={`${item.id}-preference`}>Your preference / proposed minimum</Label><Textarea id={`${item.id}-preference`} rows={2} maxLength={1000} value={answers[item.id]?.preference || ""} onChange={e => setAnswer(item.id, "preference", e.target.value)} /></div>
                      <div className="space-y-2"><Label htmlFor={`${item.id}-remarks`}>Alternative / remarks</Label><Textarea id={`${item.id}-remarks`} rows={2} maxLength={1000} value={answers[item.id]?.remarks || ""} onChange={e => setAnswer(item.id, "remarks", e.target.value)} /></div>
                    </div>
                  </fieldset>
                ))}</div>
              </section>
            ) : (
              <section>
                <h2 className="font-heading text-2xl mb-6">Review &amp; download</h2>
                <dl className="grid sm:grid-cols-2 gap-4 mb-6">{[["Member", member.name], ["Unit", member.unit], ["Contact", member.contact], ["Existing carpet area", member.area]].map(([label, value]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="font-medium break-words">{value || "Not provided"}</dd></div>)}</dl>
                {sections.map(s => <details key={s.id} className="border-b border-border py-4"><summary className="cursor-pointer font-medium">{s.id}. {s.title} ({s.items.filter(i => answers[i.id]?.view).length}/{s.items.length})</summary><div className="space-y-4 pt-4">{s.items.map(i => <div key={i.id}><p className="font-medium">{i.title}: <span className="text-muted-foreground">{answers[i.id]?.view || "Not answered"}</span></p>{answers[i.id]?.preference && <p className="text-sm break-words">Preference: {answers[i.id].preference}</p>}{answers[i.id]?.remarks && <p className="text-sm break-words">Remarks: {answers[i.id].remarks}</p>}</div>)}</div></details>)}
                <h3 className="font-semibold mt-6">Top five priorities</h3><ol className="list-decimal pl-5 mt-2 space-y-2">{member.priorities.map((p, i) => <li key={i} className="break-words">{p || "Not provided"}</li>)}</ol>
                <h3 className="font-semibold mt-6">Other expectations</h3><p className="mt-2 whitespace-pre-wrap break-words">{member.other || "None provided"}</p>
                <div className="flex items-start gap-3 mt-8"><Checkbox id="acknowledge" checked={acknowledged} onCheckedChange={v => setAcknowledged(v === true)} /><Label htmlFor="acknowledge" className="leading-relaxed">I understand this is non-binding member feedback, subject to feasibility, professional review and required Society approvals.</Label></div>
                {error && <p role="alert" className="text-destructive mt-4">{error}</p>}
                <Button onClick={download} className="mt-6"><Download />Download completed wishlist</Button>
                {downloaded && <p role="status" className="text-sm mt-4 flex items-start gap-2"><Check className="h-5 w-5 shrink-0 text-accent" />Your copy has been downloaded. It has not been submitted to the committee.</p>}
              </section>
            )}
            <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-border">
              <Button variant="outline" disabled={step === 0} onClick={() => changeStep(step - 1)}><ArrowLeft />Previous</Button>
              {step < 10 && <Button onClick={() => changeStep(step + 1)}>{step === 9 ? "Review wishlist" : "Next"}<ArrowRight /></Button>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}