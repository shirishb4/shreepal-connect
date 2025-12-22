import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { CommitteeMemberCard } from "@/components/CommitteeMemberCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

          {/* Redevelopment Committee Link */}
          <div className="mt-12 p-6 bg-primary/10 rounded-xl border border-primary/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-heading font-semibold text-foreground">Redevelopment Committee</h3>
                <p className="text-muted-foreground mt-1">View our dedicated redevelopment committee members</p>
              </div>
              <Link
                to="/redevelopment"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                View Committee
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-6 bg-secondary rounded-xl">
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
