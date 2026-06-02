"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp, Product } from "@/context/AppContext";
import { Plus, Minus, Heart, Star, ShoppingBag } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity, toggleWishlist, isInWishlist } = useApp();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isFavorited = isInWishlist(product.id);

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 0) {
      addToCart(product, 1);
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleProductClick = () => {
    trackEvent("product_clicked", {
      product_id: String(product.id),
      product_name: product.name,
      price: product.price,
      category: product.category
    });
  };

  return (
    <div className="group bg-surface rounded-lg overflow-hidden border border-border-color/30 hover:border-primary/40 shadow-organic hover:shadow-organic-hover transition-all duration-300 flex flex-col h-full relative">
      
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isOrganic && (
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md border border-emerald-500/20">
            Organic
          </span>
        )}
        {product.isSale && (
          <span className="bg-tertiary/10 text-tertiary font-sans text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md border border-tertiary/20">
            Sale
          </span>
        )}
      </div>

      {/* Wishlist Button Overlay */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-surface/80 dark:bg-surface/60 backdrop-blur-md text-secondary hover:text-red-500 shadow-sm border border-border-color/10 transition-colors duration-200"
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 transition-transform duration-300 active:scale-125 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* Product Link wrapper */}
      <Link href={`/product/${product.id}`} onClick={handleProductClick} className="block flex-grow">
        {/* Product Image Container using Next/Image */}
        <div className={`aspect-square w-full ${product.color} relative overflow-hidden transition-all duration-300 flex items-center justify-center`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
          />
          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Content Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category & Unit */}
          <div className="flex justify-between items-center text-xs font-semibold text-secondary/80 mb-1">
            <span>{product.category}</span>
            <span>{product.unit}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-sans font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          {/* Reviews Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-foreground">{product.rating}</span>
            <span className="text-xs text-secondary/60">({product.reviewsCount})</span>
          </div>

          {/* Price and Cart controls */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border-color/10">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-xs line-through text-secondary/60">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-lg font-bold text-foreground">
                ₹{product.price}
              </span>
            </div>
            
            {/* Interactive Quantity Stepper */}
            <div onClick={(e) => e.stopPropagation()}>
              {quantity === 0 ? (
                <button
                  onClick={handleIncrement}
                  className="h-10 w-10 sm:w-auto sm:px-4 rounded-full bg-primary text-white font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary-container/90 hover:scale-105 active:scale-95 transition-all duration-300"
                  aria-label="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              ) : (
                <div className="flex items-center bg-primary-container text-white h-10 rounded-full overflow-hidden transition-all duration-300 shadow-sm border border-primary/20">
                  <button
                    onClick={handleDecrement}
                    className="h-full px-3 text-white hover:bg-primary/20 flex items-center justify-center transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-sans font-extrabold text-sm min-w-[20px] text-center select-none text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="h-full px-3 text-white hover:bg-primary/20 flex items-center justify-center transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
