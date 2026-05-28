"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";

export default function Wishlist() {
  const { wishlist, products } = useApp();

  // Filter products that are in the wishlist
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlist.length === 0) {
    return (
      <div className="py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center text-4xl">
          ❤️
        </div>
        <h1 className="font-sans font-extrabold text-2xl text-foreground">Your Wishlist is Empty</h1>
        <p className="text-secondary text-sm max-w-sm mx-auto">
          Save your favorite fresh organic produce here to purchase them later. Start browsing our local crops!
        </p>
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold shadow-md hover:bg-primary-container/90 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Fresh Produce</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-500 fill-current" />
            <span>My Wishlist</span>
          </h1>
          <p className="text-secondary text-sm">
            Quickly access and add your saved items directly to the shopping basket.
          </p>
        </div>
        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10">
          {wishlist.length} Items Saved
        </span>
      </div>

      {/* Grid of Wishlist items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}
