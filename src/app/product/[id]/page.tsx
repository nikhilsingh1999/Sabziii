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
  Check
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const { products, cart, addToCart, updateQuantity, toggleWishlist, isInWishlist } = useApp();
  const [activeTab, setActiveTab] = useState<"description" | "nutritional" | "reviews">("description");

  // Find product
  const product = products.find((p) => String(p.id) === String(productId));

  useEffect(() => {
    if (product) {
      trackEvent("product_viewed", {
        product_id: String(product.id),
        product_name: product.name,
        price: product.price,
        category: product.category
      });
    }
  }, [product]);

  // Show skeleton if products catalog is empty (loading state)
  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-6">
        <span className="text-6xl block">🥬</span>
        <h1 className="font-sans font-extrabold text-2xl text-foreground">Produce Not Found</h1>
        <p className="text-secondary text-sm max-w-sm mx-auto">
          The vegetable or fruit you are looking for might have been sold out or unlisted.
        </p>
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Sourced related products
  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  // Mock Reviews
  const mockReviews = [
    { id: 1, author: "Rahul K.", rating: 5, date: "May 20, 2026", comment: "Absolutely fresh! Stayed fresh in the fridge for a whole week. Will buy again." },
    { id: 2, author: "Sneha S.", rating: 4, date: "May 15, 2026", comment: "Excellent taste, and pesticide-free is exactly what I was looking for. Highly recommend." },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Back button */}
      <div>
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>
      </div>

      {/* Main product display grid */}
      <section className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Visual Image container using Next/Image */}
        <div className="md:col-span-5 aspect-square rounded-xl bg-surface border border-border-color/30 overflow-hidden relative shadow-organic flex items-center justify-center">
          <div className={`w-full h-full ${product.color} flex items-center justify-center relative overflow-hidden transition-all duration-300`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              priority
              className="object-contain transition-transform duration-500 ease-out hover:scale-110 hover:rotate-3"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Product Details info */}
        <div className="md:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {product.isOrganic && (
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
                Organic
              </span>
            )}
            {product.isSale && (
              <span className="bg-tertiary/10 text-tertiary font-sans text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-tertiary/20">
                Sale
              </span>
            )}
            <span className="text-xs font-semibold text-secondary/80 bg-surface-hover px-3 py-1 rounded-full border border-border-color/20">
              {product.category}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-foreground">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">{product.rating}</span>
                <span className="text-xs text-secondary/60">({product.reviewsCount} customer reviews)</span>
              </div>
              <span className="text-sm text-secondary/80 font-semibold border-l border-border-color/30 pl-4">
                Unit: {product.unit}
              </span>
            </div>
          </div>

          {/* Price display */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-lg line-through text-secondary/60">₹{product.originalPrice}</span>
            )}
          </div>

          <p className="text-secondary text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>

          {/* CTAs and quantity steppers */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border-color/10">
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(product, 1)}
                className="px-8 py-3.5 rounded-full bg-primary text-white font-sans text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container/90 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket</span>
              </button>
            ) : (
              <div className="flex items-center bg-primary-container text-white h-12 rounded-full overflow-hidden transition-all duration-300 shadow-sm border border-primary/20">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="h-full px-4 text-white hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 font-sans font-extrabold text-base min-w-[30px] text-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="h-full px-4 text-white hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-3.5 rounded-full bg-surface text-secondary hover:text-red-500 shadow-sm border border-border-color/30 transition-all duration-300"
            >
              <Heart className={`w-5 h-5 transition-transform duration-300 active:scale-125 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          {/* Delivery & Quality highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface p-4 border border-border-color/20 rounded-lg shadow-organic mt-6">
            <div className="flex gap-3 text-sm">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-foreground text-xs">Sunrise Harvest Guarantee</h4>
                <p className="text-secondary text-xs mt-0.5">Harvested at sunrise, on your table by lunch.</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-foreground text-xs">Purity Verified</h4>
                <p className="text-secondary text-xs mt-0.5">Strict organic certification and lab tested for purity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs detailed section */}
      <section className="bg-surface border border-border-color/30 rounded-lg overflow-hidden shadow-organic transition-colors">
        <div className="flex border-b border-border-color/20 bg-surface-hover/50">
          {[
            { id: "description", label: "Product Story" },
            { id: "nutritional", label: "Nutritional Facts" },
            { id: "reviews", label: `Reviews (${product.reviewsCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-sans text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-surface"
                  : "border-transparent text-secondary hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {/* Tab Description */}
          {activeTab === "description" && (
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-lg text-foreground">Grown with Care</h3>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">
                {product.longDescription}
              </p>
            </div>
          )}

          {/* Tab Nutritional Facts */}
          {activeTab === "nutritional" && (
            <div className="space-y-4 max-w-md">
              <h3 className="font-sans font-bold text-lg text-foreground">Nutritional values (per 100g)</h3>
              <div className="border border-border-color/20 rounded-md overflow-hidden text-sm">
                <div className="flex justify-between p-3 border-b border-border-color/10">
                  <span className="font-semibold text-secondary">Calories</span>
                  <span className="font-bold text-foreground">{product.nutritionalFacts.calories}</span>
                </div>
                <div className="flex justify-between p-3 border-b border-border-color/10">
                  <span className="font-semibold text-secondary">Carbohydrates</span>
                  <span className="font-bold text-foreground">{product.nutritionalFacts.carbs}</span>
                </div>
                <div className="flex justify-between p-3 border-b border-border-color/10">
                  <span className="font-semibold text-secondary">Protein</span>
                  <span className="font-bold text-foreground">{product.nutritionalFacts.protein}</span>
                </div>
                <div className="flex justify-between p-3 border-b border-border-color/10">
                  <span className="font-semibold text-secondary">Fat</span>
                  <span className="font-bold text-foreground">{product.nutritionalFacts.fat}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="font-semibold text-secondary">Dietary Fiber</span>
                  <span className="font-bold text-foreground">{product.nutritionalFacts.fiber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border-color/10">
                <h3 className="font-sans font-bold text-lg text-foreground">Verified Ratings</h3>
                <button className="px-4 py-2 rounded-full border border-primary/20 text-xs font-bold text-primary hover:bg-primary/5 transition-all">
                  Write a Review
                </button>
              </div>

              <div className="space-y-4">
                {mockReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-surface-hover/30 rounded border border-border-color/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground">{rev.author}</span>
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-secondary/60">{rev.date}</span>
                    </div>
                    <p className="text-secondary text-sm italic">"{rev.comment}"</p>
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
          <h2 className="font-sans font-extrabold text-2xl text-foreground">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
