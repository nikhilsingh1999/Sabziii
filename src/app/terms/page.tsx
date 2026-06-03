"use client";

import React from "react";
import Link from "next/link";
import { Scale, ShieldAlert, FileText, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function TermsAndConditions() {
  const sections = [
    {
      id: "agreement",
      title: "1. Agreement to Terms",
      content: "Welcome to Sabziii. By accessing our website, purchasing products, or using our services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services. These terms apply to all visitors, users, and customers of Sabziii."
    },
    {
      id: "accounts",
      title: "2. Customer Accounts & Registration",
      content: "When registering on Sabziii, you must provide accurate, complete, and current information, including a valid mobile number and address. You are responsible for safeguarding the credentials of your account and for any activities or actions under your password. We reserve the right to suspend or terminate accounts that provide false information or violate these terms."
    },
    {
      id: "pricing",
      title: "3. Products, Pricing & Orders",
      content: "We make every effort to display as accurately as possible the colors, features, and details of our products. However, agricultural produce is organic and subject to natural variations. All prices are listed in Indian Rupees (INR) and are subject to change. A minimum order value of ₹200 is required to place an order. We reserve the right to refuse or cancel any order for reasons such as product unavailability, inventory issues, or errors in product pricing."
    },
    {
      id: "delivery",
      title: "4. Shipping & Delivery Policy",
      content: "We provide next-morning delivery (typically between 6:00 AM and 10:00 AM) to ensure you receive fresh harvests. Free delivery is provided on orders of ₹300 and above. Orders below ₹300 will incur a delivery charge of ₹19. Deliveries are restricted to a service radius of 3-4 km from our local dispatch center. You are responsible for ensuring someone is available to receive the delivery at the provided address and contact number."
    },
    {
      id: "cancellations",
      title: "5. Cancellations, Returns & Refunds",
      content: "Due to the perishable nature of fresh produce, order cancellations are only allowed before the dispatch stage. If you receive damaged, rotten, or incorrect items, you must report it to our customer support team (+91 9131753246) within 4 hours of delivery with photographic proof. Approved claims will be refunded to your source account or as store credits within 2-3 business days."
    },
    {
      id: "liability",
      title: "6. Limitation of Liability",
      content: "Sabziii and its operator, Bytebuster Tech, shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of, or inability to access or use, our services or fresh products."
    },
    {
      id: "governing-law",
      title: "7. Governing Law",
      content: "These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Bhopal, Madhya Pradesh."
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
          <Scale className="w-4 h-4" />
          <span>Legal Information</span>
        </div>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-foreground">
          Terms & Conditions
        </h1>
        <p className="text-secondary text-sm">
          Last Updated: June 3, 2026. Please read these terms carefully before placing orders.
        </p>
      </section>

      {/* Core Terms */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <aside className="md:col-span-4 hidden md:block sticky top-24 bg-surface p-5 border border-border-color/30 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-sans font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border-color/10 pb-2">
            <FileText className="w-4 h-4 text-primary" />
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
              <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1.5">
                <h4 className="font-sans font-bold text-foreground">Platform Operator & Contact Details</h4>
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
