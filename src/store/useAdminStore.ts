import { create } from "zustand";

// Interface definitions matching the backend data structures
export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  unit: string;
  imageUrl: string;
  active: boolean;
  isFreebie?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  imageUrl?: string;
}

export interface Customer {
  userId: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpending: number;
}

export interface OrderItem {
  product: {
    id: number | string;
    name: string;
    price: number;
    unit: string;
    image?: string;
    isFreebie?: boolean;
  };
  quantity: number;
  isFreebie?: boolean;
}

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: "COD" | "UPI";
  paymentStatus: "Pending" | "Paid";
  orderStatus: "Pending" | "Confirmed" | "Packed" | "Out For Delivery" | "Delivered" | "Cancelled";
  createdAt: any;
}

export interface Banner {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  active: boolean;
}

interface AdminState {
  // Data Cache
  products: Product[];
  categories: Category[];
  customers: Customer[];
  orders: Order[];
  banners: Banner[];
  stats: any | null;

  // Timestamps
  lastFetchedProducts: number;
  lastFetchedCategories: number;
  lastFetchedCustomers: number;
  lastFetchedOrders: number;
  lastFetchedBanners: number;
  lastFetchedStats: number;

  // Loading States
  loadingProducts: boolean;
  loadingCategories: boolean;
  loadingCustomers: boolean;
  loadingOrders: boolean;
  loadingBanners: boolean;
  loadingStats: boolean;

  // Actions
  fetchProducts: (force?: boolean) => Promise<Product[]>;
  fetchCategories: (force?: boolean) => Promise<Category[]>;
  fetchCustomers: (force?: boolean) => Promise<Customer[]>;
  fetchOrders: (force?: boolean) => Promise<Order[]>;
  fetchBanners: (force?: boolean) => Promise<Banner[]>;
  fetchStats: (force?: boolean) => Promise<any>;

  // Cache Invalidation (Mutations)
  invalidateProducts: () => void;
  invalidateCategories: () => void;
  invalidateCustomers: () => void;
  invalidateOrders: () => void;
  invalidateBanners: () => void;
  invalidateStats: () => void;
}

// Cache TTL Configurations (in milliseconds)
const CACHE_TTL = {
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  PRODUCTS: 5 * 60 * 1000,    // 5 minutes
  CUSTOMERS: 5 * 60 * 1000,   // 5 minutes
  ORDERS: 30 * 1000,          // 30 seconds
  STATS: 30 * 1000,           // 30 seconds
  BANNERS: 5 * 60 * 1000,     // 5 minutes
};

