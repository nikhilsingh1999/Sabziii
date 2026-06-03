"use client";

import React from "react";
import Image from "next/image";
import { Heart, ShieldCheck, Leaf, Sparkles } from "lucide-react";

export default function About() {
  const values = [
    {
      id: 1,
      title: "Purity & Quality Sourced",
      description: "We verify every single farm partner. All our vegetables and fruits are grown using natural fertilizers and clean, tested soil.",
      icon: ShieldCheck
    },
    {
      id: 2,
      title: "Empowering Local Farms",
      description: "By buying from us, you directly fund small-scale local agriculture. We pay our farm partners 25% above standard wholesale rates.",
      icon: Heart
    },
    {
      id: 3,
      title: "Environmental Care",
      description: "We use 100% biodegradable corn-starch packing and practice optimized delivery routing to reduce our carbon footprint.",
      icon: Leaf
    }
  ];

  const team = [
    { name: "Nikhil Singh", role: "Owner & Administrator", desc: "Manages store operations, customer services, and coordinates farm-to-table deliveries.", avatar: "NS" },
    { name: "Bytebuster Tech", role: "Platform Creator & Manager", desc: "Designed, developed, and manages the technology suite driving Sabzii catalog and orders.", avatar: "BT" },
    { name: "Dr. Anil Sharma", role: "Agricultural Advisor", desc: "A passionate botanist with 15+ years researching organic soil restoration and farming.", avatar: "AS" }
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Title Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
          Our Brand Story
        </span>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-foreground">
          Sowing the Seeds of Clean Eating
        </h1>
        <p className="text-secondary text-sm sm:text-base leading-relaxed">
          At Sabziii, we believe that healthy lives start with healthy soils. We bridge the gap between small local farms and your kitchen table.
        </p>
      </section>

      {/* Story Details and Image */}
      <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Visual Graphic */}
        <div className="lg:col-span-5 relative w-full h-80 sm:h-96 rounded-lg overflow-hidden shadow-organic border border-border-color/10">
          <Image
            src="/images/organic_farmer.png"
            alt="Organic farmer holding fresh vegetables"
            fill
            className="object-cover"
          />
        </div>

        {/* Text */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-sans font-extrabold text-2xl text-foreground">
            Born out of a simple garden project.
          </h2>
          <div className="space-y-4 text-secondary text-sm leading-relaxed">
            <p>
              In early 2025, our founder Anil noticed how difficult it was for urban families to get vegetables that weren't chemical-sprayed, cold-stored for weeks, or wrapped in multiple layers of plastic. 
            </p>
            <p>
              He teamed up with Kriti, whose family runs a generational organic farm in Haryana. Together, they designed a proprietary logistics chain that could harvest vegetables at the break of dawn, package them in compostable bags, and deliver them to city doorsteps before noon.
            </p>
            <p>
              What started as a small experimental run for 50 families has expanded into a network of 25+ verified organic farms delivering fresh, vibrant, nutrient-dense produce to thousands of households daily.
            </p>
          </div>
          
          <div className="flex gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10 items-start">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground font-semibold leading-relaxed">
              We never cold-store our vegetables for days. Everything is harvested on-demand, which preserves the high mineral and vitamin content that other supermarket foods lose during shelf storage.
            </p>
          </div>
        </div>

      </section>

      {/* Our Values */}
      <section className="space-y-8 border-t border-border-color/20 pt-16">
        <h2 className="font-sans font-extrabold text-2xl text-foreground text-center">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((val) => {
            const IconComponent = val.icon;
            return (
              <div 
                key={val.id} 
                className="bg-surface border border-border-color/30 rounded-lg p-6 shadow-organic flex flex-col gap-3.5 transition-all hover:scale-[1.02] duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-foreground">{val.title}</h3>
                <p className="text-secondary text-xs leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="space-y-8 border-t border-border-color/20 pt-16">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-sans font-extrabold text-2xl text-foreground">
            Our Farm Stewards
          </h2>
          <p className="text-secondary text-sm">
            Meet the researchers, logistics planners, and culinarians powering the Sabziii loop.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-surface rounded-lg p-6 border border-border-color/30 shadow-organic hover:shadow-organic-hover transition-all text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-sans font-bold text-lg flex items-center justify-center mx-auto shadow-inner">
                {t.avatar}
              </div>
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-base text-foreground">{t.name}</h3>
                <p className="text-xs text-primary font-semibold">{t.role}</p>
              </div>
              <p className="text-secondary text-xs leading-relaxed max-w-xs mx-auto">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
