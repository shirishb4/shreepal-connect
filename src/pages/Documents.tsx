import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { DocumentCard } from "@/components/DocumentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const documents = {
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
    { title: "Society Bye-Laws (Updated 2023)", category: "Bye-Laws", date: "01 Jan 2023" },
    { title: "Maintenance Rules & Guidelines", category: "Rules", date: "15 Mar 2022" },
    { title: "Parking Regulations", category: "Rules", date: "01 Jan 2022" },
    { title: "Pet Policy", category: "Rules", date: "01 Jan 2022" },
  ],
};

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
                    {key === "gbm" ? "General Body Meeting" : key === "agm" ? "Annual General Meeting" : key === "bylaws" ? "Bye-Laws & Rules" : key}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {docs.map((doc) => (
                      <DocumentCard key={doc.title} {...doc} downloadUrl="#" />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="gbm">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.gbm.map((doc) => (
                  <DocumentCard key={doc.title} {...doc} downloadUrl="#" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="agm">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.agm.map((doc) => (
                  <DocumentCard key={doc.title} {...doc} downloadUrl="#" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="circulars">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.circulars.map((doc) => (
                  <DocumentCard key={doc.title} {...doc} downloadUrl="#" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="audit">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.audit.map((doc) => (
                  <DocumentCard key={doc.title} {...doc} downloadUrl="#" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bylaws">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.bylaws.map((doc) => (
                  <DocumentCard key={doc.title} {...doc} downloadUrl="#" />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Note */}
          <div className="mt-12 p-6 bg-secondary rounded-xl">
            <p className="text-muted-foreground text-center">
              <strong className="text-foreground">Note:</strong> All documents are in PDF format.
              If you have trouble accessing any document, please contact the society office.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
