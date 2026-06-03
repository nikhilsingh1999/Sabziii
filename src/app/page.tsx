"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
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
  Clock3,
  MapPin,
  BadgeCheck,
  IndianRupee,
} from "lucide-react";
import {
  HeroBannerSkeleton,
  CategoriesRowSkeleton,
  ProductGridSkeleton,
} from "@/components/Skeletons";

/* ------------------------------------------------------------------ */
/*  Shared UI helpers                                                  */
/* ------------------------------------------------------------------ */
type SectionHeaderProps = {
  eyebrow?: string;
  eyebrowIcon?: React.ElementType;
  title: React.ReactNode;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  accent?: "primary" | "tertiary" | "amber";
};

const accentMap = {
  primary: {
    pill: "text-primary bg-primary/10 border-primary/15",
    link: "text-primary hover:bg-primary/5 border-primary/20",
  },
  tertiary: {
    pill: "text-tertiary bg-tertiary/10 border-tertiary/20",
    link: "text-tertiary hover:bg-tertiary/10 border-tertiary/30",
  },
  amber: {
    pill: "text-amber-600 bg-amber-400/10 border-amber-400/25",
    link: "text-amber-700 hover:bg-amber-400/10 border-amber-400/30",
  },
};

function SectionHeader({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  subtitle,
  href,
  linkLabel,
  align = "left",
  accent = "primary",
}: SectionHeaderProps) {
  const a = accentMap[accent];
  const isCenter = align === "center";

  return (
    <div
      className={[
        "flex flex-col gap-4",
        isCenter
          ? "items-center text-center max-w-2xl mx-auto"
          : "sm:flex-row sm:justify-between sm:items-end",
      ].join(" ")}
    >
      <div className={isCenter ? "space-y-3" : "space-y-3 max-w-2xl"}>
        {eyebrow && (
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${a.pill}`}
          >
            {EyebrowIcon && <EyebrowIcon className="w-3.5 h-3.5" />}
            {eyebrow}
          </span>
        )}
        <h2 className="font-sans font-extrabold text-2xl sm:text-4xl tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && <p className="text-secondary text-sm sm:text-base leading-relaxed">{subtitle}</p>}
      </div>

      {href && linkLabel && (
        <Link
          href={href}
          className={`font-sans text-sm font-bold inline-flex items-center justify-center gap-1.5 group px-4 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap active:scale-[0.98] ${a.link}`}
        >
          <span>{linkLabel}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}

function PageSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`space-y-7 sm:space-y-9 ${className}`}>{children}</section>;
}

function ProductRow({ products }: { products: any[] }) {
  return (
    <>
      <div className="sm:hidden -mx-4 px-4 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start shrink-0 w-[calc(50%-0.375rem)] min-w-[148px] rounded-3xl transition-transform duration-200 active:scale-[0.99]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-organic-hover"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
}

function getImageSrc(item: any) {
  return (
    item?.image ||
    item?.imageUrl ||
    item?.thumbnail ||
    item?.coverImage ||
    item?.images?.[0] ||
    "/placeholder.png"
  );
}

function CategoryTile({ category }: { category: any }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group snap-start shrink-0 w-[92px] sm:w-auto flex flex-col items-center gap-3 rounded-3xl p-2.5 sm:p-4 transition-all duration-300 hover:bg-surface hover:shadow-organic active:scale-[0.98]"
    >
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-surface border border-border-color/40 shadow-sm transition-all duration-300 group-hover:shadow-organic group-hover:border-primary/25">
        <Image
          src={getImageSrc(category)}
          alt={category.name || "Fresh category"}
          fill
          sizes="(max-width: 640px) 80px, 112px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <span className="font-sans font-bold text-[13px] sm:text-sm text-foreground text-center leading-tight line-clamp-2">
        {category.name}
      </span>
    </Link>
  );
}

function TrustStrip() {
  const items = [
    { icon: Leaf, label: "Farm Fresh Daily" },
    { icon: Clock3, label: "Next Morning Delivery" },
    { icon: MapPin, label: "Locally Sourced" },
    { icon: ShieldCheck, label: "Quality Assured" },
  ];

  return (
    <section className="-mt-4 sm:-mt-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 bg-surface border border-border-color/40 rounded-2xl px-3.5 py-3 sm:px-4 sm:py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-organic"
            >
              <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </span>
              <span className="font-sans text-xs sm:text-sm font-bold text-foreground leading-snug">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  const { products, categories } = useApp();

  if (products.length === 0 || categories.length === 0) {
    return (
      <div className="space-y-14 sm:space-y-16 pb-12 text-left">
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

  const featuredProducts = products.filter((p) => p.isPopular).slice(0, 8);
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  const seasonalProducts = products.filter((p) => p.isSeasonal).slice(0, 8);
  const displaySeasonal = seasonalProducts.length > 0 ? seasonalProducts : products.slice(4, 12);

  const newArrivals = products.slice(0, 8);
  const trending = products.slice(8, 16).length > 0 ? products.slice(8, 16) : products.slice(0, 8);
  const promoImages = products.slice(0, 3);

  const features = [
    {
      icon: Leaf,
      title: "Farm Fresh Produce",
      desc: "Fresh vegetables and fruits picked with care and delivered at their best texture and taste.",
    },
    {
      icon: BadgeCheck,
      title: "Quality Checked",
      desc: "Every basket is checked for freshness, ripeness, and quality before it reaches your home.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Reliable next morning delivery designed around daily cooking and family grocery routines.",
    },
    {
      icon: IndianRupee,
      title: "Affordable Pricing",
      desc: "Premium daily produce with fair pricing, clean packaging, and no unnecessary markups.",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Bhopal",
      rating: 5,
      comment:
        "The spinach, tomatoes, and fruits always arrive fresh. It genuinely feels like a more reliable way to buy daily produce.",
      avatar: "P",
    },
    {
      id: 2,
      name: "Arjun Mehta",
      location: "Indore",
      rating: 5,
      comment:
        "Clean packaging, good pricing, and the delivery timing is very convenient for morning meal prep.",
      avatar: "A",
    },
    {
      id: 3,
      name: "Meera Nair",
      location: "Bhopal",
      rating: 5,
      comment:
        "The quality is consistent. I like that the produce looks natural, fresh, and not over-polished like supermarket stock.",
      avatar: "M",
    },
  ];

  return (
    <div className="pb-16 sm:pb-20">
      <div className="space-y-12  ">
        <HeroCarousel />

        <TrustStrip />

        <PageSection>
          <SectionHeader
            eyebrow="Categories"
            eyebrowIcon={Sparkles}
            title="Explore Fresh Categories"
            subtitle="Browse vegetables, fruits, and daily essentials arranged for quick discovery."
            href="/categories"
            linkLabel="View All"
            accent="primary"
          />

          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5 overflow-x-auto sm:overflow-visible overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-4 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((category) => (
                <CategoryTile key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </PageSection>

        <PageSection>
          <SectionHeader
            eyebrow="Products"
            eyebrowIcon={Leaf}
            title="Fresh Picks For Today"
            subtitle="Handpicked products delivered fresh every morning."
            href="/shop"
            linkLabel="See All"
            accent="primary"
          />
          <ProductRow products={displayFeatured} />
        </PageSection>

        <PageSection>
          <SectionHeader
            eyebrow="Just In"
            eyebrowIcon={Sparkles}
            title="New Arrivals"
            subtitle="Recently added produce for fresh meals, snacks, juices, and everyday cooking."
            href="/shop?filter=new"
            linkLabel="See All"
            accent="tertiary"
          />
          <ProductRow products={newArrivals} />
        </PageSection>

       <section className="rounded-[2rem] bg-surface border border-border-color/40 p-5 sm:p-8 lg:p-10 shadow-sm">
  <div className="space-y-7 sm:space-y-10">
    <SectionHeader
      eyebrow="Why Choose Us"
      eyebrowIcon={ShieldCheck}
      title="Freshness You Can Trust"
      subtitle="A cleaner grocery experience focused on quality, transparency, and dependable delivery."
      align="center"
      accent="primary"
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border-color/40 bg-background px-3.5 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-organic sm:px-5 sm:py-6"
          >
            {/* Soft background decoration */}
            <div className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-primary/10 blur-2xl transition-all duration-300 group-hover:bg-primary/15" />

            <div className="relative flex flex-col items-center">
              {/* Icon badge */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white sm:h-14 sm:w-14">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <h3 className="font-sans text-sm font-bold leading-snug text-foreground sm:text-base">
                {feature.title}
              </h3>

              <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-secondary sm:text-sm">
                {feature.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

        <PageSection className="rounded-[2rem] border border-tertiary/20 bg-tertiary/5 p-5 sm:p-8 lg:p-10">
          <SectionHeader
            eyebrow="Limited Season"
            eyebrowIcon={Sparkles}
            title="Fresh Seasonal Harvests"
            subtitle="Sourced at their nutritional peak. Enjoy limited-time seasonal picks while they are at their best."
            href="/shop?filter=seasonal"
            linkLabel="View Specials"
            accent="tertiary"
          />
          <ProductRow products={displaySeasonal} />
        </PageSection>

        <PageSection>
          <SectionHeader
            eyebrow="Trending Now"
            eyebrowIcon={TrendingUp}
            title="Most Loved Picks"
            subtitle="The vegetables, fruits, and essentials customers are adding to their baskets right now."
            href="/shop?filter=trending"
            linkLabel="See All"
            accent="amber"
          />
          <ProductRow products={trending} />
        </PageSection>

         <section className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-8 text-white border border-primary/20 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
  {/* Background glow elements */}
  <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-black/15 blur-3xl" />
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_35%)]" />

  <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
    {/* Content */}
    <div className="max-w-xl space-y-6">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
        <Leaf className="h-3.5 w-3.5" />
        Morning Freshness
      </span>

      <div className="space-y-4">
        <h2 className="font-sans text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Fresh Vegetables Delivered Every Morning
        </h2>

        <p className="max-w-lg text-sm leading-7 text-white/85 sm:text-base">
          Build your daily basket with farm-fresh vegetables, fruits, and daily essentials — packed cleanly, delivered quickly, and always fresh.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/shop"
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
        >
          Start Shopping
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
          <span className="h-2 w-2 rounded-full bg-white" />
          Next-day delivery between 6-10 AM 
        </div>
      </div>

      {/* Small trust badges */}
      <div className="grid max-w-md grid-cols-3 gap-3 pt-2">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-md">
          <p className="text-lg font-extrabold">100%</p>
          <p className="text-[11px] text-white/75">Fresh Picks</p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-md">
          <p className="text-lg font-extrabold">6-10 AM</p>
          <p className="text-[11px] text-white/75">Next Day Delivery</p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-md">
          <p className="text-lg font-extrabold">Clean</p>
          <p className="text-[11px] text-white/75">Packed Items</p>
        </div>
      </div>
    </div>

    {/* Image collage */}
    <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[390px]">
      {promoImages.length > 0 ? (
        <div className="absolute inset-0 grid grid-cols-3 gap-3 sm:gap-4">
          {promoImages.slice(0, 3).map((product, index) => (
            <div
              key={product.id || index}
              className={`group relative overflow-hidden rounded-[1.6rem] border border-white/25 bg-white/10 shadow-2xl shadow-black/15 backdrop-blur-md ${
                index === 0
                  ? "mb-10"
                  : index === 1
                  ? "mt-10"
                  : "mb-4 mt-5"
              }`}
            >
              <Image
                src={getImageSrc(product)}
                alt={product.name || "Fresh produce"}
                fill
                sizes="(max-width: 1024px) 30vw, 240px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

              {product.name && (
                <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 px-3 py-2 text-primary shadow-lg backdrop-blur-md">
                  <p className="line-clamp-1 text-xs font-bold">
                    {product.name}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 rounded-[1.8rem] border border-white/20 bg-white/10 backdrop-blur-md" />
      )}

      {/* Floating card */}
      <div className="absolute -bottom-3 left-4 rounded-2xl border border-white/20 bg-white/95 px-4 py-3 text-primary shadow-xl sm:left-8">
        <p className="text-xs font-bold uppercase tracking-wider text-primary/60">
          Today’s Basket
        </p>
        <p className="text-sm font-extrabold">Fresh & Handpicked</p>
      </div>
    </div>
  </div>
</section>

        <PageSection>
          <SectionHeader
            eyebrow="Testimonials"
            eyebrowIcon={Quote}
            title="Loved By Everyday Families"
            subtitle="Real feedback from customers who care about freshness, delivery, and quality."
            align="center"
            accent="primary"
          />

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="group bg-surface rounded-3xl p-6 border border-border-color/40 shadow-sm flex flex-col justify-between gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-organic"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-primary/30" />
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">“{test.comment}”</p>
                </div>

                <div className="flex items-center gap-3 pt-5 border-t border-border-color/30">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-sans font-bold flex items-center justify-center text-sm border border-primary/15">
                    {test.avatar}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-foreground">{test.name}</h4>
                    <p className="text-xs text-secondary font-medium">{test.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        <Newsletter />
      </div>
    </div>
  );
}
