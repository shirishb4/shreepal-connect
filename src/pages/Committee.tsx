import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { CommitteeMemberCard } from "@/components/CommitteeMemberCard";

const committeeMembers = [
  {
    name: "Mr. Ramesh Kumar Sharma",
    designation: "Chairman",
    phone: "+91 98201 12345",
    email: "chairman@shreepalcomplex.com",
  },
  {
    name: "Mr. Suresh Patel",
    designation: "Secretary",
    phone: "+91 98202 23456",
    email: "secretary@shreepalcomplex.com",
  },
  {
    name: "Mrs. Anita Desai",
    designation: "Treasurer",
    phone: "+91 98203 34567",
    email: "treasurer@shreepalcomplex.com",
  },
  {
    name: "Mr. Vijay Mehta",
    designation: "Joint Secretary",
    phone: "+91 98204 45678",
  },
  {
    name: "Mrs. Priya Nair",
    designation: "Committee Member",
    phone: "+91 98205 56789",
  },
  {
    name: "Mr. Anil Joshi",
    designation: "Committee Member",
    phone: "+91 98206 67890",
  },
  {
    name: "Mrs. Kavita Gupta",
    designation: "Committee Member",
    phone: "+91 98207 78901",
  },
  {
    name: "Mr. Prakash Kulkarni",
    designation: "Committee Member",
    phone: "+91 98208 89012",
  },
];

export default function Committee() {
  return (
    <Layout>
      <PageHeader
        title="Managing Committee"
        description="Meet our dedicated committee members who manage the society's affairs"
      />

      <section className="py-12 md:py-16">
        <div className="section-container">
          {/* Key Members */}
          <div className="mb-12">
            <h2 className="text-xl font-heading text-foreground mb-6">
              Office Bearers
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {committeeMembers.slice(0, 3).map((member) => (
                <CommitteeMemberCard key={member.name} {...member} />
              ))}
            </div>
          </div>

          {/* Other Members */}
          <div>
            <h2 className="text-xl font-heading text-foreground mb-6">
              Committee Members
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {committeeMembers.slice(3).map((member) => (
                <CommitteeMemberCard key={member.name} {...member} />
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mt-12 p-6 bg-secondary rounded-xl">
            <p className="text-muted-foreground text-center">
              <strong className="text-foreground">Office Hours:</strong> Monday to Saturday, 10:00 AM - 1:00 PM & 5:00 PM - 8:00 PM
              <br />
              <span className="text-sm">For urgent matters, please contact the Chairman or Secretary directly.</span>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
