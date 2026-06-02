import React from "react";

// Generic Pulse Base — the loading placeholder block.
// Darker gray than the white card so it's actually visible.
const Pulse = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

// 1. Dashboard Metrics Summary Card Skeleton
export const DashboardCardSkeleton = () => (
  <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex items-center justify-between">
    <div className="space-y-2 flex-grow mr-4">
      <Pulse className="h-3 w-20" />
      <Pulse className="h-6 w-24" />
      <Pulse className="h-2.5 w-28" />
    </div>
    <Pulse className="w-10 h-10 rounded-full shrink-0" />
  </div>
);

// 2. Table Loader Skeleton (Used for Products, Categories, Orders, Users Tables)
export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 overflow-hidden">
    <div className="flex justify-between items-center pb-2">
      <Pulse className="h-4 w-40" />
      <Pulse className="h-8 w-24 rounded-full" />
    </div>
    <div className="border border-slate-200/70 rounded-lg overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200/70 grid grid-cols-12 gap-4">
        {[...Array(cols)].map((_, i) => (
          <div key={i} className={`col-span-${Math.floor(12 / cols)}`}>
            <Pulse className="h-3 w-16" />
          </div>
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {[...Array(rows)].map((_, r) => (
          <div key={r} className="p-4 grid grid-cols-12 gap-4 items-center">
            {[...Array(cols)].map((_, c) => (
              <div key={c} className={`col-span-${Math.floor(12 / cols)}`}>
                <Pulse className={`h-4 ${c === 0 ? "w-28" : "w-16"}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 3. Product Card Skeleton Grid
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden border border-slate-200/50 shadow-sm p-4 space-y-4 flex flex-col justify-between h-full">
    <div className="space-y-4">
      {/* Image Placeholder */}
      <Pulse className="aspect-square w-full rounded-lg" />
      {/* Category / Unit line */}
      <div className="flex justify-between">
        <Pulse className="h-3 w-12" />
        <Pulse className="h-3 w-8" />
      </div>
      {/* Title */}
      <Pulse className="h-4 w-32" />
      {/* Rating */}
      <Pulse className="h-3 w-16" />
    </div>
    {/* Price & Button Footer */}
    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
      <Pulse className="h-5 w-14" />
      <Pulse className="h-9 w-20 rounded-full" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// 4. Product Details Page Skeleton
export const ProductDetailsSkeleton = () => (
  <div className="space-y-12 pb-16">
    <Pulse className="h-4 w-24" /> {/* Back link */}
    <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Image aspect container */}
      <div className="md:col-span-5 aspect-square rounded-xl overflow-hidden shadow-sm">
        <Pulse className="w-full h-full rounded-xl" />
      </div>
      {/* Right Product Details Info */}
      <div className="md:col-span-7 space-y-6">
        <div className="flex gap-2">
          <Pulse className="h-6 w-20 rounded-full" />
          <Pulse className="h-6 w-16 rounded-full" />
        </div>
        <Pulse className="h-10 w-2/3" />
        <Pulse className="h-4 w-40" />
        <Pulse className="h-8 w-28" />
        <Pulse className="h-20 w-full" />
        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <Pulse className="h-12 w-32 rounded-full" />
          <Pulse className="h-12 w-12 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// 5. Hero Carousel/Banner Skeleton
export const HeroBannerSkeleton = () => (
  <Pulse className="w-full h-[140px] min-[400px]:h-[170px] min-[500px]:h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px] xl:h-[520px] rounded-2xl" />
);

// 6. Categories Row Skeleton (Circular layout)
export const CategoriesRowSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="flex sm:grid overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-200/50 rounded-2xl w-28 shrink-0 sm:w-full">
        <Pulse className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
        <Pulse className="h-4 w-16" />
        <Pulse className="h-3 w-10" />
      </div>
    ))}
  </div>
);