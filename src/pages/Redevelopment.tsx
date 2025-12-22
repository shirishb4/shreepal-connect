import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { CommitteeMemberCard } from "@/components/CommitteeMemberCard";

const redevelopmentMembers = [
  {
    name: "Mr. Ashok Verma",
    designation: "Chairman - Redevelopment",
    phone: "+91 98201 11111",
    email: "redevelopment@shreepalcomplex.com",
  },
  {
    name: "Mr. Sunil Patil",
    designation: "Coordinator",
    phone: "+91 98202 22222",
  },
  {
    name: "Mrs. Meera Joshi",
    designation: "Member",
    phone: "+91 98203 33333",
  },
  {
    name: "Mr. Rajesh Iyer",
    designation: "Member",
    phone: "+91 98204 44444",
  },
  {
    name: "Mr. Deepak Shah",
    designation: "Member",
    phone: "+91 98205 55555",
  },
];

export default function Redevelopment() {
  return (
    <Layout>
      <PageHeader
        title="Redevelopment Committee"
        description="Committee members overseeing the society redevelopment project"
      />

      <section className="py-12 md:py-16">
        <div className="section-container">
          {/* Committee Members */}
          <div className="mb-12">
            <h2 className="text-xl font-heading text-foreground mb-6">
              Committee Members
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {redevelopmentMembers.map((member) => (
                <CommitteeMemberCard key={member.name} {...member} />
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mt-12 p-6 bg-secondary rounded-xl">
            <p className="text-muted-foreground text-center">
              <strong className="text-foreground">Note:</strong> For any queries related to redevelopment, 
              please contact the Redevelopment Committee Chairman or Coordinator directly.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
