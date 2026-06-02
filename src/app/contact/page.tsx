"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim() || !email.includes("@")) newErrors.email = "Valid email is required";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!message.trim() || message.length < 10) newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-12 animate-fade-in">
      
      {/* Title */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
          Get in Touch
        </span>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-foreground">
          Contact Sabziii Support
        </h1>
        <p className="text-secondary text-sm leading-relaxed">
          Questions about delivery areas, subscription boxes, or interested in farming partnerships? Send us a message!
        </p>
      </section>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact details cards */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface p-6 border border-border-color/30 rounded-lg shadow-organic space-y-6">
            <h2 className="font-sans font-extrabold text-base text-foreground border-b border-border-color/20 pb-3">
              Support Information
            </h2>

            <ul className="space-y-4">
              <li className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-sans font-bold text-foreground">Customer Care</h4>
                  <p className="text-secondary/80 mt-0.5">+91 98765 43210</p>
                  <p className="text-secondary/60 mt-0.5">Toll-free line for immediate assistance</p>
                </div>
              </li>

              <li className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-sans font-bold text-foreground">Email Support</h4>
                  <p className="text-secondary/80 mt-0.5">support@sabziii.com</p>
                  <p className="text-secondary/60 mt-0.5">Response within 12 business hours</p>
                </div>
              </li>

              <li className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-sans font-bold text-foreground">Support Hours</h4>
                  <p className="text-secondary/80 mt-0.5">Monday - Sunday</p>
                  <p className="text-secondary/60 mt-0.5">7:00 AM to 8:00 PM IST</p>
                </div>
              </li>

              <li className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-sans font-bold text-foreground">HQ Office Address</h4>
                  <p className="text-secondary/80 mt-0.5">12 Organic Farm Road,</p>
                  <p className="text-secondary/60 mt-0.5">Green Valley, Gurgaon - 122003</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>

        {/* Contact Form area */}
        <div className="lg:col-span-8 bg-surface p-6 sm:p-8 border border-border-color/30 rounded-lg shadow-organic">
          {status === "success" ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <h3 className="font-sans font-extrabold text-xl text-foreground">Inquiry Sent Successfully!</h3>
              <p className="text-secondary text-sm max-w-md mx-auto">
                Thank you for reaching out to us. One of our farm support specialists will get in touch with you shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-full shadow"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleMessageSubmit} className="space-y-4">
              <h2 className="font-sans font-extrabold text-base text-foreground border-b border-border-color/20 pb-3">
                Send an Inquiry Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Nikhil Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={status === "loading"}
                    className={`w-full px-4 py-2.5 rounded border ${errors.name ? "border-red-500" : "border-border-color/50"} bg-surface focus:outline-none focus:border-primary text-sm`}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="nikhil@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    className={`w-full px-4 py-2.5 rounded border ${errors.email ? "border-red-500" : "border-border-color/50"} bg-surface focus:outline-none focus:border-primary text-sm`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label htmlFor="subject" className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="e.g. Inquiring about partnership or organic farming"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={status === "loading"}
                  className={`w-full px-4 py-2.5 rounded border ${errors.subject ? "border-red-500" : "border-border-color/50"} bg-surface focus:outline-none focus:border-primary text-sm`}
                />
                {errors.subject && <p className="text-[10px] text-red-500 font-bold">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Detailed Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Write your questions or notes here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={status === "loading"}
                  className={`w-full px-4 py-2.5 rounded border ${errors.message ? "border-red-500" : "border-border-color/50"} bg-surface focus:outline-none focus:border-primary text-sm`}
                />
                {errors.message && <p className="text-[10px] text-red-500 font-bold">{errors.message}</p>}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-3 rounded-full bg-primary text-white text-sm font-bold flex items-center gap-2 shadow hover:bg-primary-container disabled:opacity-70 transition-all duration-300"
                >
                  <span>{status === "loading" ? "Sending inquiry..." : "Send Message"}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
