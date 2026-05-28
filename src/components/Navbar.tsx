"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Leaf 
} from "lucide-react";

export const Navbar = () => {
  const { cart, wishlist, darkMode, toggleDarkMode } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistItems = wishlist.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 glass-header transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-110">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="font-sans font-extrabold text-2xl tracking-tight text-primary">
                  Fresh<span className="text-tertiary">Pick</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-sans text-sm font-semibold transition-colors duration-200 hover:text-primary ${
                      isActive 
                        ? "text-primary border-b-2 border-primary pb-1" 
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions Panel */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search fresh produce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 xl:w-64 pl-10 pr-4 py-2 text-sm rounded-full bg-surface-hover border border-border-color/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 dark:bg-surface-hover"
                />
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-secondary/70" />
              </form>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-surface-hover text-secondary transition-colors duration-200"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 rounded-full hover:bg-surface-hover text-secondary transition-colors duration-200 relative"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${totalWishlistItems > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 rounded-full hover:bg-surface-hover text-secondary transition-colors duration-200 relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-primary" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-tertiary text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="p-2 rounded-full hover:bg-surface-hover text-secondary transition-colors duration-200"
                aria-label="Dashboard"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>

            {/* Mobile Actions and Burger Toggle */}
            <div className="flex md:hidden items-center space-x-3">
              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-surface-hover text-secondary transition-colors duration-200"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Cart Mobile */}
              <Link
                href="/cart"
                className="p-2 rounded-full hover:bg-surface-hover text-secondary relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-primary" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-tertiary text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {/* Burger Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-surface-hover text-secondary focus:outline-none"
                aria-label="Open Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-out drawer menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border-color/20 bg-surface/95 backdrop-blur-lg animate-fade-in shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Search Bar Mobile */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search fresh produce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-surface-hover border border-border-color/50 focus:outline-none focus:border-primary"
                />
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-secondary/70" />
              </form>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 text-base font-semibold rounded-md transition-colors ${
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-secondary hover:bg-surface-hover hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Secondary actions footer inside mobile drawer */}
              <div className="border-t border-border-color/20 pt-4 flex items-center justify-around">
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-secondary hover:text-primary font-semibold"
                >
                  <Heart className={`w-5 h-5 ${totalWishlistItems > 0 ? "fill-red-500 text-red-500" : ""}`} />
                  <span>Wishlist ({totalWishlistItems})</span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-secondary hover:text-primary font-semibold"
                >
                  <User className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
