"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <section className="bg-primary/5 dark:bg-primary-container/5 rounded-xl border border-primary/10 overflow-hidden relative shadow-organic py-10 px-6 sm:p-12 max-w-7xl mx-auto my-12">
      {/* Background circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="grid md:grid-cols-5 gap-8 items-center max-w-5xl mx-auto">
        <div className="md:col-span-3 text-center md:text-left">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground mb-3">
            Subscribe to our Newsletter
          </h2>
          <p className="text-secondary text-sm sm:text-base leading-relaxed">
            Get 15% off your first order, plus updates on seasonal harvests, healthy kitchen hacks, and exclusive member-only promotions.
          </p>
        </div>

        <div className="md:col-span-2">
          {status === "success" ? (
            <div className="bg-white/80 dark:bg-surface/80 border border-emerald-500/20 rounded-md p-4 flex items-start gap-3 shadow-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-sans font-bold text-sm text-foreground">Welcome to the FreshPick Family!</h4>
                <p className="text-xs text-secondary mt-0.5">Please check your inbox. Your 15% discount code has been sent!</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
                className="flex-grow px-5 py-3 rounded-full bg-surface border border-border-color/50 focus:outline-none focus:border-primary text-sm shadow-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container/90 transition-all duration-300 disabled:opacity-70 group"
              >
                <span>{status === "loading" ? "Subscribing..." : "Subscribe"}</span>
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
