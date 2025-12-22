import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { EmergencyContactCard } from "@/components/EmergencyContactCard";
import {
  Flame,
  Stethoscope,
  Shield,
  Zap,
  Droplets,
  Building,
  Phone,
  AlertTriangle,
} from "lucide-react";

const emergencyContacts = [
  {
    icon: Flame,
    title: "Fire Brigade",
    number: "101",
    description: "Thane Fire Station - Available 24/7",
    variant: "highlight" as const,
  },
  {
    icon: Stethoscope,
    title: "Ambulance / Medical Emergency",
    number: "102",
    description: "Government Ambulance Service",
    variant: "highlight" as const,
  },
  {
    icon: Shield,
    title: "Police Station",
    number: "100",
    description: "Panchpakhadi Police Station",
    variant: "highlight" as const,
  },
  {
    icon: Zap,
    title: "Electricity Emergency (MSEDCL)",
    number: "1912",
    description: "MSEDCL Thane Division - Power outages & electrical emergencies",
  },
  {
    icon: Droplets,
    title: "Water Supply Emergency",
    number: "022-2534 5678",
    description: "Thane Municipal Corporation Water Department",
  },
  {
    icon: Building,
    title: "Nearby Hospital",
    number: "022-2536 1234",
    description: "Jupiter Hospital, Thane - 24/7 Emergency Services",
  },
  {
    icon: Phone,
    title: "Society Office",
    number: "022-2540 1234",
    description: "Shreepal Complex Society Office",
  },
  {
    icon: AlertTriangle,
    title: "Disaster Management",
    number: "1077",
    description: "National Disaster Management Helpline",
  },
];

export default function Emergency() {
  return (
    <Layout>
      <PageHeader
        title="Emergency Contacts"
        description="Important emergency numbers for quick access during emergencies"
      />

      {/* Important Notice */}
      <section className="bg-emergency/10 border-b border-emergency/20 py-4">
        <div className="section-container">
          <div className="flex items-center justify-center gap-3 text-center">
            <AlertTriangle className="h-5 w-5 text-emergency" />
            <p className="text-foreground font-medium">
              In case of emergency, call the relevant number immediately. Stay calm and provide clear information.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="section-container">
          {/* Primary Emergency Numbers */}
          <div className="mb-12">
            <h2 className="text-xl font-heading text-foreground mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-emergency rounded-full"></span>
              Primary Emergency Numbers
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {emergencyContacts.slice(0, 3).map((contact) => (
                <EmergencyContactCard key={contact.title} {...contact} />
              ))}
            </div>
          </div>

          {/* Other Emergency Contacts */}
          <div>
            <h2 className="text-xl font-heading text-foreground mb-6">
              Other Important Contacts
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {emergencyContacts.slice(3).map((contact) => (
                <EmergencyContactCard key={contact.title} {...contact} />
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-12 p-6 bg-card rounded-xl border border-border">
            <h3 className="font-heading font-bold text-foreground mb-4">
              Emergency Preparedness Tips
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Save these numbers in your phone for quick access
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Know the location of fire extinguishers in your building
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Keep a first-aid kit handy at home
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Familiarize yourself with emergency exits and assembly points
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}
