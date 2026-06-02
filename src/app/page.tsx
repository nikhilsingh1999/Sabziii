"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { HeroCarousel } from "@/components/HeroCarousel";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Recycle,
  Star,
  Sparkles,
  Quote,
  Leaf,
  TrendingUp,
  Zap,
} from "lucide-react";
import { HeroBannerSkeleton, CategoriesRowSkeleton, ProductGridSkeleton } from "@/components/Skeletons";

/* ------------------------------------------------------------------ */
/*  Reusable Section Header                                            */
/* ------------------------------------------------------------------ */
type SectionHeaderProps = {
  eyebrow?: string;
  eyebrowIcon?: React.ElementType;
  title: React.ReactNode;
  subtitle?: string;
  href: string;
  linkLabel: string;
  accent?: "primary" | "tertiary" | "amber";
};

const accentMap = {
  primary: {
    pill: "text-primary bg-primary/10",
    link: "text-primary hover:bg-primary/5 border-primary/20",
  },
  tertiary: {
    pill: "text-tertiary bg-tertiary/10",
    link: "text-tertiary hover:bg-tertiary/10 border-tertiary/30",
  },
  amber: {
    pill: "text-amber-500 bg-amber-400/10",
    link: "text-amber-600 hover:bg-amber-400/10 border-amber-400/30",
  },
};

