"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

export default function Blog() {
  const { blogArticles } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Nutrition", "Kitchen Hacks", "Recipes"];

  const filteredBlogs = selectedCategory === "all"
    ? blogArticles
    : blogArticles.filter((b) => b.category === selectedCategory);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
          FreshPick Organic Blog
        </h1>
        <p className="text-secondary text-sm">
          Healthy recipes, organic nutrition science, and smart kitchen storage tips.
        </p>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-color/20 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat
                ? "bg-primary text-white"
                : "bg-surface-hover text-secondary border border-border-color/20 hover:border-primary/20"
            }`}
          >
            {cat === "all" ? "All Articles" : cat}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.map((article) => (
          <article 
            key={article.slug}
            className="bg-surface border border-border-color/30 hover:border-primary/30 rounded-lg overflow-hidden shadow-organic hover:shadow-organic-hover flex flex-col justify-between h-full transition-all duration-300 group"
          >
            <div>
              {/* Graphic Placeholder header */}
              <div className={`h-40 bg-gradient-to-tr ${article.color} relative p-6 flex flex-col justify-between`}>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-foreground dark:text-white px-2 py-0.5 rounded backdrop-blur-sm self-start">
                  {article.category}
                </span>
                <span className="text-5xl self-end">🌱</span>
              </div>

              {/* Card content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-4 text-[10px] font-bold text-secondary uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="font-sans font-extrabold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-secondary text-xs leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </div>

            {/* Read more button link */}
            <div className="px-5 pb-5 pt-3 border-t border-border-color/10">
              <Link
                href={`/blog/${article.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-container group-hover:translate-x-0.5 transition-all"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
