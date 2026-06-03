"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Eye, Lock, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "collection",
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us when registering an account, updating your profile, placing orders, or contacting customer care. This includes your name, email address, physical delivery address(es), and mobile phone number. If you authenticate using Google Sign-In, we collect your basic profile details (name, email, profile photo) as authorized by Google."
    },
    {
      id: "usage",
      title: "2. How We Use Your Information",
      content: "We use the collected information strictly to process, validate, and deliver your orders; schedule morning drop-offs; manage your user profile and saved addresses; and verify admin credentials. We may also use your contact details to send transaction invoices or respond to support requests. We do not use your personal information for unsolicited marketing or spam."
    },
    {
      id: "sharing",
      title: "3. Information Sharing & Disclosure",
      content: "We do not sell, rent, trade, or share your personal information with third-party advertisers or external marketing organizations. Your delivery details (name, address, phone number) are only shared with our local dispatch and delivery staff to execute order delivery. We may disclose your information if required to comply with Indian laws or protect legal rights."
    },
    {
      id: "security",
      title: "4. Data Security",
      content: "We implement robust security measures to safeguard your personal data. All user account metadata and order histories are stored securely on Google Firebase Firestore database using secure authorization rules. Payment details are processed using encrypted transaction channels. However, no electronic transmission or storage method is 100% secure, and we cannot guarantee absolute data security."
    },
    {
      id: "user-rights",
      title: "5. Your Rights & Controls",
      content: "You have full access and control over your personal information. You can log into your dashboard profile to edit your name, update your active phone number, or add and delete saved delivery addresses at any time. If you wish to delete your account or wipe your order history, you can submit an account deletion request by emailing support@sabziii.com."
    },
    {
      id: "cookies",
      title: "6. Cookies & Tracking Technologies",
      content: "We use cookies to maintain your login session state, store items inside your local shopping basket, and compile anonymous website usage traffic analytics. You can configure your web browser to block or refuse cookies, but some components of the Sabziii website (such as checkout and cart persistency) may not function properly as a result."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-10 animate-fade-in text-left">
      
      {/* Back button */}
      <div>
        <Link 
          href="/" 
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border-color/30 bg-surface px-4 py-2 text-sm font-semibold text-secondary transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <section className="space-y-4 border-b border-border-color/20 pb-8">
        <div className="inline-flex items-center gap-2 text-primary bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Trust</span>
        </div>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-foreground">
          Privacy Policy
        </h1>
        <p className="text-secondary text-sm">
          Last Updated: June 3, 2026. Your privacy and trust are our highest priorities.
        </p>
      </section>

      {/* Core Privacy Details */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <aside className="md:col-span-4 hidden md:block sticky top-24 bg-surface p-5 border border-border-color/30 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-sans font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border-color/10 pb-2">
            <Eye className="w-4 h-4 text-primary" />
            <span>Table of Contents</span>
          </h3>
          <ul className="space-y-2.5 text-xs">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a 
                  href={`#${sec.id}`}
                  className="block text-secondary hover:text-primary transition-colors font-medium"
                >
                  {sec.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Contents */}
        <main className="md:col-span-8 space-y-8 bg-surface border border-border-color/30 rounded-2xl p-6 sm:p-8 shadow-sm">
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24 space-y-3">
              <h2 className="font-sans font-extrabold text-base sm:text-lg text-foreground border-b border-border-color/10 pb-2">
                {sec.title}
              </h2>
              <p className="text-secondary text-sm leading-relaxed">
                {sec.content}
              </p>
            </section>
          ))}

          {/* Operator Details */}
          <section className="mt-10 pt-8 border-t border-border-color/20 space-y-4">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3.5 items-start">
              <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1.5">
                <h4 className="font-sans font-bold text-foreground">Data Controller & Contact</h4>
                <p className="text-secondary leading-relaxed">
                  This website is created, maintained, and managed by <b>Bytebuster Tech</b> (represented by <b>Nikhil Singh</b>).
                </p>
                <div className="pt-2 grid gap-2 text-secondary/90 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>Bhopal, Madhya Pradesh, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>+91 9131753246</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>support@sabziii.com</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
      </div>

    </div>
  );
}
