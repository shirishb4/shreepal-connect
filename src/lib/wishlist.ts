import { z } from "zod";
import sections from "./redevelopment-wishlist.json";

export { sections };
export const views = ["Agree", "Disagree", "Need clarification", "Not applicable"] as const;
export type Answer = { view: string; preference: string; remarks: string };
export type Answers = Record<string, Answer>;
export const memberSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  unit: z.string().trim().min(1, "Enter your flat or commercial unit number.").max(40),
  contact: z.string().trim().regex(/^\+?[0-9 ()-]{10,20}$/, "Enter a valid contact number."),
  area: z.string().trim().max(40),
  priorities: z.array(z.string().trim().max(300)).length(5),
  other: z.string().trim().max(3000),
});
export type MemberDetails = z.infer<typeof memberSchema>;
export const disclaimer = "This wishlist is member feedback for discussion and feasibility assessment—not approval, a commitment, offer acceptance or a final specification. All expectations remain subject to legal and technical review, applicable permissions and the Society’s due process.";
export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] ?? char));
}
export function buildWishlistDocument(member: MemberDetails, answers: Answers) {
  const e = escapeHtml;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Shreepal Member Wishlist</title></head><body><h1>SHREEPAL COMPLEX CHSL</h1><h2>REDEVELOPMENT EXPECTATIONS &amp; MEMBER WISHLIST</h2><p>${e(disclaimer)}</p><p>Member: ${e(member.name)} | Unit: ${e(member.unit)} | Contact: ${e(member.contact)}</p><p>Existing carpet area: ${e(member.area || "Not provided")} | Date: ${new Date().toLocaleDateString("en-IN")}</p>${sections.map(s => `<h2>${e(s.id)}. ${e(s.title)}</h2><table border="1" cellpadding="8"><thead><tr><th>Expectation</th><th>Proposed minimum / reference</th><th>Member view</th><th>Preference</th><th>Alternative / remarks</th></tr></thead><tbody>${s.items.map(i => { const a = answers[i.id]; return `<tr><td>${e(i.title)}</td><td>${e(i.proposal)}</td><td>${e(a?.view || "Not answered")}</td><td>${e(a?.preference || "—")}</td><td>${e(a?.remarks || "—")}</td></tr>`; }).join("")}</tbody></table>`).join("")}<h2>Top five priorities</h2><ol>${member.priorities.map(p => `<li>${e(p || "Not provided")}</li>`).join("")}</ol><h2>Other expectations</h2><p>${e(member.other || "None provided")}</p><p>Member signature: ____________________ Date: ____________________</p><p>${e(disclaimer)}</p><p>This downloaded copy has not been submitted to the committee.</p></body></html>`;
}