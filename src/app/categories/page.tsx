"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ArrowRight } from "lucide-react";

export default function Categories() {
  const { categories } = useApp();

  const categoryDetails = [
    {
      slug: "leafy-greens",
      description: "Crisp, nutrient-dense leafy greens including organic spinach, butterhead lettuce, kale, and garden herbs. Loaded with iron and vitamins for healthy smoothies and salads.",
      details: ["100% pesticide free", "Triple washed & ready", "Rich in Iron & Calcium"]
    },
    {
      slug: "vegetables",
      description: "Everyday kitchen essentials like sweet vine tomatoes, seedless cucumbers, crisp carrots, and fresh onions. Sourced daily from local partner farms.",
      details: ["Harvested at sunrise", "Sourced locally", "High fiber & water content"]
    },
    {
      slug: "fruits",
      description: "Sweet, juicy fruits rich in vitamins and natural sugars. Enjoy crisp apples, bananas, fresh berries, and creamy Hass avocados.",
      details: ["Hand picked quality", "Rich in vitamin C", "Great for kids & snacking"]
    },
    {
      slug: "exotics",
      description: "Specialty, hard-to-find gourmet items like dragon fruit, purple asparagus, portobello mushrooms, and zucchini. Perfect for adventurous cooks.",
      details: ["Gourmet quality standards", "Unique health benefits", "Imported & specialty items"]
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
          Browse Categories
        </h1>
        <p className="text-secondary text-sm">
          Discover our wide range of farm-fresh organic produce categorized for your healthy dietary needs.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => {
          const details = categoryDetails.find((d) => d.slug === category.slug) || {
            description: "Fresh and organic agricultural products sourced from local farmers.",
            details: ["Organic standard", "Freshly sourced"]
          };

          return (
            <div 
              key={category.slug}
              className="bg-surface rounded-lg border border-border-color/30 hover:border-primary/40 p-6 flex flex-col justify-between gap-6 shadow-organic hover:shadow-organic-hover transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Icon & Title */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl ${category.color} shadow-inner group-hover:scale-105 transition-transform duration-300 overflow-hidden`}>
                    {category.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      category.emoji
                    )}
                  </div>
                  <div>
                    <h2 className="font-sans font-extrabold text-xl text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                      {category.count} Products Available
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-secondary text-sm leading-relaxed">
                  {details.description}
                </p>

                {/* Feature Bullet points */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {details.details.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-border-color/10">
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-container/90 transition-all duration-300 group-hover:translate-x-0.5"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
