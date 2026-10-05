import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { DocumentCard } from "@/components/DocumentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Scale } from "lucide-react";

interface DocumentItem {
  title: string;
  category: string;
  date: string;
  description?: string;
  source?: string;
  actionUrl?: string;
}

const documents: Record<string, DocumentItem[]> = {
  gbm: [
    { title: "GBM Notice - December 2024", category: "GBM Notice", date: "15 Dec 2024" },
    { title: "GBM Minutes - September 2024", category: "GBM Minutes", date: "20 Sep 2024" },
    { title: "GBM Notice - September 2024", category: "GBM Notice", date: "01 Sep 2024" },
  ],
  agm: [
    { title: "AGM Notice 2024-25", category: "AGM Notice", date: "01 Aug 2024" },
    { title: "AGM Minutes 2023-24", category: "AGM Minutes", date: "15 Sep 2023" },
    { title: "AGM Notice 2023-24", category: "AGM Notice", date: "01 Aug 2023" },
  ],
  circulars: [
    { title: "Water Tank Cleaning Schedule", category: "Circular", date: "10 Dec 2024" },
    { title: "Diwali Celebration Guidelines", category: "Circular", date: "25 Oct 2024" },
    { title: "Parking Rules Update", category: "Circular", date: "15 Oct 2024" },
    { title: "Maintenance Payment Reminder", category: "Circular", date: "01 Oct 2024" },
  ],
  audit: [
    { title: "Audit Report 2023-24", category: "Audit Report", date: "30 Jun 2024" },
    { title: "Audit Report 2022-23", category: "Audit Report", date: "30 Jun 2023" },
    { title: "Audit Report 2021-22", category: "Audit Report", date: "30 Jun 2022" },
  ],
  bylaws: [
    {
      title: "Maharashtra Redevelopment GR — 30 September 2026",
      category: "Latest Government Resolution",
      date: "30 Sep 2026",
      description: "Current Section 79A procedure for developer-led, self, group and cluster redevelopment. It supersedes the 4 July 2019 framework and strengthens member participation, tendering, agreements and project timelines.",
      source: "Government of Maharashtra — GR No. Sagruyo-2026/Pra.Kra.108/14-S",
      actionUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/Marathi/202609301657141847.pdf",
    },
    {
      title: "Unified Development Control & Promotion Regulations (UDCPR)",
      category: "Planning Regulations",
      date: "Updated through 30 Jan 2023",
      description: "Development controls covering permissible construction, FSI, TDR, parking, open spaces and approvals. Applicable rules and later amendments must be confirmed for the site with the local planning authority.",
      source: "MMRDA / Government of Maharashtra",
      actionUrl: "https://www.mmrda.maharashtra.gov.in/sites/default/files/2023-10/UDCPR_compressed_2.pdf",
    },
    {
      title: "Model Bye-Laws of Cooperative Housing Societies",
      category: "Bye-Laws",
      date: "2014 reference edition",
      description: "Government reference text for society governance, member rights, meetings, records and redevelopment. The society's own registered and amended bye-laws remain controlling.",
      source: "Commissioner for Cooperation, Maharashtra",
      actionUrl: "https://sahakarayukta.maharashtra.gov.in/SITE/PDF/Rules_Acts_Bylaws/Model_Bye_Laws_of_Coop_Housing_Society_New_Flatowner_Type_%282-9-14%29%20%281%29.pdf",
    },
    {
      title: "Deemed Conveyance Guidance & Online System",
      category: "Title & Conveyance",
      date: "Current government guidance",
      description: "Explains transfer of land and building title to a housing society, an important title-readiness step before redevelopment where conveyance has not been completed.",
      source: "Department of Co-operation, Maharashtra",
      actionUrl: "https://mahasahakar.maharashtra.gov.in/en/online-deemed-conveyance-management-system/",
    },
    { title: "Society Bye-Laws (Updated 2023)", category: "Bye-Laws", date: "01 Jan 2023" },
    { title: "Maintenance Rules & Guidelines", category: "Rules", date: "15 Mar 2022" },
    { title: "Parking Regulations", category: "Rules", date: "01 Jan 2022" },
    { title: "Pet Policy", category: "Rules", date: "01 Jan 2022" },
  ],
};

