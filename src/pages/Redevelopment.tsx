import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { CommitteeMemberCard } from "@/components/CommitteeMemberCard";
import rcLogo from "@/assets/rc-logo.png";

const redevelopmentMembers = [
  {
    name: "Mr. Sanjay Apte",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. Rajendra Hirlekar",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. Nitin Upasani",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. Sanjay Jadhav",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. Sameer Ghanvatkar",
    designation: "Committee Member",
    phone: "",
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
          {/* Logo Section */}
          <div className="flex justify-center mb-10">
            <img src={rcLogo} alt="Redevelopment Committee" className="w-48 h-48 rounded-xl object-cover shadow-lg" />
          </div>

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
