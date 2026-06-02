"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Phone, Mail, MapPin, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border-color/30 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Logo and About Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-5">
              <div className="relative h-8 w-24 sm:h-10 sm:w-30 transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="Sabziii Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-secondary text-sm leading-relaxed mb-6 max-w-sm">
              We connect urban families with local, sustainable farms, delivering nutrient-rich organic produce straight to your kitchen. Taste the fresh difference.
            </p>
            <div className="flex space-x-4">
              {/* Simple Mock Social Icons */}
              {["Facebook", "Instagram", "Twitter", "Pinterest"].map((social) => (
                <span 
                  key={social} 
                  className="w-8 h-8 rounded-full bg-surface-hover hover:bg-primary/10 hover:text-primary border border-border-color/20 flex items-center justify-center text-xs font-semibold text-secondary cursor-pointer transition-colors duration-200"
                >
                  {social[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links Navigation */}
          <div>
            <h4 className="font-sans font-bold text-sm text-foreground uppercase tracking-wider mb-5">
              Useful Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "About Sabziii", href: "/about" },
                { name: "Browse Products", href: "/shop" },
                { name: "Special Offers", href: "/shop?filter=sale" },
                { name: "Latest Blog", href: "/blog" },
                { name: "Contact Support", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-secondary hover:text-primary text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="font-sans font-bold text-sm text-foreground uppercase tracking-wider mb-5">
              Product Categories
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Leafy Greens", href: "/shop?category=leafy-greens" },
                { name: "Fresh Vegetables", href: "/shop?category=vegetables" },
                { name: "Sweet Fruits", href: "/shop?category=fruits" },
                { name: "Exotic Produce", href: "/shop?category=exotics" },
                { name: "Browse All", href: "/categories" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-secondary hover:text-primary text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-sans font-bold text-sm text-foreground uppercase tracking-wider mb-5">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-secondary text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>12 Organic Farm Road, Green Valley, IND</span>
              </li>
              <li className="flex gap-3 text-secondary text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-3 text-secondary text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>support@sabziii.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright and payment types */}
        <div className="border-t border-border-color/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary/80 text-xs text-center md:text-left flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} Sabziii. All rights reserved. Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span>for healthy dining.</span>
          </p>

          <div className="flex items-center gap-2">
            {["Visa", "MasterCard", "UPI", "Rupay", "COD"].map((pay) => (
              <span 
                key={pay} 
                className="px-2 py-1 bg-surface-hover text-secondary border border-border-color/20 rounded font-sans text-[10px] font-bold"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