const categoryHeadings: Record<string, string> = {
  gbm: "General Body Meeting",
  agm: "Annual General Meeting",
  circulars: "Circulars",
  audit: "Audit Reports",
  bylaws: "Bye-Laws, Rules & Redevelopment Guidance",
};

const redevelopmentSteps = [
  "Confirm title, conveyance or deemed conveyance status, property records and encumbrances.",
  "Obtain a structural audit or competent-authority condition assessment and confirm planning eligibility.",
  "Follow the 30 September 2026 GR for the Special General Meeting, quorum, voting and video record.",
  "Select an eligible architect or PMC transparently and prepare option-wise feasibility reports under applicable UDCPR or local DCPR.",
  "Approve tender terms, invite at least three competitive bids and circulate the comparative statement to members.",
  "Select the developer through the prescribed Special General Meeting with the Registrar's authorised representative.",
  "Complete due diligence, bank guarantee terms, registered Development Agreement and individual Permanent Alternative Accommodation Agreements before vacating.",
  "Track MahaRERA registration, sanctioned plans, commencement permissions, rent and corpus obligations, construction milestones, Occupancy Certificate and final allotment.",
];

export default function Documents() {
  return (
    <Layout>
      <PageHeader
        title="Documents"
        description="Access society documents, notices, and reports"
      />

      <section className="py-12 md:py-16">
        <div className="section-container">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-8">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border border-border"
              >
                All Documents
              </TabsTrigger>
              <TabsTrigger
                value="gbm"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border border-border"
              >
                GBM
              </TabsTrigger>
              <TabsTrigger
                value="agm"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border border-border"
              >
                AGM
              </TabsTrigger>
              <TabsTrigger
                value="circulars"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border border-border"
              >
                Circulars
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border border-border"
              >
                Audit Reports
              </TabsTrigger>
              <TabsTrigger
                value="bylaws"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg border border-border"
              >
                Bye-Laws & Rules
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {Object.entries(documents).map(([key, docs]) => (
                <div key={key}>
                  <h2 className="text-lg font-heading font-bold text-foreground mb-4 capitalize">
                    {categoryHeadings[key] ?? key}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {docs.map((doc) => (
                      <DocumentCard key={doc.title} {...doc} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="gbm">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.gbm.map((doc) => (
                  <DocumentCard key={doc.title} {...doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="agm">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.agm.map((doc) => (
                  <DocumentCard key={doc.title} {...doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="circulars">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.circulars.map((doc) => (
                  <DocumentCard key={doc.title} {...doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="audit">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.audit.map((doc) => (
                  <DocumentCard key={doc.title} {...doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bylaws" className="space-y-10">
              <div>
                <div className="mb-5 max-w-3xl">
                  <h2 className="text-xl font-heading font-bold text-foreground">
                    Official references
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Use these sources to understand the governing process. Confirm the latest amendments and site-specific applicability before taking a formal decision.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.bylaws.map((doc) => (
                    <DocumentCard key={doc.title} {...doc} />
                ))}
                </div>
              </div>

              <section className="border-y border-border py-8" aria-labelledby="redevelopment-process-title">
                <div className="flex items-start gap-3">
                  <Scale className="mt-0.5 h-6 w-6 flex-shrink-0 text-accent" />
                  <div>
                    <h2 id="redevelopment-process-title" className="text-xl font-heading font-bold text-foreground">
                      Redevelopment process guide
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      A practical record checklist for the society and its members under the 2026 framework.
                    </p>
                  </div>
                </div>
                <ol className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-2">
                  {redevelopmentSteps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 border-l-4 border-accent bg-secondary p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <div>
                    <h3 className="font-semibold text-foreground">Key safeguards in the 2026 GR</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      The reported safeguards include 51% approval of total membership at key stages, at least three bids, recorded meetings, member access to records, registered accommodation agreements before vacating, and defined project timelines.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-l-4 border-emergency bg-emergency/5 p-5">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emergency" />
                  <div>
                    <h3 className="font-semibold text-foreground">Check local applicability</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Thane generally follows UDCPR, but the current consolidated text, local amendments, plot conditions and competent planning authority requirements must be confirmed for this property.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Note */}
          <div className="mt-12 p-6 bg-secondary rounded-lg">
            <p className="text-muted-foreground text-center">
              <strong className="text-foreground">Note:</strong> These references are for general information and do not replace advice from the society's advocate, architect, PMC, Registrar or planning authority.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
