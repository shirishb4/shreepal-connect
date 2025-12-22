import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { MapPin, Mail, Phone, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: "Near Aradhana Cinema, Panchpakhadi, Thane – 400 602, Maharashtra",
  },
  {
    icon: Mail,
    title: "Email",
    content: "shreepalcomplexchsltd@gmail.com",
    href: "mailto:shreepalcomplexchsltd@gmail.com",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+91 98190 68803",
    href: "tel:+919819068803",
  },
  {
    icon: Clock,
    title: "Office Hours",
    content: "Mon - Sat: 10:00 AM - 1:00 PM & 5:00 PM - 8:00 PM",
  },
];

export default function Contact() {
  return (
    <Layout>
      <PageHeader
        title="Contact Us"
        description="Get in touch with the society office for any queries or assistance"
      />

      <section className="py-12 md:py-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-heading text-foreground mb-6">
                Society Office
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:text-accent transition-colors"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-muted rounded-xl h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-2" />
                  <p>Map location</p>
                  <p className="text-sm">Near Aradhana Cinema, Panchpakhadi</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-heading text-foreground mb-6">
                Send a Message
              </h2>
              
              <form className="space-y-6 bg-card p-6 rounded-xl border border-border">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flat">Flat Number</Label>
                    <Input id="flat" placeholder="e.g., A-101" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is this regarding?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your query or concern..."
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>

              <p className="mt-4 text-sm text-muted-foreground text-center">
                We typically respond within 2-3 working days.
              </p>
            </div>
          </div>

          {/* Committee Quick Contact */}
          <div className="mt-16 p-6 bg-secondary rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-6 w-6 text-accent" />
              <h3 className="font-heading font-bold text-foreground">
                Need Immediate Assistance?
              </h3>
            </div>
            <p className="text-muted-foreground">
              For urgent matters, please contact the Managing Committee directly.
              Visit the{" "}
              <a href="/committee" className="text-accent hover:underline font-medium">
                Committee page
              </a>{" "}
              for their contact details.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
