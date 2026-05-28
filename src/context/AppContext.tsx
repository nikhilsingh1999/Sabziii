"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  description: string;
  longDescription: string;
  stock: number;
  isOrganic: boolean;
  isPopular: boolean;
  isSeasonal: boolean;
  isSale: boolean;
  nutritionalFacts: {
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
    fiber: string;
  };
  color: string; // Tailwind bg color class for visual representation
  textColor: string;
  emoji: string;
  image: string; // Real image path
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
}

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
  categories: { name: string; slug: string; count: number; emoji: string; color: string }[];
  blogArticles: BlogArticle[];
  cart: CartItem[];
  wishlist: number[];
  orders: Order[];
  darkMode: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  placeOrder: (shippingDetails: any, paymentMethod: string) => Order;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Comprehensive mock products database with INR prices and real image paths
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Organic Spinach",
    category: "Leafy Greens",
    categorySlug: "leafy-greens",
    price: 40,
    originalPrice: 50,
    unit: "250g pack",
    rating: 4.8,
    reviewsCount: 142,
    description: "Crisp, nutrient-dense organic spinach leaves, washed and ready to cook or use in fresh salads.",
    longDescription: "Our organic spinach is harvested at the peak of freshness from local farms. It is packed with iron, vitamins A, C, and K, and dietary fiber. Perfect for green smoothies, sautés, salads, and soups. No pesticides or chemical fertilizers were used in growing this produce.",
    stock: 25,
    isOrganic: true,
    isPopular: true,
    isSeasonal: false,
    isSale: true,
    nutritionalFacts: { calories: "23 kcal", carbs: "3.6g", protein: "2.9g", fat: "0.4g", fiber: "2.2g" },
    color: "bg-emerald-100 dark:bg-emerald-950/40",
    textColor: "text-emerald-800 dark:text-emerald-300",
    emoji: "🥬",
    image: "/images/products/spinach.png"
  },
  {
    id: 2,
    name: "Farm Fresh Broccoli",
    category: "Fresh Vegetables",
    categorySlug: "vegetables",
    price: 80,
    unit: "500g head",
    rating: 4.6,
    reviewsCount: 89,
    description: "Vibrant green, pesticide-free broccoli crowns. Excellent source of vitamin C and dietary fiber.",
    longDescription: "Grown in nutrient-rich soils, our broccoli crowns have dense, tight florets and sturdy, sweet stems. Broccoli is exceptionally rich in vitamin C and K, and contains powerful antioxidants. Steam it, roast it with garlic, or chop it raw into healthy summer slaws.",
    stock: 18,
    isOrganic: true,
    isPopular: true,
    isSeasonal: false,
    isSale: false,
    nutritionalFacts: { calories: "34 kcal", carbs: "6.6g", protein: "2.8g", fat: "0.4g", fiber: "2.6g" },
    color: "bg-green-100 dark:bg-green-950/40",
    textColor: "text-green-800 dark:text-green-300",
    emoji: "🥦",
    image: "/images/products/broccoli.png"
  },
  {
    id: 3,
    name: "Organic Vine Tomatoes",
    category: "Fresh Vegetables",
    categorySlug: "vegetables",
    price: 120,
    originalPrice: 140,
    unit: "500g pack",
    rating: 4.9,
    reviewsCount: 204,
    description: "Sweet, juicy vine-ripened tomatoes. Plump, deep red, and full of natural sun-grown flavor.",
    longDescription: "These vine tomatoes are left on the vine until perfectly red and sweet, yielding an intense, garden-fresh tomato aroma. Rich in Lycopene, vitamin C, and potassium. Ideal for fresh Caprese salads, homemade pasta sauces, roasting, or snacking.",
    stock: 15,
    isOrganic: true,
    isPopular: true,
    isSeasonal: true,
    isSale: true,
    nutritionalFacts: { calories: "18 kcal", carbs: "3.9g", protein: "0.9g", fat: "0.2g", fiber: "1.2g" },
    color: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-800 dark:text-red-300",
    emoji: "🍅",
    image: "/images/products/tomato.png"
  },
  {
    id: 4,
    name: "Sweet Honeycrisp Apples",
    category: "Sweet Fruits",
    categorySlug: "fruits",
    price: 180,
    unit: "1kg bag",
    rating: 4.7,
    reviewsCount: 112,
    description: "Crisp, sweet, and moderately tart apples. Perfectly juicy and great for snacking.",
    longDescription: "Honeycrisp apples are famous for their signature crisp texture and sweet, juice-filled bite. They make the perfect refreshing snack on their own, add crunch to salads, and bake beautifully into pies and crisps. Rich in antioxidants and soluble fiber.",
    stock: 30,
    isOrganic: false,
    isPopular: true,
    isSeasonal: false,
    isSale: false,
    nutritionalFacts: { calories: "52 kcal", carbs: "14g", protein: "0.3g", fat: "0.2g", fiber: "2.4g" },
    color: "bg-rose-50 dark:bg-rose-950/30",
    textColor: "text-rose-800 dark:text-rose-300",
    emoji: "🍎",
    image: "/images/products/apple.png"
  },
  {
    id: 5,
    name: "Organic Cavendish Bananas",
    category: "Sweet Fruits",
    categorySlug: "fruits",
    price: 60,
    unit: "1 bundle (approx. 5-6 pcs)",
    rating: 4.8,
    reviewsCount: 310,
    description: "Creamy, sweet, and perfectly ripened bananas. The ultimate natural energy snack.",
    longDescription: "Harvested responsibly, our organic Cavendish bananas are loaded with essential potassium, vitamin B6, and quick-releasing energy carbohydrates. Perfect for pre-workout fuel, blending into smoothies, slicing over cereal, or baking into banana bread.",
    stock: 45,
    isOrganic: true,
    isPopular: false,
    isSeasonal: false,
    isSale: false,
    nutritionalFacts: { calories: "89 kcal", carbs: "23g", protein: "1.1g", fat: "0.3g", fiber: "2.6g" },
    color: "bg-yellow-50 dark:bg-yellow-950/30",
    textColor: "text-yellow-800 dark:text-yellow-300",
    emoji: "🍌",
    image: "/images/products/banana.png"
  },
  {
    id: 6,
    name: "Sweet Red Strawberries",
    category: "Sweet Fruits",
    categorySlug: "fruits",
    price: 150,
    originalPrice: 180,
    unit: "400g pack",
    rating: 4.9,
    reviewsCount: 187,
    description: "Premium grade, hand-picked sweet strawberries. Brilliant red color, juicy and aromatic.",
    longDescription: "Our strawberries are carefully hand-picked at peak ripeness. They are sweet, succulent, and pack a massive dose of vitamin C and manganese. Perfect for desserts, yogurt toppings, fruit bowls, salads, or eating straight out of the package.",
    stock: 12,
    isOrganic: true,
    isPopular: true,
    isSeasonal: true,
    isSale: true,
    nutritionalFacts: { calories: "32 kcal", carbs: "7.7g", protein: "0.7g", fat: "0.3g", fiber: "2g" },
    color: "bg-red-100/50 dark:bg-red-950/20",
    textColor: "text-red-700 dark:text-red-400",
    emoji: "🍓",
    image: "/images/products/strawberry.png"
  },
  {
    id: 7,
    name: "Organic Hass Avocado",
    category: "Sweet Fruits",
    categorySlug: "fruits",
    price: 90,
    unit: "1 pc",
    rating: 4.5,
    reviewsCount: 96,
    description: "Creamy, rich Hass avocados. High in heart-healthy monounsaturated fats and potassium.",
    longDescription: "Hass avocados feature a dark, pebbled skin that turns blackish-purple when ripe. Inside, you will find a buttery, smooth pulp loaded with healthy fats, fiber, and vitamins E and K. Perfect for making authentic guacamole, spreading on morning sourdough toast, or topping salads.",
    stock: 22,
    isOrganic: true,
    isPopular: true,
    isSeasonal: false,
    isSale: false,
    nutritionalFacts: { calories: "160 kcal", carbs: "8.5g", protein: "2g", fat: "14.7g", fiber: "6.7g" },
    color: "bg-lime-50 dark:bg-lime-950/30",
    textColor: "text-lime-800 dark:text-lime-300",
    emoji: "🥑",
    image: "/images/products/avocado.png"
  },
  {
    id: 8,
    name: "Red Bell Peppers",
    category: "Fresh Vegetables",
    categorySlug: "vegetables",
    price: 80,
    unit: "300g pack (2 pcs)",
    rating: 4.7,
    reviewsCount: 75,
    description: "Sweet, crunchy red bell peppers. Excellent source of vitamins A, C, and antioxidants.",
    longDescription: "These thick-walled, glossy red bell peppers have a sweet flavor profile and satisfying crunch. Grown naturally and harvested at full maturity. Ideal for roasting, stir-fries, fajitas, stuffing, or eating raw with dips.",
    stock: 20,
    isOrganic: false,
    isPopular: false,
    isSeasonal: false,
    isSale: false,
    nutritionalFacts: { calories: "31 kcal", carbs: "6g", protein: "1g", fat: "0.3g", fiber: "2.1g" },
    color: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-800 dark:text-orange-300",
    emoji: "🫑",
    image: "/images/products/bell_pepper.png"
  },
  {
    id: 9,
    name: "English Seedless Cucumber",
    category: "Fresh Vegetables",
    categorySlug: "vegetables",
    price: 40,
    unit: "1 pc",
    rating: 4.4,
    reviewsCount: 63,
    description: "Crisp and refreshing seedless cucumber. Perfect for salads, sandwiches, and detox drinks.",
    longDescription: "Our English cucumbers are long, thin-skinned, and virtually seedless. They are sweet and refreshing, composed of over 95% water, making them highly hydrating. Eat them raw in Mediterranean salads, slice thin for cucumber sandwiches, or juice them for healthy detox blends.",
    stock: 35,
    isOrganic: false,
    isPopular: false,
    isSeasonal: false,
    isSale: false,
    nutritionalFacts: { calories: "15 kcal", carbs: "3.6g", protein: "0.7g", fat: "0.1g", fiber: "0.5g" },
    color: "bg-teal-50 dark:bg-teal-950/30",
    textColor: "text-teal-800 dark:text-teal-300",
    emoji: "🥒",
    image: "/images/products/cucumber.png"
  },
  {
    id: 10,
    name: "Premium Dragon Fruit",
    category: "Exotic Produce",
    categorySlug: "exotics",
    price: 120,
    originalPrice: 150,
    unit: "1 pc (approx. 400g)",
    rating: 4.8,
    reviewsCount: 48,
    description: "Stunning pink exterior with sweet, white-fleshed pulp and tiny edible black seeds.",
    longDescription: "Our exotic pink pitaya (Dragon Fruit) is imported from premium tropical orchards. It has a mild, refreshing sweetness resembling a pear and kiwi mix. Highly rich in dietary fiber, vitamin C, iron, and active prebiotics that promote gut health.",
    stock: 10,
    isOrganic: false,
    isPopular: false,
    isSeasonal: true,
    isSale: true,
    nutritionalFacts: { calories: "60 kcal", carbs: "12.9g", protein: "1.2g", fat: "1.5g", fiber: "2.9g" },
    color: "bg-pink-50 dark:bg-pink-950/30",
    textColor: "text-pink-800 dark:text-pink-300",
    emoji: "🍍",
    image: "/images/products/dragon_fruit.png"
  },
  {
    id: 11,
    name: "Fresh Purple Asparagus",
    category: "Exotic Produce",
    categorySlug: "exotics",
    price: 190,
    unit: "250g bunch",
    rating: 4.7,
    reviewsCount: 35,
    description: "Rare purple asparagus spears, sweeter and more tender than green varieties.",
    longDescription: "Purple asparagus is a specialty crop known for its beautiful violet spears and higher sugar content. It is exceptionally tender, allowing it to be eaten raw in salads or lightly grilled, roasted, or sautéed. Rich in anthocyanins and folate.",
    stock: 8,
    isOrganic: true,
    isPopular: true,
    isSeasonal: true,
    isSale: false,
    nutritionalFacts: { calories: "20 kcal", carbs: "3.9g", protein: "2.2g", fat: "0.1g", fiber: "2.1g" },
    color: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-800 dark:text-purple-300",
    emoji: "🥦",
    image: "/images/products/asparagus.png"
  },
  {
    id: 12,
    name: "Organic Portobello Mushrooms",
    category: "Exotic Produce",
    categorySlug: "exotics",
    price: 140,
    unit: "150g pack (2 large caps)",
    rating: 4.6,
    reviewsCount: 52,
    description: "Meaty, rich, and earthy mushroom caps. Perfect for grilling or as a plant-based burger swap.",
    longDescription: "Our organic Portobello mushrooms feature large, dark brown, fully opened caps with deep gills. They have a dense, meaty texture and rich, savory umami taste. Excellent for stuffing with herbs and cheese, grilling, or roasting.",
    stock: 14,
    isOrganic: true,
    isPopular: false,
    isSeasonal: false,
    isSale: false,
    nutritionalFacts: { calories: "22 kcal", carbs: "3.3g", protein: "2.1g", fat: "0.4g", fiber: "1.3g" },
    color: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-800 dark:text-amber-300",
    emoji: "🍄",
    image: "/images/products/mushroom.png"
  }
];

