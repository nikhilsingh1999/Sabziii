"use client";

import React from "react";
import Link from "next/link";

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
  return (
    <Link 
      href={`/shop?category=${category.slug}`}
      className="group bg-surface rounded-lg border border-border-color/30 hover:border-primary/30 p-5 flex items-center gap-4 shadow-organic hover:shadow-organic-hover transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${category.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        {category.emoji}
      </div>
      <div>
        <h3 className="font-sans font-bold text-lg text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-secondary/70 font-medium">
          {category.count} Products Available
        </p>
      </div>
    </Link>
  );
};
