import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { trackEvent } from "@/lib/analytics";

// Reuse Product interface format from AppContext
export interface Product {
  id: string | number;
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
  color: string;
  textColor: string;
  emoji: string;
  image: string;
  active: boolean;
  isFreebie?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  emoji?: string;
  color?: string;
  count?: number;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderId?: string; // mapping
  date: string;
  items: CartItem[];
  total: number;
  status: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
}

export interface Banner {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  active: boolean;
}

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  createdAt?: any;
}

interface StoreState {
  // Auth
  user: UserProfile | null;
  authLoading: boolean;
  
  // Shopping Lists
  cart: CartItem[];
  wishlist: (string | number)[];
  orders: Order[];
  addresses: any[];
  
  // Store Catalog Data
  products: Product[];
  categories: Category[];
  banners: Banner[];
  loadingData: boolean;
  
  // UI Theme
  darkMode: boolean;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setAuthLoading: (loading: boolean) => void;
  initAuthListener: () => () => void;
  
  // Auth Triggers
  signInWithEmail: (email: string, pass: string) => Promise<FirebaseUser>;
  signUpWithEmail: (name: string, email: string, pass: string, phone: string) => Promise<FirebaseUser>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  updateUserProfile: (uid: string, profileUpdates: Partial<UserProfile>) => Promise<void>;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string | number) => void;
  isInWishlist: (productId: string | number) => boolean;
  
  // Catalog Fetching
  fetchStoreData: () => Promise<void>;
  fetchUserOrders: (uid: string) => Promise<void>;
  
  // Addresses CRUD Actions
  fetchUserAddresses: (uid: string) => Promise<void>;
  addUserAddress: (uid: string, addressData: any) => Promise<void>;
  updateUserAddress: (uid: string, addressId: string, addressData: any) => Promise<void>;
  deleteUserAddress: (uid: string, addressId: string) => Promise<void>;
  
  // Checkout Action
  placeOrder: (shippingDetails: any, paymentMethod: string) => Promise<Order>;
  
  // Theme Action
  toggleDarkMode: () => void;
}

const FREEBIE_ID = "freebie-dhaniya-mirch";
const FREEBIE_ITEM: CartItem = {
  product: {
    id: FREEBIE_ID,
    name: "Complimentary Dhaniya & Mirch",
    category: "Fresh Herbs",
    categorySlug: "leafy-greens",
    price: 0,
    unit: "1 bundle",
    rating: 5,
    reviewsCount: 1,
    description: "Free organic fresh coriander and green chillies bundle.",
    longDescription: "Enjoy complimentary coriander and green chillies freshly picked from our organic farms.",
    stock: 9999,
    isOrganic: true,
    isPopular: false,
    isSeasonal: false,
    isSale: false,
    nutritionalFacts: { calories: "5 kcal", carbs: "1g", protein: "0.2g", fat: "0g", fiber: "0.5g" },
    color: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-800 dark:text-emerald-300",
    emoji: "🌿",
    image: "/images/products/spinach.png",
    active: true,
    isFreebie: true
  },
  quantity: 1
};

