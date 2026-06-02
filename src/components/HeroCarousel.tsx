"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useStore } from "@/store/useStore";

interface BannerSlide {
  id: string | number;
  image: string;
  alt: string;
  link: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: 1,
    image: "/images/banner1.jpg",
    alt: "Kal Subah Taaza Sabzi, Seedha Aapke Ghar - Sabziii Freshly Picked. Delivered.",
    link: "/shop",
  },
  {
    id: 2,
    image: "/images/banner2.png",
    alt: "Kisaan Se Seedha Aapke Ghar Tak - SABZIII Aapka Apna Digital Sabziwala",
    link: "/shop",
  },
  {
    id: 3,
    image: "/images/banner3.jpg",
    alt: "Har Order Ke Saath FREE Dhaniya & Pudina - SABZIII Aapka Apna Digital Sabziwala",
    link: "/shop",
  },
];

export const HeroCarousel = () => {
  const banners = useStore((state) => state.banners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Touch gesture support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  // Resolve slides from dynamic banners (only active ones are fetched by store)
  const activeBanners = banners && banners.length > 0 ? banners : [];
  const carouselSlides: BannerSlide[] = activeBanners.length > 0
    ? activeBanners.map((b) => ({
        id: b.id,
        image: b.imageUrl,
        alt: b.title,
        link: b.link || "/shop"
      }))
    : DEFAULT_SLIDES;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length);
  }, [carouselSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselSlides.length) % carouselSlides.length);
  }, [carouselSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Reset index if slides list changes (to prevent out of bounds)
  useEffect(() => {
    setCurrentIndex(0);
  }, [carouselSlides.length]);

  // Start Autoplay
  useEffect(() => {
    if (!isHovered && carouselSlides.length > 1) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered, nextSlide, carouselSlides.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (carouselSlides.length === 0) return null;

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl shadow-organic border border-border-color/10 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Wrapper (Translating container) */}
      <div 
        className="flex transition-transform duration-700 ease-out h-[140px] min-[400px]:h-[170px] min-[500px]:h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px] xl:h-[520px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselSlides.map((slide, index) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative h-full">
            <Link href={slide.link} className="block w-full h-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-fill hover:scale-[1.01] transition-transform duration-700"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows (Only show if multiple slides) */}
      {carouselSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/30 dark:bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/30 dark:bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index 
                    ? "w-8 bg-primary shadow-sm" 
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
