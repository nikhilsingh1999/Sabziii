"use client";

import React, { use } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, Calendar, Clock, User, Share2, Heart } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogArticle({ params }: PageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  
  const { blogArticles } = useApp();

  const article = blogArticles.find((b) => b.slug === slug);

  if (!article) {
    return (
      <div className="py-20 text-center space-y-6">
        <span className="text-6xl block">📰</span>
        <h1 className="font-sans font-extrabold text-2xl text-foreground">Article Not Found</h1>
        <p className="text-secondary text-sm max-w-sm mx-auto">
          The blog post you are looking for might have been moved or unlisted.
        </p>
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blogs</span>
        </Link>
      </div>
    );
  }

  // Related posts: excluding current post
  const otherPosts = blogArticles.filter((b) => b.slug !== slug).slice(0, 2);

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      
      {/* Back button */}
      <div>
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blogs</span>
        </Link>
      </div>

      {/* Article Header block */}
      <article className="space-y-6">
        <div className="space-y-3">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded">
            {article.category}
          </span>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-secondary/80 pt-2 border-y border-border-color/10 py-3">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <User className="w-4 h-4 text-primary" />
              <span>{article.author.name} ({article.author.role})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>

        {/* Decorative graphic panel */}
        <div className={`h-64 bg-gradient-to-tr ${article.color} rounded-xl p-8 flex items-center justify-between shadow-sm relative overflow-hidden`}>
          <div className="space-y-2 max-w-sm">
            <h3 className="font-sans font-extrabold text-white text-xl md:text-2xl drop-shadow-sm">
              Fresh thoughts on clean living.
            </h3>
            <p className="text-white/80 text-xs">
              FreshPick is dedicated to supporting your organic lifestyle.
            </p>
          </div>
          <span className="text-8xl select-none animate-pulse">🥗</span>
          <div className="absolute inset-0 bg-white/5 dark:bg-black/5 mix-blend-overlay pointer-events-none" />
        </div>

        {/* Content Body text */}
        <div className="text-secondary text-sm sm:text-base leading-relaxed space-y-4 pt-4 border-b border-border-color/10 pb-8">
          <p className="first-letter:text-4xl first-letter:font-extrabold first-letter:text-primary first-letter:float-left first-letter:mr-2">
            {article.content.substring(0, 1)}
            {article.content.substring(1)}
          </p>
          <p>
            When we source our produce, we work with soil scientists and organic agronomists to verify that the levels of macro and micro nutrients remain intact. That means the spinach leaves aren't just crunchy—they are actually packed with magnesium and vitamin K.
          </p>
          <p>
            Cooking organic produce requires gentle heat to preserve these structures. Steaming instead of boiling, or using quick stir-fry methods with cold-pressed oils, keeps the cellular integrity high and ensures you extract the maximum health benefits.
          </p>
        </div>

        {/* Social utility interactions */}
        <div className="flex justify-between items-center text-xs text-secondary/70">
          <div className="flex gap-4">
            <button className="flex items-center gap-1 hover:text-red-500 font-semibold transition-colors">
              <Heart className="w-4 h-4" />
              <span>Like Article</span>
            </button>
            <button className="flex items-center gap-1 hover:text-primary font-semibold transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
          <span>Tags: organic, health, nutrition, dining</span>
        </div>
      </article>

      {/* Suggested articles footer */}
      <section className="space-y-6 pt-8 border-t border-border-color/20 mt-12">
        <h3 className="font-sans font-extrabold text-xl text-foreground">Other Reads</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {otherPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="bg-surface p-4 border border-border-color/30 hover:border-primary/20 rounded-lg shadow-sm flex flex-col justify-between gap-3 transition-all hover:scale-[1.01]"
            >
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{post.category}</span>
                <h4 className="font-sans font-bold text-sm text-foreground mt-1 line-clamp-1">{post.title}</h4>
                <p className="text-secondary text-[11px] leading-relaxed mt-1 line-clamp-2">{post.excerpt}</p>
              </div>
              <span className="text-[10px] text-primary font-extrabold text-right mt-2 inline-block">Read More →</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
