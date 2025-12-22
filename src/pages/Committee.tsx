import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { CommitteeMemberCard } from "@/components/CommitteeMemberCard";

const committeeMembers = [
  {
    name: "Mr. Anand Rao",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. Shirish Bhambure",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. Mayur Shah",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. K. N. Konar",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. Ashok Chaudhari",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. Dilip Mahajan",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mr. Vivek Mirgal",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mrs. Pragati Chaudhari",
    designation: "Committee Member",
    phone: "",
  },
  {
    name: "Mrs. Varsha Chaddawa",
    designation: "Committee Member",
    phone: "",
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeMembers.map((member) => (
              <CommitteeMemberCard key={member.name} {...member} />
            ))}
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