function ensureFreebie(cart: CartItem[]): CartItem[] {
  const otherItems = cart.filter(item => String(item.product.id) !== FREEBIE_ID);
  if (otherItems.length > 0) {
    const hasFreebie = cart.some(item => String(item.product.id) === FREEBIE_ID);
    if (!hasFreebie) {
      return [...otherItems, FREEBIE_ITEM];
    } else {
      return [
        ...otherItems,
        cart.find(item => String(item.product.id) === FREEBIE_ID) || FREEBIE_ITEM
      ];
    }
  } else {
    return [];
  }
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial States
      user: null,
      authLoading: true,
      cart: [],
      wishlist: [],
      orders: [],
      addresses: [],
      products: [],
      categories: [],
      banners: [],
      loadingData: false,
      darkMode: false,

      // Actions
      setUser: (user) => set({ user }),
      setAuthLoading: (authLoading) => set({ authLoading }),

      initAuthListener: () => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          if (!fbUser) {
            set({ user: null, authLoading: false, orders: [], addresses: [] });
            return;
          }

          try {
            // Load user profile from users collection in Firestore
            const userDocRef = doc(db, "users", fbUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const data = userDoc.data() as UserProfile;
              set({ user: data, authLoading: false });
              // Fetch user orders and addresses history
              get().fetchUserOrders(fbUser.uid);
              get().fetchUserAddresses(fbUser.uid);
            } else {
              // Fallback if auth exists but no doc yet (e.g. Google Sign-In first time)
              const profile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || "",
                name: fbUser.displayName || "Customer",
                role: "user",
                phone: ""
              };
              await setDoc(userDocRef, { ...profile, createdAt: new Date() });
              set({ user: profile, authLoading: false });
              get().fetchUserAddresses(fbUser.uid);
            }
          } catch (error) {
            console.error("Error synchronizing customer credentials:", error);
            set({ authLoading: false });
          }
        });
        return unsubscribe;
      },

      signInWithEmail: async (email, password) => {
        set({ authLoading: true });
        try {
          const res = await signInWithEmailAndPassword(auth, email, password);
          trackEvent("login", { method: "email", email: res.user.email });
          return res.user;
        } catch (err) {
          set({ authLoading: false });
          throw err;
        }
      },

      signUpWithEmail: async (name, email, password, phone) => {
        set({ authLoading: true });
        try {
          const res = await createUserWithEmailAndPassword(auth, email, password);
          const fbUser = res.user;
          
          // Update profile display name
          await updateProfile(fbUser, { displayName: name });
          
          // Set profile document in Firestore
          const profile: UserProfile = {
            uid: fbUser.uid,
            email,
            name,
            role: "user",
            phone
          };
          await setDoc(doc(db, "users", fbUser.uid), {
            ...profile,
            createdAt: new Date()
          });

          set({ user: profile, authLoading: false });
          get().fetchUserAddresses(fbUser.uid);
          trackEvent("signup", { method: "email", email: fbUser.email, name, phone });
          return fbUser;
        } catch (err) {
          set({ authLoading: false });
          throw err;
        }
      },

      signInWithGoogle: async () => {
        set({ authLoading: true });
        try {
          const provider = new GoogleAuthProvider();
          const res = await signInWithPopup(auth, provider);
          const fbUser = res.user;

          // Check if user profile doc exists
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let profile: UserProfile;
          if (!userDoc.exists()) {
            profile = {
              uid: fbUser.uid,
              email: fbUser.email || "",
              name: fbUser.displayName || "Customer",
              role: "user",
              phone: ""
            };
            await setDoc(userDocRef, {
              ...profile,
              createdAt: new Date()
            });
          } else {
            profile = userDoc.data() as UserProfile;
          }

          set({ user: profile, authLoading: false });
          get().fetchUserAddresses(fbUser.uid);
          trackEvent("login", { method: "google", email: fbUser.email });
          return fbUser;
        } catch (err) {
          set({ authLoading: false });
          throw err;
        }
      },

      logout: async () => {
        set({ authLoading: true });
        try {
          await signOut(auth);
          set({ user: null, authLoading: false, orders: [], addresses: [] });
        } catch (err) {
          set({ authLoading: false });
          throw err;
        }
      },

      updateUserProfile: async (uid, profileUpdates) => {
        try {
          const userDocRef = doc(db, "users", uid);
          await updateDoc(userDocRef, profileUpdates);
          set((state) => ({
            user: state.user ? { ...state.user, ...profileUpdates } : null
          }));
        } catch (error) {
          console.error("Error updating user profile:", error);
          throw error;
        }
      },

      addToCart: (product, quantity = 1) => {
        if (String(product.id) === FREEBIE_ID) return; // Prevent adding freebie manually
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => String(item.product.id) === String(product.id)
          );
          
          let newCart = [...state.cart];
          if (existingIndex > -1) {
            newCart[existingIndex] = {
              ...newCart[existingIndex],
              quantity: newCart[existingIndex].quantity + quantity
            };
          } else {
            newCart.push({ product, quantity });
          }
          trackEvent("add_to_cart", {
            product_id: String(product.id),
            product_name: product.name,
            price: product.price,
            quantity
          });
          return { cart: ensureFreebie(newCart) };
        });
      },

      removeFromCart: (productId) => {
        if (String(productId) === FREEBIE_ID) return; // Prevent removing freebie manually
        set((state) => {
          const itemToRemove = state.cart.find((item) => String(item.product.id) === String(productId));
          if (itemToRemove) {
            trackEvent("remove_from_cart", {
              product_id: String(productId),
              product_name: itemToRemove.product.name
            });
          }
          const newCart = state.cart.filter((item) => String(item.product.id) !== String(productId));
          return { cart: ensureFreebie(newCart) };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (String(productId) === FREEBIE_ID) return; // Prevent modifying freebie quantity
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set((state) => {
          const newCart = state.cart.map((item) =>
            String(item.product.id) === String(productId)
              ? { ...item, quantity }
              : item
          );
          return { cart: ensureFreebie(newCart) };
        });
      },

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => {
        set((state) => {
          const isFav = state.wishlist.includes(productId);
          const newWishlist = isFav
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId];
          return { wishlist: newWishlist };
        });
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      fetchStoreData: async () => {
        set({ loadingData: true });
        try {
          // Fetch products, categories, and banners concurrently from Next APIs
          const [prodRes, catRes, banRes] = await Promise.all([
            fetch("/api/products"),
            fetch("/api/categories"),
            fetch("/api/banners").catch(() => null) // Safe fallback if banners API isn't online
          ]);

          const prodData = await prodRes.json();
          const catData = await catRes.json();
          const banData = banRes ? await banRes.json() : { success: false, banners: [] };

          const fetchedProducts = prodData.success ? prodData.products : [];
          const fetchedCategories = catData.success ? catData.categories : [];
          const fetchedBanners = banData.success ? banData.banners : [];

          // Map raw data from Firestore to AppContext expected schemas
          // ONLY display active ones for regular customer catalog
          const activeProducts = fetchedProducts
            .filter((p: any) => p.active !== false)
            .map((p: any) => {
              const categoryObj = fetchedCategories.find((c: any) => c.id === p.categoryId || c.slug === p.categoryId);
              const resolvedSlug = categoryObj ? categoryObj.slug : (p.categoryId || "vegetables");
              return {
                id: p.id,
                name: p.name,
                category: p.categoryName || "Vegetables",
                categorySlug: resolvedSlug,
                price: Number(p.price),
                originalPrice: p.discountPrice ? Number(p.price) : undefined,
                // Map discountPrice to price if available, storing regular price in originalPrice
                ...(p.discountPrice ? { price: Number(p.discountPrice), originalPrice: Number(p.price) } : {}),
                unit: p.unit || "kg",
                rating: p.rating || 4.7,
                reviewsCount: p.reviewsCount || 10,
                description: p.description || "",
                longDescription: p.description || "",
                stock: Number(p.stock || 0),
                isOrganic: p.isOrganic !== false,
                isPopular: p.isPopular === true,
                isSeasonal: p.isSeasonal === true,
                isSale: !!p.discountPrice,
                nutritionalFacts: p.nutritionalFacts || { calories: "30 kcal", carbs: "6g", protein: "1.2g", fat: "0.2g", fiber: "1.5g" },
                color: p.color || "bg-green-50 dark:bg-green-950/30",
                textColor: p.textColor || "text-green-800 dark:text-green-300",
                emoji: p.emoji || "🥬",
                image: p.imageUrl || "/images/products/spinach.png",
                active: true
              };
            });

          // Define preset colors & emojis for categories to make storefront beautiful
          const categoryPresets: Record<string, { emoji: string; color: string }> = {
            "leafy-greens": { emoji: "🥬", color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300" },
            "vegetables": { emoji: "🥦", color: "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300" },
            "fruits": { emoji: "🍓", color: "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300" },
            "exotics": { emoji: "✨", color: "bg-purple-50 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300" }
          };

          const activeCategories = fetchedCategories
            .filter((c: any) => c.active !== false)
            .map((c: any) => {
              const preset = categoryPresets[c.slug] || { emoji: "🥗", color: "bg-slate-50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-300" };
              return {
                id: c.id,
                name: c.name,
                slug: c.slug,
                description: c.description || "",
                active: true,
                emoji: preset.emoji,
                color: preset.color,
                imageUrl: c.imageUrl || "",
                count: activeProducts.filter((p: any) => p.categorySlug === c.slug).length
              };
            });

          const activeBanners = fetchedBanners.filter((b: any) => b.active !== false);

          set({ 
            products: activeProducts, 
            categories: activeCategories, 
            banners: activeBanners,
            loadingData: false 
          });
        } catch (error) {
          console.error("Error loading store data catalog:", error);
          set({ loadingData: false });
        }
      },

      fetchUserOrders: async (uid) => {
        try {
          const ordersRef = collection(db, "orders");
          const q = query(
            ordersRef, 
            where("userId", "==", uid)
          );
          const querySnapshot = await getDocs(q);
          
          const userOrders: Order[] = querySnapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            
            // Format Timestamp to string date representation
            let dateStr = "";
            if (data.createdAt && typeof data.createdAt.toDate === "function") {
              dateStr = data.createdAt.toDate().toLocaleDateString("en-US", { 
                year: "numeric", 
                month: "short", 
                day: "numeric" 
              });
            } else {
              dateStr = new Date().toLocaleDateString("en-US");
            }

            return {
              id: docSnap.id,
              date: dateStr,
              items: data.items || [],
              total: Number(data.totalAmount || 0),
              status: data.orderStatus || "Processing",
              shippingAddress: {
                fullName: data.customerName || "Customer",
                address: data.address || "",
                city: "Local",
                zipCode: "",
                phone: data.phone || ""
              },
              paymentMethod: data.paymentMethod || "COD"
            };
          });

          // Sort orders by date descending
          const sortedOrders = userOrders.sort((a, b) => b.id.localeCompare(a.id));
          set({ orders: sortedOrders });
        } catch (error) {
          console.error("Error retrieving user orders history:", error);
        }
      },

      placeOrder: async (shippingDetails, paymentMethod) => {
        const { cart, user } = get();
        const paidItems = cart.filter(item => String(item.product.id) !== FREEBIE_ID);
        const subtotal = paidItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        if (subtotal < 200) {
          throw new Error("Minimum order value of ₹200 is required to place an order.");
        }

        const delivery = subtotal >= 300 ? 0 : 19;
        const total = subtotal + delivery;

        const orderPayload = {
          userId: user?.uid || "guest",
          customerName: shippingDetails.fullName,
          phone: shippingDetails.phone,
          address: `${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.zipCode}`,
          items: cart.map(item => ({
            product: {
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              unit: item.product.unit,
              image: item.product.image,
              isFreebie: item.product.isFreebie || false
            },
            quantity: item.quantity,
            isFreebie: item.product.isFreebie || false
          })),
          subtotal,
          deliveryCharge: delivery,
          totalAmount: total,
          paymentMethod: paymentMethod === "cod" ? "COD" : "UPI",
          paymentStatus: "Pending",
          orderStatus: "Pending"
        };

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload)
        });

        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to process order.");
        }

        const dateStr = new Date().toLocaleDateString("en-US", { 
          year: "numeric", 
          month: "short", 
          day: "numeric" 
        });

        const newOrder: Order = {
          id: data.orderId,
          date: dateStr,
          items: [...cart],
          total: parseFloat(total.toFixed(2)),
          status: "Pending",
          shippingAddress: shippingDetails,
          paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "UPI (GPay/PhonePe)"
        };

        // Update local state orders list
        set((state) => ({
          orders: [newOrder, ...state.orders],
          cart: [] // Clear shopping cart
        }));

        trackEvent("place_order", {
          order_id: newOrder.id,
          total: newOrder.total,
          items_count: newOrder.items.length
        });

        return newOrder;
      },

      fetchUserAddresses: async (uid) => {
        try {
          const addrRef = collection(db, "users", uid, "addresses");
          const querySnapshot = await getDocs(addrRef);
          const userAddresses = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          set({ addresses: userAddresses });
        } catch (error) {
          console.error("Error retrieving user addresses:", error);
        }
      },

      addUserAddress: async (uid, addressData) => {
        try {
          const addrRef = collection(db, "users", uid, "addresses");
          const newDoc = await addDoc(addrRef, {
            ...addressData,
            createdAt: new Date()
          });
          const newAddress = {
            id: newDoc.id,
            ...addressData
          };
          set((state) => ({
            addresses: [...state.addresses, newAddress]
          }));
        } catch (error) {
          console.error("Error adding user address:", error);
          throw error;
        }
      },

      updateUserAddress: async (uid, addressId, addressData) => {
        try {
          const docRef = doc(db, "users", uid, "addresses", addressId);
          await updateDoc(docRef, {
            ...addressData,
            updatedAt: new Date()
          });
          set((state) => ({
            addresses: state.addresses.map((addr) =>
              addr.id === addressId ? { ...addr, ...addressData } : addr
            )
          }));
        } catch (error) {
          console.error("Error updating user address:", error);
          throw error;
        }
      },

      deleteUserAddress: async (uid, addressId) => {
        try {
          const docRef = doc(db, "users", uid, "addresses", addressId);
          await deleteDoc(docRef);
          set((state) => ({
            addresses: state.addresses.filter((addr) => addr.id !== addressId)
          }));
        } catch (error) {
          console.error("Error deleting user address:", error);
          throw error;
        }
      },

      toggleDarkMode: () => {
        set((state) => {
          const nextMode = !state.darkMode;
          if (nextMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { darkMode: nextMode };
        });
      }
    }),
    {
      name: "sabziii_store_storage",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        darkMode: state.darkMode
      })
    }
  )
);
