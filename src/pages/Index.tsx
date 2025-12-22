import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  AlertTriangle,
  Flame,
  Stethoscope,
  Shield,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const quickLinks = [
  {
    icon: Users,
    title: "Managing Committee",
    description: "View committee members and contacts",
    href: "/committee",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Access notices, minutes & bylaws",
    href: "/documents",
  },
  {
    icon: Phone,
    title: "Emergency Contacts",
    description: "Fire, Police, Hospital & more",
    href: "/emergency",
  },
  {
    icon: Mail,
    title: "Contact Us",
    description: "Reach out to the society office",
    href: "/contact",
  },
];

const emergencyQuick = [
  { icon: Flame, label: "Fire", number: "101" },
  { icon: Stethoscope, label: "Ambulance", number: "102" },
  { icon: Shield, label: "Police", number: "100" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-16 md:py-24">
        <div className="section-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <Building2 className="h-9 w-9 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading text-foreground leading-tight">
              Shreepal Complex
              <br />
              <span className="text-accent">Cooperative Housing Society</span>
            </h1>
            <p className="mt-4 text-body-lg text-muted-foreground max-w-xl">
              Welcome to our society's official website. Access important documents,
              contact information, and stay updated with the latest notices.
            </p>

            {/* Registration Details */}
            <div className="mt-8 p-5 bg-card rounded-xl border border-border inline-block">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Registration Details
              </p>
              <p className="text-foreground font-semibold">
                Regn. No.: T.N.A / H.S.G. / T.C. / 8189 / 96-97
              </p>
              <p className="text-muted-foreground">
                Date of Registration: 01.08.1996
              </p>
            </div>

            {/* Address */}
            <div className="mt-6 flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-accent" />
              <span>
                Near Aradhana Cinema, Panchpakhadi, Thane – 400 602, Maharashtra
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Quick Access */}
      <section className="bg-emergency/5 border-y border-emergency/20 py-6">
        <div className="section-container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-emergency" />
              <span className="font-semibold text-foreground">
                Emergency Numbers:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {emergencyQuick.map((item) => (
                <a
                  key={item.label}
                  href={`tel:${item.number}`}
                  className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border hover:border-emergency/50 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-emergency" />
                  <span className="font-medium">{item.label}:</span>
                  <span className="font-bold text-emergency">{item.number}</span>
                </a>
              ))}
              <Button asChild variant="outline" className="border-emergency text-emergency hover:bg-emergency hover:text-emergency-foreground">
                <Link to="/emergency">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 md:py-20">
        <div className="section-container">
          <h2 className="text-2xl md:text-3xl font-heading text-foreground mb-8">
            Quick Access
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.href} to={link.href} className="quick-link group">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <link.icon className="h-6 w-6 text-secondary-foreground group-hover:text-accent-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {link.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading text-foreground mb-6">
              About Our Society
            </h2>
            <p className="text-body text-muted-foreground mb-8">
              Shreepal Complex Cooperative Housing Society was established in 1996
              with a commitment to providing a safe, well-maintained, and harmonious
              living environment for all its members. We operate with transparency
              and prioritize the welfare of our residents.
            </p>
            <Button asChild>
              <Link to="/about">
                Learn More About Us
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
