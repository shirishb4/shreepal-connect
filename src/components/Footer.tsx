import { Link } from "react-router-dom";
import { Building2, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-container py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Society Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold">Shreepal Complex</h3>
                <p className="text-sm text-primary-foreground/80">CHS Ltd.</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Regn. No.: T.N.A / H.S.G. / T.C. / 8189 / 96-97
              <br />
              Date of Registration: 01.08.1996
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">
                  About Society
                </Link>
              </li>
              <li>
                <Link to="/committee" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">
                  Managing Committee
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">
                  Documents
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">
                  Emergency Contacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Near Aradhana Cinema, Panchpakhadi,
                  <br />
                  Thane – 400 602, Maharashtra
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:shreepalcomplexchsltd@gmail.com" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline">
                  shreepalcomplexchsltd@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+919819068803" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline">
                  +91 98190 68803
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Shreepal Complex Cooperative Housing Society Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
