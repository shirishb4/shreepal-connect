import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2, Building2, Users, FileCheck, Heart } from "lucide-react";

const objectives = [
  "Maintain and enhance common areas and facilities for all residents",
  "Ensure timely collection and transparent utilization of maintenance funds",
  "Promote harmonious living and community welfare",
  "Comply with all legal and statutory requirements under Maharashtra Cooperative Societies Act",
  "Facilitate transparent decision-making through regular General Body Meetings",
  "Address member grievances promptly and fairly",
];

const values = [
  {
    icon: Building2,
    title: "Transparency",
    description: "All financial records and decisions are shared openly with members",
  },
  {
    icon: Users,
    title: "Community",
    description: "Fostering a sense of belonging and mutual respect among residents",
  },
  {
    icon: FileCheck,
    title: "Compliance",
    description: "Adhering to all legal requirements and cooperative society norms",
  },
  {
    icon: Heart,
    title: "Member Welfare",
    description: "Prioritizing the comfort, safety, and well-being of all members",
  },
];

export default function About() {
  return (
    <Layout>
      <PageHeader
        title="About the Society"
        description="Learn about our history, objectives, and commitment to member welfare"
      />

      <section className="py-12 md:py-16">
        <div className="section-container">
          {/* History */}
          <div className="max-w-3xl">
            <h2 className="text-2xl font-heading text-foreground mb-4">
              Our History
            </h2>
            <div className="prose prose-lg text-muted-foreground">
              <p className="text-body leading-relaxed">
                Shreepal Complex Cooperative Housing Society was established on
                <strong className="text-foreground"> 1st August, 1996</strong> and is registered
                under the Maharashtra Cooperative Societies Act, 1960. Located in the
                heart of Panchpakhadi, Thane, our society has been home to numerous
                families for over two decades.
              </p>
              <p className="text-body leading-relaxed mt-4">
                Over the years, we have grown into a well-organized community with a
                strong focus on maintaining infrastructure, ensuring security, and
                fostering a spirit of cooperation among all members.
              </p>
            </div>

            {/* Registration Info */}
            <div className="mt-8 p-6 bg-secondary rounded-xl">
              <h3 className="font-heading font-bold text-foreground mb-3">
                Registration & Legal Status
              </h3>
              <div className="space-y-2 text-body">
                <p>
                  <span className="text-muted-foreground">Registration Number:</span>{" "}
                  <span className="font-semibold text-foreground">
                    T.N.A / H.S.G. / T.C. / 8189 / 96-97
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Date of Registration:</span>{" "}
                  <span className="font-semibold text-foreground">01.08.1996</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Registered Under:</span>{" "}
                  <span className="font-semibold text-foreground">
                    Maharashtra Cooperative Societies Act, 1960
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="mt-16">
            <h2 className="text-2xl font-heading text-foreground mb-6">
              Our Objectives
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {objectives.map((objective, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border"
                >
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{objective}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="mt-16">
            <h2 className="text-2xl font-heading text-foreground mb-6">
              Our Values
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-card rounded-xl border border-border p-6 text-center"
                >
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
