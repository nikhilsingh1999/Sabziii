"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useStore, Product as ZustandProduct, CartItem as ZustandCartItem, Order as ZustandOrder } from "@/store/useStore";

// Export identical interfaces for storefront code compatibility
export interface Product extends ZustandProduct {}
export interface CartItem extends ZustandCartItem {}
export interface Order extends ZustandOrder {}

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  color: string;
}

interface AppContextType {
  products: Product[];
  categories: { name: string; slug: string; count: number; emoji: string; color: string; imageUrl?: string }[];
  blogArticles: BlogArticle[];
  cart: CartItem[];
  wishlist: any[];
  orders: Order[];
  addresses: any[];
  darkMode: boolean;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: any) => void;
  updateQuantity: (productId: any, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: any) => void;
  isInWishlist: (productId: any) => boolean;
  placeOrder: (shippingDetails: any, paymentMethod: string) => any;
  toggleDarkMode: () => void;
  fetchUserAddresses: (uid: string) => Promise<void>;
  addUserAddress: (uid: string, addressData: any) => Promise<void>;
  updateUserAddress: (uid: string, addressId: string, addressData: any) => Promise<void>;
  deleteUserAddress: (uid: string, addressId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Keep mock blogs since it is statically displayed on client-side blog pages
const MOCK_BLOGS: BlogArticle[] = [
  {
    slug: "benefits-organic-greens",
    title: "5 Benefits of Eating Organic Greens Daily",
    excerpt: "Discover why adding fresh leafy greens to your meals can transform your energy, skin, and overall health.",
    content: "Leafy green vegetables are packed with essential vitamins, minerals, and disease-fighting phytochemicals. When grown organically without synthetic pesticides, they preserve their natural nutritional load and support environmental health. Eating them daily can boost immune response, enhance digestion due to high fiber, protect heart function, give you radiant skin, and stabilize energy levels throughout the day.",
    date: "May 25, 2026",
    readTime: "4 min read",
    category: "Nutrition",
    author: { name: "Dr. Sarah Adams", role: "Nutrition Specialist" },
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    slug: "keep-produce-fresh",
    title: "How to Keep Your Fruits & Vegetables Fresh for Longer",
    excerpt: "Simple storage tricks to minimize food waste and keep your fresh produce crisp and delicious.",
    content: "Different fruits and vegetables need different storage conditions. Greens should be kept dry and wrapped in a reusable paper towel to absorb condensation. Fruits like apples, bananas, and tomatoes release ethylene gas which speeds up ripening; keep them isolated from leafy greens. Root vegetables like potatoes and onions should be stored in a cool, dark, well-ventilated dry cupboard rather than the refrigerator.",
    date: "May 22, 2026",
    readTime: "5 min read",
    category: "Kitchen Hacks",
    author: { name: "Chef Marcus Lin", role: "Culinary Expert" },
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    slug: "healthy-green-smoothies",
    title: "Delicious and Healthy Green Smoothie Recipes",
    excerpt: "Kickstart your morning with these simple, nutrient-dense green smoothie recipes that taste amazing.",
    content: "Many avoid green smoothies assuming they taste bitter, but the key is the 60/40 rule: 60% fruits, 40% greens. Try blending 1 cup of organic spinach, 1 frozen Cavendish banana, half an avocado for creaminess, and a cup of almond milk. Another favorite is organic kale, green apple, cucumber slices, and a dash of lemon juice. Add chia seeds or plant protein for an extra nutritional kick.",
    date: "May 18, 2026",
    readTime: "3 min read",
    category: "Recipes",
    author: { name: "Lisa Jenkins", role: "Wellness Blogger" },
    color: "from-green-500/20 to-lime-500/20"
  }
];

export const AppProvider: React.FC<{
  children: React.ReactNode;
  initialProducts?: Product[];
  initialCategories?: any[];
  initialBanners?: any[];
}> = ({ children, initialProducts = [], initialCategories = [], initialBanners = [] }) => {
  const store = useStore();

  // Seed store instantly on render if currently empty to enable immediate SSR
  if (store.products.length === 0 && initialProducts.length > 0) {
    useStore.setState({
      products: initialProducts,
      categories: initialCategories,
      banners: initialBanners
    });
  }

  // Mount listeners and fetch initial catalog from Firestore on client load
  useEffect(() => {
    // 1. Sync User Auth Credentials
    const unsubscribe = store.initAuthListener();
    
    // 2. Load Products, Categories, and Banners from DB (background refresh)
    store.fetchStoreData();
    
    return () => unsubscribe();
  }, []);

  // Synchronize system darkmode class list
  useEffect(() => {
    if (store.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [store.darkMode]);

  const contextValue: AppContextType = {
    products: store.products as Product[],
    categories: store.categories as any[],
    blogArticles: MOCK_BLOGS,
    cart: store.cart as CartItem[],
    wishlist: store.wishlist,
    orders: store.orders as Order[],
    addresses: store.addresses,
    darkMode: store.darkMode,
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    toggleWishlist: store.toggleWishlist,
    isInWishlist: store.isInWishlist,
    placeOrder: store.placeOrder,
    toggleDarkMode: store.toggleDarkMode,
    fetchUserAddresses: store.fetchUserAddresses,
    addUserAddress: store.addUserAddress,
    updateUserAddress: store.updateUserAddress,
    deleteUserAddress: store.deleteUserAddress
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