function SectionHeader({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  subtitle,
  href,
  linkLabel,
  accent = "primary",
}: SectionHeaderProps) {
  const a = accentMap[accent];
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
      <div className="space-y-2">
        {eyebrow && (
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${a.pill}`}
          >
            {EyebrowIcon && <EyebrowIcon className="w-3 h-3" />}
            {eyebrow}
          </span>
        )}
        <h2 className="font-sans font-extrabold text-2xl sm:text-4xl tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && <p className="text-secondary text-sm max-w-md">{subtitle}</p>}
      </div>
      <Link
        href={href}
        className={`font-sans text-sm font-bold flex items-center gap-1.5 group px-4 py-2 rounded-full border transition-all whitespace-nowrap ${a.link}`}
      >
        <span>{linkLabel}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable Product Row                                               */
/*  Mobile: horizontal scroll, exactly 2 cards per viewport           */
/*  Desktop (sm+): normal responsive grid                             */
/* ------------------------------------------------------------------ */
function ProductRow({ products }: { products: any[] }) {
  return (
    <>
      {/* Mobile: horizontal snap-scroll, 2 cards visible */}
      <div className="sm:hidden -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start shrink-0 w-[calc(50%-0.5rem)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  const { products, categories } = useApp();

  // Show skeletons if store data is empty (e.g., initial mount loading)
  if (products.length === 0 || categories.length === 0) {
    return (
      <div className="space-y-16 pb-12 text-left">
        <HeroBannerSkeleton />
        <section className="space-y-6">
          <div className="h-8 w-64 bg-slate-200 rounded-full animate-pulse" />
          <CategoriesRowSkeleton count={4} />
        </section>
        <section className="space-y-6">
          <div className="h-8 w-48 bg-slate-200 rounded-full animate-pulse" />
          <ProductGridSkeleton count={4} />
        </section>
      </div>
    );
  }

  // Featured (popular)
  const featuredProducts = products.filter((p) => p.isPopular).slice(0, 8);
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  // Seasonal
  const seasonalProducts = products.filter((p) => p.isSeasonal).slice(0, 8);
  const displaySeasonal = seasonalProducts.length > 0 ? seasonalProducts : products.slice(4, 12);

  // New Arrivals (latest by id / fallback slice)
  const newArrivals = products.slice(0, 8);

  // Top Picks / Trending (anything not already obviously surfaced — simple fallback)
  const trending = products.slice(8, 16).length > 0 ? products.slice(8, 16) : products.slice(0, 8);

  const features = [
    {
      icon: Truck,
      title: "Express 3-Hour Delivery",
      desc: "From the field to your doorstep in under three hours. We maintain a cold chain process to ensure optimum crispness and nutrient preservation.",
    },
    {
      icon: ShieldCheck,
      title: "Certified 100% Organic",
      desc: "Every product is sourced from verified organic growers who practice regenerative farming. Zero chemicals, zero synthetic pesticides, pure nature.",
    },
    {
      icon: Recycle,
      title: "Eco-Friendly Packaging",
      desc: "We love our planet as much as we love clean food. All deliveries are packed in 100% biodegradable and zero-waste starch bags or recycled crates.",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Home Chef & Mom",
      rating: 5,
      comment:
        "The quality of organic spinach and tomatoes is unmatched. It feels like I just picked them from my own backyard! Delivery was incredibly fast, within 2 hours.",
      avatar: "P",
    },
    {
      id: 2,
      name: "Arjun Mehta",
      role: "Fitness Coach",
      rating: 5,
      comment:
        "Finding fresh purple asparagus and dragon fruit in the city used to be a hassle. Sabziii exotic range is fresh and reasonably priced. Strongly recommend!",
      avatar: "A",
    },
    {
      id: 3,
      name: "Meera Nair",
      role: "Healthy Living Advocate",
      rating: 5,
      comment:
        "I love their commitment to plastic-free bio-packaging. The produce arrives in beautiful eco-friendly bags and everything is extremely fresh. A complete game-changer.",
      avatar: "M",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Quick trust strip */}
      <section className="grid grid-cols-3 gap-3 sm:gap-6 -mt-6">
        {[
          { icon: Zap, label: "3-Hr Delivery" },
          { icon: Leaf, label: "100% Organic" },
          { icon: Recycle, label: "Eco Packaging" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-center gap-2 bg-surface border border-border-color/30 rounded-2xl py-3 px-2 shadow-organic"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-foreground">{item.label}</span>
            </div>
          );
        })}
      </section>

      {/* Categories */}
      <section className="space-y-7">
        <SectionHeader
          eyebrow="Shop by Category"
          eyebrowIcon={Sparkles}
          title={
            <>
              Explore Our{" "}
              <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                Categories
              </span>
            </>
          }
          subtitle="Carefully curated fresh organic harvests sorted for your convenience."
          href="/categories"
          linkLabel="View All"
          accent="primary"
        />
        <div className="flex sm:grid overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 scrollbar-thin">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Best Sellers */}
      <section className="space-y-7">
        <SectionHeader
          eyebrow="Top Rated"
          eyebrowIcon={Star}
          title={
            <>
              Featured{" "}
              <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                Best Sellers
              </span>
            </>
          }
          subtitle="Our customers' favorite fresh organic produce this week."
          href="/shop"
          linkLabel="See All"
          accent="amber"
        />
        <ProductRow products={displayFeatured} />
      </section>

      {/* New Arrivals */}
      <section className="space-y-7">
        <SectionHeader
          eyebrow="Just In"
          eyebrowIcon={Sparkles}
          title={
            <>
              Fresh{" "}
              <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                New Arrivals
              </span>
            </>
          }
          subtitle="Hand-picked additions to our farm-fresh collection."
          href="/shop?filter=new"
          linkLabel="See All"
          accent="primary"
        />
        <ProductRow products={newArrivals} />
      </section>

      {/* Why Choose Us */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-surface to-tertiary/5 border border-border-color/30 p-7 sm:p-12">
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-tertiary/10 rounded-full blur-3xl" />

        <div className="relative text-center max-w-xl mx-auto space-y-2 mb-10">
          <h2 className="font-sans font-extrabold text-2xl sm:text-4xl tracking-tight text-foreground">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              Sabziii
            </span>
          </h2>
          <p className="text-secondary text-sm">
            Freshness, sustainability, and trust delivered with every single order.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group bg-surface/80 backdrop-blur-sm rounded-2xl p-7 border border-border-color/40 text-center flex flex-col items-center gap-4 shadow-organic hover:shadow-organic-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-sans font-bold text-lg text-foreground">{feature.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Seasonal Specials */}
      <section className="relative overflow-hidden bg-gradient-to-br from-tertiary/10 via-tertiary/5 to-transparent rounded-3xl border border-tertiary/20 p-6 sm:p-12 shadow-accent space-y-7">
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative">
          <SectionHeader
            eyebrow="Limited Season"
            eyebrowIcon={Sparkles}
            title={
              <>
                Fresh Seasonal <span className="text-tertiary">Harvests</span>
              </>
            }
            subtitle="Sourced at their nutritional peak. Enjoy these limited-time seasonal treasures."
            href="/shop?filter=seasonal"
            linkLabel="View Specials"
            accent="tertiary"
          />
        </div>
        <div className="relative">
          <ProductRow products={displaySeasonal} />
        </div>
      </section>

      {/* Trending Now */}
      <section className="space-y-7">
        <SectionHeader
          eyebrow="Trending Now"
          eyebrowIcon={TrendingUp}
          title={
            <>
              Most{" "}
              <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
                Loved Picks
              </span>
            </>
          }
          subtitle="What everyone's adding to their baskets right now."
          href="/shop?filter=trending"
          linkLabel="See All"
          accent="primary"
        />
        <ProductRow products={trending} />
      </section>

      {/* Promo banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-tertiary p-8 sm:p-14 text-center shadow-accent">
        <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative space-y-4 max-w-lg mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 text-white">
            <Sparkles className="w-3 h-3" /> First Order Offer
          </span>
          <h2 className="font-sans font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Get 20% Off Your First Basket
          </h2>
          <p className="text-white/80 text-sm">
            Fresh, organic, and delivered in hours. Use code{" "}
            <span className="font-bold text-white">FRESH20</span> at checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
            <Quote className="w-3 h-3" /> Testimonials
          </span>
          <h2 className="font-sans font-extrabold text-2xl sm:text-4xl tracking-tight text-foreground">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-secondary text-sm">
            Read real feedback from families, chefs, and health-conscious food lovers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="group relative bg-surface rounded-2xl p-7 border border-border-color/30 shadow-organic hover:shadow-organic-hover hover:-translate-y-1 flex flex-col justify-between gap-4 transition-all duration-300 overflow-hidden"
            >
              <Quote className="absolute -top-2 -right-2 w-20 h-20 text-primary/5 fill-current rotate-12" />
              <div className="relative space-y-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-foreground text-sm italic leading-relaxed">"{test.comment}"</p>
              </div>
              <div className="relative flex items-center gap-3 pt-4 border-t border-border-color/20 mt-2">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-tertiary text-white font-sans font-bold flex items-center justify-center text-sm shadow-md shadow-primary/20">
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