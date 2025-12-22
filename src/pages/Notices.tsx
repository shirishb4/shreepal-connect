import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { NoticeCard } from "@/components/NoticeCard";

const notices = [
  {
    title: "Annual General Meeting Notice 2024-25",
    date: "20 December 2024",
    excerpt: "Notice is hereby given that the Annual General Meeting of the Society will be held on Sunday, 5th January 2025 at 10:00 AM in the society premises.",
    isNew: true,
  },
  {
    title: "Water Tank Cleaning Scheduled",
    date: "15 December 2024",
    excerpt: "The overhead water tank cleaning is scheduled for 22nd December 2024. Water supply will be affected from 8:00 AM to 2:00 PM.",
    isNew: true,
  },
  {
    title: "Maintenance Payment Reminder",
    date: "10 December 2024",
    excerpt: "Members are requested to clear all pending maintenance dues by 31st December 2024 to avoid late payment charges.",
    isNew: false,
  },
  {
    title: "Lift Maintenance Notice",
    date: "05 December 2024",
    excerpt: "Annual maintenance of lifts will be carried out on 15th December 2024. Lifts will be non-operational from 9:00 AM to 5:00 PM.",
    isNew: false,
  },
  {
    title: "New Security Measures Implemented",
    date: "01 December 2024",
    excerpt: "New security protocols have been implemented including visitor registration and vehicle entry passes. Please cooperate with security personnel.",
    isNew: false,
  },
  {
    title: "Diwali Celebration Guidelines",
    date: "25 October 2024",
    excerpt: "Guidelines for Diwali celebrations in the society premises. Crackers are prohibited within the society compound for safety reasons.",
    isNew: false,
  },
  {
    title: "Parking Space Allocation Notice",
    date: "15 October 2024",
    excerpt: "Updated parking space allocations have been finalized. Members can collect their new parking stickers from the society office.",
    isNew: false,
  },
  {
    title: "GBM Minutes - September 2024",
    date: "20 September 2024",
    excerpt: "Minutes of the General Body Meeting held on 15th September 2024 are now available for members to review.",
    isNew: false,
  },
];

export default function Notices() {
  return (
    <Layout>
      <PageHeader
        title="Notices & Announcements"
        description="Stay updated with the latest society notices and announcements"
      />

      <section className="py-12 md:py-16">
        <div className="section-container">
          {/* Latest Notices */}
          <div className="space-y-4">
            {notices.map((notice, index) => (
              <div
                key={notice.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <NoticeCard {...notice} />
              </div>
            ))}
          </div>

          {/* Archive Note */}
          <div className="mt-12 p-6 bg-secondary rounded-xl text-center">
            <p className="text-muted-foreground">
              Looking for older notices? Please visit the{" "}
              <a href="/documents" className="text-accent hover:underline font-medium">
                Documents
              </a>{" "}
              section for archived circulars and notices.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