export const useAdminStore = create<AdminState>((set, get) => ({
  products: [],
  categories: [],
  customers: [],
  orders: [],
  banners: [],
  stats: null,

  lastFetchedProducts: 0,
  lastFetchedCategories: 0,
  lastFetchedCustomers: 0,
  lastFetchedOrders: 0,
  lastFetchedBanners: 0,
  lastFetchedStats: 0,

  loadingProducts: false,
  loadingCategories: false,
  loadingCustomers: false,
  loadingOrders: false,
  loadingBanners: false,
  loadingStats: false,

  fetchProducts: async (force = false) => {
    const { products, lastFetchedProducts } = get();
    const now = Date.now();
    if (!force && products.length > 0 && (now - lastFetchedProducts < CACHE_TTL.PRODUCTS)) {
      return products;
    }

    set({ loadingProducts: true });
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok && data.success) {
        const fetchedProducts = data.products || [];
        set({ products: fetchedProducts, lastFetchedProducts: now });
        return fetchedProducts;
      }
      throw new Error(data.error || "Failed to fetch products");
    } catch (err) {
      console.error("fetchProducts error:", err);
      throw err;
    } finally {
      set({ loadingProducts: false });
    }
  },

  fetchCategories: async (force = false) => {
    const { categories, lastFetchedCategories } = get();
    const now = Date.now();
    if (!force && categories.length > 0 && (now - lastFetchedCategories < CACHE_TTL.CATEGORIES)) {
      return categories;
    }

    set({ loadingCategories: true });
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok && data.success) {
        const fetchedCategories = data.categories || [];
        set({ categories: fetchedCategories, lastFetchedCategories: now });
        return fetchedCategories;
      }
      throw new Error(data.error || "Failed to fetch categories");
    } catch (err) {
      console.error("fetchCategories error:", err);
      throw err;
    } finally {
      set({ loadingCategories: false });
    }
  },

  fetchCustomers: async (force = false) => {
    const { customers, lastFetchedCustomers } = get();
    const now = Date.now();
    if (!force && customers.length > 0 && (now - lastFetchedCustomers < CACHE_TTL.CUSTOMERS)) {
      return customers;
    }

    set({ loadingCustomers: true });
    try {
      const res = await fetch("/api/admin/analytics?type=customers");
      const data = await res.json();
      if (res.ok && data.success) {
        const fetchedCustomers = data.customers || [];
        set({ customers: fetchedCustomers, lastFetchedCustomers: now });
        return fetchedCustomers;
      }
      throw new Error(data.error || "Failed to fetch customers");
    } catch (err) {
      console.error("fetchCustomers error:", err);
      throw err;
    } finally {
      set({ loadingCustomers: false });
    }
  },

  fetchOrders: async (force = false) => {
    const { orders, lastFetchedOrders } = get();
    const now = Date.now();
    if (!force && orders.length > 0 && (now - lastFetchedOrders < CACHE_TTL.ORDERS)) {
      return orders;
    }

    set({ loadingOrders: true });
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (res.ok && data.success) {
        const fetchedOrders = data.orders || [];
        set({ orders: fetchedOrders, lastFetchedOrders: now });
        return fetchedOrders;
      }
      throw new Error(data.error || "Failed to fetch orders");
    } catch (err) {
      console.error("fetchOrders error:", err);
      throw err;
    } finally {
      set({ loadingOrders: false });
    }
  },

  fetchBanners: async (force = false) => {
    const { banners, lastFetchedBanners } = get();
    const now = Date.now();
    if (!force && banners.length > 0 && (now - lastFetchedBanners < CACHE_TTL.BANNERS)) {
      return banners;
    }

    set({ loadingBanners: true });
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (res.ok && data.success) {
        const fetchedBanners = data.banners || [];
        set({ banners: fetchedBanners, lastFetchedBanners: now });
        return fetchedBanners;
      }
      throw new Error(data.error || "Failed to fetch banners");
    } catch (err) {
      console.error("fetchBanners error:", err);
      throw err;
    } finally {
      set({ loadingBanners: false });
    }
  },

  fetchStats: async (force = false) => {
    const { stats, lastFetchedStats } = get();
    const now = Date.now();
    if (!force && stats !== null && (now - lastFetchedStats < CACHE_TTL.STATS)) {
      return stats;
    }

    set({ loadingStats: true });
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (res.ok && data.success) {
        const fetchedStats = {
          ...(data.stats || {}),
          revenueTrend: data.report?.revenueTrend || []
        };
        set({ stats: fetchedStats, lastFetchedStats: now });
        return fetchedStats;
      }
      throw new Error(data.error || "Failed to fetch dashboard stats");
    } catch (err) {
      console.error("fetchStats error:", err);
      throw err;
    } finally {
      set({ loadingStats: false });
    }
  },

  invalidateProducts: () => set({ lastFetchedProducts: 0 }),
  invalidateCategories: () => set({ lastFetchedCategories: 0 }),
  invalidateCustomers: () => set({ lastFetchedCustomers: 0 }),
  invalidateOrders: () => set({ lastFetchedOrders: 0 }),
  invalidateBanners: () => set({ lastFetchedBanners: 0 }),
  invalidateStats: () => set({ lastFetchedStats: 0 }),
}));
