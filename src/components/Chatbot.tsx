import { useState } from "react";
import { MessageCircle, X, Send, ChevronRight, Home, FileText, Users, Phone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  options?: QuickOption[];
}

interface QuickOption {
  label: string;
  action: string;
  icon?: React.ComponentType<{ className?: string }>;
  link?: string;
}

const initialOptions: QuickOption[] = [
  { label: "About Society", action: "about", icon: Home, link: "/about" },
  { label: "Committee Members", action: "committee", icon: Users, link: "/committee" },
  { label: "Documents", action: "documents", icon: FileText, link: "/documents" },
  { label: "Emergency Contacts", action: "emergency", icon: Phone, link: "/emergency" },
  { label: "Common FAQs", action: "faqs", icon: HelpCircle },
];

const faqOptions: QuickOption[] = [
  { label: "How to pay maintenance?", action: "faq_maintenance" },
  { label: "Parking rules", action: "faq_parking" },
  { label: "Guest registration", action: "faq_guest" },
  { label: "Redevelopment updates", action: "faq_redevelopment", link: "/redevelopment" },
  { label: "Report a complaint", action: "faq_complaint" },
  { label: "← Back to main menu", action: "main" },
];

const responses: Record<string, { text: string; options?: QuickOption[] }> = {
  greeting: {
    text: "👋 Namaste! Welcome to Shreepal Complex CHS Ltd. I'm here to help you with society-related queries. How can I assist you today?",
    options: initialOptions,
  },
  about: {
    text: "🏢 Shreepal Complex CHS Ltd. was registered on 01.08.1996 (Regn. No.: T.N.A/H.S.G./T.C./8189/96-97). We're located near Aradhana Cinema, Panchpakhadi, Thane – 400 602. Visit our About page for more details!",
    options: [{ label: "View About Page", action: "link", link: "/about" }, ...initialOptions.filter(o => o.action !== "about")],
  },
  committee: {
    text: "👥 Our Managing Committee oversees society operations. View the complete list of committee members with their designations and contact details.",
    options: [{ label: "View Committee", action: "link", link: "/committee" }, ...initialOptions.filter(o => o.action !== "committee")],
  },
  documents: {
    text: "📄 Access important society documents including bylaws, meeting minutes, financial statements, and notices. All documents are available for download.",
    options: [{ label: "View Documents", action: "link", link: "/documents" }, ...initialOptions.filter(o => o.action !== "documents")],
  },
  emergency: {
    text: "🚨 For emergencies:\n• Fire: 101\n• Ambulance: 102\n• Police: 100\n\nVisit our Emergency page for complete contact list including hospitals, plumbers, and electricians.",
    options: [{ label: "View All Contacts", action: "link", link: "/emergency" }, ...initialOptions.filter(o => o.action !== "emergency")],
  },
  faqs: {
    text: "❓ Here are some frequently asked questions. Select one to learn more:",
    options: faqOptions,
  },
  faq_maintenance: {
    text: "💰 **Maintenance Payment Options:**\n\n1. **UPI/Bank Transfer** - Society account details available at the office\n2. **Cheque** - Payable to 'Shreepal Complex CHS Ltd.'\n3. **Cash** - At society office during working hours\n\n📅 Due date: 10th of every month\n⚠️ Late fee: As per society bylaws",
    options: faqOptions,
  },
  faq_parking: {
    text: "🚗 **Parking Rules:**\n\n• Each flat is allocated one parking slot\n• Visitor parking in designated areas only\n• No parking in fire lanes or common passages\n• Two-wheelers to be parked in designated areas\n• Contact committee for parking allotment issues",
    options: faqOptions,
  },
  faq_guest: {
    text: "🏠 **Guest Registration:**\n\n• Inform security about expected guests\n• Long-term guests (>7 days) must be registered with society office\n• Maintain entry in visitor register\n• Tenants must complete NOC process",
    options: faqOptions,
  },
  faq_redevelopment: {
    text: "🏗️ **Redevelopment Updates:**\n\nOur Redevelopment Committee is actively working on society redevelopment plans. For the latest updates, meeting minutes, and developer selection process, please visit the Redevelopment page.",
    options: [{ label: "Redevelopment Page", action: "link", link: "/redevelopment" }, ...faqOptions.filter(o => o.action !== "faq_redevelopment")],
  },
  faq_complaint: {
    text: "📝 **To Register a Complaint:**\n\n1. Submit written complaint to society office\n2. Email: shreepalcomplexchsltd@gmail.com\n3. Contact any committee member directly\n4. Use society notice board for community issues\n\nAll complaints are addressed in monthly meetings.",
    options: faqOptions,
  },
  main: {
    text: "How else can I help you?",
    options: initialOptions,
  },
  default: {
    text: "I appreciate your question! For specific queries, please contact our society office or email us at shreepalcomplexchsltd@gmail.com. In the meantime, here are some quick options:",
    options: initialOptions,
  },
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: responses.greeting.text, isBot: true, options: responses.greeting.options },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleOptionClick = (action: string) => {
    const response = responses[action] || responses.default;
    
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: response.text, isBot: true, options: response.options },
    ]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simple keyword matching for responses
    const lowerInput = inputValue.toLowerCase();
    let responseKey = "default";
    
    if (lowerInput.includes("maintenance") || lowerInput.includes("payment") || lowerInput.includes("pay")) {
      responseKey = "faq_maintenance";
    } else if (lowerInput.includes("parking") || lowerInput.includes("car") || lowerInput.includes("vehicle")) {
      responseKey = "faq_parking";
    } else if (lowerInput.includes("guest") || lowerInput.includes("visitor")) {
      responseKey = "faq_guest";
    } else if (lowerInput.includes("redevelop") || lowerInput.includes("construction")) {
      responseKey = "faq_redevelopment";
    } else if (lowerInput.includes("complaint") || lowerInput.includes("issue") || lowerInput.includes("problem")) {
      responseKey = "faq_complaint";
    } else if (lowerInput.includes("committee") || lowerInput.includes("member")) {
      responseKey = "committee";
    } else if (lowerInput.includes("document") || lowerInput.includes("notice") || lowerInput.includes("bylaw")) {
      responseKey = "documents";
    } else if (lowerInput.includes("emergency") || lowerInput.includes("fire") || lowerInput.includes("police") || lowerInput.includes("ambulance")) {
      responseKey = "emergency";
    } else if (lowerInput.includes("about") || lowerInput.includes("society") || lowerInput.includes("history")) {
      responseKey = "about";
    } else if (lowerInput.includes("hi") || lowerInput.includes("hello") || lowerInput.includes("namaste")) {
      responseKey = "greeting";
    }

    const response = responses[responseKey];
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: response.text, isBot: true, options: response.options },
      ]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen ? "scale-0" : "scale-100"}`}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
        style={{ height: "500px", maxHeight: "calc(100vh - 6rem)" }}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Shreepal Assistant</h3>
              <p className="text-xs text-primary-foreground/80">Society Help Desk</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.isBot
                      ? "bg-muted text-foreground rounded-tl-sm"
                      : "bg-accent text-accent-foreground rounded-tr-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  
                  {/* Quick Options */}
                  {message.isBot && message.options && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option, index) => (
                        option.link ? (
                          <Link
                            key={index}
                            to={option.link}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-xs font-medium hover:bg-secondary transition-colors"
                          >
                            {option.icon && <option.icon className="h-3.5 w-3.5" />}
                            {option.label}
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option.action)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-xs font-medium hover:bg-secondary transition-colors"
                          >
                            {option.icon && <option.icon className="h-3.5 w-3.5" />}
                            {option.label}
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-muted border-0"
            />
            <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
