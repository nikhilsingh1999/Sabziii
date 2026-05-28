"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Recycle, 
  Star 
} from "lucide-react";

export default function Home() {
  const { products, categories } = useApp();

  // Get featured products (isPopular: true)
  const featuredProducts = products.filter((p) => p.isPopular).slice(0, 4);

  // Get seasonal products (isSeasonal: true)
  const seasonalProducts = products.filter((p) => p.isSeasonal).slice(0, 4);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Home Chef & Mom",
      rating: 5,
      comment: "The quality of organic spinach and tomatoes is unmatched. It feels like I just picked them from my own backyard! Delivery was incredibly fast, within 2 hours.",
      avatar: "P"
    },
    {
      id: 2,
      name: "Arjun Mehta",
      role: "Fitness Coach",
      rating: 5,
      comment: "Finding fresh purple asparagus and dragon fruit in the city used to be a hassle. FreshPick exotic range is fresh and reasonably priced. Strongly recommend!",
      avatar: "A"
    },
    {
      id: 3,
      name: "Meera Nair",
      role: "Healthy Living Advocate",
      rating: 5,
      comment: "I love their commitment to plastic-free bio-packaging. The produce arrives in beautiful eco-friendly bags and everything is extremely fresh. A complete game-changer.",
      avatar: "M"
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="grid lg:grid-cols-12 gap-8 items-center bg-primary/5 dark:bg-primary-container/5 rounded-xl border border-primary/10 p-6 sm:p-10 lg:p-12 overflow-hidden relative shadow-organic">
        <div className="lg:col-span-7 z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary dark:text-primary-container font-sans text-xs font-bold rounded-full uppercase tracking-wider border border-primary/20">
            🌱 100% Organic & Farm Fresh
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight text-foreground">
            Taste the Fresh Difference — Farm to Table in <span className="text-primary">Hours</span>
          </h1>
          <p className="text-secondary text-base sm:text-lg leading-relaxed max-w-xl">
            Sustainably grown fruits and vegetables by local organic farms, delivered straight to your doorstep. Experience nutrient-rich produce that stays fresh longer.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link 
              href="/shop" 
              className="px-6 py-3.5 rounded-full bg-primary text-white text-sm font-bold flex items-center gap-2 shadow-md hover:bg-primary-container/90 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Shop Fresh Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/categories" 
              className="px-6 py-3.5 rounded-full bg-surface text-foreground hover:bg-surface-hover text-sm font-bold flex items-center gap-2 shadow-sm border border-border-color/30 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Browse Categories</span>
            </Link>
          </div>
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-color/20 max-w-md">
            <div>
              <p className="text-2xl font-extrabold text-primary">25+</p>
              <p className="text-xs text-secondary font-medium">Local Farms</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-primary">100%</p>
              <p className="text-xs text-secondary font-medium">Pesticide Free</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-primary">&lt; 3 Hr</p>
              <p className="text-xs text-secondary font-medium">Express Delivery</p>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="lg:col-span-5 relative w-full h-72 sm:h-96 lg:h-full min-h-[300px] flex items-center justify-center">
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-organic border border-border-color/10">
            <Image
              src="/images/fresh_produce_hero.png"
              alt="Vibrant heap of fresh organic produce"
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
              Explore Our Categories
            </h2>
            <p className="text-secondary text-sm">
              Carefully curated fresh organic harvests sorted for your convenience.
            </p>
          </div>
          <Link 
            href="/categories" 
            className="text-primary hover:text-primary-container font-sans text-sm font-bold flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
              Featured Best Sellers
            </h2>
            <p className="text-secondary text-sm">
              Our customers' favorite fresh organic produce this week.
            </p>
          </div>
          <Link 
            href="/shop" 
            className="text-primary hover:text-primary-container font-sans text-sm font-bold flex items-center gap-1 group"
          >
            <span>See All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why Choose Us marketing grid */}
      <section className="grid md:grid-cols-3 gap-8 pt-8">
        
        <div className="bg-surface rounded-lg p-6 border border-border-color/30 text-center flex flex-col items-center gap-4 shadow-organic hover:shadow-organic-hover transition-all duration-300">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-lg text-foreground">Express 3-Hour Delivery</h3>
          <p className="text-secondary text-sm leading-relaxed">
            From the field to your doorstep in under three hours. We maintain a cold chain process to ensure optimum crispness and nutrient preservation.
          </p>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-border-color/30 text-center flex flex-col items-center gap-4 shadow-organic hover:shadow-organic-hover transition-all duration-300">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-lg text-foreground">Certified 100% Organic</h3>
          <p className="text-secondary text-sm leading-relaxed">
            Every product is sourced from verified organic growers who practice regenerative farming. Zero chemicals, zero synthetic pesticides, pure nature.
          </p>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-border-color/30 text-center flex flex-col items-center gap-4 shadow-organic hover:shadow-organic-hover transition-all duration-300">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <Recycle className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-lg text-foreground">Eco-Friendly Packaging</h3>
          <p className="text-secondary text-sm leading-relaxed">
            We love our planet as much as we love clean food. All deliveries are packed in 100% biodegradable and zero-waste starch bags or recycled crates.
          </p>
        </div>

      </section>

      {/* Seasonal Harvest Specials */}
      <section className="bg-tertiary/5 dark:bg-tertiary/10 rounded-xl border border-tertiary/10 p-6 sm:p-10 shadow-accent space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <span className="inline-block text-xs font-bold uppercase text-tertiary tracking-wider px-2 py-0.5 bg-tertiary/10 rounded mb-2">
              Limited Season
            </span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
              Fresh Seasonal Harvests
            </h2>
            <p className="text-secondary text-sm">
              Sourced at their nutritional peak. Enjoy these limited-time seasonal treasures.
            </p>
          </div>
          <Link 
            href="/shop?filter=seasonal" 
            className="text-tertiary hover:text-tertiary-container font-sans text-sm font-bold flex items-center gap-1 group"
          >
            <span>View All Specials</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {seasonalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
            What Our Customers Say
          </h2>
          <p className="text-secondary text-sm">
            Read real feedback from families, chefs, and health-conscious food lovers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div 
              key={test.id} 
              className="bg-surface rounded-lg p-6 border border-border-color/30 shadow-organic hover:shadow-organic-hover flex flex-col justify-between gap-4 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-foreground text-sm italic leading-relaxed">
                  "{test.comment}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-border-color/10 mt-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-sans font-bold flex items-center justify-center text-sm shadow-inner">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-foreground">{test.name}</h4>
                  <p className="text-xs text-secondary/70 font-medium">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

    </div>
  );
}
