"use client";

import React from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    count: number;
    emoji: string;
    color: string;
  };
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const handleCategoryClick = () => {
    trackEvent("category_click", {
      category_name: category.name,
      category_slug: category.slug
    });
  };

  return (
    <Link 
      href={`/shop?category=${category.slug}`}
      onClick={handleCategoryClick}
      className="group flex flex-col items-center text-center gap-3.5 p-4 bg-surface rounded-2xl border border-border-color/30 hover:border-primary/40 hover:shadow-organic transition-all duration-300 w-28 shrink-0 sm:w-full"
    >
      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl ${category.color} shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300`}>
        {category.emoji}
      </div>
      <div className="space-y-1">
        <h3 className="font-sans font-extrabold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {category.name}
        </h3>
        <p className="text-[9px] sm:text-xs text-secondary/60 font-bold uppercase tracking-wider">
          {category.count} Items
        </p>
      </div>
    </Link>
  );
};
