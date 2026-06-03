"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { trackEvent } from "@/lib/analytics";
import { ProductDetailsSkeleton } from "@/components/Skeletons";
import {
  ArrowLeft,
  Heart,
  Star,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

type ProductTab = "description" | "nutritional" | "reviews";

type ProductSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
};

function ProductSectionHeader({
  eyebrow,
  title,
  subtitle,
  actionHref,
  actionLabel,
}: ProductSectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div className="space-y-2">
        {eyebrow && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" />
            {eyebrow}
          </span>
        )}
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="max-w-xl text-sm leading-relaxed text-secondary">{subtitle}</p>}
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex w-fit items-center justify-center rounded-full border border-border-color/40 px-4 py-2 text-sm font-bold text-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default function ProductDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { products, cart, addToCart, updateQuantity, toggleWishlist, isInWishlist } = useApp();
  const [activeTab, setActiveTab] = useState<ProductTab>("description");

  const product = products.find((p) => String(p.id) === String(productId));

  useEffect(() => {
    if (product) {
      trackEvent("product_viewed", {
        product_id: String(product.id),
        product_name: product.name,
        price: product.price,
        category: product.category,
      });
    }
  }, [product]);

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border-color/40 bg-surface text-5xl shadow-sm">
          🥬
        </div>
        <h1 className="font-sans text-2xl font-extrabold text-foreground">Produce Not Found</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-secondary">
          The vegetable or fruit you are looking for might have been sold out or unlisted.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-container/90"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const mockReviews = [
    {
      id: 1,
      author: "Rahul K.",
      rating: 5,
      date: "May 20, 2026",
      comment: "Absolutely fresh! Stayed fresh in the fridge for a whole week. Will buy again.",
    },
    {
      id: 2,
      author: "Sneha S.",
      rating: 4,
      date: "May 15, 2026",
      comment: "Excellent taste, and pesticide-free is exactly what I was looking for. Highly recommend.",
    },
  ];

  const trustPoints = [
    "Fresh morning stock",
    "Quality checked",
    "Safe packaging",
  ];

  const tabs: { id: ProductTab; label: string }[] = [
    { id: "description", label: "Product Story" },
    { id: "nutritional", label: "Nutrition" },
    { id: "reviews", label: `Reviews (${product.reviewsCount})` },
  ];

  return (
    <div className="space-y-10 pb-16 sm:space-y-14">
      {/* Back button */}
      <div className="pt-1">
        <Link
          href="/shop"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border-color/30 bg-surface px-4 py-2 text-sm font-semibold text-secondary transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </Link>
      </div>

      {/* Main product display grid */}
      <section className="grid items-start gap-6 rounded-[2rem] border border-border-color/40 bg-surface p-4 shadow-sm sm:p-6 md:grid-cols-12 lg:gap-10 lg:p-8">
        {/* Product image */}
        <div className="md:col-span-5">
          <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-border-color/40 bg-background shadow-sm">
            <div className={`relative flex h-full w-full items-center justify-center overflow-hidden ${product.color}`}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                priority
                className="object-contain  transition-transform duration-500 ease-out hover:scale-105 "
              />
            </div>

            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-border-color/40 bg-surface text-secondary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:text-red-500"
            >
              <Heart
                className={`h-5 w-5 transition-all duration-300 ${
                  isFavorited ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Product details */}
        <div className="md:col-span-7 md:pt-1">
          <div className="space-y-6 lg:space-y-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {product.isOrganic && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    Organic
                  </span>
                )}
                {product.isSale && (
                  <span className="rounded-full border border-tertiary/20 bg-tertiary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-tertiary">
                    Sale
                  </span>
                )}
                <span className="rounded-full border border-border-color/30 bg-background px-3 py-1 text-xs font-semibold text-secondary">
                  {product.category}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-sans text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-foreground">{product.rating}</span>
                    <span className="text-xs text-secondary/70">{product.reviewsCount} reviews</span>
                  </div>

                  <span className="rounded-full border border-border-color/30 px-3 py-1 text-xs font-bold text-secondary">
                    Unit: {product.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border-color/30 bg-background p-4 sm:p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-extrabold text-foreground sm:text-4xl">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="pb-1 text-lg font-semibold text-secondary/60 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 rounded-2xl border border-border-color/30 bg-background px-3 py-3 text-xs font-bold text-foreground"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {point}
                </div>
              ))}
            </div>

            {/* CTAs and quantity steppers */}
            <div className="flex flex-col gap-3 border-t border-border-color/20 pt-5 sm:flex-row sm:items-center">
              {quantity === 0 ? (
                <button
                  onClick={() => addToCart(product, 1)}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-sans text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-container/90 active:scale-95 sm:w-auto"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Basket</span>
                </button>
              ) : (
                <div className="flex h-12 w-full items-center justify-between overflow-hidden rounded-full border border-primary/20 bg-primary-container text-white shadow-sm sm:w-auto">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="flex h-full min-w-12 items-center justify-center px-4 transition-colors hover:bg-primary/20"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[44px] select-none text-center font-sans text-base font-extrabold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="flex h-full min-w-12 items-center justify-center px-4 transition-colors hover:bg-primary/20"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border-color/40 bg-background px-5 py-3 text-sm font-bold text-secondary transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500 sm:w-auto"
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-300 ${
                    isFavorited ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{isFavorited ? "Saved" : "Wishlist"}</span>
              </button>
            </div>

            {/* Delivery & Quality highlights */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-border-color/30 bg-background p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-sm">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-foreground">Sunrise Harvest Guarantee</h4>
                    <p className="mt-1 text-xs leading-relaxed text-secondary">
                      Harvested fresh and packed with care for daily delivery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border-color/30 bg-background p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-sm">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-foreground">Purity Verified</h4>
                    <p className="mt-1 text-xs leading-relaxed text-secondary">
                      Checked for quality, freshness, and clean sourcing standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs detailed section */}
      <section className="overflow-hidden rounded-[2rem] border border-border-color/40 bg-surface shadow-sm">
        <div className="overflow-x-auto border-b border-border-color/20 bg-background/60 px-3 py-3 sm:px-5">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2.5 font-sans text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border-color/30 bg-surface text-secondary hover:border-primary/30 hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          {activeTab === "description" && (
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
                Grown with Care
              </span>
              <h3 className="font-sans text-xl font-extrabold text-foreground">From farm to your kitchen</h3>
              <p className="text-sm leading-7 text-secondary sm:text-base">{product.longDescription}</p>
            </div>
          )}

          {activeTab === "nutritional" && (
            <div className="max-w-2xl space-y-5">
              <div>
                <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
                  Per 100g
                </span>
                <h3 className="mt-3 font-sans text-xl font-extrabold text-foreground">
                  Nutritional values
                </h3>
              </div>

              <div className="grid overflow-hidden rounded-3xl border border-border-color/30 bg-background text-sm sm:grid-cols-2">
                {[
                  ["Calories", product.nutritionalFacts.calories],
                  ["Carbohydrates", product.nutritionalFacts.carbs],
                  ["Protein", product.nutritionalFacts.protein],
                  ["Fat", product.nutritionalFacts.fat],
                  ["Dietary Fiber", product.nutritionalFacts.fiber],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between gap-4 p-4 ${
                      index !== 4 ? "border-b border-border-color/20" : ""
                    } sm:border-b sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r sm:border-border-color/20`}
                  >
                    <span className="font-semibold text-secondary">{label}</span>
                    <span className="font-bold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-border-color/20 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-sans text-xl font-extrabold text-foreground">Verified Ratings</h3>
                  <p className="mt-1 text-sm text-secondary">
                    Honest feedback from customers who ordered this produce.
                  </p>
                </div>
                <button className="inline-flex w-fit items-center justify-center rounded-full border border-primary/20 px-4 py-2.5 text-xs font-bold text-primary transition-all duration-300 hover:bg-primary/5">
                  Write a Review
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {mockReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-3xl border border-border-color/30 bg-background p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-sans text-sm font-extrabold text-primary">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-sans text-sm font-extrabold text-foreground">{rev.author}</h4>
                          <div className="mt-1 flex text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-secondary/60">{rev.date}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-secondary">“{rev.comment}”</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <ProductSectionHeader
            eyebrow="Fresh Picks"
            title="You May Also Like"
            subtitle="More produce from the same category, selected to complete your fresh basket."
            actionHref="/shop"
            actionLabel="View Shop"
          />

          <div className="sm:hidden -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
              {relatedProducts.map((p) => (
                <div key={p.id} className="w-[calc(50%-0.5rem)] shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden grid-cols-2 gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
