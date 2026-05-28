"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp, Product } from "@/context/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { Search, SlidersHorizontal, ArrowUpDown, RotateCcw } from "lucide-react";

// Loading Skeleton component
const ShopSkeleton = () => (
  <div className="space-y-6 pb-12 animate-pulse">
    <div className="h-10 bg-surface-hover rounded-md w-1/4"></div>
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-3 space-y-6 hidden lg:block">
        <div className="h-48 bg-surface-hover rounded-md"></div>
        <div className="h-32 bg-surface-hover rounded-md"></div>
      </div>
      <div className="lg:col-span-9 space-y-6">
        <div className="h-12 bg-surface-hover rounded-md w-full"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-surface-hover rounded-lg border border-border-color/10"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Inner Content Component that uses useSearchParams
function ShopContent() {
  const searchParams = useSearchParams();
  const { products, categories } = useApp();

  // State filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<number>(250);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync with search params on mount / params change
  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const filter = searchParams.get("filter");

    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
    if (filter === "sale") {
      // Custom filter handling if any
    }
  }, [searchParams]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Search match
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category match
    const matchesCategory = selectedCategory === "all" || product.categorySlug === selectedCategory;

    // Price match
    const matchesPrice = product.price <= priceRange;

    // Organic match
    const matchesOrganic = !onlyOrganic || product.isOrganic;

    // Sale filter check from query params
    const filterType = searchParams.get("filter");
    const matchesSpecialFilter = 
      filterType === "sale" ? product.isSale : 
      filterType === "seasonal" ? product.isSeasonal : true;

    return matchesSearch && matchesCategory && matchesPrice && matchesOrganic && matchesSpecialFilter;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "popular":
      default:
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    }
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange(250);
    setOnlyOrganic(false);
    setSortBy("popular");
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Title */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-foreground">
          Shop Fresh Produce
        </h1>
        <p className="text-secondary text-sm">
          Browse organic farm vegetables, sweet fruits, leafy greens, and exotic items.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="lg:col-span-3 bg-surface p-6 border border-border-color/30 rounded-lg shadow-organic hidden lg:block space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-border-color/20 pb-4">
            <h2 className="font-sans font-bold text-base text-foreground flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Filters</span>
            </h2>
            <button 
              onClick={handleResetFilters}
              className="text-xs font-semibold text-secondary hover:text-primary flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="font-sans font-bold text-sm text-foreground">Categories</h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-left text-sm font-medium px-3 py-1.5 rounded transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-secondary hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                All Produce
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`text-left text-sm font-medium px-3 py-1.5 rounded transition-colors flex justify-between items-center ${
                    selectedCategory === cat.slug
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-secondary hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs bg-border-color/20 text-secondary px-1.5 py-0.2 rounded font-sans font-bold">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 border-t border-border-color/20 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-sans font-bold text-sm text-foreground">Max Price</h3>
              <span className="text-sm font-bold text-primary">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="10"
              max="250"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-border-color/30 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-secondary/70 font-semibold">
              <span>₹10</span>
              <span>₹250</span>
            </div>
          </div>

          {/* Organic Only Switch */}
          <div className="flex items-center justify-between border-t border-border-color/20 pt-4">
            <label htmlFor="organic-toggle" className="font-sans font-bold text-sm text-foreground cursor-pointer">
              Organic Only
            </label>
            <input
              type="checkbox"
              id="organic-toggle"
              checked={onlyOrganic}
              onChange={(e) => setOnlyOrganic(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-border-color text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </div>
        </aside>

        {/* Products Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-surface border border-border-color/30 p-4 rounded-lg shadow-organic flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-surface-hover border border-border-color/50 focus:outline-none focus:border-primary"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-secondary/70" />
            </div>

            {/* Sorting and Mobile Filters button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-4 py-2 rounded-full border border-border-color/40 text-sm font-semibold flex items-center gap-1.5 hover:bg-surface-hover"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-secondary hidden sm:inline" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 text-sm rounded-full border border-border-color/40 bg-surface focus:outline-none focus:border-primary font-semibold text-secondary"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Drawer/Modal Filters */}
          {showMobileFilters && (
            <div className="lg:hidden bg-surface p-5 border border-border-color/30 rounded-lg shadow-lg space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-border-color/20 pb-3">
                <h3 className="font-sans font-extrabold text-base text-foreground">Refine Selection</h3>
                <button 
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-primary"
                >
                  Clear All
                </button>
              </div>

              {/* Mobile Category select */}
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-sm text-foreground">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === "all"
                        ? "bg-primary text-white"
                        : "bg-surface-hover text-secondary border border-border-color/20"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedCategory === cat.slug
                          ? "bg-primary text-white"
                          : "bg-surface-hover text-secondary border border-border-color/20"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Pricing range */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Max Price</span>
                  <span className="text-primary">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="250"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseFloat(e.target.value))}
                  className="w-full h-1 bg-border-color/30 rounded-lg accent-primary"
                />
              </div>

              {/* Mobile Organic check */}
              <div className="flex items-center justify-between">
                <span className="font-sans font-bold text-sm text-foreground">Organic Only</span>
                <input
                  type="checkbox"
                  checked={onlyOrganic}
                  onChange={(e) => setOnlyOrganic(e.target.checked)}
                  className="w-5 h-5 rounded border-border-color text-primary"
                />
              </div>

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-2.5 rounded-full bg-primary text-white font-sans text-sm font-bold"
              >
                Apply Filters
              </button>
            </div>
          )}

          {/* Active Filters Display */}
          {(selectedCategory !== "all" || searchQuery || onlyOrganic || priceRange < 250) && (
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="text-secondary font-semibold">Active:</span>
              {selectedCategory !== "all" && (
                <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded">
                  Category: {categories.find((c) => c.slug === selectedCategory)?.name}
                </span>
              )}
              {searchQuery && (
                <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded">
                  Search: "{searchQuery}"
                </span>
              )}
              {onlyOrganic && (
                <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded">
                  Organic Only
                </span>
              )}
              {priceRange < 250 && (
                <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded">
                  Under ₹{priceRange}
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-lg p-12 text-center border border-border-color/30 shadow-organic space-y-4">
              <span className="text-5xl block">🥬</span>
              <h3 className="font-sans font-bold text-lg text-foreground">No Products Found</h3>
              <p className="text-secondary text-sm max-w-sm mx-auto">
                We couldn't find any produce matching your current search or filter criteria. Try resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