const MOCK_CATEGORIES = [
  { name: "Leafy Greens", slug: "leafy-greens", count: 2, emoji: "🥬", color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300" },
  { name: "Fresh Vegetables", slug: "vegetables", count: 5, emoji: "🥦", color: "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300" },
  { name: "Sweet Fruits", slug: "fruits", count: 4, emoji: "🍓", color: "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300" },
  { name: "Exotic Produce", slug: "exotics", count: 3, emoji: "✨", color: "bg-purple-50 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300" }
];

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("freshpick_cart");
      const storedWishlist = localStorage.getItem("freshpick_wishlist");
      const storedOrders = localStorage.getItem("freshpick_orders");
      const storedDarkMode = localStorage.getItem("freshpick_darkmode");

      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      if (storedOrders) setOrders(JSON.parse(storedOrders));
      
      // Check system theme or stored theme
      if (storedDarkMode) {
        setDarkMode(JSON.parse(storedDarkMode));
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(prefersDark);
      }
      setIsHydrated(true);
    }
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("freshpick_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("freshpick_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("freshpick_orders", JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("freshpick_darkmode", JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode, isHydrated]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: number) => {
    return wishlist.includes(productId);
  };

  const placeOrder = (shippingDetails: any, paymentMethod: string) => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const delivery = subtotal > 299 ? 0 : 40;
    const total = subtotal + tax + delivery;

    const newOrder: Order = {
      id: "FP-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      items: [...cart],
      total: parseFloat(total.toFixed(2)),
      status: "Processing",
      shippingAddress: shippingDetails,
      paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppContext.Provider
      value={{
        products: MOCK_PRODUCTS,
        categories: MOCK_CATEGORIES,
        blogArticles: MOCK_BLOGS,
        cart,
        wishlist,
        orders,
        darkMode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        toggleDarkMode,
      }}
    >
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
